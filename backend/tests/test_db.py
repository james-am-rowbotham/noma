"""The database: what it is, that the migrations are reversible, and two PostGIS traps. ADR-0004."""

import pytest
from alembic import command
from sqlalchemy import Engine, text

from tests.conftest import alembic_config, url_of_test_database

pytestmark = pytest.mark.db

# The Etna earthquake of 2026-08-15, from the real INGV record — not invented coordinates.
ETNA_QUAKE_LON, ETNA_QUAKE_LAT = 15.07, 37.832


def test_postgis_is_on(db: Engine):
    with db.connect() as c:
        version = c.execute(text("SELECT postgis_lib_version()")).scalar_one()
    assert version.startswith("3.6."), version


def test_the_migrations_run_down_and_back_up(db: Engine):
    # Every migration must be reversible, or a bad deploy cannot be rolled back.
    cfg = alembic_config(url_of_test_database())
    command.downgrade(cfg, "base")
    command.upgrade(cfg, "head")

    # Going down to base DROPS the PostGIS extension, and recreating it gives its types new
    # internal ids. Connections already pooled still hold the old ones, and any spatial query on
    # them then fails with "no spatial operator found for st_dwithin". Throwing the pool away
    # forces fresh connections. Found because this poisoned tests in OTHER files that ran later —
    # they passed on their own, which is exactly how an order-dependent failure hides.
    db.dispose()


def test_postgis_takes_longitude_first(db: Engine):
    # ST_MakePoint(x, y) — and x is LONGITUDE. Written latitude-first, this earthquake lands on
    # land in the Horn of Africa, 3,374 km away (measured with PostGIS, 2026-09-19).
    # Domain-model point 9: longitude, latitude, everywhere inside Noma.
    with db.connect() as c:
        x, y = c.execute(
            text("SELECT ST_X(p), ST_Y(p) FROM (SELECT ST_MakePoint(:lon, :lat) AS p) s"),
            {"lon": ETNA_QUAKE_LON, "lat": ETNA_QUAKE_LAT},
        ).one()
    assert (x, y) == (ETNA_QUAKE_LON, ETNA_QUAKE_LAT)


def test_distance_is_in_metres_only_as_geography(db: Engine):
    # "Earthquakes within 30 km of Etna" is agreed point 1 — a spatial query, asked each time.
    # Asked of a GEOMETRY column, PostGIS answers in DEGREES, so "30" would mean a circle roughly
    # 3,300 km across. Asked of GEOGRAPHY, it answers in METRES. One degree north of the Etna
    # earthquake, the two answers:
    with db.connect() as c:
        as_geometry, as_geography = c.execute(
            text("""
                SELECT ST_Distance(a, b), ST_Distance(a::geography, b::geography)
                FROM (SELECT ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)     AS a,
                             ST_SetSRID(ST_MakePoint(:lon, :lat + 1), 4326) AS b) s
            """),
            {"lon": ETNA_QUAKE_LON, "lat": ETNA_QUAKE_LAT},
        ).one()
    assert as_geometry == pytest.approx(1.0)  # degrees
    assert as_geography == pytest.approx(111_000, rel=0.01)  # metres: one degree of latitude
