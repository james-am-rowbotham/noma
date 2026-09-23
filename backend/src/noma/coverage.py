"""Fetching because someone looked, rather than on a schedule.

Someone looks at an area and a time window; Noma makes sure it has that area and window, fetching
only what it has not already got. Nothing runs when nobody is using Noma.

WHAT THIS GIVES UP, stated plainly: revisions that happen while nobody is looking are lost for
good. An agency's service only ever reports what its catalogue says NOW — there is no way to ask
INGV what it said at 03:00. So a detection published automatically at 03:00 and reviewed at 03:20,
with nobody watching, leaves only the reviewed version obtainable. For settled historical data that
costs nothing. It would matter for watching a volcano through unrest, and the answer then is to add
a standing watch on this same machinery, not to change it.
"""

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from sqlalchemy import Connection, text

from noma.adapters.ingv import INGV_EVENT_SERVICE, event_query, fetch_events
from noma.adapters.quakeml import ParsedQuakeML
from noma.domain.quake import SourceId
from noma.ingest import INGV, store

#: How recently an area covering the PRESENT must have been fetched to be trusted without asking
#: again. Short, because a catalogue revises fastest just after an earthquake.
LIVE_MAX_AGE = timedelta(minutes=5)

#: How long after an earthquake a catalogue has stopped revising it — after which a window is
#: settled and a fetch covering it never needs repeating.
#:
#: SEVEN DAYS IS A GUESS, and it is the one number here without evidence behind it. It can be
#: measured rather than guessed: ask INGV with `updatedafter` over a period and see how old the
#: events it returns are. Until that is done, this is deliberately generous.
SETTLED_AFTER = timedelta(days=7)


@dataclass(frozen=True)
class Area:
    """A box on the map, in degrees. Longitude first, everywhere inside Noma (point 9)."""

    min_longitude: float
    min_latitude: float
    max_longitude: float
    max_latitude: float

    def as_wkt(self) -> str:
        """As a polygon. Containment is asked of GEOMETRY, not geography: ST_Covers on a geography
        polygon returns false even against itself (see the migration that adds event_fetch)."""
        w, s, e, n = self.min_longitude, self.min_latitude, self.max_longitude, self.max_latitude
        return f"POLYGON(({w} {s},{e} {s},{e} {n},{w} {n},{w} {s}))"


@dataclass(frozen=True)
class Coverage:
    """What Noma did about a request: whether it had to ask, and what it now holds."""

    fetched: bool
    reason: str
    stored: ParsedQuakeML | None = None


def ensure_events(
    connection: Connection,
    area: Area,
    *,
    start: datetime,
    end: datetime,
    min_magnitude: float | None = None,
    now: datetime | None = None,
) -> Coverage:
    """Make sure Noma holds this agency's earthquakes for this area and window."""
    now = now or datetime.now(tz=UTC)
    if end <= start:
        raise ValueError("the window ends before it starts")

    covered = _already_covered(connection, area, start, end, min_magnitude, now)
    if covered:
        return Coverage(fetched=False, reason=covered)

    url = event_query(
        INGV_EVENT_SERVICE,
        starttime=start,
        endtime=end,
        minlongitude=area.min_longitude,
        maxlongitude=area.max_longitude,
        minlatitude=area.min_latitude,
        maxlatitude=area.max_latitude,
        minmagnitude=min_magnitude,
    )
    fetched = fetch_events(url)
    if fetched is None:
        # Asked, and the catalogue was empty. Recorded so an empty area is not asked about again.
        _record(connection, area, start, end, min_magnitude, str(url), now, found=0, document=None)
        return Coverage(fetched=True, reason="fetched; the catalogue had nothing")

    stored = store(connection, fetched)
    document_id = (
        stored.origins[0].envelope.raw if stored.origins else stored.events[0].envelope.raw
    )
    _record(
        connection,
        area,
        start,
        end,
        min_magnitude,
        fetched.request_url,
        now,
        found=len(stored.events),
        document=document_id,
    )
    return Coverage(fetched=True, reason=f"fetched {len(stored.events)} events", stored=stored)


def _already_covered(
    connection: Connection,
    area: Area,
    start: datetime,
    end: datetime,
    min_magnitude: float | None,
    now: datetime,
) -> str | None:
    """A previous fetch counts only if it covers the whole area AND the whole window, was no more
    filtered than this request, and is still fresh. No gap arithmetic: a partly-covering fetch is
    ignored and the request is made again, which is cheap because re-ingesting identical records
    conflicts and does nothing (domain-model point 19)."""
    settled = end <= now - SETTLED_AFTER
    row = connection.execute(
        text("""
            SELECT fetched_at, found FROM event_fetch
            WHERE source_id = :source_id
              AND ST_Covers(area, ST_GeomFromText(:area, 4326))
              AND window_start <= :start AND window_end >= :end
              -- A fetch filtered to M2+ cannot satisfy a request for everything.
              -- Casts are explicit: a parameter compared only against NULL gives Postgres nothing
              -- to infer a type from, and it refuses rather than guessing.
              AND (min_magnitude IS NULL
                   OR min_magnitude <= CAST(:min_magnitude AS double precision))
              AND (CAST(:settled AS boolean) OR fetched_at >= :fresh_since)
            ORDER BY fetched_at DESC
            LIMIT 1
        """),
        {
            "source_id": INGV.id,
            "area": area.as_wkt(),
            "start": start,
            "end": end,
            "min_magnitude": min_magnitude,
            "settled": settled,
            "fresh_since": now - LIVE_MAX_AGE,
        },
    ).one_or_none()
    if row is None:
        return None
    when = "settled" if settled else "fetched recently"
    return f"already held ({when}: {row.found} events at {row.fetched_at:%Y-%m-%d %H:%M} UTC)"


def _record(
    connection: Connection,
    area: Area,
    start: datetime,
    end: datetime,
    min_magnitude: float | None,
    request_url: str,
    now: datetime,
    *,
    found: int,
    document: str | None,
) -> None:
    connection.execute(
        text("""
            INSERT INTO event_fetch (source_id, fetched_at, area, window_start, window_end,
                                     min_magnitude, found, request_url, raw_document_id)
            VALUES (:source_id, :fetched_at, ST_GeomFromText(:area, 4326), :start, :end,
                    :min_magnitude, :found, :request_url, :document)
        """),
        {
            "source_id": SourceId(INGV.id),
            "fetched_at": now,
            "area": area.as_wkt(),
            "start": start,
            "end": end,
            "min_magnitude": min_magnitude,
            "found": found,
            "request_url": request_url,
            "document": document,
        },
    )
