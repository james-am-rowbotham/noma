"""Turning stored records into facts. The rules are in `docs/architecture/detection.md`.

**Nothing here writes its own SQL.** Every detector reads through `noma.store`, because those
queries already take the newest version of each record and the one bug this layer exists to prevent
came from a hand-written `count(*)`: 83 rows over Etna, 61 actual earthquakes, because every
revision is kept on purpose (domain-model point 19). The store's own read returns 63 rows and 63
distinct earthquakes. The reads were never wrong; the shortcut was.

So the rule is reuse, not care: a detector that writes fresh SQL has to rediscover revision keeping,
`as_of`, and geography-versus-geometry on its own, and will eventually get one of them wrong
silently.
"""

from collections.abc import Sequence
from datetime import UTC, datetime, timedelta
from math import sqrt

from sqlalchemy import Connection

from noma.coverage import Area
from noma.domain.detection import Reading, in_words
from noma.domain.quake import SourceId
from noma.ingest import INGV
from noma.store.quakes import EarthquakeSummary, earthquakes_in
from noma.store.series import datastreams_of, observations_of
from noma.store.sources import last_asked

#: Readable names for the properties a GNSS series carries, so a label names the measurement rather
#: than the column (DET-1).
MOVEMENT = {
    "displacement_east": "Eastward ground movement",
    "displacement_north": "Northward ground movement",
    "displacement_up": "Vertical ground movement",
}


def earthquake_rate(
    connection: Connection,
    area: Area,
    *,
    place: str,
    window: timedelta,
    baseline: timedelta,
    ask_every: timedelta,
    source_id: SourceId = INGV,
    now: datetime | None = None,
) -> Reading | None:
    """How many earthquakes in `window`, against the daily rate over `baseline`.

    **Returns None rather than zero when Noma has never asked this source.** "No earthquakes" from a
    catalogue nobody queried is not a measurement of the ground (DET-7), and a zero here would be
    indistinguishable from a quiet fortnight.

    `observed_at` is when Noma last managed to ask, not when an earthquake last happened: an event
    feed has no rhythm of its own, so the freshness that matters is Noma's own asking (domain model,
    point 25). `ask_every` is how often the caller intends to ask, which is what makes this fact
    able to go stale at all.
    """
    at = now or datetime.now(tz=UTC)
    asked = last_asked(connection, source_id)
    if asked is None:
        return None

    recent = _in_window(connection, area, at - window, at)
    older = _in_window(connection, area, at - baseline, at)

    # DISTINCT by the agency's own event id. NOTE: no sabotage can tell this apart from `len()`
    # today, because `earthquakes_in` already returns one row per earthquake — the real guarantee
    # lives in the store's query and is tested there (DET-5, tests/test_store.py). This set is a
    # restatement at the point that depends on it, so a future change to that query over-counts
    # nothing here. Kept deliberately, with the knowledge that it is currently unfalsifiable.
    count = len({e.event.public_id for e in recent})
    ids = sorted({e.event.public_id for e in older})

    # How much history the baseline actually rests on, which is not the same as the window asked
    # for (DET-4). Thirty days of window over three days of data is a three-day baseline, and
    # saying "30-day average" of it would be a fabrication.
    times = [e.origin.time.value for e in older]
    held = (max(times) - min(times)) if len(times) > 1 else timedelta(0)
    days = max(held.total_seconds() / 86_400, 1.0)

    return Reading(
        label=f"Earthquakes near {place}",
        window=_window_words(window),
        value=count,
        unit="earthquakes",
        # The catalogue gives no uncertainty on a count, and saying so is the rule (DET-6's
        # sibling): an omitted slot would read as exact.
        uncertainty=None,
        observed_at=asked,
        expected_cadence=ask_every,
        baseline=(
            f"{len(ids) / days:.1f} per day over the {in_words(held)} of history Noma holds"
            if ids
            else "nothing held for this area over the baseline period"
        ),
        records=ids,
    )


def _window_words(d: timedelta) -> str:
    """ "the last 24 hours" as "the last day", not "the last 1 day". `in_words` keeps the "1"
    because an age needs it — "1 day ago" — and a window does not."""
    words = in_words(d)
    return f"the last {words.removeprefix('1 ')}"


def _in_window(
    connection: Connection, area: Area, start: datetime, end: datetime
) -> Sequence[EarthquakeSummary]:
    """Spelled out rather than `**unpacked`: a dict of floats spread into keywords type-checks
    against every float-ish parameter the callee has, including `as_of`, which takes a datetime."""
    return earthquakes_in(
        connection,
        west=area.min_longitude,
        south=area.min_latitude,
        east=area.max_longitude,
        north=area.max_latitude,
        start=start,
        end=end,
        limit=5000,
    )


def ground_movement(
    connection: Connection,
    station: str,
    observed_property: str,
    *,
    window: timedelta,
    now: datetime | None = None,
) -> Reading | None:
    """How far the ground moved over `window`, with the uncertainty of the CHANGE.

    Two readings, each with its own standard deviation, so the change carries
    the two added in quadrature — `sqrt(s1^2 + s2^2)` — and not one reading's alone, which
    would understate it by about 40%.

    **A change smaller than that is not a change** (DET-6), and the baseline says so in words,
    rather than leaving a judge to notice. Etna's nearest open station reports about ±1.5 mm
    per reading, so roughly ±2 mm of any change is the instrument rather than the volcano.

    Returns None when the stream is unknown or holds fewer than two readings in the window: a
    change needs two points, and inventing one from a single reading would be the same class of
    error this module exists to prevent.
    """
    at = now or datetime.now(tz=UTC)
    streams = {d.observed_property: d for d in datastreams_of(connection, station)}
    stream = streams.get(observed_property)
    if stream is None:
        return None

    readings = observations_of(connection, stream.public_id, start=at - window, end=at)
    if len(readings) < 2:
        return None

    first, last = readings[0], readings[-1]
    # Stored in metres; reported in millimetres, because a 3 mm movement written as 0.003 reads as
    # nothing. The unit travels with the value, so the conversion is stated rather than implied.
    change_mm = (last.result - first.result) * 1_000
    sigmas = [o.uncertainty for o in (first, last) if o.uncertainty is not None]
    # Both or neither: a change computed from one stated uncertainty and one unknown one has an
    # uncertainty nobody can state, and halving it would be worse than admitting that.
    change_sigma_mm = sqrt(sum((s * 1_000) ** 2 for s in sigmas)) if len(sigmas) == 2 else None

    within_error = change_sigma_mm is not None and abs(change_mm) <= change_sigma_mm
    return Reading(
        label=f"{MOVEMENT.get(observed_property, observed_property)} at {station}",
        window=_window_words(window),
        value=change_mm,
        unit="mm",
        uncertainty=change_sigma_mm,
        observed_at=last.phenomenon_time,
        expected_cadence=stream.expected_cadence,
        baseline=(
            "smaller than its own uncertainty — not a change"
            if within_error
            else f"{len(readings)} readings against {stream.reference_frame or 'no stated frame'}"
        ),
        # A reading has no public id of its own, so the stream and the moment identify it exactly.
        records=[f"{stream.public_id}@{o.phenomenon_time.isoformat()}" for o in (first, last)],
    )
