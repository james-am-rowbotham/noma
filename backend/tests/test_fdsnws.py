"""Asking an agency for earthquakes. The query is built and checked without the network; one test
marked `network` calls INGV for real."""

from datetime import UTC, datetime, timedelta
from typing import TypedDict

import httpx2 as httpx
import pytest
from sqlalchemy import Engine, text

from noma.adapters.fdsnws import EVENT_SERVICE_PATH, CatalogueError, event_query, fetch_events
from noma.coverage import Area, ensure_events

pytestmark = pytest.mark.filterwarnings("ignore::DeprecationWarning")


# Etna, roughly — a box around the volcano, not a claim about where its edge is. Which earthquakes
# belong to Etna is a question Noma has not answered yet (domain-model point 1, and the Smithsonian
# catalogue's terms could not be read), so this is only "the area being looked at".
#: Used only to build queries in these tests; the real URL comes from the source table.
INGV = "https://webservices.ingv.it/fdsnws/event/1/query"


class Box(TypedDict):
    minlatitude: float
    maxlatitude: float
    minlongitude: float
    maxlongitude: float


ETNA_BOX: Box = {
    "minlatitude": 37.60,
    "maxlatitude": 37.95,
    "minlongitude": 14.80,
    "maxlongitude": 15.25,
}


class TestTheQuery:
    def test_it_asks_for_quakeml_not_geojson(self):
        # Both INGV and USGS offer GeoJSON, but each invented its own and neither can carry more
        # than one origin or magnitude per event — the thing domain-model point 2 exists to keep.
        assert event_query(INGV).params["format"] == "xml"

    def test_it_uses_the_standards_parameter_names(self):
        url = event_query(INGV, **ETNA_BOX, minmagnitude=2, limit=10)
        assert {"minlatitude", "maxlatitude", "minlongitude", "maxlongitude"} <= set(url.params)
        assert url.params["minmagnitude"] == "2"

    def test_times_go_out_as_utc(self):
        # Amsterdam in August is UTC+2; 10:24 local is 08:24 UTC. Sending the local reading would
        # ask for the wrong two hours — the same trap as reading one (ADR-0003).
        amsterdam = datetime(2026, 8, 15, 10, 24, tzinfo=UTC) + timedelta(hours=2)
        url = event_query(INGV, starttime=amsterdam.astimezone(UTC))
        assert url.params["starttime"] == "2026-08-15T12:24:00"

    def test_a_time_without_a_timezone_is_refused(self):
        with pytest.raises(ValueError, match="no timezone"):
            event_query(INGV, starttime=datetime(2026, 8, 15, 10, 24))  # noqa: DTZ001

    def test_the_path_is_the_standards_not_an_agencys(self):
        # fdsnws-event 1.2: only the host differs between agencies, which is why the host lives in
        # the source table and this does not.
        assert EVENT_SERVICE_PATH == "/fdsnws/event/1/query"
        assert INGV.endswith(EVENT_SERVICE_PATH)


class TestWhatComesBack:
    def test_a_non_xml_answer_is_refused(self, monkeypatch: pytest.MonkeyPatch):
        # INGV answered `format=json` with HTTP 200 and QuakeML anyway (docs/research/standards.md),
        # so the content type is what is checked, never the status code alone.
        def html(*_args: object, **_kwargs: object) -> httpx.Response:
            return httpx.Response(200, headers={"content-type": "text/html"}, content=b"<html>")

        monkeypatch.setattr(httpx, "get", html)
        with pytest.raises(CatalogueError, match="expected QuakeML"):
            fetch_events(event_query(INGV))

    def test_nothing_found_is_not_an_error(self, monkeypatch: pytest.MonkeyPatch):
        # A query matching no earthquakes answers 204 No Content, not an empty document.
        def no_content(*_args: object, **_kwargs: object) -> httpx.Response:
            return httpx.Response(204)

        monkeypatch.setattr(httpx, "get", no_content)
        assert fetch_events(event_query(INGV)) is None

    def test_an_unreachable_service_says_so(self, monkeypatch: pytest.MonkeyPatch):
        def boom(*_args: object, **_kwargs: object) -> httpx.Response:
            raise httpx.ConnectError("no route to host")

        monkeypatch.setattr(httpx, "get", boom)
        with pytest.raises(CatalogueError, match="could not reach"):
            fetch_events(event_query(INGV))


@pytest.mark.network
@pytest.mark.db
def test_real_earthquakes_from_the_live_services(db: Engine):
    """The whole path against the real world: work out who answers for Etna, ask them, store it."""
    area = Area(
        min_longitude=ETNA_BOX["minlongitude"],
        min_latitude=ETNA_BOX["minlatitude"],
        max_longitude=ETNA_BOX["maxlongitude"],
        max_latitude=ETNA_BOX["maxlatitude"],
    )
    with db.connect() as conn:
        transaction = conn.begin()
        now = datetime.now(tz=UTC)
        coverage = ensure_events(
            conn, area, start=now - timedelta(days=90), end=now, min_magnitude=1.5
        )
        asked = {s.source_id for s in coverage.sources}
        assert "ingv" in asked, "INGV answers for Italy and should have been asked"

        stored = [s.stored for s in coverage.sources if s.stored]
        assert stored, "no source returned anything — widen the query"
        for parsed in stored:
            for origin in parsed.origins:
                assert origin.envelope.provenance == "OBSERVED"

        # Every record carries the request that produced it, so it can be fetched again.
        urls = conn.execute(text("SELECT request_url FROM raw_document")).scalars().all()
        assert urls and all("fdsnws/event" in u for u in urls)
        transaction.rollback()
