import os
import time
from collections.abc import Iterator
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import URL, Engine, create_engine, make_url, text
from sqlalchemy.exc import OperationalError

from noma.settings import settings

# Run every test as if in Amsterdam. On a UTC machine — a typical CI runner — treating a time as
# local gives the right answer by accident, so the timezone trap in ADR-0002 and ADR-0003 would go
# untested. This is set before anything reads the clock.
os.environ["TZ"] = "Europe/Amsterdam"
time.tzset()

REPO = Path(__file__).parents[2]
BACKEND = REPO / "backend"
ETNA = REPO / "docs/research/example-quakeml-ingv-etna-2026-08-15.xml"
QUAKEML_XSD = REPO / "schemas/quakeml/1.2/QuakeML-BED-1.2.xsd"


# ── the database ─────────────────────────────────────────────────────────────
# Tests marked `db` get their OWN database, `noma_test`, rebuilt from the migrations every run — so
# they never touch development data, and the migrations themselves are exercised each time.

TEST_DATABASE = "noma_test"


def url_of_test_database() -> URL:
    return make_url(settings().database_url).set(database=TEST_DATABASE)


def alembic_config(url: URL) -> Config:
    cfg = Config(str(BACKEND / "alembic.ini"))
    # render_as_string(hide_password=False): str(url) would write the password as "***".
    cfg.set_main_option("sqlalchemy.url", url.render_as_string(hide_password=False))
    return cfg


@pytest.fixture(scope="session")
def db() -> Iterator[Engine]:
    server = create_engine(settings().database_url, isolation_level="AUTOCOMMIT")
    try:
        with server.connect() as c:
            c.execute(text(f"DROP DATABASE IF EXISTS {TEST_DATABASE} WITH (FORCE)"))
            c.execute(text(f"CREATE DATABASE {TEST_DATABASE}"))
    except OperationalError as e:
        pytest.fail(f"no database to test against — run `docker compose up -d` first.\n{e}")
    finally:
        server.dispose()

    url = url_of_test_database()
    command.upgrade(alembic_config(url), "head")
    engine = create_engine(url)
    yield engine
    engine.dispose()
