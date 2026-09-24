"""Earthquakes for the map.

GeoJSON, because that is what a map reads and what OGC API Features and STAC both use. Two
things it deliberately does NOT do:

  - **No depth in the coordinates.** RFC 7946 says a third coordinate is "the height in meters
    above or below the WGS 84 reference ellipsoid". INGV and USGS both put depth in KILOMETRES,
    positive DOWNWARD, in that position — measured, docs/research/standards.md. Repeating that
    would hand every client a number that means the opposite of what the format says. Depth is a
    property, named `depthMetres`, with its sign convention written down.

  - **No cross-type magnitude comparison.** `minMagnitude` filters the magnitude each agency
    stands behind, whatever scale that is, exactly as fdsnws-event does. The scale travels with
    every value so a reader can see that an ML 3.9 and an Mw 3.9 are not the same claim.
"""

from datetime import UTC, datetime, timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import Connection

from noma.coverage import Area, ensure_events
from noma.db import engine
from noma.domain.quake import Magnitude, Origin
from noma.store.quakes import EarthquakeSummary, earthquakes_in, load_sources

router = APIRouter(tags=["earthquakes"])

#: A window nobody asked about. Long enough to show a volcano's recent behaviour, short enough that
#: a first look is one small fetch.
DEFAULT_WINDOW = timedelta(days=30)

#: Wider than this and a single request could ask an agency for a continent. The map asks for what
#: is on screen; anything larger is a mistake worth refusing loudly.
MAX_SPAN_DEGREES = 20.0


def connection():
    with engine().begin() as conn:
        yield conn


@router.get("/earthquakes")
def earthquakes(
    conn: Annotated[Connection, Depends(connection)],
    bbox: Annotated[
        str,
        Query(
            description="west,south,east,north in degrees — longitude first, as GeoJSON orders it",
            examples=["14.80,37.60,15.25,37.95"],
        ),
    ],
    start: Annotated[datetime | None, Query(description="ISO 8601. Default: 30 days ago")] = None,
    end: Annotated[datetime | None, Query(description="ISO 8601. Default: now")] = None,
    min_magnitude: Annotated[
        float | None,
        Query(
            alias="minMagnitude",
            description=(
                "Filters the magnitude each agency stands behind, whatever scale it is on. "
                "Scales are not interchangeable; each value carries its own."
            ),
        ),
    ] = None,
) -> dict[str, Any]:
    """Earthquakes in view. Fetches from the agency if Noma does not already hold this area and
    window (domain-model point 20), so the first look at somewhere new is slower than the second."""
    area = _area(bbox)
    now = datetime.now(tz=UTC)
    start = start or now - DEFAULT_WINDOW
    end = end or now
    if start.tzinfo is None or end.tzinfo is None:
        raise HTTPException(422, "start and end must carry a timezone; Noma works in UTC")
    if end <= start:
        raise HTTPException(422, "the window ends before it starts")

    coverage = ensure_events(conn, area, start=start, end=end, min_magnitude=min_magnitude, now=now)
    found = earthquakes_in(
        conn,
        west=area.min_longitude,
        south=area.min_latitude,
        east=area.max_longitude,
        north=area.max_latitude,
        start=start,
        end=end,
        min_magnitude=min_magnitude,
    )
    # Attribution for the sources that actually contributed a feature. INGV's data is CC BY 4.0,
    # so this is a legal requirement, and it travels with the data rather than living in a footer
    # somebody may forget (domain-model point 13).
    contributing = sorted({e.origin.envelope.source_id for e in found})
    return {
        "type": "FeatureCollection",
        "features": [_feature(e) for e in found],
        "attribution": [
            {"source": s.id, "name": s.name, "licence": s.licence}
            for s in load_sources(conn, contributing)
        ],
        # WHO WAS ASKED, always — not only who answered. An empty result says nothing about the
        # ground until you know who was consulted: USGS answers for the whole world but carries
        # none of Japan's small volcanic earthquakes, so "0 earthquakes, asked USGS" at Sakurajima
        # is a statement about Noma's sources, and a bare "0 earthquakes" would be a false
        # statement about one of the most active volcanoes on Earth.
        "noma": {
            "fetched": coverage.fetched,
            "coverage": coverage.reason,
            "asked": [s.source_id for s in coverage.sources],
        },
    }


def _area(bbox: str) -> Area:
    try:
        west, south, east, north = (float(p) for p in bbox.split(","))
    except ValueError:
        raise HTTPException(422, "bbox must be four numbers: west,south,east,north") from None
    if west >= east or south >= north:
        raise HTTPException(422, "bbox must be west,south,east,north with west<east, south<north")
    if east - west > MAX_SPAN_DEGREES or north - south > MAX_SPAN_DEGREES:
        raise HTTPException(422, f"bbox is wider than {MAX_SPAN_DEGREES} degrees; zoom in")
    return Area(min_longitude=west, min_latitude=south, max_longitude=east, max_latitude=north)


def _feature(e: EarthquakeSummary) -> dict[str, Any]:
    o, m = e.origin, e.magnitude
    return {
        "type": "Feature",
        "id": e.event.public_id,
        # Longitude, latitude — and NO third coordinate. See this module's docstring.
        "geometry": {"type": "Point", "coordinates": [o.longitude.value, o.latitude.value]},
        "properties": {
            "time": o.time.value.isoformat(),
            "magnitude": _magnitude(m),
            "depthMetres": _depth(o),
            "place": e.event.description,
            "eventType": e.event.type,
            # Provenance, on every feature rather than somewhere a client may not look.
            "source": o.envelope.source_id,
            "provenance": o.envelope.provenance,
            "agency": o.agency_id,
            "retrievedAt": o.envelope.retrieved_at.isoformat(),
            # When the AGENCY produced this account — the other half of "what did we know when".
            "producedAt": o.creation_time.isoformat() if o.creation_time else None,
            "reviewed": o.evaluation_status,
            "automatic": o.evaluation_mode == "automatic" if o.evaluation_mode else None,
            # For drilling in to every competing account of this earthquake.
            "originID": o.public_id,
            "magnitudeID": m.public_id if m else None,
        },
    }


def _magnitude(m: Magnitude | None) -> dict[str, Any] | None:
    if m is None:
        return None
    # `uncertainty: None` is kept rather than omitted: a value with none reported must be able to
    # SAY so, because 3.9 alone looks exactly as precise as 3.9 ± 0.0 (CLAUDE.md).
    return {"value": m.mag.value, "uncertainty": m.mag.uncertainty, "scale": m.type}


def _depth(o: Origin) -> dict[str, Any] | None:
    if o.depth is None:
        return None
    # Positive downward, and negative is real: an earthquake on a volcano's flank can sit above
    # sea level.
    return {"value": o.depth.value, "uncertainty": o.depth.uncertainty, "positive": "down"}
