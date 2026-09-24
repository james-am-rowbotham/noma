"""GNSS position time series in the `.pos` format, as INGV's RING network publishes them.

One file is one station: a header giving where it is and how it was processed, then one row per
epoch with a position, a displacement from a reference position, and a standard deviation for each
component. 1,354 stations are published this way under CC BY 4.0 (DOI 10.13127/gnss/gipos).

Three things this module is careful about:

  - **Times are UTC.** The rows carry no timezone, and Python would otherwise be at the mercy of
    the machine's own — the same trap as QuakeML (ADR-0002, ADR-0003).
  - **The columns are read from the column-header line, not the prose.** INGV's own field
    descriptions say Se, Sn AND Su are each "Standard deviation of dN", which is a typo in their
    file. The `*YYYYMMDD HHMMSS ...` line is authoritative.
  - **A displacement without a reference frame is not a measurement.** The frame is in the header
    and travels on every datastream.
"""

import re
from dataclasses import dataclass
from datetime import UTC, datetime

from noma.domain.quake import Envelope, Metres
from noma.domain.series import Datastream, Observation, Station


class PosFileError(ValueError):
    """A position file Noma will not accept. Always says what was wrong."""


#: The three components, in the order their columns appear, with the standard deviation that goes
#: with each. Field numbers are 1-based as the column-header line counts them.
COMPONENTS = (
    ("displacement_north", 16, 19),
    ("displacement_east", 17, 20),
    ("displacement_up", 18, 21),
)
_TIME = (1, 2)
_SOLUTION = 25
_EXPECTED_FIELDS = 25


@dataclass(frozen=True)
class ParsedSeries:
    station: Station
    datastreams: list[Datastream]
    observations: list[Observation]


def parse_pos(document: bytes, envelope: Envelope) -> ParsedSeries:
    text = document.decode("utf-8", errors="replace")
    header, rows = _split(text)

    public_id = _header(header, r"^9-character ID\s*:\s*(\S+)") or _header(
        header, r"^Station name\s*:\s*(\S+)"
    )
    if not public_id:
        raise PosFileError("no station identifier in the header")

    neu = _header(header, r"^NEU Reference position\s*:\s*(.+)$")
    if not neu:
        raise PosFileError(f"{public_id}: no NEU reference position, so the station has no place")
    latitude, longitude, elevation = _reference_position(neu, public_id)

    frame = _between(neu, "(", ")") or _header(header, r"Reference Frame\s*:\s*(\S+)")
    procedure = _procedure(header)

    station = Station(
        envelope=envelope,
        public_id=public_id,
        name=_header(header, r"^Station name\s*:\s*(\S+)"),
        longitude=longitude,
        latitude=latitude,
        elevation_m=Metres(elevation),
    )
    datastreams = [
        Datastream(
            envelope=envelope,
            public_id=f"{public_id}:{prop}",
            station_public_id=public_id,
            observed_property=prop,
            unit="m",  # UCUM
            procedure=procedure,
            reference_frame=frame,
        )
        for prop, _, _ in COMPONENTS
    ]

    observations: list[Observation] = []
    for number, row in rows:
        fields = row.split()
        if len(fields) < _EXPECTED_FIELDS:
            raise PosFileError(
                f"{public_id} line {number}: {len(fields)} fields, expected {_EXPECTED_FIELDS}"
            )
        when = _time(fields[_TIME[0] - 1], fields[_TIME[1] - 1], public_id, number)
        solution = fields[_SOLUTION - 1]
        for prop, value_at, sigma_at in COMPONENTS:
            observations.append(
                Observation(
                    envelope=envelope,
                    datastream_public_id=f"{public_id}:{prop}",
                    phenomenon_time=when,
                    result=_number(fields[value_at - 1], public_id, number, prop),
                    uncertainty=_number(fields[sigma_at - 1], public_id, number, f"{prop} sigma"),
                    solution=solution,
                )
            )
    return ParsedSeries(station=station, datastreams=datastreams, observations=observations)


def _split(text: str) -> tuple[str, list[tuple[int, str]]]:
    """Header first, then one row per epoch. A data row begins with an 8-digit date.

    Anything unexpected AFTER the data has started is refused rather than skipped. An earlier
    version skipped it, which would have let a corrupted row vanish from a series without a word —
    and a gap in a time series is invisible in a way a wrong number is not.
    """
    header: list[str] = []
    rows: list[tuple[int, str]] = []
    for number, line in enumerate(text.splitlines(), start=1):
        if not line.strip():
            continue
        if re.match(r"^\s*\d{8}\s", line):
            rows.append((number, line))
        elif rows:
            raise PosFileError(
                f"line {number} is not a reading and comes after the data: {line[:60]!r}"
            )
        else:
            header.append(line)
    if not rows:
        raise PosFileError("no data rows")
    return "\n".join(header), rows


def _header(header: str, pattern: str) -> str | None:
    found = re.search(pattern, header, re.MULTILINE)
    return found.group(1).strip() if found else None


def _between(text: str, start: str, end: str) -> str | None:
    found = re.search(re.escape(start) + r"([^" + re.escape(end) + r"]+)" + re.escape(end), text)
    return found.group(1).strip() if found else None


def _procedure(header: str) -> str | None:
    """The analysis centre and software version, from the file's first line."""
    first = header.splitlines()[0] if header else ""
    found = re.match(r"^\s*(.+?Analysis Center[^,]*)", first)
    return found.group(1).strip() if found else None


def _reference_position(raw: str, public_id: str) -> tuple[float, float, float]:
    """`37.693 14.974 1775.6 (IGS20/WGS84)` — latitude, longitude, height. Latitude comes FIRST in
    this format, which is the opposite of the order Noma uses everywhere else (point 9), so it is
    unpacked explicitly here rather than by position further down."""
    numbers = re.findall(r"-?\d+\.?\d*(?:[eE][-+]?\d+)?", raw.split("(")[0])
    if len(numbers) < 3:
        raise PosFileError(f"{public_id}: cannot read a position from {raw!r}")
    latitude, longitude, elevation = (float(n) for n in numbers[:3])
    if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
        raise PosFileError(f"{public_id}: {latitude},{longitude} is not on Earth")
    return latitude, longitude, elevation


def _time(day: str, clock: str, public_id: str, line: int) -> datetime:
    """`20050914` `115500` -> UTC. The rows carry no timezone and GNSS series are UTC; without
    saying so Python would read them as the machine's local time."""
    try:
        return datetime.strptime(f"{day}{clock.zfill(6)}", "%Y%m%d%H%M%S").replace(tzinfo=UTC)
    except ValueError as e:
        raise PosFileError(f"{public_id} line {line}: not a time: {day} {clock}") from e


def _number(raw: str, public_id: str, line: int, what: str) -> float:
    try:
        value = float(raw)
    except ValueError as e:
        raise PosFileError(f"{public_id} line {line}: {what} is not a number: {raw!r}") from e
    if value != value or value in (float("inf"), float("-inf")):  # NaN or infinity
        raise PosFileError(f"{public_id} line {line}: {what} is not finite: {raw!r}")
    return value
