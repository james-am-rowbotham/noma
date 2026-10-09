"""What Noma knows about its own asking — and the one distinction a monitor depends on.

A week with no earthquakes is a quiet week. A week in which Noma never managed to ask is Noma being
broken. From the outside they are the same empty map, which is why migration 28e4a8fd1690 exists at
all: Noma once recorded INGV's HTTP 204 for Hawaii as "asked, and the catalogue is genuinely empty"
and drew a confident empty map over Kīlauea.

These tests hold the two apart.
"""

from collections.abc import Iterator
from datetime import UTC, datetime

import pytest
from sqlalchemy import Connection, Engine, text

from noma.store.sources import last_asked, last_received

pytestmark = pytest.mark.db

#: Safely in the past, so nothing here depends on the time of day it runs.
ASKED_AT = datetime(2026, 9, 20, 9, 0, tzinfo=UTC)
ETNA_BOX = "POLYGON((14.8 37.6,15.25 37.6,15.25 37.95,14.8 37.95,14.8 37.6))"


@pytest.fixture
def conn(db: Engine) -> Iterator[Connection]:
    with db.connect() as connection:
        transaction = connection.begin()
        yield connection
        transaction.rollback()


def record_an_ask(conn: Connection, *, source_id: str, found: int) -> None:
    """One row in `event_fetch`: Noma asked an agency, and this is what came back. `found=0` is the
    empty answer — the case that must not be mistaken for never asking."""
    conn.execute(
        text("""
            INSERT INTO event_fetch (source_id, fetched_at, area, window_start, window_end,
                                     found, request_url)
            VALUES (:source_id, :at, ST_GeomFromText(:area, 4326), :start, :end, :found, 'test://')
        """),
        {
            "source_id": source_id,
            "at": ASKED_AT,
            "area": ETNA_BOX,
            "start": datetime(2026, 9, 1, tzinfo=UTC),
            "end": datetime(2026, 9, 20, tzinfo=UTC),
            "found": found,
        },
    )


def store_a_document(conn: Connection, *, source_id: str) -> None:
    conn.execute(
        text("""
            INSERT INTO raw_document (source_id, retrieved_at, media_type, sha256, content)
            VALUES (:source_id, :at, 'application/xml', sha256(:c), :c)
        """),
        {"source_id": source_id, "at": ASKED_AT, "c": b"<quakeml/>"},
    )


class TestAskedAndEmptyIsNotUnasked:
    def test_an_ask_that_found_nothing_is_still_an_ask(self, conn: Connection):
        # THE KĪLAUEA CASE. INGV answers 204 for Hawaii, so there is no document to store — and if
        # freshness were read from the documents alone, a source answering diligently and emptily
        # would look like one Noma had stopped asking.
        record_an_ask(conn, source_id="ingv", found=0)

        assert last_asked(conn, "ingv") == ASKED_AT
        assert last_received(conn, "ingv") is None

    def test_a_source_never_asked_says_so(self, conn: Connection):
        # None from both. A reader must not turn this into "asked, and nothing came back".
        assert last_asked(conn, "usgs") is None
        assert last_received(conn, "usgs") is None

    def test_a_document_arriving_sets_received_but_not_asked(self, conn: Connection):
        # NASA's thermal feed has no event service: Noma fetches a file, it never "asks" in the
        # fdsnws sense. So `last_asked` stays None for it, for ever, and that is correct.
        store_a_document(conn, source_id="nasa_firms")

        assert last_received(conn, "nasa_firms") == ASKED_AT
        assert last_asked(conn, "nasa_firms") is None

    def test_both_are_answered_when_an_ask_brought_something_back(self, conn: Connection):
        record_an_ask(conn, source_id="ingv", found=58)
        store_a_document(conn, source_id="ingv")

        assert last_asked(conn, "ingv") == ASKED_AT
        assert last_received(conn, "ingv") == ASKED_AT

    def test_they_are_per_source(self, conn: Connection):
        # Asking INGV says nothing about whether USGS was asked, and a summary that pooled them
        # would report coverage Noma does not have.
        record_an_ask(conn, source_id="ingv", found=3)

        assert last_asked(conn, "ingv") is not None
        assert last_asked(conn, "usgs") is None

    def test_the_newest_ask_wins(self, conn: Connection):
        record_an_ask(conn, source_id="ingv", found=0)
        conn.execute(
            text("""
                INSERT INTO event_fetch (source_id, fetched_at, area, window_start, window_end,
                                         found, request_url)
                VALUES ('ingv', :at, ST_GeomFromText(:area, 4326), :start, :end, 0, 'test://')
            """),
            {
                "at": datetime(2026, 9, 21, 9, 0, tzinfo=UTC),
                "area": ETNA_BOX,
                "start": datetime(2026, 9, 1, tzinfo=UTC),
                "end": datetime(2026, 9, 21, tzinfo=UTC),
            },
        )

        assert last_asked(conn, "ingv") == datetime(2026, 9, 21, 9, 0, tzinfo=UTC)
