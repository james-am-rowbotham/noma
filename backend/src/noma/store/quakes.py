"""Storing and reading earthquakes. The only module that knows how the QuakeML family is laid out
in tables; everything else works with the domain models. See ADR-0004.

The flow matters and is not the obvious one. The untouched document is stored FIRST, and its id
becomes `envelope.raw` on every record parsed out of it — so each record points at exactly the bytes
it came from (domain-model point 8), and re-serving is possible without trusting anything Noma did.
"""

import hashlib
from collections.abc import Mapping, Sequence
from datetime import datetime
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
) -> ParsedQuakeML:
    """Store a QuakeML document and everything Noma reads out of it. Returns what was stored."""
    document_id = _save_document(connection, document, source_id, retrieved_at, media_type)
    envelope = Envelope(
        provenance=provenance,
        source_id=source_id,
        retrieved_at=retrieved_at,
        raw=str(document_id),
    )
    parsed = parse_quakeml(document, envelope)

    for event in parsed.events:
        event_id = _insert(
            connection, "quake_event", {**_envelope(event.envelope), **_event(event)}
        )
        for origin in (o for o in parsed.origins if o.event_id == event.public_id):
            _insert(
                connection,
                "quake_origin",
                {"event_id": event_id, **_envelope(origin.envelope), **_origin(origin)},
            )
        for magnitude in (m for m in parsed.magnitudes if m.event_id == event.public_id):
            _insert(
                connection,
                "quake_magnitude",
                {"event_id": event_id, **_envelope(magnitude.envelope), **_magnitude(magnitude)},
            )
    return parsed


def _save_document(
    connection: Connection, document: bytes, source_id: str, retrieved_at: datetime, media_type: str
) -> UUID:
    # The same document fetched twice is stored once; its id is stable, so re-ingesting is safe.
    row = connection.execute(
        text("""
            INSERT INTO raw_document (source_id, retrieved_at, media_type, sha256, content)
            VALUES (:source_id, :retrieved_at, :media_type, :sha256, :content)
            ON CONFLICT (source_id, sha256) DO UPDATE SET source_id = EXCLUDED.source_id
            RETURNING id
        """),
        {
            "source_id": source_id,
            "retrieved_at": retrieved_at,
            "media_type": media_type,
            "sha256": hashlib.sha256(document).digest(),
            "content": document,
        },
    ).one()
    return row.id


def _insert(connection: Connection, table: str, values: Mapping[str, Any]) -> UUID:
    columns = ", ".join(values)
    placeholders = ", ".join(f":{c}" for c in values)
    # `table` is never user input: it is one of this module's own table names.
    sql = f"INSERT INTO {table} ({columns}) VALUES ({placeholders}) RETURNING id"
    return connection.execute(text(sql), dict(values)).one().id


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


def load_event(connection: Connection, source_id: SourceId, public_id: str) -> ParsedQuakeML:
    """One event with every account of it — the point of the split (domain-model point 2)."""
    where = {"source_id": source_id, "public_id": public_id}
    events = [
        _read_event(r)
        for r in connection.execute(
            text(
                "SELECT * FROM quake_event WHERE source_id = :source_id AND public_id = :public_id"
            ),
            where,
        ).mappings()
    ]
    origins = [_read_origin(r) for r in _children(connection, "quake_origin", where)]
    magnitudes = [_read_magnitude(r) for r in _children(connection, "quake_magnitude", where)]
    return ParsedQuakeML(events=events, origins=origins, magnitudes=magnitudes)


#: Every read of an origin or magnitude joins its event, because the record carries the event's
#: QuakeML public id — not the row id, which is Noma's and means nothing outside this database.
_WITH_EVENT = """
    SELECT c.*, e.public_id AS event_public_id
    FROM {table} c JOIN quake_event e ON e.id = c.event_id
"""


def _children(connection: Connection, table: str, where: Mapping[str, Any]) -> Sequence[RowMapping]:
    sql = (
        _WITH_EVENT.format(table=table)
        + """
        WHERE e.source_id = :source_id AND e.public_id = :public_id ORDER BY c.public_id
    """
    )
    return list(connection.execute(text(sql), dict(where)).mappings())


def origins_within(
    connection: Connection, *, longitude: float, latitude: float, radius_m: float
) -> Sequence[Origin]:
    """ "Earthquakes near here" — asked each time, never stored (domain-model point 1).

    ST_DWithin on a GEOGRAPHY column takes METRES. On a geometry column the same number would mean
    degrees (ADR-0004), which is the difference between 30 km and most of a continent.
    """
    sql = (
        _WITH_EVENT.format(table="quake_origin")
        + """
        WHERE ST_DWithin(c.point, ST_MakePoint(:longitude, :latitude)::geography, :radius_m)
        ORDER BY c.time_value DESC
    """
    )
    rows = connection.execute(
        text(sql),
        {"longitude": longitude, "latitude": latitude, "radius_m": radius_m},
    ).mappings()
    return [_read_origin(r) for r in rows]


# ── columns -> domain model ──────────────────────────────────────────────────


def _read_envelope(r: RowMapping) -> Envelope:
    return Envelope(
        provenance=r["provenance"],
        source_id=SourceId(r["source_id"]),
        retrieved_at=r["retrieved_at"],
        raw=str(r["raw_document_id"]),
    )


def _uncertainties(r: RowMapping, name: str, unit: str = "") -> dict[str, Any]:
    u = f"_{unit}" if unit else ""
    return {
        "uncertainty": r[f"{name}_uncertainty{u}"],
        "lower_uncertainty": r[f"{name}_lower_uncertainty{u}"],
        "upper_uncertainty": r[f"{name}_upper_uncertainty{u}"],
        "confidence_level": r[f"{name}_confidence_level"],
    }


def _read_event(r: RowMapping) -> Event:
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


def _read_origin(r: RowMapping) -> Origin:
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


def _read_magnitude(r: RowMapping) -> Magnitude:
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
