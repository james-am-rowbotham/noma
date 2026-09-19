---
id: 0004
title: PostgreSQL with PostGIS, built from official images; SQLAlchemy Core and Alembic from Python
type: architecture
status: accepted
date: 2026-09-19
pinned-by: backend/tests/test_db.py
---

# ADR-0004: PostgreSQL with PostGIS, built from official images; SQLAlchemy Core and Alembic from Python

## Context

Noma needs a database before it can serve its first real data: the API deliberately serves nothing
yet, because serving the stored test record would present a file as a live observation.

`CLAUDE.md` already names PostgreSQL with PostGIS for spatial data and structured observations, and
the standards research gave a second reason: pygeoapi, a certified OGC API – Features server, serves
directly from existing PostGIS tables and views with no copying (`docs/research/standard-servers.md`).
The backend is Python (ADR-0003), so the questions left were which image to run locally, how Python
talks to the database, and how its structure is changed over time.

Locally it runs in Docker Compose. Production will be provisioned with Terraform on a managed
PostgreSQL service; that is not written yet.

## Decision

**PostgreSQL 18 with PostGIS 3.6.** The local image is Docker's **official** `postgres:18.6`, with
PostGIS installed from PostgreSQL's own apt repository (`apt.postgresql.org`), which that image
already has configured. See `docker/db/Dockerfile`.

**The PostGIS extension is created by a migration, not by the image.** Everything the database
contains is then written down in the migrations, where it can be read, reviewed and tested — not in
setup hidden inside an image.

**From Python: SQLAlchemy 2 in its Core style, the psycopg 3 driver, and Alembic for migrations.**
Core means queries written against tables, not an object-relational mapper. Migrations are written by
hand, in SQL where that reads more clearly — PostGIS is easier to read as SQL than through any
wrapper.

**The domain models stay Pydantic and know nothing about the database.** Converting a record to and
from its table happens in one place per record type.

**Synchronous for now.** ObsPy and Alembic are both synchronous, and the load is small. psycopg 3
supports asynchronous use with the same driver, so this is not a one-way door.

**Tests get their own database**, `noma_test`, dropped and rebuilt from the migrations on every run.
They never touch development data, and the migrations are exercised every time. **Every migration
must be reversible**, and a test runs them down to nothing and back up.

The local database listens on port **5433**, because 5432 is already taken on the development
machine; `NOMA_DB_PORT` overrides it.

## Alternatives considered

**The `postgis/postgis` image.** The obvious choice and the official PostGIS image. Rejected because
it publishes no build for Apple Silicon (see Evidence), which is what Noma is developed on.

**The same image under emulation** (`platform: linux/amd64`). Keeps the official image and matches a
likely Intel production host. Rejected because an emulated database is markedly slower and can hide
problems specific to the architecture it actually runs on.

**`imresamu/postgis`**, a multi-architecture build with millions of downloads. Rejected because it
describes itself, on Docker Hub, as a "test repo for postgis/postgis images". A test repository is
not something a database should depend on.

**SQLModel**, from FastAPI's author, which makes one class both a Pydantic model and a database table.
Rejected because Noma's domain models and its tables want different shapes: the domain nests the
provenance envelope (ADR-0002) and serialises under QuakeML's names, while a table wants flat,
indexable columns. Fusing them would couple the domain to storage — the thing `CLAUDE.md` asks to
keep apart.

**SQLAlchemy's ORM.** Heavier, and Noma's queries are mostly spatial and aggregate — clearer in Core.
It can be adopted later over the same driver and migrations if a use appears.

**Plain psycopg with hand-run SQL files.** The simplest option, with full control. Rejected for the
lack of a canonical migration runner: Alembic records which migrations have run, reverses them, and
can print a migration as SQL (`alembic upgrade head --sql`) for review before it touches a real
database.

**Asynchronous SQLAlchemy or asyncpg.** FastAPI supports async well. Rejected for now as complexity
without a need; see "synchronous for now" above.

## Evidence

Architectures each image publishes, from `docker manifest inspect`, 2026-09-19:

```
postgis/postgis:18-3.6     ['amd64']
postgres:18                ['386', 'amd64', 'arm', 'arm64', 'ppc64le', 'riscv64', 's390x']
imresamu/postgis:18-3.6    ['amd64', 'arm64']
```

Pulling the official PostGIS image on the development machine:

```
Error response from daemon: no matching manifest for linux/arm64/v8 in the manifest list entries
```

`imresamu/postgis` on Docker Hub: `pulls 3895218 | updated 2026-09-14 | test repo for
postgis/postgis images`.

The image built from official sources, running:

```
PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on aarch64-unknown-linux-gnu,
postgis available: 3.6.4
PGDATA=/var/lib/postgresql/18/docker
arch=aarch64
```

`PGDATA` confirms PostgreSQL 18's image moved its data under `/var/lib/postgresql/18/`, so the volume
mounts `/var/lib/postgresql`. The `/var/lib/postgresql/data` path in older guides no longer applies.

**Two PostGIS traps, measured and pinned in `test_db.py`**, using the real Etna earthquake's
coordinates (15.07 E, 37.832 N):

- *Distance units depend on the column type.* One degree of latitude north of the earthquake is
  `1.0` measured as geometry — **degrees** — and ≈ 111,000 measured as geography — **metres**. A
  "within 30 km of Etna" query (domain-model point 1) asked of geometry would search a radius of 30
  degrees.
- *Coordinate order.* `ST_MakePoint` takes longitude first. Swapped, the earthquake lands in the Horn
  of Africa: `3374 km apart|swapped point is at 37.832E, 15.07N`.

Replacing the first migration's `downgrade()` with an error, on purpose, fails
`test_the_migrations_run_down_and_back_up` with `NotImplementedError`.

## Consequences

`docker compose up -d` must be running before the backend tests; a test that needs it fails with
that instruction rather than skipping silently. The database image is built locally, so the first
start takes about a minute.

**Local and production must run the same versions.** When the Terraform lands, pin the local image to
whatever PostgreSQL and PostGIS versions the managed service offers, and record that choice. The
PostGIS minor version here follows the apt repository (3.6.4 today); `test_postgis_is_on` pins 3.6
so drift is noticed.

**Not decided here:** where Noma keeps the untouched original of each document it ingests
(domain-model point 8) — a table, or object storage; and the earthquake tables themselves, which
wait on which provenance classes exist.

## References

- PostgreSQL Docker official image — https://hub.docker.com/_/postgres
- PostgreSQL apt repository — https://wiki.postgresql.org/wiki/Apt
- PostGIS — https://postgis.net/
- SQLAlchemy 2 — https://docs.sqlalchemy.org/en/20/
- Alembic — https://alembic.sqlalchemy.org/
- psycopg 3 — https://www.psycopg.org/psycopg3/
