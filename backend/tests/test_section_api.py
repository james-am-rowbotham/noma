"""The cross-section: distance along a line against depth.

What volcano seismologists actually read, and the one view where depth — the worst-constrained of
an earthquake's three coordinates — is the whole vertical axis.
"""

from collections.abc import Iterator
from typing import Any

import httpx2 as httpx
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine

from noma.api.app import app
from noma.api.earthquakes import connection
from tests.conftest import ETNA

pytestmark = pytest.mark.db

XML = ETNA.read_bytes()
# A line passing close to the fixture earthquake at 15.07, 37.832.
ACROSS_ETNA = {"from": "14.95,37.75", "to": "15.20,37.90"}
WINDOW = {"start": "2026-08-01T00:00:00Z", "end": "2026-08-31T00:00:00Z"}


@pytest.fixture
def client(db: Engine, monkeypatch: pytest.MonkeyPatch) -> Iterator[TestClient]:
    def respond(url: object, **_kwargs: object) -> httpx.Response:
        if "ingv.it" in str(url):
            return httpx.Response(200, headers={"content-type": "application/xml"}, content=XML)
        return httpx.Response(204)

    monkeypatch.setattr(httpx, "get", respond)

    def rollback_after_each_request() -> Iterator[Any]:
        with db.connect() as conn:
            transaction = conn.begin()
            yield conn
            transaction.rollback()

    app.dependency_overrides[connection] = rollback_after_each_request
    yield TestClient(app)
    app.dependency_overrides.clear()


def get(client: TestClient, **params: str) -> dict[str, Any]:
    response = client.get("/earthquakes/section", params={**ACROSS_ETNA, **WINDOW, **params})
    assert response.status_code == 200, response.text
    return response.json()


class TestTheSection:
    def test_it_projects_the_earthquake_onto_the_line(self, client: TestClient):
        body = get(client, widthMetres="8000")
        assert len(body["earthquakes"]) == 1
        q = body["earthquakes"][0]
        # Somewhere along a line of that length, and inside the corridor.
        assert 0 < q["alongMetres"] < body["profile"]["lengthMetres"]
        assert q["offsetMetres"] <= 8000

    def test_distances_are_in_metres_not_degrees(self, client: TestClient):
        # Asked of geometry rather than geography these come back as fractions of a DEGREE — about
        # 0.2 instead of about 20,000. Both the line's length AND the distance along it are checked
        # on an absolute scale: an earlier version of this test only compared them to each other,
        # and passed happily when the projection was switched to degrees.
        body = get(client, widthMetres="8000")
        length = body["profile"]["lengthMetres"]
        along = body["earthquakes"][0]["alongMetres"]
        offset = body["earthquakes"][0]["offsetMetres"]
        assert 20_000 < length < 40_000, f"{length} looks like degrees, not metres"
        assert along > 1_000, f"{along} looks like degrees, not metres"
        assert offset > 100, f"{offset} looks like degrees, not metres"

    def test_depth_keeps_its_direction_and_its_missing_uncertainty(self, client: TestClient):
        # The fixture states a depth and NOT how uncertain it is. `uncertainty` is null rather than
        # absent, so a client can draw that it is unknown instead of drawing a confident dot.
        depth = get(client, widthMetres="8000")["earthquakes"][0]["depthMetres"]
        assert depth == {"value": 1210.0, "uncertainty": None, "positive": "down"}

    def test_a_magnitude_still_carries_its_scale(self, client: TestClient):
        m = get(client, widthMetres="8000")["earthquakes"][0]["magnitude"]
        assert m == {"value": 3.9, "uncertainty": 0.2, "scale": "ML"}

    def test_provenance_travels_with_every_point(self, client: TestClient):
        q = get(client, widthMetres="8000")["earthquakes"][0]
        assert (q["source"], q["provenance"], q["agency"]) == ("ingv", "OBSERVED", "INGV")

    def test_it_says_who_was_asked(self, client: TestClient):
        assert get(client, widthMetres="8000")["noma"]["asked"] == ["ingv", "usgs"]

    def test_the_licence_travels_with_the_data(self, client: TestClient):
        attribution = get(client, widthMetres="8000")["attribution"]
        assert [a["source"] for a in attribution] == ["ingv"]

    def test_a_narrow_corridor_excludes_what_is_off_to_the_side(self, client: TestClient):
        wide = get(client, widthMetres="8000")["earthquakes"]
        narrow = get(client, widthMetres="100")["earthquakes"]
        assert len(wide) == 1
        assert narrow == [], "a section is a slab; what lies outside it is not on the section"


class TestWhatItRefuses:
    def test_a_line_with_no_length(self, client: TestClient):
        r = client.get(
            "/earthquakes/section",
            params={"from": "15.0,37.8", "to": "15.0,37.8", **WINDOW},
        )
        assert r.status_code == 422
        assert "same point" in r.text

    def test_a_transect_across_a_continent(self, client: TestClient):
        r = client.get("/earthquakes/section", params={"from": "0,0", "to": "40,40", **WINDOW})
        assert r.status_code == 422

    def test_a_point_that_is_not_on_earth(self, client: TestClient):
        r = client.get(
            "/earthquakes/section", params={"from": "999,999", "to": "15.1,37.9", **WINDOW}
        )
        assert r.status_code == 422

    def test_a_point_that_is_not_two_numbers(self, client: TestClient):
        r = client.get("/earthquakes/section", params={"from": "15.0", "to": "15.1,37.9", **WINDOW})
        assert r.status_code == 422

    def test_a_backwards_window(self, client: TestClient):
        r = client.get(
            "/earthquakes/section",
            params={**ACROSS_ETNA, "start": WINDOW["end"], "end": WINDOW["start"]},
        )
        assert r.status_code == 422

    def test_a_corridor_wider_than_the_limit(self, client: TestClient):
        r = client.get(
            "/earthquakes/section", params={**ACROSS_ETNA, **WINDOW, "widthMetres": "999999"}
        )
        assert r.status_code == 422
