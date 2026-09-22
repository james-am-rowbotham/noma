"""The types for one earthquake: QuakeML's Event / Origin / Magnitude, plus Noma's envelope.

Why this shape: ADR-0002. Why Python: ADR-0003. The real record these are checked against:
docs/research/example-quakeml-ingv-etna-2026-08-15.xml

REQUIRED vs OPTIONAL follows the QuakeML 1.2 SPEC DOCUMENT, not its schema file. The schema file
wraps every field in an any-order, any-count group, so by the schema alone an origin with no
latitude is valid. The spec's class diagrams require time, latitude and longitude, and so do these.

NAMES: Python attributes are snake_case; everything serialised — the API, OpenAPI, and so the
browser's generated types — uses QuakeML's own names exactly, including its `ID` capitalisation.
"""

from typing import Literal, NewType

from pydantic import AwareDatetime, BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from noma.domain.vocabulary import (
    EvaluationMode,
    EvaluationStatus,
    EventType,
    EventTypeCertainty,
    OriginDepthType,
)

# ── Ids and units ────────────────────────────────────────────────────────────
# NewType is an ordinary value at runtime; pyright refuses to use one kind where another is
# expected. QuakeML ids are all long look-alike URIs, and an Event holds a preferred origin id and a
# preferred magnitude id side by side (ADR-0002).

SourceId = NewType("SourceId", str)
EventId = NewType("EventId", str)
OriginId = NewType("OriginId", str)
MagnitudeId = NewType("MagnitudeId", str)

# QuakeML gives depth in METRES. The FDSN text format gives KILOMETRES for the same field, so any
# conversion has to be written out as Metres(km * 1000).
Metres = NewType("Metres", float)


def quakeml_name(field: str) -> str:
    """public_id -> publicID, preferred_origin_id -> preferredOriginID, azimuthal_gap ->
    azimuthalGap. QuakeML capitalises a trailing `ID`; plain camelCase would not."""
    name = to_camel(field)
    return f"{name[:-2]}ID" if name.endswith("Id") else name


class Model(BaseModel):
    """Every domain record: immutable, no unknown fields, no silent coercion ("1210" stays a
    string and fails, rather than quietly becoming a number)."""

    model_config = ConfigDict(
        frozen=True,
        extra="forbid",
        strict=True,
        alias_generator=quakeml_name,
        validate_by_name=True,
        validate_by_alias=True,
        serialize_by_alias=True,
    )


# ── Provenance: Noma's, not QuakeML's ────────────────────────────────────────

# One question: what kind of claim is this? Not how Noma got it (the envelope's source and
# retrieved_at say that) and not when it is about (the record's own times say that). See ADR-0005.
ProvenanceClass = Literal[
    "OBSERVED",  # measured, by instrument or person — including an agency's own processing
    "CALCULATED",  # Noma did arithmetic over other records, so Noma can be wrong
    "MODELLED",  # a model produced it from REAL inputs: a claim about the real world
    "SIMULATED",  # a model run on HYPOTHETICAL inputs: not a claim about the real world
    "INFERRED",  # a judgement that could be wrong
    "FORECAST",  # issued by an agency responsible for it — never Noma's own output
]


class Envelope(Model):
    """Noma's fields, kept apart from the standard's (ADR-0002). Re-serving valid QuakeML is then
    the record without its envelope: nothing of ours leaks out, nothing collides with the standard.
    """

    provenance: ProvenanceClass  # required, never defaulted: missing is an error, not OBSERVED
    source_id: SourceId
    retrieved_at: AwareDatetime  # when NOMA got it — not when it happened or was published
    raw: str  # key of the untouched original (domain-model point 8)


# ── Quantities, as QuakeML defines them ──────────────────────────────────────
# In QuakeML a number is never bare: latitude, depth, time and magnitude each carry their own
# uncertainty. The uncertainty fields are optional because feeds often omit them; the value is not.
#
# No type can make a screen SHOW uncertainty. A 3.9 with none reported looks exactly as precise as
# 3.9 ± 0.0. That is a display rule, and it is still owed.


class Uncertainty(Model):
    uncertainty: float | None = None  # symmetric: value ± this
    lower_uncertainty: float | None = None
    upper_uncertainty: float | None = None
    confidence_level: float | None = None  # percent


class RealQuantity(Uncertainty):
    value: float


class DepthQuantity(Uncertainty):
    value: Metres  # positive DOWNWARD, and may be NEGATIVE: above sea level, on a volcano's flank


class TimeQuantity(Uncertainty):
    value: AwareDatetime  # AWARE: a time with no timezone is refused, not assumed local


# ── Event: that something happened ───────────────────────────────────────────
# An identity, not a measurement. Where and how big are separate records, because agencies
# disagree AND revise (domain-model point 2). Everything but the id is optional in QuakeML.


class Event(Model):
    envelope: Envelope
    public_id: EventId
    type: EventType | None = None
    type_certainty: EventTypeCertainty | None = None
    description: str | None = None  # "7 km W Linguaglossa (CT)"
    preferred_origin_id: OriginId | None = None  # the account this agency stands behind
    preferred_magnitude_id: MagnitudeId | None = None
    agency_id: str | None = None


# ── Origin: where and when, according to ONE agency ──────────────────────────


class OriginUncertainty(Model):
    horizontal_uncertainty: float | None = None  # metres
    min_horizontal_uncertainty: float | None = None  # metres
    max_horizontal_uncertainty: float | None = None  # metres
    azimuth_max_horizontal_uncertainty: float | None = None  # degrees
    preferred_description: str | None = None
    confidence_level: float | None = None  # percent


class OriginQuality(Model):
    """Never drawn on a map. Kept because it is how a seismologist decides whether to trust the
    location at all, and because a field dropped here cannot be re-served (point 8)."""

    associated_phase_count: int | None = None
    used_phase_count: int | None = None
    associated_station_count: int | None = None
    used_station_count: int | None = None
    depth_phase_count: int | None = None
    standard_error: float | None = None  # seconds
    azimuthal_gap: float | None = None  # degrees: the largest gap in station coverage
    secondary_azimuthal_gap: float | None = None  # degrees
    maximum_distance: float | None = None  # degrees
    minimum_distance: float | None = None  # degrees
    median_distance: float | None = None  # degrees


class Origin(Model):
    envelope: Envelope
    public_id: OriginId
    event_id: EventId  # QuakeML nests an Origin inside its Event; the link is kept explicitly

    time: TimeQuantity
    latitude: RealQuantity  # degrees
    longitude: RealQuantity  # degrees
    depth: DepthQuantity | None = None
    depth_type: OriginDepthType | None = None

    # Always present, possibly empty (ADR-0002): code reading it never asks whether it exists.
    uncertainty: OriginUncertainty
    quality: OriginQuality

    evaluation_mode: EvaluationMode | None = None
    evaluation_status: EvaluationStatus | None = None
    agency_id: str | None = None
    creation_time: AwareDatetime | None = None  # when the AGENCY produced this account


# ── Magnitude: how big, according to ONE agency ──────────────────────────────


class Magnitude(Model):
    envelope: Envelope
    public_id: MagnitudeId
    event_id: EventId
    origin_id: OriginId | None = None  # which location this size was computed from

    mag: RealQuantity
    # "ML", "Mw", "Md"… Free text in QuakeML, and the case varies (INGV "ML", USGS "ml").
    # Magnitudes of different types are not directly comparable — kept exactly as given.
    type: str | None = None
    station_count: int | None = None
    azimuthal_gap: float | None = None  # degrees

    evaluation_mode: EvaluationMode | None = None
    evaluation_status: EvaluationStatus | None = None
    agency_id: str | None = None
    creation_time: AwareDatetime | None = None
