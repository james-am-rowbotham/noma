"""QuakeML 1.2 -> Noma's types. The only module in Noma that reads QuakeML. See ADR-0003.

ObsPy reads the document, faithfully: every field, microseconds, and agencies' own extensions.
But ObsPy is LENIENT with bad data, deliberately — it is built for seismologists loading messy
catalogues by hand. On invalid input it (measured, ADR-0003):

  - drops an earthquake with an unknown event type, and only warns
  - accepts an origin with no latitude, without comment
  - turns a depth of "deep" into a missing depth, and only warns

Noma cannot be lenient. So this module does two things ObsPy does not:

  1. ObsPy's QuakeML warnings become errors. Nothing is dropped or blanked silently.
  2. Every ObsPy object is rebuilt as one of Noma's Pydantic models, which refuse a missing required
     field, a value outside QuakeML's vocabularies, and a time with no timezone.

What is not typed here is not lost: the original document is stored whole (envelope.raw).
"""

# ObsPy has no type information, and this module is where its untyped objects become typed ones.
# The looseness is confined to this file (see [tool.pyright] in pyproject.toml).
# pyright: reportUnknownMemberType=false, reportUnknownVariableType=false
# pyright: reportUnknownArgumentType=false, reportUnknownParameterType=false
# pyright: reportMissingParameterType=false, reportAttributeAccessIssue=false

import io
import warnings
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

from obspy import UTCDateTime, read_events
from pydantic import ValidationError

from noma.domain.quake import (
    DepthQuantity,
    Envelope,
    Event,
    EventId,
    Magnitude,
    MagnitudeId,
    Metres,
    Origin,
    OriginId,
    OriginQuality,
    OriginUncertainty,
    RealQuantity,
    TimeQuantity,
)


class QuakeMLError(ValueError):
    """A QuakeML document Noma will not accept. Always says which record and why."""


@dataclass(frozen=True)
class ParsedQuakeML:
    events: list[Event]
    origins: list[Origin]
    magnitudes: list[Magnitude]


def parse_quakeml(document: bytes, envelope: Envelope) -> ParsedQuakeML:
    """Parse a QuakeML 1.2 document. Every record gets the same envelope: one document, one source,
    one retrieval."""
    with warnings.catch_warnings():
        # Rule 1. Only ObsPy's QuakeML reader, so unrelated library noise stays noise. A valid
        # record raises none of these — measured, ADR-0003.
        warnings.filterwarnings("error", category=UserWarning, module=r"obspy\.io\.quakeml")
        try:
            catalog = read_events(io.BytesIO(document), format="QUAKEML")
        except UserWarning as w:
            raise QuakeMLError(f"ObsPy would have silently dropped or blanked data: {w}") from w
        except Exception as e:
            raise QuakeMLError(f"not a readable QuakeML document: {e}") from e

    out = ParsedQuakeML(events=[], origins=[], magnitudes=[])
    for ev in catalog:
        event_id = EventId(_id(ev.resource_id))
        try:
            out.events.append(_event(ev, event_id, envelope))
            out.origins.extend(_origin(o, event_id, envelope) for o in ev.origins)
            out.magnitudes.extend(_magnitude(m, event_id, envelope) for m in ev.magnitudes)
        except ValidationError as e:
            # Rule 2. Pydantic names the field; say which earthquake it was in.
            raise QuakeMLError(f"event {event_id}: {e}") from e
    return out


# ── records ──────────────────────────────────────────────────────────────────


def _event(ev: Any, public_id: EventId, envelope: Envelope) -> Event:
    descriptions = [d.text for d in ev.event_descriptions if d.text]
    return Event(
        envelope=envelope,
        public_id=public_id,
        type=ev.event_type,
        type_certainty=ev.event_type_certainty,
        description=descriptions[0] if descriptions else None,
        preferred_origin_id=OriginId(_id(ev.preferred_origin_id))
        if ev.preferred_origin_id
        else None,
        preferred_magnitude_id=(
            MagnitudeId(_id(ev.preferred_magnitude_id)) if ev.preferred_magnitude_id else None
        ),
        agency_id=_creation(ev).get("agency_id"),
    )


def _origin(o: Any, event_id: EventId, envelope: Envelope) -> Origin:
    public_id = OriginId(_id(o.resource_id))
    # Required by the QuakeML spec document, though not by its schema file — and ObsPy accepts
    # their absence without a word.
    for required in ("time", "latitude", "longitude"):
        if getattr(o, required) is None:
            raise QuakeMLError(
                f"origin {public_id}: {required} is missing, and QuakeML requires it"
            )

    ou, q = o.origin_uncertainty, o.quality
    return Origin(
        envelope=envelope,
        public_id=public_id,
        event_id=event_id,
        time=TimeQuantity(value=_utc(o.time), **_errors(o.time_errors)),
        latitude=RealQuantity(value=float(o.latitude), **_errors(o.latitude_errors)),
        longitude=RealQuantity(value=float(o.longitude), **_errors(o.longitude_errors)),
        # QuakeML depth is in METRES already; this is the one place that is asserted.
        depth=(
            DepthQuantity(value=Metres(float(o.depth)), **_errors(o.depth_errors))
            if o.depth is not None
            else None
        ),
        depth_type=o.depth_type,
        uncertainty=OriginUncertainty(**_fields(ou, OriginUncertainty)),
        quality=OriginQuality(**_fields(q, OriginQuality)),
        evaluation_mode=o.evaluation_mode,
        evaluation_status=o.evaluation_status,
        agency_id=_creation(o).get("agency_id"),
        creation_time=_creation(o).get("creation_time"),
    )


def _magnitude(m: Any, event_id: EventId, envelope: Envelope) -> Magnitude:
    public_id = MagnitudeId(_id(m.resource_id))
    if m.mag is None:
        raise QuakeMLError(f"magnitude {public_id}: mag is missing, and QuakeML requires it")
    return Magnitude(
        envelope=envelope,
        public_id=public_id,
        event_id=event_id,
        origin_id=OriginId(_id(m.origin_id)) if m.origin_id else None,
        mag=RealQuantity(value=float(m.mag), **_errors(m.mag_errors)),
        type=m.magnitude_type,
        station_count=m.station_count,
        azimuthal_gap=m.azimuthal_gap,
        evaluation_mode=m.evaluation_mode,
        evaluation_status=m.evaluation_status,
        agency_id=_creation(m).get("agency_id"),
        creation_time=_creation(m).get("creation_time"),
    )


# ── helpers ──────────────────────────────────────────────────────────────────


def _utc(t: UTCDateTime) -> datetime:
    """ObsPy's times are UTC but come back with NO timezone attached — measured, ADR-0003. Left
    that way, Python treats them as local time in places. This labels them; it does not convert."""
    return t.datetime.replace(tzinfo=UTC)


def _id(resource_id: Any) -> str:
    return str(resource_id.id)


def _errors(e: Any) -> dict[str, float]:
    """ObsPy's QuantityError -> Noma's uncertainty fields, leaving out the ones not given."""
    if e is None:
        return {}
    keys = ("uncertainty", "lower_uncertainty", "upper_uncertainty", "confidence_level")
    return {k: float(v) for k in keys if (v := getattr(e, k, None)) is not None}


def _fields(obj: Any, model: type[OriginUncertainty] | type[OriginQuality]) -> dict[str, Any]:
    """Copy the fields a model declares from an ObsPy object — or none, if ObsPy has no such object
    (the container is still built, empty: ADR-0002)."""
    if obj is None:
        return {}
    return {k: v for k in model.model_fields if (v := getattr(obj, k, None)) is not None}


def _creation(obj: Any) -> dict[str, Any]:
    info = getattr(obj, "creation_info", None)
    if info is None:
        return {}
    out: dict[str, Any] = {}
    if info.agency_id is not None:
        out["agency_id"] = str(info.agency_id)
    if info.creation_time is not None:
        out["creation_time"] = _utc(info.creation_time)
    return out
