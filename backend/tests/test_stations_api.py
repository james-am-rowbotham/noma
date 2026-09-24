"""The stations endpoints. What they mostly guard is a sentence: `held` is what Noma HAS, and
these endpoints never imply it is what exists.

The fixture is the real ESLN series from Etna's southern flank (see test_gnss.py), which is why
the numbers below are metres of ground movement and not round numbers.
"""

from collections.abc import Iterator
from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine, text

from noma.adapters.gnss_pos import parse_pos
from noma.api.app import app
from noma.api.earthquakes import connection
from noma.store.series import save_series
from tests.conftest import ESLN
from tests.test_gnss import ENVELOPE

pytestmark = pytest.mark.db

RAW = ESLN.read_bytes()
#: Etna. ESLN sits on the southern flank, about 6 km from the craters — the closest open station.
BBOX = "14.80,37.60,15.25,37.95"
#: The fixture runs from 2005 to 2026, and the default window is only a year.
WINDOW = {"start": "2005-01-01T00:00:00Z", "end": "2026-09-24T00:00:00Z"}


@pytest.fixture
def client(db: Engine) -> Iterator[TestClient]:
    def rollback_after_each_request() -> Iterator[Any]:
        with db.connect() as conn:
            transaction = conn.begin()
            document = conn.execute(
                text("""
                    INSERT INTO raw_document (source_id, retrieved_at, media_type, sha256, content)
                    VALUES ('ingv', now(), 'text/plain', sha256(:c), :c) RETURNING id
                """),
                {"c": RAW},
            ).scalar_one()
            save_series(conn, parse_pos(RAW, ENVELOPE.model_copy(update={"raw": str(document)})))
            yield conn
            transaction.rollback()

    app.dependency_overrides[connection] = rollback_after_each_request
    yield TestClient(app)
    app.dependency_overrides.clear()


def get(client: TestClient, path: str, **params: str) -> dict[str, Any]:
    response = client.get(path, params=params)
    assert response.status_code == 200, response.text
    return response.json()


class TestTheStationsInView:
    def test_geojson_with_the_station_in_it(self, client: TestClient):
        body = get(client, "/stations", bbox=BBOX)
        assert [f["id"] for f in body["features"]] == ["ESLN"]
        assert body["features"][0]["properties"]["name"]

    def test_it_says_that_it_only_knows_what_it_holds(self, client: TestClient):
        # There is no question an agency answers with "which GNSS stations are near here?" — the
        # network publishes one file per station. So this count is about Noma, not about Etna,
        # and the response has to say so rather than leave it to be assumed.
        assert get(client, "/stations", bbox=BBOX)["noma"] == {"held": 1, "fetchesOnDemand": False}

    def test_the_geometry_has_no_third_coordinate(self, client: TestClient):
        # GeoJSON's third slot is height above the ellipsoid. Elevation is a property here for
        # the same reason earthquake depth is: so nothing silently means its opposite.
        feature = get(client, "/stations", bbox=BBOX)["features"][0]
        assert len(feature["geometry"]["coordinates"]) == 2
        assert 1700 < feature["properties"]["elevationMetres"] < 1800

    def test_each_station_says_what_it_measures_and_in_what_units(self, client: TestClient):
        measures = get(client, "/stations", bbox=BBOX)["features"][0]["properties"]["measures"]
        assert {m["observedProperty"] for m in measures} == {
            "displacement_north",
            "displacement_east",
            "displacement_up",
        }
        assert {m["unit"] for m in measures} == {"m"}  # UCUM
        # Without these two, a number of metres is not a measurement of anything.
        assert all(m["procedure"] and m["referenceFrame"] for m in measures)

    def test_a_box_somewhere_else_is_empty_rather_than_wrong(self, client: TestClient):
        assert get(client, "/stations", bbox="-155.40,19.25,-155.15,19.50")["features"] == []


class TestOneStationOverTime:
    def test_the_readings_come_back_in_order_with_their_uncertainty(self, client: TestClient):
        body = get(client, "/stations/ESLN/series", property="displacement_east", **WINDOW)
        readings = body["observations"]
        assert [r["time"] for r in readings] == sorted(r["time"] for r in readings)
        # Every GNSS reading carries its own uncertainty, unlike most earthquake depths.
        assert all(r["uncertainty"] is not None for r in readings)
        assert body["noma"]["held"] == len(readings)

    def test_it_measures_real_movement(self, client: TestClient):
        readings = get(client, "/stations/ESLN/series", property="displacement_east", **WINDOW)[
            "observations"
        ]
        # Metres of eastward motion over twenty years. Most of it is the plate carrying Sicily,
        # not Etna deforming — a caveat for whatever draws this, not for the number.
        assert round(readings[-1]["value"], 5) == 0.37985

    def test_it_attributes_ingv(self, client: TestClient):
        # CC BY 4.0: attribution is a licence condition, not a courtesy.
        body = get(client, "/stations/ESLN/series", property="displacement_east", **WINDOW)
        assert body["attribution"] == [
            {
                "source": "ingv",
                "name": "Istituto Nazionale di Geofisica e Vulcanologia",
                "licence": "CC-BY-4.0",
            }
        ]


class TestWhatItRefuses:
    def test_a_station_it_does_not_hold(self, client: TestClient):
        response = client.get("/stations/NOWHERE/series", params={"property": "displacement_east"})
        assert response.status_code == 404
        assert "holds no station" in response.json()["detail"]

    def test_a_property_the_station_does_not_measure(self, client: TestClient):
        # The error names what it DOES measure, because the alternative is guessing.
        response = client.get("/stations/ESLN/series", params={"property": "temperature"})
        assert response.status_code == 404
        assert "displacement_east" in response.json()["detail"]

    def test_a_bbox_that_is_not_four_numbers(self, client: TestClient):
        assert client.get("/stations", params={"bbox": "etna"}).status_code == 422

    def test_a_bbox_bigger_than_a_view(self, client: TestClient):
        assert client.get("/stations", params={"bbox": "-30,20,40,70"}).status_code == 422

    def test_a_time_without_a_zone(self, client: TestClient):
        response = client.get(
            "/stations/ESLN/series",
            params={"property": "displacement_east", "start": "2005-01-01T00:00:00"},
        )
        assert response.status_code == 422
