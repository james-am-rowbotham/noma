"""Storing and reading continuously measured things — family 2. See ADR-0004.

The only module that knows how stations, datastreams and observations are laid out in tables.

Observations arrive in their thousands — one station is 19,203 readings over twenty years — so they
are inserted in batches. They carry the same content fingerprint as the earthquake tables
(domain-model point 19): an unchanged re-fetch conflicts and does nothing, and a reading revised
later (a `rapid` solution replaced by a `final` one) lands beside the one before it.
"""

import hashlib
from collections.abc import Mapping, Sequence
from datetime import UTC, datetime
from typing import Any
from uuid import UUID

from sqlalchemy import Connection, RowMapping, text

from noma.adapters.gnss_pos import ParsedSeries
from noma.domain.quake import Envelope, Metres, SourceId
from noma.domain.series import Datastream, Observation, Station

#: How many observations go to the database at once. Large enough that twenty years of daily
#: readings is a handful of round trips, small enough not to build a statement of unbounded size.
BATCH = 1000


def save_series(connection: Connection, parsed: ParsedSeries) -> dict[str, int]:
    """Store a station, its datastreams and its readings. Returns what was actually written —
    re-storing an unchanged file writes nothing, and says so."""
    station_id = _save_station(connection, parsed.station)
    streams = {d.public_id: _save_datastream(connection, d, station_id) for d in parsed.datastreams}
    written = _save_observations(connection, parsed.observations, streams)
    return {"stations": 1, "datastreams": len(streams), "observations": written}


def _save_station(connection: Connection, station: Station) -> UUID:
    row = connection.execute(
        text("""
            INSERT INTO station (provenance, source_id, retrieved_at, raw_document_id,
                                 public_id, name, point, elevation_m)
            VALUES (:provenance, :source_id, :retrieved_at, :raw_document_id,
                    :public_id, :name,
                    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
                    :elevation_m)
            ON CONFLICT (source_id, public_id) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
        """),
        {
            **_envelope(station.envelope),
            "public_id": station.public_id,
            "name": station.name,
            "longitude": station.longitude,
            "latitude": station.latitude,
            "elevation_m": station.elevation_m,
        },
    ).one()
    return row.id


def _save_datastream(connection: Connection, stream: Datastream, station_id: UUID) -> UUID:
    row = connection.execute(
        text("""
            INSERT INTO datastream (station_id, provenance, source_id, retrieved_at,
                                    raw_document_id, public_id, observed_property, unit,
                                    procedure, reference_frame, expected_cadence)
            VALUES (:station_id, :provenance, :source_id, :retrieved_at, :raw_document_id,
                    :public_id, :observed_property, :unit, :procedure, :reference_frame,
                    :expected_cadence)
            ON CONFLICT (source_id, public_id) DO UPDATE SET unit = EXCLUDED.unit,
                -- Re-ingesting updates the rhythm: an agency moving from daily to hourly is news,
                -- and a stale cadence would make a healthy feed look late forever.
                expected_cadence = EXCLUDED.expected_cadence
            RETURNING id
        """),
        {
            "station_id": station_id,
            **_envelope(stream.envelope),
            "public_id": stream.public_id,
            "observed_property": stream.observed_property,
            "unit": stream.unit,
            "procedure": stream.procedure,
            "expected_cadence": stream.expected_cadence,
            "reference_frame": stream.reference_frame,
        },
    ).one()
    return row.id


def _save_observations(
    connection: Connection, observations: Sequence[Observation], streams: Mapping[str, UUID]
) -> int:
    sql = text("""
        INSERT INTO observation (datastream_id, provenance, source_id, retrieved_at,
                                 raw_document_id, phenomenon_time, result_time, result,
                                 uncertainty, solution, content_hash)
        VALUES (:datastream_id, :provenance, :source_id, :retrieved_at, :raw_document_id,
                :phenomenon_time, :result_time, :result, :uncertainty, :solution, :content_hash)
        ON CONFLICT (datastream_id, phenomenon_time, content_hash) DO NOTHING
    """)
    written = 0
    batch: list[dict[str, Any]] = []
    for o in observations:
        batch.append(
            {
                "datastream_id": streams[o.datastream_public_id],
                **_envelope(o.envelope),
                "phenomenon_time": o.phenomenon_time,
                "result_time": o.result_time,
                "result": o.result,
                "uncertainty": o.uncertainty,
                "solution": o.solution,
                "content_hash": _content_hash(o),
            }
        )
        if len(batch) >= BATCH:
            written += connection.execute(sql, batch).rowcount
            batch = []
    if batch:
        written += connection.execute(sql, batch).rowcount
    return written


def _content_hash(o: Observation) -> bytes:
    """A fingerprint of what the AGENCY said. The envelope is excluded on purpose: `retrieved_at`
    differs on every fetch, and Noma fetching twice is not the agency changing its mind."""
    return hashlib.sha256(o.model_dump_json(exclude={"envelope"}).encode()).digest()


def _envelope(e: Envelope) -> dict[str, Any]:
    return {
        "provenance": e.provenance,
        "source_id": e.source_id,
        "retrieved_at": e.retrieved_at,
        "raw_document_id": UUID(e.raw),
    }


# ── reading ──────────────────────────────────────────────────────────────────


def stations_within(
    connection: Connection, *, longitude: float, latitude: float, radius_m: float
) -> Sequence[Station]:
    """ "Stations near here" — a distance question, answered in METRES because the column is
    geography (ADR-0004)."""
    rows = connection.execute(
        text("""
            SELECT *, ST_X(point::geometry) AS longitude, ST_Y(point::geometry) AS latitude
            FROM station
            WHERE ST_DWithin(point, ST_MakePoint(:longitude, :latitude)::geography, :radius_m)
            ORDER BY public_id
        """),
        {"longitude": longitude, "latitude": latitude, "radius_m": radius_m},
    ).mappings()
    return [_read_station(r) for r in rows]


def datastreams_of(connection: Connection, station_public_id: str) -> Sequence[Datastream]:
    rows = connection.execute(
        text("""
            SELECT d.*, s.public_id AS station_public_id
            FROM datastream d JOIN station s ON s.id = d.station_id
            WHERE s.public_id = :station_public_id
            ORDER BY d.observed_property
        """),
        {"station_public_id": station_public_id},
    ).mappings()
    return [_read_datastream(r) for r in rows]


def last_observed(connection: Connection, station_public_id: str) -> Mapping[str, datetime]:
    """When each of a station's streams last produced a reading, keyed by datastream.

    Separate from `datastreams_of` because this is a fact about the OBSERVATIONS, not a column on
    the datastream — storing it on the stream would mean a value that is wrong the moment the next
    reading lands.

    A stream absent from the result has never produced a reading at all, which is a different state
    from "has not produced one lately" and must stay distinguishable: the first means Noma has
    never seen this stream work, the second means it stopped.
    """
    rows = connection.execute(
        text("""
            SELECT d.public_id, max(o.phenomenon_time) AS last
            FROM datastream d
              JOIN station s ON s.id = d.station_id
              JOIN observation o ON o.datastream_id = d.id
            WHERE s.public_id = :station_public_id
            GROUP BY d.public_id
        """),
        {"station_public_id": station_public_id},
    ).all()
    return {r.public_id: r.last for r in rows}


def observations_of(
    connection: Connection,
    datastream_public_id: str,
    *,
    start: datetime | None = None,
    end: datetime | None = None,
    as_of: datetime | None = None,
    limit: int = 50_000,
) -> Sequence[Observation]:
    """One reading per epoch: the newest version Noma had received `as_of` (domain-model point 19).
    Without that choice a reading revised once would appear twice on a chart."""
    rows = connection.execute(
        text("""
            SELECT DISTINCT ON (o.phenomenon_time) o.*, d.public_id AS datastream_public_id
            FROM observation o JOIN datastream d ON d.id = o.datastream_id
            WHERE d.public_id = :datastream_public_id
              AND o.retrieved_at <= :as_of
              AND (CAST(:start AS timestamptz) IS NULL OR o.phenomenon_time >= :start)
              AND (CAST(:end   AS timestamptz) IS NULL OR o.phenomenon_time <= :end)
            ORDER BY o.phenomenon_time, o.retrieved_at DESC
            LIMIT :limit
        """),
        {
            "datastream_public_id": datastream_public_id,
            "start": start,
            "end": end,
            "as_of": as_of or datetime.now(tz=UTC),
            "limit": limit,
        },
    ).mappings()
    return [_read_observation(r) for r in rows]


def _read_envelope(r: RowMapping) -> Envelope:
    return Envelope(
        provenance=r["provenance"],
        source_id=SourceId(r["source_id"]),
        retrieved_at=r["retrieved_at"],
        raw=str(r["raw_document_id"]),
    )


def _read_station(r: RowMapping) -> Station:
    return Station(
        envelope=_read_envelope(r),
        public_id=r["public_id"],
        name=r["name"],
        longitude=r["longitude"],
        latitude=r["latitude"],
        elevation_m=Metres(r["elevation_m"]) if r["elevation_m"] is not None else None,
    )


def _read_datastream(r: RowMapping) -> Datastream:
    return Datastream(
        envelope=_read_envelope(r),
        public_id=r["public_id"],
        station_public_id=r["station_public_id"],
        observed_property=r["observed_property"],
        unit=r["unit"],
        procedure=r["procedure"],
        reference_frame=r["reference_frame"],
        expected_cadence=r["expected_cadence"],
    )


def _read_observation(r: RowMapping) -> Observation:
    return Observation(
        envelope=_read_envelope(r),
        datastream_public_id=r["datastream_public_id"],
        phenomenon_time=r["phenomenon_time"],
        result_time=r["result_time"],
        result=r["result"],
        uncertainty=r["uncertainty"],
        solution=r["solution"],
    )
