"""a source says where it answers for

Noma asked INGV about everywhere, including Hawaii. INGV answers HTTP 204 for Hawaii — it runs
Italy's network — and Noma read that as "asked, and the catalogue is genuinely empty", recorded it,
and never asked again. The result was a confident empty map over Kilauea with no error, which is
worse than a crash: a crash says something is wrong.

So a source now declares the area it answers for, and the service to ask. "Earthquakes here" asks
every source whose region covers the view.

The regions are OPERATIONAL, not scientific: they say where Noma asks this agency, not where the
agency's instruments can detect something. That is why they are a box and not a claim.

Where two regions overlap, both are asked and both answers are kept — domain-model point 10, an
agency's event stays that agency's event. Measured the day this was written, for the same box and
window around Etna: INGV returned 58 events and USGS returned 1, and that one was the same
earthquake INGV recorded as M3.9 at 10:24:08.910 "7 km W Linguaglossa", which USGS recorded as M3.6
at 10:24:10.174 "1 km NE of Sant'Alfio". Two accounts, not a contradiction.

Revision ID: 28e4a8fd1690
Revises: 5a8cd4323335
Create Date: 2026-09-24 14:49
"""

from collections.abc import Sequence

from alembic import op

revision: str = "28e4a8fd1690"
down_revision: str | Sequence[str] | None = "5a8cd4323335"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

WORLD = "POLYGON((-180 -90,180 -90,180 90,-180 90,-180 -90))"
# Italy and its surrounding seas. A box, because it is an operational choice about where Noma asks
# INGV — not a statement about the reach of their network.
ITALY = "POLYGON((5 35,20 35,20 48,5 48,5 35))"


def upgrade() -> None:
    op.execute("""
        ALTER TABLE source
            ADD COLUMN event_service_url text,
            -- GEOMETRY, not geography: this is asked for CONTAINMENT, never distance. ST_Covers on
            -- a geography polygon returns false even against itself (see event_fetch).
            ADD COLUMN region geometry(Polygon, 4326)
    """)
    op.execute("CREATE INDEX source_region ON source USING GIST (region)")

    # Seeded here so a fresh database can answer for somewhere without anyone running a script.
    # Licences are the ones each agency states; they decide what Noma may re-serve (point 13).
    op.execute(f"""
        INSERT INTO source (id, name, ror_id, licence, event_service_url, region) VALUES
        ('ingv',
         'Istituto Nazionale di Geofisica e Vulcanologia',
         'https://ror.org/00qps9a02',
         'CC-BY-4.0',
         'https://webservices.ingv.it/fdsnws/event/1/query',
         ST_GeomFromText('{ITALY}', 4326)),
        ('usgs',
         'United States Geological Survey',
         'https://ror.org/035a68863',
         'public-domain-usgs',
         'https://earthquake.usgs.gov/fdsnws/event/1/query',
         ST_GeomFromText('{WORLD}', 4326))
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            ror_id = EXCLUDED.ror_id,
            licence = EXCLUDED.licence,
            event_service_url = EXCLUDED.event_service_url,
            region = EXCLUDED.region
    """)


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS source_region")
    op.execute("ALTER TABLE source DROP COLUMN event_service_url, DROP COLUMN region")
