"""GNSS position series — family 2, things measured continuously.

The fixture is real: six epochs cut from INGV's ESLN series on Etna's southern flank, keeping the
file's own header. The full series is 6,401 daily epochs from 2005 to 2026, CC BY 4.0
(DOI 10.13127/gnss/gipos).

This data is better documented than the earthquake catalogues in one way that matters: EVERY
reading carries its own standard deviation, where fewer than half of INGV's origins state a depth
uncertainty.
"""

from collections.abc import Iterator
from datetime import UTC, datetime

import pytest
from sqlalchemy import Connection, Engine, text

from noma.adapters.gnss_pos import ParsedSeries, PosFileError, parse_pos
from noma.domain.quake import Envelope, SourceId
from noma.store.series import datastreams_of, observations_of, save_series, stations_within
from tests.conftest import ESLN

RAW = ESLN.read_bytes()
ENVELOPE = Envelope(
    provenance="OBSERVED",  # an agency processing its own instruments (ADR-0005)
    source_id=SourceId("ingv"),
    # Safely in the past: reads default to "as Noma held it NOW", so a retrieval time later than
    # the clock would filter every reading out — and would do so only at certain times of day.
    retrieved_at=datetime(2026, 9, 20, 12, 0, tzinfo=UTC),
    raw="",
)


def parse(document: bytes = RAW, envelope: Envelope = ENVELOPE) -> ParsedSeries:
    return parse_pos(document, envelope)


class TestReadingTheFile:
    def test_it_finds_the_station_and_where_it_is(self):
        station = parse().station
        assert station.public_id == "ESLN"
        assert (round(station.latitude, 4), round(station.longitude, 4)) == (37.6934, 14.9743)
        assert station.elevation_m is not None
        # Height above the ellipsoid, positive UP — the opposite convention to earthquake depth.
        assert 1700 < station.elevation_m < 1800

    def test_one_datastream_per_component_each_with_its_unit(self):
        streams = parse().datastreams
        assert [d.observed_property for d in streams] == [
            "displacement_north",
            "displacement_east",
            "displacement_up",
        ]
        assert {d.unit for d in streams} == {"m"}  # UCUM

    def test_a_displacement_carries_the_frame_it_is_measured_against(self):
        # Without it, "moved 38 cm east" measures nothing: east relative to what?
        assert parse().datastreams[0].reference_frame == "IGS20/WGS84"

    def test_it_records_how_the_numbers_were_produced(self):
        # The observation standard's `procedure`. For a processed product it is the only honest
        # answer to "how do you know?".
        assert parse().datastreams[0].procedure == "INGV ONT GipsyX-2.3 Analysis Center"

    def test_every_reading_carries_its_own_uncertainty(self):
        # The thing that makes this better documented than the earthquake catalogues.
        observations = parse().observations
        assert observations, "no readings"
        assert all(o.uncertainty is not None for o in observations)

    def test_vertical_is_the_least_certain_component(self):
        # Same shape as earthquake depth being worst-constrained, and for related reasons.
        by = {
            d: [o for o in parse().observations if o.datastream_public_id.endswith(d)]
            for d in ("north", "east", "up")
        }
        mean = {k: sum(o.uncertainty or 0 for o in v) / len(v) for k, v in by.items()}
        assert mean["up"] > mean["north"] and mean["up"] > mean["east"]

    def test_times_are_utc(self):
        # The rows carry no timezone; read as local time they would drift by the machine's offset.
        first = min(o.phenomenon_time for o in parse().observations)
        assert first == datetime(2005, 9, 14, 11, 55, tzinfo=UTC)

    def test_it_keeps_the_agencys_word_for_how_settled_a_reading_is(self):
        # "final" here; a "rapid" solution replaced later is the same idea as an earthquake origin
        # going from automatic to reviewed.
        assert {o.solution for o in parse().observations} == {"final"}

    def test_twenty_years_of_movement_survives(self):
        east = [o for o in parse().observations if o.datastream_public_id.endswith("east")]
        assert round(east[-1].result, 5) == 0.37985  # metres


class TestWhatItRefuses:
    def test_a_row_that_is_not_a_reading_is_refused_not_skipped(self):
        # A gap in a time series is invisible in a way a wrong number is not, so a corrupted row
        # must never be quietly dropped.
        with pytest.raises(PosFileError, match="comes after the data"):
            parse(RAW.replace(b" 20050916", b" CORRUPTED"))

    def test_a_value_that_is_not_a_number(self):
        with pytest.raises(PosFileError, match="not a number"):
            parse(RAW.replace(b"0.37985", b"..drift"))

    def test_a_file_with_no_readings(self):
        header = RAW.split(b"\n 2005")[0]
        with pytest.raises(PosFileError, match="no data rows"):
            parse(header)

    def test_a_station_with_no_position(self):
        with pytest.raises(PosFileError, match="no NEU reference position"):
            parse(RAW.replace(b"NEU Reference position", b"NEU Reference nowhere"))


@pytest.mark.db
class TestStoring:
    @pytest.fixture
    def conn(self, db: Engine) -> Iterator[Connection]:
        with db.connect() as connection:
            transaction = connection.begin()
            document = connection.execute(
                text("""
                    INSERT INTO raw_document (source_id, retrieved_at, media_type, sha256, content)
                    VALUES ('ingv', now(), 'text/plain', sha256(:c), :c) RETURNING id
                """),
                {"c": RAW},
            ).scalar_one()
            self.envelope = ENVELOPE.model_copy(update={"raw": str(document)})
            yield connection
            transaction.rollback()

    def test_a_series_survives_the_round_trip(self, conn: Connection):
        stored = parse(envelope=self.envelope)
        save_series(conn, stored)

        near = stations_within(conn, longitude=14.999, latitude=37.751, radius_m=10_000)
        assert [s.public_id for s in near] == ["ESLN"]

        streams = datastreams_of(conn, "ESLN")
        assert len(streams) == 3
        east = next(d for d in streams if d.observed_property == "displacement_east")
        assert east.reference_frame == "IGS20/WGS84"

        read_back = observations_of(conn, east.public_id)
        original = [o for o in stored.observations if o.datastream_public_id == east.public_id]
        assert [o.result for o in read_back] == [o.result for o in original]
        assert [o.uncertainty for o in read_back] == [o.uncertainty for o in original]

    def test_the_same_file_twice_writes_nothing_the_second_time(self, conn: Connection):
        parsed = parse(envelope=self.envelope)
        first = save_series(conn, parsed)
        again = save_series(conn, parsed)
        assert first["observations"] > 0
        assert again["observations"] == 0, "an unchanged re-fetch is not news"

    def test_a_revised_reading_lands_beside_the_one_before_it(self, conn: Connection):
        save_series(conn, parse(envelope=self.envelope))
        # The same epoch, reprocessed: a different value and a different solution.
        revised = RAW.replace(b"final", b"rapid").replace(b"0.37985", b"0.37999")
        later = self.envelope.model_copy(
            update={"retrieved_at": datetime(2026, 9, 21, 12, 0, tzinfo=UTC)}
        )
        save_series(conn, parse(revised, later))

        versions = conn.execute(
            text("SELECT count(*) FROM observation WHERE result IN (0.37985, 0.37999)")
        ).scalar_one()
        assert versions == 2, "the earlier reading must survive the revision"

        east = next(
            d for d in datastreams_of(conn, "ESLN") if d.observed_property == "displacement_east"
        )
        newest = observations_of(conn, east.public_id)[-1]
        assert newest.result == 0.37999 and newest.solution == "rapid"

        # ...and what Noma held before the revision is still answerable.
        before = observations_of(
            conn, east.public_id, as_of=datetime(2026, 9, 20, 18, 0, tzinfo=UTC)
        )
        assert before[-1].result == 0.37985
