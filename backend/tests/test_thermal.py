"""Satellite thermal detections — reading NASA's file, and storing what it says.

The fixture is real: the five VIIRS detections over Etna at 01:09 UTC on 2026-09-24 — 4.34 MW at
the summit and a line of smaller ones running east-southeast — kept beside two detections from
elsewhere in the same file, one in Finland and one in Ukraine. Those two are not padding. They are
what proves the box does anything, and one of them is a DAYTIME detection with a wider pixel, so
the footprint is not accidentally constant across the fixture.

This is an ACTIVE FIRE product. Nothing here calls these detections volcanic, and neither does
Noma: it stores heat measured at a place.
"""

from collections.abc import Iterator
from datetime import UTC, datetime, timedelta

import pytest
from pydantic import ValidationError
from sqlalchemy import Connection, Engine, text

from noma.adapters.firms import FirmsError, parse_firms
from noma.domain.quake import Envelope, SourceId
from noma.domain.thermal import ThermalDetection
from noma.store.thermal import detections_within, last_asked, save_detections
from tests.conftest import FIRMS

RAW = FIRMS.read_bytes()

#: Etna and its flanks — the box `noma.ingest.ETNA_BBOX` uses.
ETNA = (14.70, 37.55, 15.35, 38.00)
SUMMIT = (14.996, 37.754)
#: One particular summit pixel. Two of the five detections report the SAME 4.34 MW — adjacent
#: pixels of one hot cluster often do — so "the hottest one" does not name a detection. Where a
#: test needs to follow one across a revision, it follows it by where it is.
TOP = (37.75405, 14.99632)

ENVELOPE = Envelope(
    provenance="OBSERVED",  # NASA's own processing of NASA's own instrument (ADR-0005)
    source_id=SourceId("nasa_firms"),
    # An hour after the overpass, which is what near-real-time means, and safely in the past:
    # reads default to "as Noma held it NOW", so a retrieval time later than the clock would
    # filter everything out — and would do it only when run at certain times of day.
    retrieved_at=datetime(2026, 9, 24, 2, 0, tzinfo=UTC),
    raw="",
)


def parse(
    document: bytes = RAW,
    envelope: Envelope = ENVELOPE,
    bbox: tuple[float, float, float, float] | None = ETNA,
) -> list[ThermalDetection]:
    return parse_firms(document, envelope, bbox=bbox)


class TestReadingTheFile:
    def test_the_box_decides_which_rows_become_records(self):
        # Seven rows in the file, five of them over Etna. The Finnish and Ukrainian fires are real
        # detections and Noma has no use for them.
        assert len(parse()) == 5
        assert len(parse(bbox=None)) == 7

    def test_the_summit_is_where_the_heat_is(self):
        # 4.34 MW at the summit, and about a megawatt each along a line running east-southeast.
        by_power = sorted(parse(), key=lambda d: d.frp_mw or 0, reverse=True)
        assert [d.frp_mw for d in by_power] == [4.34, 4.34, 1.37, 1.03, 1.03]
        assert (round(by_power[0].latitude, 3), round(by_power[0].longitude, 3)) == (37.754, 14.996)

    def test_times_are_utc(self):
        # The file carries no timezone. Read as local time these would land at 03:09, because the
        # tests run in Amsterdam — see conftest.
        assert {d.observed_at for d in parse()} == {datetime(2026, 9, 24, 1, 9, tzinfo=UTC)}

    def test_an_hour_that_lost_its_leading_zero_still_reads_as_that_hour(self):
        # `acq_time` is HHMM, and `0109` comes back from a spreadsheet as `109`. Unpadded it would
        # parse as 10:09 — nine hours wrong, with nothing to show that anything went wrong.
        unpadded = RAW.replace(b",2026-09-24,0109,", b",2026-09-24,109,")
        assert {d.observed_at for d in parse(unpadded)} == {datetime(2026, 9, 24, 1, 9, tzinfo=UTC)}

    def test_every_detection_carries_the_pixel_it_was_measured_over(self):
        # A DETECTION IS A PIXEL. Without these a client can only draw a dot, which claims a
        # precision of metres for a measurement made over about 375 of them.
        assert all(d.scan_km > 0 and d.track_km > 0 for d in parse(bbox=None))

    def test_the_pixel_is_bigger_away_from_the_centre_of_the_swath(self):
        # Why the footprint travels per detection and is not a constant for the instrument.
        assert len({(d.scan_km, d.track_km) for d in parse(bbox=None)}) > 1

    def test_confidence_stays_the_agencys_word(self):
        # Ordinal, not measured. A number here would invite averaging it.
        assert {d.confidence for d in parse()} == {"nominal"}

    def test_it_keeps_whether_the_sun_was_up(self):
        # A night detection is the stronger one: sunlight cannot be mistaken for heat.
        assert {d.day_night for d in parse()} == {"N"}
        assert {d.day_night for d in parse(bbox=None)} == {"N", "D"}

    def test_it_keeps_both_brightness_temperatures(self):
        # In KELVIN, and the background is the half that makes the other half mean something:
        # 330 K stands out because what surrounds it is 282 K.
        top = _at(parse(), TOP)
        assert top.brightness_k == 330.03
        assert top.brightness_background_k == 281.87

    def test_it_keeps_the_product_version(self):
        # "NRT": near-real-time, and replaced by the processed product later. Without it, a
        # revision arriving tomorrow would be indistinguishable from a second fire.
        assert {d.product_version for d in parse()} == {"2.0NRT"}


class TestWhatItRefuses:
    def test_a_file_that_is_not_firms(self):
        with pytest.raises(FirmsError, match="missing latitude"):
            parse(b"time,place\n2026-09-24,Etna\n")

    def test_an_empty_file(self):
        with pytest.raises(FirmsError, match="no header row"):
            parse(b"")

    def test_a_detection_with_no_footprint(self):
        # Required, not optional: a detection whose pixel is unknown cannot be drawn honestly.
        with pytest.raises(FirmsError, match="scan is missing"):
            parse(RAW.replace(b"330.03,0.39,0.36", b"330.03,,0.36"))

    def test_a_value_that_is_not_a_number(self):
        with pytest.raises(FirmsError, match="frp is not a number"):
            parse(RAW.replace(b",4.34,", b",very hot,"))

    def test_a_detection_built_without_a_footprint_is_not_a_detection(self):
        # The model's rule, not only the parser's: the next thermal source — another satellite, a
        # researcher's own file — has to supply it too, or its detections could be drawn as dots.
        with pytest.raises(ValidationError):
            ThermalDetection(
                envelope=ENVELOPE,
                longitude=14.996,
                latitude=37.754,
                observed_at=datetime(2026, 9, 24, 1, 9, tzinfo=UTC),
            )  # pyright: ignore[reportCallIssue]

    def test_a_coordinate_that_is_not_on_earth(self):
        with pytest.raises(FirmsError, match="not on Earth"):
            parse(RAW.replace(b"37.75405,14.99632", b"137.75405,14.99632"), bbox=None)


@pytest.mark.db
class TestStoring:
    @pytest.fixture
    def conn(self, db: Engine) -> Iterator[Connection]:
        with db.connect() as connection:
            transaction = connection.begin()
            self.envelope = ENVELOPE.model_copy(update={"raw": str(_document(connection, RAW))})
            yield connection
            transaction.rollback()

    def test_the_detections_survive_the_round_trip(self, conn: Connection):
        assert save_detections(conn, parse(envelope=self.envelope)) == 5

        found = near_summit(conn, radius_m=15_000)
        assert len(found) == 5
        assert _at(found, TOP).frp_mw == 4.34
        assert {d.scan_km for d in found} == {0.39}
        assert {d.envelope.provenance for d in found} == {"OBSERVED"}

    def test_the_same_file_twice_stores_it_once(self, conn: Connection):
        save_detections(conn, parse(envelope=self.envelope))
        # NASA rewrites the file as granules are processed, so the same detections arrive again
        # and again. Noma fetching twice is not NASA changing its mind.
        later = self.envelope.model_copy(update={"retrieved_at": _later(hours=1)})
        assert save_detections(conn, parse(envelope=later)) == 0

    def test_a_reprocessed_detection_replaces_the_near_real_time_one(self, conn: Connection):
        save_detections(conn, parse(envelope=self.envelope))

        processed = RAW.replace(b"2.0NRT,281.87,4.34", b"2.0,281.87,3.90")
        revised = self.envelope.model_copy(
            update={
                "retrieved_at": _later(hours=6),
                "raw": str(_document(conn, processed)),
            }
        )
        assert save_detections(conn, parse(processed, revised)) == 1

        # Still five detections, not six: the revision stands in front of its predecessor rather
        # than beside it, which would draw the same hot pixel twice.
        found = near_summit(conn, radius_m=15_000)
        assert len(found) == 5
        assert (_at(found, TOP).frp_mw, _at(found, TOP).product_version) == (3.90, "2.0")

    def test_what_noma_held_before_the_revision_is_still_answerable(self, conn: Connection):
        save_detections(conn, parse(envelope=self.envelope))
        processed = RAW.replace(b"2.0NRT,281.87,4.34", b"2.0,281.87,3.90")
        revised = self.envelope.model_copy(
            update={"retrieved_at": _later(hours=6), "raw": str(_document(conn, processed))}
        )
        save_detections(conn, parse(processed, revised))

        # "What did Noma hold at lunchtime?" — before the processed product arrived.
        before = near_summit(conn, radius_m=15_000, as_of=_later(hours=1))
        assert (_at(before, TOP).frp_mw, _at(before, TOP).product_version) == (4.34, "2.0NRT")
        now = near_summit(conn, radius_m=15_000)
        assert _at(now, TOP).frp_mw == 3.90

    def test_distance_is_in_metres(self, conn: Connection):
        # The column is geography (ADR-0004). A radius read as degrees would pull in the whole
        # island — the summit detections sit within about two kilometres of each other.
        save_detections(conn, parse(envelope=self.envelope))
        assert len(near_summit(conn, radius_m=2_000)) == 2
        assert len(near_summit(conn, radius_m=15_000)) == 5

    def test_the_window_filters_by_when_the_satellite_looked(self, conn: Connection):
        save_detections(conn, parse(envelope=self.envelope))
        looked = datetime(2026, 9, 24, 1, 9, tzinfo=UTC)
        assert near_summit(conn, radius_m=15_000, start=looked + timedelta(minutes=1)) == []
        assert len(near_summit(conn, radius_m=15_000, end=looked)) == 5

    def test_it_knows_when_noma_last_asked(self, conn: Connection):
        # Read from the stored document, because the document IS the record of the fetch. The
        # endpoint uses this to decide whether to ask NASA again.
        asked = last_asked(conn, "nasa_firms")
        assert asked is not None and asked.tzinfo is not None
        assert last_asked(conn, "usgs") is None


def near_summit(
    connection: Connection,
    *,
    radius_m: float,
    start: datetime | None = None,
    end: datetime | None = None,
    as_of: datetime | None = None,
) -> list[ThermalDetection]:
    longitude, latitude = SUMMIT
    return list(
        detections_within(
            connection,
            longitude=longitude,
            latitude=latitude,
            radius_m=radius_m,
            start=start,
            end=end,
            as_of=as_of,
        )
    )


def _at(detections: list[ThermalDetection], where: tuple[float, float]) -> ThermalDetection:
    latitude, longitude = where
    found = [
        d
        for d in detections
        if round(d.latitude, 5) == latitude and round(d.longitude, 5) == longitude
    ]
    assert len(found) == 1, f"expected one detection at {where}, found {len(found)}"
    return found[0]


def _document(connection: Connection, content: bytes) -> object:
    return connection.execute(
        text("""
            INSERT INTO raw_document (source_id, retrieved_at, media_type, sha256, content)
            VALUES ('nasa_firms', now(), 'text/csv', sha256(:c), :c) RETURNING id
        """),
        {"c": content},
    ).scalar_one()


def _later(*, hours: int) -> datetime:
    return ENVELOPE.retrieved_at + timedelta(hours=hours)
