"""Storing and reading earthquakes. The only module that knows how the QuakeML family is laid out
in tables; everything else works with the domain models. See ADR-0004.

The flow matters and is not the obvious one. The untouched document is stored FIRST, and its id
becomes `envelope.raw` on every record parsed out of it — so each record points at exactly the bytes
it came from (domain-model point 8), and re-serving is possible without trusting anything Noma did.
"""

import hashlib
from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any
from uuid import UUID

from sqlalchemy import Connection, RowMapping, text

from noma.adapters.quakeml import ParsedQuakeML, parse_quakeml
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
    ProvenanceClass,
    RealQuantity,
    SourceId,
    TimeQuantity,
)
from noma.domain.source import Source

# ── writing ──────────────────────────────────────────────────────────────────


def save_source(connection: Connection, source: Source) -> None:
    connection.execute(
        text("""
            INSERT INTO source (id, name, ror_id, licence)
            VALUES (:id, :name, :ror_id, :licence)
            ON CONFLICT (id) DO UPDATE
               SET name = EXCLUDED.name, ror_id = EXCLUDED.ror_id, licence = EXCLUDED.licence
        """),
        # by_alias=False: the aliases are QuakeML's names for the OUTSIDE world (ADR-0003), and
        # `ror_id` would go out as `rorID`. Column names are the database's own.
        source.model_dump(by_alias=False),
    )


def ingest_quakeml(
    connection: Connection,
    document: bytes,
    *,
    source_id: SourceId,
    provenance: ProvenanceClass,
    retrieved_at: datetime,
    media_type: str = "application/xml",
    request_url: str | None = None,
) -> ParsedQuakeML:
    """Store a QuakeML document and everything Noma reads out of it. Returns what was stored."""
    document_id = _save_document(
        connection, document, source_id, retrieved_at, media_type, request_url
    )
    envelope = Envelope(
        provenance=provenance,
        source_id=source_id,
        retrieved_at=retrieved_at,
        raw=str(document_id),
    )
    parsed = parse_quakeml(document, envelope)

    for event in parsed.events:
        event_id = _insert(
            connection,
            "quake_event",
            {**_envelope(event.envelope), **_event(event), "content_hash": _content_hash(event)},
        )
        if event_id is None:
            # This exact version of the event is already stored. Its origins and magnitudes may
            # still have been revised, so they are still offered; they conflict harmlessly if not.
            event_id = _event_row_id(connection, event)
        for origin in (o for o in parsed.origins if o.event_id == event.public_id):
            _insert(
                connection,
                "quake_origin",
                {
                    "event_id": event_id,
                    **_envelope(origin.envelope),
                    **_origin(origin),
                    "content_hash": _content_hash(origin),
                },
            )
        for magnitude in (m for m in parsed.magnitudes if m.event_id == event.public_id):
            _insert(
                connection,
                "quake_magnitude",
                {
                    "event_id": event_id,
                    **_envelope(magnitude.envelope),
                    **_magnitude(magnitude),
                    "content_hash": _content_hash(magnitude),
                },
            )
    return parsed


def _event_row_id(connection: Connection, event: Event) -> UUID:
    return (
        connection.execute(
            text("""
            SELECT id FROM quake_event
            WHERE source_id = :source_id AND public_id = :public_id AND content_hash = :hash
        """),
            {
                "source_id": event.envelope.source_id,
                "public_id": event.public_id,
                "hash": _content_hash(event),
            },
        )
        .one()
        .id
    )


def _save_document(
    connection: Connection,
    document: bytes,
    source_id: str,
    retrieved_at: datetime,
    media_type: str,
    request_url: str | None,
) -> UUID:
    # The same document fetched twice is stored once; its id is stable, so re-ingesting is safe.
    row = connection.execute(
        text("""
            INSERT INTO raw_document (source_id, retrieved_at, media_type, sha256, content,
                                      request_url)
            VALUES (:source_id, :retrieved_at, :media_type, :sha256, :content, :request_url)
            ON CONFLICT (source_id, sha256) DO UPDATE SET source_id = EXCLUDED.source_id
            RETURNING id
        """),
        {
            "source_id": source_id,
            "retrieved_at": retrieved_at,
            "media_type": media_type,
            "sha256": hashlib.sha256(document).digest(),
            "content": document,
            "request_url": request_url,
        },
    ).one()
    return row.id


def _content_hash(record: Event | Origin | Magnitude) -> bytes:
    """A fingerprint of everything the AGENCY said, so a re-fetch of identical data is recognised
    and a revision is not. The envelope is excluded on purpose: `retrieved_at` differs on every
    fetch, and Noma fetching the same record twice is not the agency changing its mind."""
    body = record.model_dump_json(exclude={"envelope"})
    return hashlib.sha256(body.encode()).digest()


def _insert(connection: Connection, table: str, values: Mapping[str, Any]) -> UUID | None:
    columns = ", ".join(values)
    placeholders = ", ".join(f":{c}" for c in values)
    # `table` is never user input: it is one of this module's own table names.
    # DO NOTHING on conflict: the same version of a record arriving again is not news. A REVISION
    # has a different content_hash and so lands as a new row beside its predecessor.
    sql = (
        f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
        f" ON CONFLICT (source_id, public_id, content_hash) DO NOTHING RETURNING id"
    )
    row = connection.execute(text(sql), dict(values)).one_or_none()
    return row.id if row else None


# ── domain model -> columns ──────────────────────────────────────────────────


def _envelope(e: Envelope) -> dict[str, Any]:
    return {
        "provenance": e.provenance,
        "source_id": e.source_id,
        "retrieved_at": e.retrieved_at,
        "raw_document_id": UUID(e.raw),
    }


def _quantity(name: str, q: RealQuantity | DepthQuantity | None, unit: str = "") -> dict[str, Any]:
    u = f"_{unit}" if unit else ""
    return {
        f"{name}{u}": q.value if q else None,
        f"{name}_uncertainty{u}": q.uncertainty if q else None,
        f"{name}_lower_uncertainty{u}": q.lower_uncertainty if q else None,
        f"{name}_upper_uncertainty{u}": q.upper_uncertainty if q else None,
        f"{name}_confidence_level": q.confidence_level if q else None,
    }


def _event(e: Event) -> dict[str, Any]:
    return {
        "public_id": e.public_id,
        "type": e.type,
        "type_certainty": e.type_certainty,
        "description": e.description,
        "preferred_origin_public_id": e.preferred_origin_id,
        "preferred_magnitude_public_id": e.preferred_magnitude_id,
        "agency_id": e.agency_id,
    }


def _origin(o: Origin) -> dict[str, Any]:
    return {
        "public_id": o.public_id,
        "time_value": o.time.value,
        "time_uncertainty_s": o.time.uncertainty,
        "time_lower_uncertainty_s": o.time.lower_uncertainty,
        "time_upper_uncertainty_s": o.time.upper_uncertainty,
        "time_confidence_level": o.time.confidence_level,
        **_quantity("latitude", o.latitude),
        **_quantity("longitude", o.longitude),
        **_quantity("depth", o.depth, "m"),
        "depth_type": o.depth_type,
        "evaluation_mode": o.evaluation_mode,
        "evaluation_status": o.evaluation_status,
        "agency_id": o.agency_id,
        "creation_time": o.creation_time,
        "horizontal_uncertainty_m": o.uncertainty.horizontal_uncertainty,
        "min_horizontal_uncertainty_m": o.uncertainty.min_horizontal_uncertainty,
        "max_horizontal_uncertainty_m": o.uncertainty.max_horizontal_uncertainty,
        "azimuth_max_horizontal_uncertainty_deg": o.uncertainty.azimuth_max_horizontal_uncertainty,
        "preferred_description": o.uncertainty.preferred_description,
        "uncertainty_confidence_level": o.uncertainty.confidence_level,
        "associated_phase_count": o.quality.associated_phase_count,
        "used_phase_count": o.quality.used_phase_count,
        "associated_station_count": o.quality.associated_station_count,
        "used_station_count": o.quality.used_station_count,
        "depth_phase_count": o.quality.depth_phase_count,
        "standard_error_s": o.quality.standard_error,
        "azimuthal_gap_deg": o.quality.azimuthal_gap,
        "secondary_azimuthal_gap_deg": o.quality.secondary_azimuthal_gap,
        "maximum_distance_deg": o.quality.maximum_distance,
        "minimum_distance_deg": o.quality.minimum_distance,
        "median_distance_deg": o.quality.median_distance,
    }


def _magnitude(m: Magnitude) -> dict[str, Any]:
    return {
        "public_id": m.public_id,
        "origin_public_id": m.origin_id,
        "mag": m.mag.value,
        "mag_uncertainty": m.mag.uncertainty,
        "mag_lower_uncertainty": m.mag.lower_uncertainty,
        "mag_upper_uncertainty": m.mag.upper_uncertainty,
        "mag_confidence_level": m.mag.confidence_level,
        "type": m.type,
        "station_count": m.station_count,
        "azimuthal_gap_deg": m.azimuthal_gap,
        "evaluation_mode": m.evaluation_mode,
        "evaluation_status": m.evaluation_status,
        "agency_id": m.agency_id,
        "creation_time": m.creation_time,
    }


# ── reading ──────────────────────────────────────────────────────────────────


def load_event(
    connection: Connection,
    source_id: SourceId,
    public_id: str,
    *,
    as_of: datetime | None = None,
) -> ParsedQuakeML:
    """One event with every account of it — the point of the split (domain-model point 2).

    `as_of` reads the catalogue as Noma held it at that moment: the question an observatory asks
    when reviewing a crisis afterwards. Default is everything received so far.
    """
    where: dict[str, Any] = {
        "source_id": source_id,
        "public_id": public_id,
        "as_of": as_of or datetime.now(tz=UTC),
    }
    events = [
        _read_event(r)
        for r in connection.execute(
            text("""
                SELECT DISTINCT ON (source_id, public_id) * FROM quake_event
                WHERE source_id = :source_id AND public_id = :public_id AND retrieved_at <= :as_of
                ORDER BY source_id, public_id, retrieved_at DESC
            """),
            where,
        ).mappings()
    ]
    origins = [_read_origin(r) for r in _children(connection, "quake_origin", where)]
    magnitudes = [_read_magnitude(r) for r in _children(connection, "quake_magnitude", where)]
    return ParsedQuakeML(events=events, origins=origins, magnitudes=magnitudes)


#: Every read of an origin or magnitude joins its event, because the record carries the event's
#: QuakeML public id — not the row id, which is Noma's and means nothing outside this database.
#:
#: And every read picks ONE version per public id: the newest Noma had received `as_of` (default,
#: now). Records accumulate versions because agencies revise (domain-model point 2), so a read that
#: did not choose would return the same earthquake several times over. Passing an earlier `as_of`
#: is what answers "what did we know at 10:25?".
_LATEST = """
    SELECT DISTINCT ON (c.source_id, c.public_id) c.*, e.public_id AS event_public_id
    FROM {table} c JOIN quake_event e ON e.id = c.event_id
    WHERE c.retrieved_at <= :as_of
      AND {filter}
    ORDER BY c.source_id, c.public_id, c.retrieved_at DESC
"""


def _children(connection: Connection, table: str, where: Mapping[str, Any]) -> Sequence[RowMapping]:
    sql = _LATEST.format(
        table=table, filter="e.source_id = :source_id AND e.public_id = :public_id"
    )
    return list(connection.execute(text(sql), dict(where)).mappings())


def origins_within(
    connection: Connection,
    *,
    longitude: float,
    latitude: float,
    radius_m: float,
    as_of: datetime | None = None,
) -> Sequence[Origin]:
    """ "Earthquakes near here" — asked each time, never stored (domain-model point 1).

    ST_DWithin on a GEOGRAPHY column takes METRES. On a geometry column the same number would mean
    degrees (ADR-0004), which is the difference between 30 km and most of a continent.
    """
    sql = _LATEST.format(
        table="quake_origin",
        filter="ST_DWithin(c.point, ST_MakePoint(:longitude, :latitude)::geography, :radius_m)",
    )
    rows = connection.execute(
        text(sql),
        {
            "longitude": longitude,
            "latitude": latitude,
            "radius_m": radius_m,
            "as_of": as_of or datetime.now(tz=UTC),
        },
    ).mappings()
    # Newest first: the ordering the query needs is by version, so time is sorted here.
    return sorted((_read_origin(r) for r in rows), key=lambda o: o.time.value, reverse=True)


# ── columns -> domain model ──────────────────────────────────────────────────

#: Timestamp columns on the QuakeML tables. JSON has no datetime type, so `to_jsonb` renders these
#: as ISO strings and the models — which are strict, and refuse a string where a datetime belongs —
#: would reject them. Converted back explicitly rather than by loosening the models.
_TIMESTAMPS = ("retrieved_at", "time_value", "creation_time")


def _from_jsonb(row: Mapping[str, Any], event_public_id: str) -> dict[str, Any]:
    out = {**row, "event_public_id": event_public_id}
    for key in _TIMESTAMPS:
        if isinstance(out.get(key), str):
            out[key] = datetime.fromisoformat(out[key])
    return out


#: A row, from a query or rebuilt from jsonb. SQLAlchemy's RowMapping is a Mapping[Any, Any] and
#: Mapping's key type is invariant, so Mapping[str, Any] would not accept one.
Row = Mapping[Any, Any]


def _read_envelope(r: Row) -> Envelope:
    return Envelope(
        provenance=r["provenance"],
        source_id=SourceId(r["source_id"]),
        retrieved_at=r["retrieved_at"],
        raw=str(r["raw_document_id"]),
    )


def _uncertainties(r: Row, name: str, unit: str = "") -> dict[str, Any]:
    u = f"_{unit}" if unit else ""
    return {
        "uncertainty": r[f"{name}_uncertainty{u}"],
        "lower_uncertainty": r[f"{name}_lower_uncertainty{u}"],
        "upper_uncertainty": r[f"{name}_upper_uncertainty{u}"],
        "confidence_level": r[f"{name}_confidence_level"],
    }


def _read_event(r: Row) -> Event:
    return Event(
        envelope=_read_envelope(r),
        public_id=EventId(r["public_id"]),
        type=r["type"],
        type_certainty=r["type_certainty"],
        description=r["description"],
        preferred_origin_id=(
            OriginId(r["preferred_origin_public_id"]) if r["preferred_origin_public_id"] else None
        ),
        preferred_magnitude_id=(
            MagnitudeId(r["preferred_magnitude_public_id"])
            if r["preferred_magnitude_public_id"]
            else None
        ),
        agency_id=r["agency_id"],
    )


def _read_origin(r: Row) -> Origin:
    return Origin(
        envelope=_read_envelope(r),
        public_id=OriginId(r["public_id"]),
        event_id=EventId(r["event_public_id"]),
        time=TimeQuantity(
            value=r["time_value"],
            uncertainty=r["time_uncertainty_s"],
            lower_uncertainty=r["time_lower_uncertainty_s"],
            upper_uncertainty=r["time_upper_uncertainty_s"],
            confidence_level=r["time_confidence_level"],
        ),
        latitude=RealQuantity(value=r["latitude"], **_uncertainties(r, "latitude")),
        longitude=RealQuantity(value=r["longitude"], **_uncertainties(r, "longitude")),
        depth=(
            DepthQuantity(value=Metres(r["depth_m"]), **_uncertainties(r, "depth", "m"))
            if r["depth_m"] is not None
            else None
        ),
        depth_type=r["depth_type"],
        uncertainty=OriginUncertainty(
            horizontal_uncertainty=r["horizontal_uncertainty_m"],
            min_horizontal_uncertainty=r["min_horizontal_uncertainty_m"],
            max_horizontal_uncertainty=r["max_horizontal_uncertainty_m"],
            azimuth_max_horizontal_uncertainty=r["azimuth_max_horizontal_uncertainty_deg"],
            preferred_description=r["preferred_description"],
            confidence_level=r["uncertainty_confidence_level"],
        ),
        quality=OriginQuality(
            associated_phase_count=r["associated_phase_count"],
            used_phase_count=r["used_phase_count"],
            associated_station_count=r["associated_station_count"],
            used_station_count=r["used_station_count"],
            depth_phase_count=r["depth_phase_count"],
            standard_error=r["standard_error_s"],
            azimuthal_gap=r["azimuthal_gap_deg"],
            secondary_azimuthal_gap=r["secondary_azimuthal_gap_deg"],
            maximum_distance=r["maximum_distance_deg"],
            minimum_distance=r["minimum_distance_deg"],
            median_distance=r["median_distance_deg"],
        ),
        evaluation_mode=r["evaluation_mode"],
        evaluation_status=r["evaluation_status"],
        agency_id=r["agency_id"],
        creation_time=r["creation_time"],
    )


def _read_magnitude(r: Row) -> Magnitude:
    return Magnitude(
        envelope=_read_envelope(r),
        public_id=MagnitudeId(r["public_id"]),
        event_id=EventId(r["event_public_id"]),
        origin_id=OriginId(r["origin_public_id"]) if r["origin_public_id"] else None,
        mag=RealQuantity(value=r["mag"], **_uncertainties(r, "mag")),
        type=r["type"],
        station_count=r["station_count"],
        azimuthal_gap=r["azimuthal_gap_deg"],
        evaluation_mode=r["evaluation_mode"],
        evaluation_status=r["evaluation_status"],
        agency_id=r["agency_id"],
        creation_time=r["creation_time"],
    )


# ── what the map asks for ────────────────────────────────────────────────────


@dataclass(frozen=True)
class EarthquakeSummary:
    """One earthquake as a map shows it: the event, plus the single account its agency stands
    behind. Every competing account is still there — `load_event` returns them — but a map draws
    one dot per earthquake, not one per version or per origin."""

    event: Event
    origin: Origin
    magnitude: Magnitude | None


#: Latest version of each record, as of a moment (domain-model point 19), then each event joined to
#: the origin and magnitude IT names as preferred. An event whose preferred origin Noma has not
#: ingested is left out: a dot has to have a position.
_SUMMARY = """
WITH e AS (
    SELECT DISTINCT ON (source_id, public_id) * FROM quake_event
    WHERE retrieved_at <= :as_of ORDER BY source_id, public_id, retrieved_at DESC
), o AS (
    SELECT DISTINCT ON (source_id, public_id) * FROM quake_origin
    WHERE retrieved_at <= :as_of ORDER BY source_id, public_id, retrieved_at DESC
), m AS (
    SELECT DISTINCT ON (source_id, public_id) * FROM quake_magnitude
    WHERE retrieved_at <= :as_of ORDER BY source_id, public_id, retrieved_at DESC
)
SELECT
    e.public_id AS event_public_id,
    to_jsonb(e) AS event, to_jsonb(o) AS origin, to_jsonb(m) AS magnitude
FROM e
JOIN o ON o.event_id = e.id AND o.public_id = e.preferred_origin_public_id
LEFT JOIN m ON m.event_id = e.id AND m.public_id = e.preferred_magnitude_public_id
WHERE o.point && ST_MakeEnvelope(:west, :south, :east, :north, 4326)::geography
  AND o.time_value >= :start AND o.time_value <= :end
  AND (CAST(:min_magnitude AS double precision) IS NULL OR m.mag >= :min_magnitude)
ORDER BY o.time_value DESC
LIMIT :limit
"""


def earthquakes_in(
    connection: Connection,
    *,
    west: float,
    south: float,
    east: float,
    north: float,
    start: datetime,
    end: datetime,
    min_magnitude: float | None = None,
    as_of: datetime | None = None,
    limit: int = 2000,
) -> Sequence[EarthquakeSummary]:
    rows = connection.execute(
        text(_SUMMARY),
        {
            "west": west,
            "south": south,
            "east": east,
            "north": north,
            "start": start,
            "end": end,
            "min_magnitude": min_magnitude,
            "as_of": as_of or datetime.now(tz=UTC),
            "limit": limit,
        },
    ).mappings()

    out: list[EarthquakeSummary] = []
    for r in rows:
        event = _from_jsonb(r["event"], r["event_public_id"])
        origin = _from_jsonb(r["origin"], r["event_public_id"])
        out.append(
            EarthquakeSummary(
                event=_read_event(event),
                origin=_read_origin(origin),
                magnitude=(
                    _read_magnitude(_from_jsonb(r["magnitude"], r["event_public_id"]))
                    if r["magnitude"]
                    else None
                ),
            )
        )
    return out
