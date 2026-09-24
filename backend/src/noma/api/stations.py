"""Stations and their series — family 2 over the API.

Unlike earthquakes, this does NOT fetch on demand. Noma can ask an agency "what earthquakes are in
this box?" because that is a question fdsnws-event answers. There is no equivalent for GNSS: the
network publishes one file per station and a station's position is inside its own file, so "which
stations are near here?" cannot be asked without fetching all 1,354 of them.

So these endpoints serve what Noma HOLDS, and say so — `noma.held` is a count, not a claim about
what exists. Ingesting a station is a deliberate act (`noma.ingest.ingest_station_series`) until
there is a station catalogue to read.
"""

from collections.abc import Sequence
from datetime import UTC, datetime, timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import Connection

from noma.api.earthquakes import connection
from noma.domain.series import Datastream, Observation, Station
from noma.store.quakes import load_sources
from noma.store.series import datastreams_of, observations_of, stations_within

router = APIRouter(tags=["stations"])

#: A year, because a GNSS series is daily and a year of it is what shows a trend. Earthquakes
#: default to thirty days; a different question wants a different window.
DEFAULT_WINDOW = timedelta(days=365)

MAX_SPAN_DEGREES = 20.0


@router.get("/stations")
def stations(
    conn: Annotated[Connection, Depends(connection)],
    bbox: Annotated[
        str,
        Query(
            description="west,south,east,north in degrees — longitude first",
            examples=["14.80,37.60,15.25,37.95"],
        ),
    ],
) -> dict[str, Any]:
    """Stations Noma holds inside the box, with what each of them measures."""
    west, south, east, north = _bbox(bbox)
    # A box is turned into a centre and a radius because the column is geography, where distance
    # is answered in METRES (ADR-0004).
    centre_lon, centre_lat = (west + east) / 2, (south + north) / 2
    radius_m = max(abs(east - west), abs(north - south)) / 2 * 111_000

    found = stations_within(conn, longitude=centre_lon, latitude=centre_lat, radius_m=radius_m)
    inside = [s for s in found if west <= s.longitude <= east and south <= s.latitude <= north]
    contributing = sorted({s.envelope.source_id for s in inside})
    return {
        "type": "FeatureCollection",
        "features": [_feature(s, datastreams_of(conn, s.public_id)) for s in inside],
        "attribution": [
            {"source": s.id, "name": s.name, "licence": s.licence}
            for s in load_sources(conn, contributing)
        ],
        # Not "what exists" — what Noma has been given. There is no query that asks an agency
        # which GNSS stations are near a place.
        "noma": {"held": len(inside), "fetchesOnDemand": False},
    }


@router.get("/stations/{public_id}/series")
def series(
    conn: Annotated[Connection, Depends(connection)],
    public_id: str,
    observed_property: Annotated[str, Query(alias="property", examples=["displacement_east"])],
    start: Annotated[datetime | None, Query(description="ISO 8601. Default: a year ago")] = None,
    end: Annotated[datetime | None, Query(description="ISO 8601. Default: now")] = None,
) -> dict[str, Any]:
    """One property of one station over time, newest version of each reading."""
    streams = {d.observed_property: d for d in datastreams_of(conn, public_id)}
    if not streams:
        raise HTTPException(404, f"Noma holds no station {public_id}")
    stream = streams.get(observed_property)
    if stream is None:
        raise HTTPException(
            404,
            f"{public_id} has no {observed_property}; it measures {sorted(streams)}",
        )

    now = datetime.now(tz=UTC)
    start = start or now - DEFAULT_WINDOW
    end = end or now
    if start.tzinfo is None or end.tzinfo is None:
        raise HTTPException(422, "start and end must carry a timezone; Noma works in UTC")
    if end <= start:
        raise HTTPException(422, "the window ends before it starts")

    readings = observations_of(conn, stream.public_id, start=start, end=end)
    contributing = sorted({stream.envelope.source_id})
    return {
        "station": public_id,
        "datastream": _datastream(stream),
        "observations": [_observation(o) for o in readings],
        "attribution": [
            {"source": s.id, "name": s.name, "licence": s.licence}
            for s in load_sources(conn, contributing)
        ],
        "noma": {"held": len(readings)},
    }


def _bbox(raw: str) -> tuple[float, float, float, float]:
    try:
        west, south, east, north = (float(p) for p in raw.split(","))
    except ValueError:
        raise HTTPException(422, "bbox must be four numbers: west,south,east,north") from None
    if west >= east or south >= north:
        raise HTTPException(422, "bbox must be west,south,east,north with west<east, south<north")
    if east - west > MAX_SPAN_DEGREES or north - south > MAX_SPAN_DEGREES:
        raise HTTPException(422, f"bbox is wider than {MAX_SPAN_DEGREES} degrees; zoom in")
    return west, south, east, north


def _feature(station: Station, streams: Sequence[Datastream]) -> dict[str, Any]:
    return {
        "type": "Feature",
        "id": station.public_id,
        # Longitude, latitude, and NO third coordinate — the same rule as earthquakes. Elevation is
        # a property, because GeoJSON's third slot means height above the ellipsoid and conflating
        # the two is how depth got mis-stated everywhere else.
        "geometry": {"type": "Point", "coordinates": [station.longitude, station.latitude]},
        "properties": {
            "name": station.name,
            "elevationMetres": station.elevation_m,
            "source": station.envelope.source_id,
            "provenance": station.envelope.provenance,
            "measures": [_datastream(d) for d in streams],
        },
    }


def _datastream(d: Datastream) -> dict[str, Any]:
    return {
        "id": d.public_id,
        "observedProperty": d.observed_property,
        "unit": d.unit,  # UCUM
        # Without these two a number of metres is not a measurement of anything.
        "procedure": d.procedure,
        "referenceFrame": d.reference_frame,
    }


def _observation(o: Observation) -> dict[str, Any]:
    return {
        "time": o.phenomenon_time.isoformat(),
        "value": o.result,
        # Present on every reading here, unlike earthquake depth. Null rather than absent if ever
        # missing, so a client can draw that it is unknown.
        "uncertainty": o.uncertainty,
        "solution": o.solution,
    }
