"""Asking INGV for earthquakes. The query is built and checked without the network; one test marked
`network` actually calls the live service."""

from datetime import UTC, datetime, timedelta
from typing import TypedDict

import httpx2 as httpx
import pytest
from sqlalchemy import Engine, text

from noma.adapters.ingv import INGV_EVENT_SERVICE, CatalogueError, event_query, fetch_events
from noma.ingest import ingest_ingv_events

pytestmark = pytest.mark.filterwarnings("ignore::DeprecationWarning")


# Etna, roughly — a box around the volcano, not a claim about where its edge is. Which earthquakes
# belong to Etna is a question Noma has not answered yet (domain-model point 1, and the Smithsonian
# catalogue's terms could not be read), so this is only "the area being looked at".
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
        assert event_query().params["format"] == "xml"

    def test_it_uses_the_standards_parameter_names(self):
        url = event_query(**ETNA_BOX, minmagnitude=2, limit=10)
        assert {"minlatitude", "maxlatitude", "minlongitude", "maxlongitude"} <= set(url.params)
        assert url.params["minmagnitude"] == "2"

    def test_times_go_out_as_utc(self):
        # Amsterdam in August is UTC+2; 10:24 local is 08:24 UTC. Sending the local reading would
        # ask for the wrong two hours — the same trap as reading one (ADR-0003).
        amsterdam = datetime(2026, 8, 15, 10, 24, tzinfo=UTC) + timedelta(hours=2)
        url = event_query(starttime=amsterdam.astimezone(UTC))
        assert url.params["starttime"] == "2026-08-15T12:24:00"

    def test_a_time_without_a_timezone_is_refused(self):
        with pytest.raises(ValueError, match="no timezone"):
            event_query(starttime=datetime(2026, 8, 15, 10, 24))  # noqa: DTZ001

    def test_it_points_at_the_standard_path(self):
        # fdsnws-event 1.2 — the path is the standard's, so another agency is a different host.
        assert INGV_EVENT_SERVICE.endswith("/fdsnws/event/1/query")


class TestWhatComesBack:
    def test_a_non_xml_answer_is_refused(self, monkeypatch: pytest.MonkeyPatch):
        # INGV answered `format=json` with HTTP 200 and QuakeML anyway (docs/research/standards.md),
        # so the content type is what is checked, never the status code alone.
        def html(*_args: object, **_kwargs: object) -> httpx.Response:
            return httpx.Response(200, headers={"content-type": "text/html"}, content=b"<html>")

        monkeypatch.setattr(httpx, "get", html)
        with pytest.raises(CatalogueError, match="expected QuakeML"):
            fetch_events(event_query())

    def test_nothing_found_is_not_an_error(self, monkeypatch: pytest.MonkeyPatch):
        # A query matching no earthquakes answers 204 No Content, not an empty document.
        def no_content(*_args: object, **_kwargs: object) -> httpx.Response:
            return httpx.Response(204)

        monkeypatch.setattr(httpx, "get", no_content)
        assert fetch_events(event_query()) is None

    def test_an_unreachable_service_says_so(self, monkeypatch: pytest.MonkeyPatch):
        def boom(*_args: object, **_kwargs: object) -> httpx.Response:
            raise httpx.ConnectError("no route to host")

        monkeypatch.setattr(httpx, "get", boom)
        with pytest.raises(CatalogueError, match="could not reach"):
            fetch_events(event_query())


@pytest.mark.network
@pytest.mark.db
def test_real_earthquakes_from_the_live_service(db: Engine):
    """The whole path: ask INGV, store what comes back, and it is real data from today."""
    with db.connect() as conn:
        transaction = conn.begin()
        stored = ingest_ingv_events(
            conn,
            starttime=datetime.now(tz=UTC) - timedelta(days=365),
            **ETNA_BOX,
            minmagnitude=2.5,
            limit=5,
        )
        assert stored is not None, "INGV had no matching earthquakes — widen the query"
        assert stored.events, "a document with no events"

        # Every record carries the request that produced it, so it can be fetched again.
        request_url = conn.execute(text("SELECT request_url FROM raw_document")).scalar_one()
        assert "fdsnws/event" in request_url

        for origin in stored.origins:
            assert origin.envelope.provenance == "OBSERVED"
            assert ETNA_BOX["minlatitude"] <= origin.latitude.value <= ETNA_BOX["maxlatitude"]
        transaction.rollback()
