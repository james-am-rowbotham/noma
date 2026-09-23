"""Fetching because someone looked. The rule being tested is that Noma asks an agency once for a
given area and window, and not again — except where the window touches the present, because a
catalogue keeps revising recent earthquakes."""

from datetime import UTC, datetime, timedelta
from typing import TypedDict

import httpx2 as httpx
import pytest
from sqlalchemy import Connection, Engine, text

from noma.coverage import LIVE_MAX_AGE, SETTLED_AFTER, Area, ensure_events
from noma.ingest import INGV
from noma.store.quakes import save_source
from tests.conftest import ETNA

pytestmark = pytest.mark.db

XML = ETNA.read_bytes()
NOW = datetime(2026, 9, 23, 12, 0, tzinfo=UTC)
ETNA_AREA = Area(min_longitude=14.80, min_latitude=37.60, max_longitude=15.25, max_latitude=37.95)
# Wholly inside ETNA_AREA, so a fetch of the larger box covers it.
INSIDE = Area(min_longitude=14.95, min_latitude=37.75, max_longitude=15.10, max_latitude=37.85)


class Window(TypedDict):
    start: datetime
    end: datetime


# A window that ended a month ago: settled, so Noma should never ask about it twice.
LAST_YEAR: Window = {"start": NOW - timedelta(days=365), "end": NOW - timedelta(days=30)}


@pytest.fixture
def conn(db: Engine):
    with db.connect() as connection:
        transaction = connection.begin()
        save_source(connection, INGV)
        yield connection
        transaction.rollback()


@pytest.fixture
def agency(monkeypatch: pytest.MonkeyPatch) -> list[str]:
    """Stand in for INGV, and record every request actually made to it."""
    asked: list[str] = []

    def respond(url: object, **_kwargs: object) -> httpx.Response:
        asked.append(str(url))
        return httpx.Response(200, headers={"content-type": "application/xml"}, content=XML)

    monkeypatch.setattr(httpx, "get", respond)
    return asked


def test_looking_at_an_area_fetches_it(conn: Connection, agency: list[str]):
    result = ensure_events(conn, ETNA_AREA, **LAST_YEAR, now=NOW)
    assert result.fetched
    assert len(agency) == 1
    assert conn.execute(text("SELECT count(*) FROM quake_event")).scalar_one() == 1


def test_looking_again_at_a_settled_window_asks_nothing(conn: Connection, agency: list[str]):
    ensure_events(conn, ETNA_AREA, **LAST_YEAR, now=NOW)
    again = ensure_events(conn, ETNA_AREA, **LAST_YEAR, now=NOW + timedelta(days=200))
    assert not again.fetched
    assert "settled" in again.reason
    assert len(agency) == 1, "a window that ended long ago does not change"


def test_zooming_in_asks_nothing(conn: Connection, agency: list[str]):
    # The smaller box lies inside the one already fetched, so Noma already holds it.
    ensure_events(conn, ETNA_AREA, **LAST_YEAR, now=NOW)
    zoomed = ensure_events(conn, INSIDE, **LAST_YEAR, now=NOW)
    assert not zoomed.fetched
    assert len(agency) == 1


def test_zooming_out_does_ask(conn: Connection, agency: list[str]):
    ensure_events(conn, INSIDE, **LAST_YEAR, now=NOW)
    wider = ensure_events(conn, ETNA_AREA, **LAST_YEAR, now=NOW)
    assert wider.fetched, "the larger area was never covered"
    assert len(agency) == 2


def test_a_window_touching_now_is_rechecked(conn: Connection, agency: list[str]):
    live: Window = {"start": NOW - timedelta(days=1), "end": NOW}
    ensure_events(conn, ETNA_AREA, **live, now=NOW)
    soon = ensure_events(conn, ETNA_AREA, **live, now=NOW + LIVE_MAX_AGE + timedelta(seconds=1))
    assert soon.fetched, "recent earthquakes are still being revised"
    assert len(agency) == 2


def test_a_window_touching_now_is_not_rechecked_immediately(conn: Connection, agency: list[str]):
    live: Window = {"start": NOW - timedelta(days=1), "end": NOW}
    ensure_events(conn, ETNA_AREA, **live, now=NOW)
    again = ensure_events(conn, ETNA_AREA, **live, now=NOW + timedelta(minutes=1))
    assert not again.fetched
    assert len(agency) == 1


def test_a_filtered_fetch_does_not_satisfy_an_unfiltered_look(conn: Connection, agency: list[str]):
    # Having fetched only M2+, Noma does not hold the small earthquakes, and must not pretend to.
    ensure_events(conn, ETNA_AREA, **LAST_YEAR, min_magnitude=2.0, now=NOW)
    everything = ensure_events(conn, ETNA_AREA, **LAST_YEAR, now=NOW)
    assert everything.fetched
    assert len(agency) == 2


def test_an_unfiltered_fetch_satisfies_a_filtered_look(conn: Connection, agency: list[str]):
    ensure_events(conn, ETNA_AREA, **LAST_YEAR, now=NOW)
    filtered = ensure_events(conn, ETNA_AREA, **LAST_YEAR, min_magnitude=2.0, now=NOW)
    assert not filtered.fetched, "Noma already holds everything, including the big ones"
    assert len(agency) == 1


def test_an_empty_area_is_not_asked_about_twice(conn: Connection, monkeypatch: pytest.MonkeyPatch):
    asked: list[str] = []

    def empty(url: object, **_kwargs: object) -> httpx.Response:
        asked.append(str(url))
        return httpx.Response(204)

    monkeypatch.setattr(httpx, "get", empty)
    first = ensure_events(conn, ETNA_AREA, **LAST_YEAR, now=NOW)
    second = ensure_events(conn, ETNA_AREA, **LAST_YEAR, now=NOW)
    assert first.fetched and not second.fetched
    assert len(asked) == 1, "asked and empty is not the same as never asked"


def test_a_backwards_window_is_refused(conn: Connection):
    with pytest.raises(ValueError, match="ends before it starts"):
        ensure_events(conn, ETNA_AREA, start=NOW, end=NOW - timedelta(days=1), now=NOW)


def test_the_settled_threshold_is_declared_not_hidden():
    # It is a guess, and the module says so. This test exists so it cannot quietly become folklore.
    assert timedelta(days=1) <= SETTLED_AFTER
