"""Satellite thermal detections for the map.

Two things this endpoint refuses to do quietly.

**It does not draw a dot.** Every feature carries the footprint the satellite measured — about
375 m across for this instrument — because the centre of a pixel is not where the heat is. A client
that draws a point is choosing to; it cannot do it by accident for want of the number.

**It does not pretend to cover the world.** The free FIRMS feed is one file per continent and Noma
reads the European one, over Etna. Asked about somewhere with no feed configured, the answer says
`live: null` rather than returning an empty collection that looks exactly like a quiet volcano —
the mistake that migration 28e4a8fd1690 exists because of.

The feed also only carries the last 24 hours. Anything older is what Noma happened to be running to
collect, so `held` is a count of what Noma has, never a claim about what happened.
"""

from datetime import UTC, datetime, timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import Connection

from noma.api.earthquakes import connection
from noma.domain.thermal import ThermalDetection
from noma.ingest import ETNA_BBOX, NASA_FIRMS, ingest_thermal
from noma.store.quakes import load_sources
from noma.store.thermal import detections_within, last_asked

router = APIRouter(tags=["thermal"])

#: A day, because that is exactly what the free feed carries. A longer default would quietly show a
#: window Noma can only fill by having been running.
DEFAULT_WINDOW = timedelta(hours=24)

#: How stale a fetch may be before this asks NASA again. VIIRS passes over a few times a day, but
#: the file is rewritten as each granule is processed, so asking more often than this buys nothing.
LIVE_MAX_AGE = timedelta(minutes=15)

MAX_SPAN_DEGREES = 20.0


@router.get("/thermal")
def thermal(
    conn: Annotated[Connection, Depends(connection)],
    bbox: Annotated[
        str,
        Query(
            description="west,south,east,north in degrees — longitude first",
            examples=["14.80,37.60,15.25,37.95"],
        ),
    ],
    start: Annotated[datetime | None, Query(description="ISO 8601. Default: 24 hours ago")] = None,
    end: Annotated[datetime | None, Query(description="ISO 8601. Default: now")] = None,
) -> dict[str, Any]:
    """Hot pixels in view. Refreshes from NASA when the view is somewhere Noma has a thermal feed
    and the last fetch has gone stale."""
    west, south, east, north = _bbox(bbox)
    now = datetime.now(tz=UTC)
    start = start or now - DEFAULT_WINDOW
    end = end or now
    if start.tzinfo is None or end.tzinfo is None:
        raise HTTPException(422, "start and end must carry a timezone; Noma works in UTC")
    if end <= start:
        raise HTTPException(422, "the window ends before it starts")

    asked = last_asked(conn, NASA_FIRMS)
    covered = _intersects((west, south, east, north), ETNA_BBOX)
    fetched = False
    if covered and (asked is None or now - asked > LIVE_MAX_AGE):
        ingest_thermal(conn)
        asked, fetched = now, True

    centre_lon, centre_lat = (west + east) / 2, (south + north) / 2
    # The column is geography, where distance is metres (ADR-0004), so the box becomes a circle
    # around its centre and the corners are then trimmed off below.
    radius_m = max(abs(east - west), abs(north - south)) / 2 * 111_000
    found = [
        d
        for d in detections_within(
            conn,
            longitude=centre_lon,
            latitude=centre_lat,
            radius_m=radius_m,
            start=start,
            end=end,
        )
        if west <= d.longitude <= east and south <= d.latitude <= north
    ]

    contributing = sorted({d.envelope.source_id for d in found})
    return {
        "type": "FeatureCollection",
        "features": [_feature(d) for d in found],
        "attribution": [
            {"source": s.id, "name": s.name, "licence": s.licence}
            for s in load_sources(conn, contributing)
        ],
        "noma": {
            "held": len(found),
            "fetched": fetched,
            # `live: null` means NOBODY WAS ASKED about this view — not that nothing is burning.
            "live": {
                "source": NASA_FIRMS,
                "windowHours": DEFAULT_WINDOW / timedelta(hours=1),
                "lastAsked": asked.isoformat() if asked else None,
            }
            if covered
            else None,
        },
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


def _intersects(
    view: tuple[float, float, float, float], feed: tuple[float, float, float, float]
) -> bool:
    """Overlap, not containment: a view of Etna's summit is smaller than the feed area, and a view
    of Sicily is larger. Either one is worth asking about."""
    return view[0] <= feed[2] and feed[0] <= view[2] and view[1] <= feed[3] and feed[1] <= view[3]


def _feature(d: ThermalDetection) -> dict[str, Any]:
    return {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [d.longitude, d.latitude]},
        "properties": {
            "time": d.observed_at.isoformat(),
            # THE CENTRE IS NOT THE FIRE. These are the sides of the pixel the radiometer
            # integrated over, in kilometres; drawing a dot throws them away.
            "pixelKm": {"scan": d.scan_km, "track": d.track_km},
            # Megawatts of radiated heat. Related to eruptive intensity only loosely, through
            # published relationships — this is not a measure of how big an eruption is.
            "frpMegawatts": d.frp_mw,
            # KELVIN, both of them: the fire channel and the background it stood out against.
            "brightnessKelvin": d.brightness_k,
            "backgroundKelvin": d.brightness_background_k,
            # The provider's own word on an ordinal scale, never a number (domain/thermal.py).
            "confidence": d.confidence,
            "satellite": d.satellite,
            # A night detection is the stronger one: sunlight cannot be mistaken for heat.
            "night": d.day_night == "N" if d.day_night else None,
            # "NRT" means it may be replaced by the processed product later.
            "productVersion": d.product_version,
            "source": d.envelope.source_id,
            "provenance": d.envelope.provenance,
            "retrievedAt": d.envelope.retrieved_at.isoformat(),
        },
    }
