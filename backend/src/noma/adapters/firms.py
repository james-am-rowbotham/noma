"""NASA FIRMS active-fire detections.

FIRMS publishes recent detections as CSV, one row per hot pixel, with no account and no key. Its
terms ask for attribution and place no non-commercial restriction
(docs/research/volcanic-activity.md), which is why Noma can use it where MIROVA's volcano-specific
thermal product — images, non-commercial — cannot be used at all.

Two things this module is careful about:

  - **Times are UTC.** `acq_date` and `acq_time` carry no zone, and `acq_time` is an HHMM string
    that loses its leading zero: `0109` arrives as `109`. Read naively both go wrong, one silently.
  - **Confidence stays a word.** FIRMS gives "low", "nominal", "high" for this instrument. Turning
    that into a number would invite arithmetic on an ordinal scale.

It is an ACTIVE FIRE product, not a volcano product: it detects heat, not eruptions. A wildfire on
Etna's flank looks the same to it as a lava flow. Noma stores what was measured — radiated power at
a place — and does not call it volcanic.
"""

import csv
import io
from collections.abc import Iterable
from datetime import UTC, datetime

from noma.domain.quake import Envelope
from noma.domain.thermal import ThermalDetection


class FirmsError(ValueError):
    """A FIRMS file Noma will not accept. Always says what was wrong."""


REQUIRED = ("latitude", "longitude", "acq_date", "acq_time", "scan", "track")


def parse_firms(
    document: bytes,
    envelope: Envelope,
    *,
    bbox: tuple[float, float, float, float] | None = None,
) -> list[ThermalDetection]:
    """Read a FIRMS CSV. `bbox` (west, south, east, north) keeps only detections inside it — the
    continental files are large and Noma has no use for a fire in Portugal."""
    rows = csv.DictReader(io.StringIO(document.decode("utf-8", errors="replace")))
    if rows.fieldnames is None:
        raise FirmsError("empty file: no header row")
    missing = [c for c in REQUIRED if c not in rows.fieldnames]
    if missing:
        raise FirmsError(f"not a FIRMS file: missing {', '.join(missing)}")

    return list(_detections(rows, envelope, bbox))


def _detections(
    rows: Iterable[dict[str, str | None]],
    envelope: Envelope,
    bbox: tuple[float, float, float, float] | None,
) -> Iterable[ThermalDetection]:
    for number, row in enumerate(rows, start=2):  # row 1 is the header
        longitude = _number(row.get("longitude"), number, "longitude")
        latitude = _number(row.get("latitude"), number, "latitude")
        if not (-180 <= longitude <= 180 and -90 <= latitude <= 90):
            raise FirmsError(f"row {number}: {longitude},{latitude} is not on Earth")
        if bbox and not (bbox[0] <= longitude <= bbox[2] and bbox[1] <= latitude <= bbox[3]):
            continue

        yield ThermalDetection(
            envelope=envelope,
            longitude=longitude,
            latitude=latitude,
            scan_km=_number(row.get("scan"), number, "scan"),
            track_km=_number(row.get("track"), number, "track"),
            observed_at=_time(row.get("acq_date"), row.get("acq_time"), number),
            frp_mw=_optional(row.get("frp"), number, "frp"),
            brightness_k=_optional(
                row.get("bright_ti4") or row.get("brightness"), number, "bright"
            ),
            brightness_background_k=_optional(
                row.get("bright_ti5") or row.get("bright_t31"), number, "background"
            ),
            confidence=_text(row.get("confidence")),
            satellite=_text(row.get("satellite")),
            day_night=_text(row.get("daynight")),
            product_version=_text(row.get("version")),
        )


def _time(day: str | None, clock: str | None, number: int) -> datetime:
    """`2026-09-24` + `0109` -> UTC. FIRMS times carry no zone, and `acq_time` is HHMM which loses
    its leading zero on the way through a spreadsheet: `0109` becomes `109`. Padding it back is not
    cosmetic — unpadded, `109` would parse as 10:09 rather than 01:09."""
    if not day or clock is None:
        raise FirmsError(f"row {number}: no acquisition time")
    try:
        return datetime.strptime(f"{day} {str(clock).strip().zfill(4)}", "%Y-%m-%d %H%M").replace(
            tzinfo=UTC
        )
    except ValueError as e:
        raise FirmsError(f"row {number}: not a time: {day!r} {clock!r}") from e


def _number(raw: str | None, number: int, what: str) -> float:
    value = _optional(raw, number, what)
    if value is None:
        raise FirmsError(f"row {number}: {what} is missing, and it is required")
    return value


def _optional(raw: str | None, number: int, what: str) -> float | None:
    text = (raw or "").strip()
    if not text:
        return None
    try:
        value = float(text)
    except ValueError as e:
        raise FirmsError(f"row {number}: {what} is not a number: {text!r}") from e
    if value != value or value in (float("inf"), float("-inf")):
        raise FirmsError(f"row {number}: {what} is not finite: {text!r}")
    return value


def _text(raw: str | None) -> str | None:
    text = (raw or "").strip()
    return text or None


#: Where FIRMS publishes recent detections. One file per instrument and region, no key.
FIRMS_RECENT = "https://firms.modaps.eosdis.nasa.gov/data/active_fire/{product}/csv/{file}"
VIIRS_EUROPE_24H = {"product": "suomi-npp-viirs-c2", "file": "SUOMI_VIIRS_C2_Europe_24h.csv"}


def recent_url(product: str, file: str) -> str:
    return FIRMS_RECENT.format(product=product, file=file)


def europe_24h_url() -> str:
    return recent_url(**VIIRS_EUROPE_24H)
