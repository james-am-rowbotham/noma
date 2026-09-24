"""A vertical slice through a volcano: distance along a line against depth.

This is what volcano seismologists actually read. Every paper on Etna, Kilauea or anywhere else
pairs a map view with one or more of these, because depth is the one axis a map cannot show, and
shallow and deep swarms mean entirely different things.

NOT GeoJSON. A section is not a map — its horizontal axis is distance along a line and its vertical
axis is depth — so dressing it as geography would misuse the format and invite a client to plot it
on a map. It is its own shape, and says so.

Two things it insists on:

  - **Depth uncertainty is returned, including when it is absent.** Depth is the worst-constrained
    of an earthquake's three coordinates, and of the INGV origins Noma holds around Etna, all have
    a depth and fewer than half state how uncertain it is. A bare dot claims a precision most of
    these records never asserted, so `depthMetres.uncertainty` is null rather than missing, and a
    client can draw that absence.
  - **Every distance is in METRES**, computed by PostGIS against geography. Asked of geometry the
    same numbers would come back in degrees.
"""

from datetime import UTC, datetime
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import Connection

from noma.api.earthquakes import DEFAULT_WINDOW, connection
from noma.coverage import Area, ensure_events
from noma.store.quakes import OnProfile, earthquakes_on_profile, load_sources, profile_length_m

router = APIRouter(tags=["earthquakes"])

#: Half-width of the corridor either side of the line. Everything within it is projected onto the
#: section, which is how a paper draws one — a section is a slab, not a plane.
DEFAULT_WIDTH_M = 5_000.0
MAX_WIDTH_M = 50_000.0

#: A line longer than this is not a section through a volcano, it is a transect across a country.
MAX_LENGTH_M = 500_000.0


@router.get("/earthquakes/section")
def section(
    conn: Annotated[Connection, Depends(connection)],
    start_point: Annotated[
        str, Query(alias="from", description="lon,lat — longitude first", examples=["14.85,37.60"])
    ],
    end_point: Annotated[
        str, Query(alias="to", description="lon,lat — longitude first", examples=["15.15,37.90"])
    ],
    width_m: Annotated[
        float,
        Query(alias="widthMetres", gt=0, le=MAX_WIDTH_M, description="half-width of the corridor"),
    ] = DEFAULT_WIDTH_M,
    start: Annotated[datetime | None, Query(description="ISO 8601. Default: 30 days ago")] = None,
    end: Annotated[datetime | None, Query(description="ISO 8601. Default: now")] = None,
    min_magnitude: Annotated[float | None, Query(alias="minMagnitude")] = None,
) -> dict[str, Any]:
    from_lon, from_lat = _point(start_point, "from")
    to_lon, to_lat = _point(end_point, "to")

    now = datetime.now(tz=UTC)
    start = start or now - DEFAULT_WINDOW
    end = end or now
    if start.tzinfo is None or end.tzinfo is None:
        raise HTTPException(422, "start and end must carry a timezone; Noma works in UTC")
    if end <= start:
        raise HTTPException(422, "the window ends before it starts")

    length_m = profile_length_m(conn, (from_lon, from_lat, to_lon, to_lat))
    if length_m == 0:
        raise HTTPException(422, "the line has no length: from and to are the same point")
    if length_m > MAX_LENGTH_M:
        raise HTTPException(422, f"the line is {length_m / 1000:.0f} km; the limit is 500 km")

    # Make sure Noma holds the ground the corridor crosses. The bounding box is wider than the
    # corridor, which is fine: fetching a little extra is cheap, and missing data is not.
    margin = _degrees_for(width_m, max(abs(from_lat), abs(to_lat)))
    coverage = ensure_events(
        conn,
        Area(
            min_longitude=min(from_lon, to_lon) - margin,
            min_latitude=min(from_lat, to_lat) - margin,
            max_longitude=max(from_lon, to_lon) + margin,
            max_latitude=max(from_lat, to_lat) + margin,
        ),
        start=start,
        end=end,
        min_magnitude=min_magnitude,
        now=now,
    )

    found = earthquakes_on_profile(
        conn,
        from_lon=from_lon,
        from_lat=from_lat,
        to_lon=to_lon,
        to_lat=to_lat,
        width_m=width_m,
        start=start,
        end=end,
        min_magnitude=min_magnitude,
    )
    contributing = sorted({p.origin.envelope.source_id for p in found})
    return {
        "profile": {
            "from": [from_lon, from_lat],
            "to": [to_lon, to_lat],
            "lengthMetres": length_m,
            "widthMetres": width_m,
        },
        "earthquakes": [_on_profile(p) for p in found],
        "attribution": [
            {"source": s.id, "name": s.name, "licence": s.licence}
            for s in load_sources(conn, contributing)
        ],
        "noma": {
            "fetched": coverage.fetched,
            "coverage": coverage.reason,
            "asked": [s.source_id for s in coverage.sources],
        },
    }


def _point(raw: str, name: str) -> tuple[float, float]:
    try:
        lon, lat = (float(p) for p in raw.split(","))
    except ValueError:
        raise HTTPException(422, f"{name} must be lon,lat — two numbers, longitude first") from None
    if not (-180 <= lon <= 180 and -90 <= lat <= 90):
        raise HTTPException(422, f"{name} is not on Earth: {lon},{lat}")
    return lon, lat


def _degrees_for(metres: float, latitude: float) -> float:
    """A generous degree margin for a distance in metres. One degree of latitude is about 111 km
    everywhere; longitude is narrower away from the equator, so latitude's figure over-covers."""
    return metres / 111_000.0


def _on_profile(p: OnProfile) -> dict[str, Any]:
    o, m = p.origin, p.magnitude
    return {
        "alongMetres": p.along_m,
        "offsetMetres": p.offset_m,
        # Positive DOWNWARD, and negative is real on a volcano's flank. `uncertainty` is null rather
        # than absent when the agency did not state one, so a client can draw that it is unknown.
        "depthMetres": (
            {"value": o.depth.value, "uncertainty": o.depth.uncertainty, "positive": "down"}
            if o.depth
            else None
        ),
        "magnitude": (
            {"value": m.mag.value, "uncertainty": m.mag.uncertainty, "scale": m.type} if m else None
        ),
        "time": o.time.value.isoformat(),
        "id": p.event.public_id,
        "place": p.event.description,
        "source": o.envelope.source_id,
        "provenance": o.envelope.provenance,
        "agency": o.agency_id,
        "reviewed": o.evaluation_status,
        "automatic": o.evaluation_mode == "automatic" if o.evaluation_mode else None,
        "horizontalUncertaintyMetres": o.uncertainty.horizontal_uncertainty,
    }
