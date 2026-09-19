# Noma's local database: the OFFICIAL PostgreSQL image, plus PostGIS from PostgreSQL's own apt
# repository (apt.postgresql.org), which that image already has configured. See ADR-0004.
#
# Not postgis/postgis: it publishes no Apple Silicon build, and the multi-architecture alternative
# describes itself as a test repository. This keeps every layer official and runs natively.
#
# The PostGIS extension itself is created by a database migration, not by this image — so what the
# database contains is recorded in the migrations, where it can be read and tested.

FROM postgres:18.6

RUN apt-get update \
 && apt-get install -y --no-install-recommends postgresql-18-postgis-3 \
 && rm -rf /var/lib/apt/lists/*
