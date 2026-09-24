"""Storing and reading satellite thermal detections. See ADR-0004."""

import hashlib
from collections.abc import Sequence
from datetime import UTC, datetime
from typing import Any
from uuid import UUID

from sqlalchemy import Connection, RowMapping, text

from noma.domain.quake import Envelope, SourceId
from noma.domain.thermal import ThermalDetection

BATCH = 500


def save_detections(connection: Connection, detections: Sequence[ThermalDetection]) -> int:
    """Returns how many were actually written. Re-storing an unchanged file writes nothing."""
    sql = text("""
        INSERT INTO thermal_detection (provenance, source_id, retrieved_at, raw_document_id,
                                       point, scan_km, track_km, observed_at, frp_mw,
                                       brightness_k, brightness_background_k, confidence,
                                       satellite, day_night, product_version, content_hash)
        VALUES (:provenance, :source_id, :retrieved_at, :raw_document_id,
                ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
                :scan_km, :track_km, :observed_at, :frp_mw, :brightness_k,
                :brightness_background_k, :confidence, :satellite, :day_night,
                :product_version, :content_hash)
        ON CONFLICT (source_id, point, observed_at, content_hash) DO NOTHING
    """)
    written = 0
    batch: list[dict[str, Any]] = []
    for d in detections:
        batch.append(
            {
                "provenance": d.envelope.provenance,
                "source_id": d.envelope.source_id,
                "retrieved_at": d.envelope.retrieved_at,
                "raw_document_id": UUID(d.envelope.raw),
                "longitude": d.longitude,
                "latitude": d.latitude,
                "scan_km": d.scan_km,
                "track_km": d.track_km,
                "observed_at": d.observed_at,
                "frp_mw": d.frp_mw,
                "brightness_k": d.brightness_k,
                "brightness_background_k": d.brightness_background_k,
                "confidence": d.confidence,
                "satellite": d.satellite,
                "day_night": d.day_night,
                "product_version": d.product_version,
                "content_hash": _content_hash(d),
            }
        )
        if len(batch) >= BATCH:
            written += connection.execute(sql, batch).rowcount
            batch = []
    if batch:
        written += connection.execute(sql, batch).rowcount
    return written


def _content_hash(d: ThermalDetection) -> bytes:
    """A fingerprint of what the PROVIDER said; the envelope is excluded because Noma fetching
    twice is not NASA reprocessing (domain-model point 19)."""
    return hashlib.sha256(d.model_dump_json(exclude={"envelope"}).encode()).digest()


def last_asked(connection: Connection, source_id: str) -> datetime | None:
    """When Noma last fetched anything from this source. Read from `raw_document` rather than from
    a table of its own: the document IS the record of the fetch."""
    return connection.execute(
        text("SELECT max(retrieved_at) FROM raw_document WHERE source_id = :source_id"),
        {"source_id": source_id},
    ).scalar_one_or_none()


def detections_within(
    connection: Connection,
    *,
    longitude: float,
    latitude: float,
    radius_m: float,
    start: datetime | None = None,
    end: datetime | None = None,
    as_of: datetime | None = None,
    limit: int = 5000,
) -> Sequence[ThermalDetection]:
    """Newest version of each detection, as Noma held it `as_of`. A near-real-time detection
    replaced later by the processed product would otherwise appear twice."""
    rows = connection.execute(
        text("""
            SELECT DISTINCT ON (point, observed_at) *,
                   ST_X(point::geometry) AS longitude, ST_Y(point::geometry) AS latitude
            FROM thermal_detection
            WHERE ST_DWithin(point, ST_MakePoint(:longitude, :latitude)::geography, :radius_m)
              AND retrieved_at <= :as_of
              AND (CAST(:start AS timestamptz) IS NULL OR observed_at >= :start)
              AND (CAST(:end   AS timestamptz) IS NULL OR observed_at <= :end)
            ORDER BY point, observed_at, retrieved_at DESC
            LIMIT :limit
        """),
        {
            "longitude": longitude,
            "latitude": latitude,
            "radius_m": radius_m,
            "start": start,
            "end": end,
            "as_of": as_of or datetime.now(tz=UTC),
            "limit": limit,
        },
    ).mappings()
    return sorted((_read(r) for r in rows), key=lambda d: d.observed_at, reverse=True)


def _read(r: RowMapping) -> ThermalDetection:
    return ThermalDetection(
        envelope=Envelope(
            provenance=r["provenance"],
            source_id=SourceId(r["source_id"]),
            retrieved_at=r["retrieved_at"],
            raw=str(r["raw_document_id"]),
        ),
        longitude=r["longitude"],
        latitude=r["latitude"],
        scan_km=r["scan_km"],
        track_km=r["track_km"],
        observed_at=r["observed_at"],
        frp_mw=r["frp_mw"],
        brightness_k=r["brightness_k"],
        brightness_background_k=r["brightness_background_k"],
        confidence=r["confidence"],
        satellite=r["satellite"],
        day_night=r["day_night"],
        product_version=r["product_version"],
    )
