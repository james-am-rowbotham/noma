"""The earthquakes endpoint. Two of these guard traps rather than features: GeoJSON's third
coordinate, and magnitude scales that are not interchangeable."""

from collections.abc import Iterator
from datetime import UTC, datetime, timedelta
from typing import Any

import httpx2 as httpx
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine

from noma.api.app import app
from noma.api.earthquakes import connection
from noma.ingest import INGV
from noma.store.quakes import save_source
from tests.conftest import ETNA

pytestmark = pytest.mark.db

XML = ETNA.read_bytes()
BBOX = "14.80,37.60,15.25,37.95"
# The fixture earthquake is from 2026-08-15, so the window must reach back past it.
WINDOW = {
    "start": "2026-08-01T00:00:00Z",
    "end": "2026-08-31T00:00:00Z",
}


@pytest.fixture
def client(db: Engine, monkeypatch: pytest.MonkeyPatch) -> Iterator[TestClient]:
    def respond(_url: object, **_kwargs: object) -> httpx.Response:
        return httpx.Response(200, headers={"content-type": "application/xml"}, content=XML)

    monkeypatch.setattr(httpx, "get", respond)

    def rollback_after_each_request() -> Iterator[Any]:
        with db.connect() as conn:
            transaction = conn.begin()
            save_source(conn, INGV)
            yield conn
            transaction.rollback()

    app.dependency_overrides[connection] = rollback_after_each_request
    yield TestClient(app)
    app.dependency_overrides.clear()


def get(client: TestClient, **params: str) -> dict[str, Any]:
    response = client.get("/earthquakes", params={"bbox": BBOX, **WINDOW, **params})
    assert response.status_code == 200, response.text
    return response.json()


class TestWhatItReturns:
    def test_geojson_with_the_earthquake_in_it(self, client: TestClient):
        body = get(client)
        assert body["type"] == "FeatureCollection"
        assert len(body["features"]) == 1
        assert body["features"][0]["geometry"]["coordinates"] == [15.07, 37.832]

    def test_depth_is_not_smuggled_into_the_coordinates(self, client: TestClient):
        # RFC 7946's third coordinate means HEIGHT above the ellipsoid. INGV and USGS both put
        # depth in kilometres downward there. Noma does not repeat that.
        coordinates = get(client)["features"][0]["geometry"]["coordinates"]
        assert len(coordinates) == 2, "a third coordinate would mean the opposite of the depth"

    def test_depth_is_a_property_with_its_direction_stated(self, client: TestClient):
        depth = get(client)["features"][0]["properties"]["depthMetres"]
        assert depth == {"value": 1210.0, "uncertainty": None, "positive": "down"}

    def test_a_magnitude_carries_its_scale(self, client: TestClient):
        # ML 3.9 and Mw 3.9 are not the same claim, so the scale travels with the number.
        assert get(client)["features"][0]["properties"]["magnitude"] == {
            "value": 3.9,
            "uncertainty": 0.2,
            "scale": "ML",
        }

    def test_provenance_is_on_every_feature(self, client: TestClient):
        properties = get(client)["features"][0]["properties"]
        assert properties["provenance"] == "OBSERVED"
        assert properties["source"] == "ingv"
        assert properties["agency"] == "INGV"
        assert properties["retrievedAt"] and properties["producedAt"]

    def test_the_licence_travels_with_the_data(self, client: TestClient):
        # CC BY 4.0 makes attribution a legal requirement, not a footer someone may forget.
        assert get(client)["attribution"] == [
            {"source": "ingv", "name": INGV.name, "licence": "CC-BY-4.0"}
        ]

    def test_it_says_whether_it_had_to_go_and_fetch(self, client: TestClient):
        assert get(client)["noma"]["fetched"] is True


class TestWhatItRefuses:
    def test_a_bbox_that_is_not_four_numbers(self, client: TestClient):
        assert client.get("/earthquakes", params={"bbox": "14.8,37.6"}).status_code == 422

    def test_a_bbox_given_the_wrong_way_round(self, client: TestClient):
        bad = "15.25,37.95,14.80,37.60"
        assert client.get("/earthquakes", params={"bbox": bad}).status_code == 422

    def test_a_bbox_covering_a_continent(self, client: TestClient):
        # The map asks for what is on screen. Anything larger would ask an agency for a continent.
        assert client.get("/earthquakes", params={"bbox": "0,0,40,40"}).status_code == 422

    def test_a_backwards_window(self, client: TestClient):
        response = client.get(
            "/earthquakes",
            params={"bbox": BBOX, "start": WINDOW["end"], "end": WINDOW["start"]},
        )
        assert response.status_code == 422

    def test_a_time_without_a_timezone(self, client: TestClient):
        # Noma works in UTC. A naive time would be read as the server's local time — the trap
        # recorded in ADR-0002 and ADR-0003.
        response = client.get("/earthquakes", params={"bbox": BBOX, "start": "2026-08-01T00:00:00"})
        assert response.status_code == 422


class TestFiltering:
    def test_a_magnitude_filter_that_excludes_it(self, client: TestClient):
        assert get(client, minMagnitude="5")["features"] == []

    def test_a_window_that_excludes_it(self, client: TestClient):
        body = get(client, start="2026-09-01T00:00:00Z", end="2026-09-02T00:00:00Z")
        assert body["features"] == []

    def test_somewhere_else_entirely(self, client: TestClient):
        body = get(client, bbox="10.0,45.0,10.5,45.5")
        assert body["features"] == []


def test_a_default_window_is_used_when_none_is_given(client: TestClient):
    response = client.get("/earthquakes", params={"bbox": BBOX})
    assert response.status_code == 200
    # The fixture is older than the default window, so nothing is returned — but it must not error.
    assert response.json()["type"] == "FeatureCollection"


def test_the_window_default_is_a_month():
    from noma.api.earthquakes import DEFAULT_WINDOW

    assert timedelta(days=30) == DEFAULT_WINDOW
    assert datetime.now(tz=UTC) - DEFAULT_WINDOW < datetime.now(tz=UTC)
