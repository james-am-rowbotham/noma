"""earthquake tables

One table per record in the QuakeML family (domain-model point 2, ADR-0002), plus the sources they
came from and the untouched documents they arrived in.

EVERY FIELD IS A COLUMN. No JSON blob for "the rest": a scientific field that is only carried and
never queried today is still a field somebody will want to filter on, and an empty column costs
nothing. Columns also keep the database readable on its own — pygeoapi and anything else that
reads PostGIS directly (ADR-0004) sees real fields, not documents it must unpack.

UNITS ARE IN THE COLUMN NAMES. Python's Metres type does not survive into the database
(ADR-0003), so `depth_m` says it here instead.

Revision ID: 0c22d9a0da2f
Revises: 41259de1fb55
Create Date: 2026-09-22 17:56
"""

from collections.abc import Sequence

from alembic import op

revision: str = "0c22d9a0da2f"
down_revision: str | Sequence[str] | None = "41259de1fb55"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

# The six provenance classes (ADR-0005), enforced by the database as well as by the types. A CHECK
# rather than an enum type: changing the list later is an ordinary migration, not an ALTER TYPE.
PROVENANCE = "'OBSERVED', 'CALCULATED', 'MODELLED', 'SIMULATED', 'INFERRED', 'FORECAST'"

# Columns every scientific record carries (ADR-0002's envelope).
ENVELOPE = f"""
    provenance      text NOT NULL CHECK (provenance IN ({PROVENANCE})),
    source_id       text NOT NULL REFERENCES source(id),
    retrieved_at    timestamptz NOT NULL,
    raw_document_id uuid NOT NULL REFERENCES raw_document(id) ON DELETE RESTRICT,
"""


def quantity(name: str, unit: str = "", required: bool = False) -> str:
    """A QuakeML quantity: the value, and every way the producer can say how sure they are.

    `required` mirrors the QuakeML SPEC DOCUMENT, not its schema file (ADR-0002) — so the database
    refuses an origin with no latitude, exactly as the Python types do."""
    u = f"_{unit}" if unit else ""
    null = " NOT NULL" if required else ""
    return f"""
    {name}{u}                      double precision{null},
    {name}_uncertainty{u}          double precision,
    {name}_lower_uncertainty{u}    double precision,
    {name}_upper_uncertainty{u}    double precision,
    {name}_confidence_level        double precision,
"""


def upgrade() -> None:
    op.execute("""
        CREATE TABLE source (
            id       text PRIMARY KEY,           -- 'ingv', 'usgs'
            name     text NOT NULL,
            ror_id   text,                       -- permanent id for an organisation; a person
                                                 -- would carry an ORCID instead (CLAUDE.md)
            licence  text NOT NULL               -- decides what Noma may re-serve (point 13)
        )
    """)

    # Point 8: the original document is kept untouched, so nothing Noma did not model is lost and
    # the record can be re-served exactly. QuakeML documents are small, so they live here; large
    # artefacts (GeoTIFF, NetCDF) will go to object storage instead, keyed the same way.
    op.execute("""
        CREATE TABLE raw_document (
            id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            source_id    text NOT NULL REFERENCES source(id),
            retrieved_at timestamptz NOT NULL,
            media_type   text NOT NULL,          -- 'application/xml'
            sha256       bytea NOT NULL,         -- the same document is stored once
            content      bytea NOT NULL,
            UNIQUE (source_id, sha256)
        )
    """)

    # An Event is an identity, not a measurement: no magnitude, no location (point 2).
    op.execute(f"""
        CREATE TABLE quake_event (
            id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            {ENVELOPE}
            public_id text NOT NULL,
            type      text,
            type_certainty text,
            description    text,
            -- Which account this agency stands behind. QuakeML public ids, not Noma's — resolved
            -- when read, because an event can name an origin that has not been ingested.
            preferred_origin_public_id    text,
            preferred_magnitude_public_id text,
            agency_id text,
            -- Point 10: an agency's event stays that agency's event; two agencies' records of one
            -- earthquake are two rows, never merged.
            UNIQUE (source_id, public_id)
        )
    """)

    op.execute(f"""
        CREATE TABLE quake_origin (
            id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            event_id uuid NOT NULL REFERENCES quake_event(id) ON DELETE CASCADE,
            {ENVELOPE}
            public_id text NOT NULL,

            -- Required by the QuakeML spec document, though not by its schema file (ADR-0002).
            time_value                  timestamptz NOT NULL,
            time_uncertainty_s          double precision,
            time_lower_uncertainty_s    double precision,
            time_upper_uncertainty_s    double precision,
            time_confidence_level       double precision,
            {quantity("latitude", required=True)}
            {quantity("longitude", required=True)}
            {quantity("depth", "m")}

            -- Generated from latitude and longitude, so it cannot disagree with them. GEOGRAPHY,
            -- not geometry: distances then come back in METRES. Asked of geometry, "within 30 km"
            -- would mean 30 degrees — a circle some 3,300 km across (ADR-0004).
            point geography(Point, 4326)
                GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography)
                STORED,

            depth_type        text,
            evaluation_mode   text,
            evaluation_status text,
            agency_id         text,
            creation_time     timestamptz,      -- when the AGENCY produced this account

            -- The origin's own uncertainty block, separate from the per-quantity ones above.
            horizontal_uncertainty_m              double precision,
            min_horizontal_uncertainty_m          double precision,
            max_horizontal_uncertainty_m          double precision,
            azimuth_max_horizontal_uncertainty_deg double precision,
            preferred_description                 text,
            uncertainty_confidence_level          double precision,

            -- Quality. Nothing draws these; they are how a seismologist decides whether to trust
            -- the location at all, and a field dropped here cannot be re-served (point 8).
            associated_phase_count    integer,
            used_phase_count          integer,
            associated_station_count  integer,
            used_station_count        integer,
            depth_phase_count         integer,
            standard_error_s          double precision,
            azimuthal_gap_deg         double precision,
            secondary_azimuthal_gap_deg double precision,
            maximum_distance_deg      double precision,
            minimum_distance_deg      double precision,
            median_distance_deg       double precision,

            UNIQUE (source_id, public_id)
        )
    """)

    op.execute(f"""
        CREATE TABLE quake_magnitude (
            id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            event_id uuid NOT NULL REFERENCES quake_event(id) ON DELETE CASCADE,
            {ENVELOPE}
            public_id text NOT NULL,
            origin_public_id text,              -- which location this size was computed from

            mag                     double precision NOT NULL,
            mag_uncertainty         double precision,
            mag_lower_uncertainty   double precision,
            mag_upper_uncertainty   double precision,
            mag_confidence_level    double precision,
            -- "ML", "Mw", "Md"... free text in QuakeML, and the case varies between agencies.
            -- Magnitudes of different types are NOT directly comparable: filtering across types
            -- is a decision Noma has not yet made, so nothing here implies they are one scale.
            type              text,
            station_count     integer,
            azimuthal_gap_deg double precision,
            evaluation_mode   text,
            evaluation_status text,
            agency_id         text,
            creation_time     timestamptz,
            UNIQUE (source_id, public_id)
        )
    """)

    # The three questions the first slice asks: where, when, how big.
    op.execute("CREATE INDEX quake_origin_point ON quake_origin USING GIST (point)")
    op.execute("CREATE INDEX quake_origin_time ON quake_origin (time_value DESC)")
    op.execute("CREATE INDEX quake_magnitude_mag ON quake_magnitude (type, mag)")
    op.execute("CREATE INDEX quake_origin_event ON quake_origin (event_id)")
    op.execute("CREATE INDEX quake_magnitude_event ON quake_magnitude (event_id)")


def downgrade() -> None:
    for table in ("quake_magnitude", "quake_origin", "quake_event", "raw_document", "source"):
        op.execute(f"DROP TABLE IF EXISTS {table}")
