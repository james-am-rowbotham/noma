"""The real Etna earthquake, into PostgreSQL and back out unchanged. ADR-0004.

A round trip is the test that matters for storage: it fails if any of the ~40 columns is written to
the wrong place, read from the wrong place, or quietly dropped — including the ones nothing will
ever draw, which is exactly where a silent loss would otherwise hide (domain-model point 8).
"""

from datetime import UTC, datetime, timedelta

import pytest
from sqlalchemy import Connection, Engine, text
from sqlalchemy.exc import DBAPIError

from noma.adapters.quakeml import QuakeMLError
from noma.domain.quake import SourceId
from noma.domain.source import Source
from noma.store.quakes import ingest_quakeml, load_event, origins_within, save_source
from tests.conftest import ETNA

pytestmark = pytest.mark.db

XML = ETNA.read_bytes()
RETRIEVED_AT = datetime(2026, 9, 18, 19, 51, tzinfo=UTC)
INGV = Source(
    id=SourceId("ingv"),
    name="Istituto Nazionale di Geofisica e Vulcanologia",
    ror_id="https://ror.org/00qps9a02",
    # CC BY 4.0 makes attribution a legal requirement, not a courtesy (domain-model point 13).
    licence="CC-BY-4.0",
)
ETNA_QUAKE_LON, ETNA_QUAKE_LAT = 15.07, 37.832


@pytest.fixture
def conn(db: Engine):
    """Each test in its own transaction, rolled back after — so tests cannot affect each other."""
    with db.connect() as connection:
        transaction = connection.begin()
        save_source(connection, INGV)
        yield connection
        transaction.rollback()


def ingest(connection: Connection):
    return ingest_quakeml(
        connection,
        XML,
        source_id=SourceId("ingv"),
        provenance="OBSERVED",  # ADR-0005: an agency's own processing of its own instruments
        retrieved_at=RETRIEVED_AT,
    )


def test_an_earthquake_survives_the_round_trip_exactly(conn: Connection):
    stored = ingest(conn)
    event = stored.events[0]

    read_back = load_event(conn, SourceId("ingv"), event.public_id)

    assert read_back.events == stored.events
    assert read_back.origins == stored.origins
    assert read_back.magnitudes == stored.magnitudes


def test_the_record_points_at_the_bytes_it_came_from(conn: Connection):
    # envelope.raw is the id of the stored document, so the original can always be re-read.
    stored = ingest(conn)
    content = conn.execute(
        text("SELECT content FROM raw_document WHERE id = :id"),
        {"id": stored.origins[0].envelope.raw},
    ).scalar_one()
    assert bytes(content) == XML


def test_the_same_document_twice_is_stored_once(conn: Connection):
    ingest(conn)
    count = conn.execute(text("SELECT count(*) FROM raw_document")).scalar_one()
    assert count == 1


def test_near_here_is_a_question_answered_in_metres(conn: Connection):
    # Domain-model point 1: an earthquake has a location, not a volcano. "Within 30 km" is asked
    # each time, and ST_DWithin on a geography column takes METRES.
    stored = ingest(conn)
    near = origins_within(conn, longitude=ETNA_QUAKE_LON, latitude=ETNA_QUAKE_LAT, radius_m=30_000)
    assert [o.public_id for o in near] == [o.public_id for o in stored.origins]

    # One degree of latitude away is about 111 km: outside 30 km, inside 200 km.
    far = ETNA_QUAKE_LAT + 1
    assert origins_within(conn, longitude=ETNA_QUAKE_LON, latitude=far, radius_m=30_000) == []
    assert len(origins_within(conn, longitude=ETNA_QUAKE_LON, latitude=far, radius_m=200_000)) == 1


def test_the_database_refuses_a_provenance_class_that_does_not_exist(conn: Connection):
    # ADR-0005's six classes are a CHECK constraint as well as a Python type, so a direct write —
    # a migration, a script, psql — cannot introduce a seventh.
    ingest(conn)  # so there is a document to point at
    with pytest.raises(DBAPIError, match="provenance"), conn.begin_nested():
        conn.execute(
            text("""
                INSERT INTO quake_event (provenance, source_id, retrieved_at, raw_document_id,
                                         public_id)
                SELECT 'RETRIEVED', 'ingv', now(), id, 'x' FROM raw_document LIMIT 1
            """)
        )


def test_a_document_noma_will_not_accept_stores_nothing(conn: Connection):
    # The parse happens inside the transaction, so a refusal leaves no half-ingested earthquake.
    broken = XML.replace(b"<type>earthquake</type>", b"<type>quake-ish</type>")
    # A savepoint, so the refusal undoes only this attempt and the test can still look afterwards.
    savepoint = conn.begin_nested()
    with pytest.raises(QuakeMLError):
        ingest_quakeml(
            conn,
            broken,
            source_id=SourceId("ingv"),
            provenance="OBSERVED",
            retrieved_at=RETRIEVED_AT,
        )
    savepoint.rollback()
    assert conn.execute(text("SELECT count(*) FROM quake_event")).scalar_one() == 0
    assert conn.execute(text("SELECT count(*) FROM raw_document")).scalar_one() == 0


class TestRevisions:
    """Domain-model point 2's second half: the same agency revises. An automatic detection is
    published in seconds and a human-reviewed one replaces it later — and the first version is
    what an observatory reviewing a crisis needs to see."""

    @staticmethod
    def revised() -> bytes:
        # The same earthquake as INGV would re-publish it: same public ids, a moved location and a
        # magnitude the review changed.
        return (
            XML.replace(b"<value>37.832</value>", b"<value>37.840</value>")
            .replace(b"<value>3.9</value>", b"<value>4.1</value>")
            .replace(b"<evaluationStatus>reviewed", b"<evaluationStatus>final")
        )

    def ingest_at(self, conn: Connection, document: bytes, when: datetime):
        return ingest_quakeml(
            conn,
            document,
            source_id=SourceId("ingv"),
            provenance="OBSERVED",
            retrieved_at=when,
        )

    def test_the_same_data_twice_adds_nothing(self, conn: Connection):
        self.ingest_at(conn, XML, RETRIEVED_AT)
        self.ingest_at(conn, XML, RETRIEVED_AT + timedelta(hours=1))
        rows = conn.execute(text("SELECT count(*) FROM quake_origin")).scalar_one()
        assert rows == 1, "an unchanged re-fetch should not create a version"

    def test_a_revision_is_kept_beside_the_version_before_it(self, conn: Connection):
        self.ingest_at(conn, XML, RETRIEVED_AT)
        self.ingest_at(conn, self.revised(), RETRIEVED_AT + timedelta(hours=1))
        rows = conn.execute(text("SELECT count(*) FROM quake_origin")).scalar_one()
        assert rows == 2, "the earlier version must survive the revision"

    def test_reading_gives_the_newest_version(self, conn: Connection):
        first = self.ingest_at(conn, XML, RETRIEVED_AT)
        self.ingest_at(conn, self.revised(), RETRIEVED_AT + timedelta(hours=1))

        now = load_event(conn, SourceId("ingv"), first.events[0].public_id)

        assert now.origins[0].latitude.value == 37.840
        assert now.magnitudes[0].mag.value == 4.1
        assert now.origins[0].evaluation_status == "final"

    def test_what_did_we_know_at_the_time(self, conn: Connection):
        # The question this whole design exists to answer.
        first = self.ingest_at(conn, XML, RETRIEVED_AT)
        self.ingest_at(conn, self.revised(), RETRIEVED_AT + timedelta(hours=1))

        before = load_event(
            conn,
            SourceId("ingv"),
            first.events[0].public_id,
            as_of=RETRIEVED_AT + timedelta(minutes=30),
        )

        assert before.origins[0].latitude.value == 37.832
        assert before.magnitudes[0].mag.value == 3.9
        assert before.origins[0].evaluation_status == "reviewed"

    def test_a_search_of_the_map_returns_one_row_per_earthquake(self, conn: Connection):
        # Not one per version — otherwise a much-revised earthquake would crowd the map.
        self.ingest_at(conn, XML, RETRIEVED_AT)
        self.ingest_at(conn, self.revised(), RETRIEVED_AT + timedelta(hours=1))
        near = origins_within(
            conn, longitude=ETNA_QUAKE_LON, latitude=ETNA_QUAKE_LAT, radius_m=30_000
        )
        assert len(near) == 1
        assert near[0].latitude.value == 37.840
