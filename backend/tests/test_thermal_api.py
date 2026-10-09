"""The thermal endpoint. Three of these guard honesty rather than features: the pixel footprint
that stops a client drawing a dot, `live: null` where Noma has no feed, and not asking NASA again
five minutes after asking.
"""

from collections.abc import Iterator
from typing import Any

import httpx2 as httpx
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine, text

from noma.api.app import app
from noma.api.earthquakes import connection
from tests.conftest import FIRMS

pytestmark = pytest.mark.db

CSV = FIRMS.read_bytes()
ETNA = "14.80,37.60,15.25,37.95"
#: Kīlauea. The European file carries nothing here, and neither does any feed Noma has.
KILAUEA = "-155.40,19.25,-155.15,19.50"
# The fixture overpass is 01:09 on 2026-09-24, so the window has to reach back past it.
WINDOW = {"start": "2026-09-24T00:00:00Z", "end": "2026-09-25T00:00:00Z"}


class Nasa:
    """Stands in for NASA, and counts. `asked` is the point: the endpoint's job is partly to not
    ask."""

    def __init__(self) -> None:
        self.asked = 0

    def __call__(self, url: object, **_kwargs: object) -> httpx.Response:
        self.asked += 1
        return httpx.Response(200, headers={"content-type": "text/csv"}, content=CSV)


@pytest.fixture
def nasa(monkeypatch: pytest.MonkeyPatch) -> Nasa:
    spy = Nasa()
    monkeypatch.setattr(httpx, "get", spy)
    return spy


def client_over(db: Engine, *, asked_recently: bool) -> Iterator[TestClient]:
    def rollback_after_each_request() -> Iterator[Any]:
        # Sources come from the migration that seeds them; nothing is registered here.
        with db.connect() as conn:
            transaction = conn.begin()
            if asked_recently:
                # A fetch Noma made a moment ago. `last_received` reads the stored document, so
                # this is what a recent fetch actually looks like.
                conn.execute(
                    text("""
                        INSERT INTO raw_document (source_id, retrieved_at, media_type, sha256,
                                                  content)
                        VALUES ('nasa_firms', now(), 'text/csv', sha256(:c), :c)
                    """),
                    {"c": b"latitude,longitude,acq_date,acq_time,scan,track\n"},
                )
            yield conn
            transaction.rollback()

    app.dependency_overrides[connection] = rollback_after_each_request
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def client(db: Engine) -> Iterator[TestClient]:
    yield from client_over(db, asked_recently=False)


@pytest.fixture
def client_that_just_asked(db: Engine) -> Iterator[TestClient]:
    yield from client_over(db, asked_recently=True)


def get(client: TestClient, bbox: str = ETNA, **params: str) -> dict[str, Any]:
    response = client.get("/thermal", params={"bbox": bbox, **WINDOW, **params})
    assert response.status_code == 200, response.text
    return response.json()


class TestWhatItReturns:
    def test_geojson_with_the_detections_in_it(self, client: TestClient, nasa: Nasa):
        body = get(client)
        assert body["type"] == "FeatureCollection"
        assert len(body["features"]) == 5
        assert body["noma"]["held"] == 5
        assert nasa.asked == 1

    def test_every_feature_carries_the_pixel_it_was_measured_over(
        self, client: TestClient, nasa: Nasa
    ):
        # THE CENTRE IS NOT THE FIRE. A client cannot draw this honestly without the footprint,
        # and cannot get the footprint anywhere else.
        for feature in get(client)["features"]:
            pixel = feature["properties"]["pixelKm"]
            assert pixel["scan"] > 0 and pixel["track"] > 0

    def test_the_geometry_has_no_third_coordinate(self, client: TestClient, nasa: Nasa):
        # Same rule as earthquakes: RFC 7946's third slot is height above the ellipsoid, and
        # nothing here is a height.
        assert all(len(f["geometry"]["coordinates"]) == 2 for f in get(client)["features"])

    def test_the_numbers_say_what_they_are(self, client: TestClient, nasa: Nasa):
        # By place, not by "the hottest": two adjacent pixels of the same cluster report the same
        # 4.34 MW, so the power does not name a detection.
        summit = next(
            f
            for f in get(client)["features"]
            if [round(c, 5) for c in f["geometry"]["coordinates"]] == [14.99632, 37.75405]
        )
        properties = summit["properties"]
        assert properties["frpMegawatts"] == 4.34
        assert properties["brightnessKelvin"] == 330.03
        assert properties["backgroundKelvin"] == 281.87
        # A word, never a number — the scale is ordinal (domain/thermal.py).
        assert properties["confidence"] == "nominal"
        assert properties["night"] is True

    def test_every_feature_says_where_it_came_from(self, client: TestClient, nasa: Nasa):
        for feature in get(client)["features"]:
            assert feature["properties"]["source"] == "nasa_firms"
            # Measured by an instrument, processed by the agency that owns it (ADR-0005).
            assert feature["properties"]["provenance"] == "OBSERVED"
            assert feature["properties"]["retrievedAt"]

    def test_it_attributes_nasa(self, client: TestClient, nasa: Nasa):
        # FIRMS asks to be acknowledged. Attribution travels with the data rather than living in
        # a footer somebody may forget (domain-model point 13).
        assert get(client)["attribution"] == [
            {
                "source": "nasa_firms",
                "name": "NASA Fire Information for Resource Management System",
                "licence": "nasa-eosdis-open",
            }
        ]


class TestWhenItAsksNasa:
    def test_it_asks_when_it_holds_nothing(self, client: TestClient, nasa: Nasa):
        assert get(client)["noma"]["fetched"] is True
        assert nasa.asked == 1

    def test_it_does_not_ask_again_straight_away(
        self, client_that_just_asked: TestClient, nasa: Nasa
    ):
        # Including when it found nothing. A quiet volcano and a broken feed look the same from
        # here, and asking again a minute later distinguishes neither.
        body = get(client_that_just_asked)
        assert body["noma"]["fetched"] is False
        assert body["noma"]["held"] == 0
        assert nasa.asked == 0

    def test_it_does_not_ask_about_somewhere_it_has_no_feed(self, client: TestClient, nasa: Nasa):
        # The Kilauea lesson (migration 28e4a8fd1690): an empty collection over a volcano is a
        # statement, and this one must not be mistaken for "nothing is happening".
        body = get(client, bbox=KILAUEA)
        assert body["features"] == []
        assert body["noma"]["live"] is None
        assert nasa.asked == 0

    def test_it_says_what_the_live_feed_covers(self, client: TestClient, nasa: Nasa):
        live = get(client)["noma"]["live"]
        assert live is not None
        assert live["source"] == "nasa_firms"
        # The free feed carries 24 hours and no more. Anything older is only there because Noma
        # was running.
        assert live["windowHours"] == 24
        assert live["lastAsked"]


class TestWhatItRefuses:
    def test_a_bbox_that_is_not_four_numbers(self, client: TestClient, nasa: Nasa):
        assert client.get("/thermal", params={"bbox": "etna"}).status_code == 422

    def test_a_bbox_bigger_than_a_view(self, client: TestClient, nasa: Nasa):
        assert client.get("/thermal", params={"bbox": "-30,20,40,70"}).status_code == 422

    def test_a_time_without_a_zone(self, client: TestClient, nasa: Nasa):
        response = client.get(
            "/thermal", params={"bbox": ETNA, "start": "2026-09-24T00:00:00", "end": "now"}
        )
        assert response.status_code == 422

    def test_a_window_that_ends_before_it_starts(self, client: TestClient, nasa: Nasa):
        response = client.get(
            "/thermal",
            params={"bbox": ETNA, "start": WINDOW["end"], "end": WINDOW["start"]},
        )
        assert response.status_code == 422
