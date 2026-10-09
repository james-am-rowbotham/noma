"""The gate in front of Jev, and the words that get through it.

Jev is a decision model, not a chat model: it reads what it is given, literally, and its vendor
documents that it cannot count and reads dates as text. Everything here guards one idea — **Jev is
never asked to notice anything.** Staleness, missing sources, unreported uncertainty and the
arithmetic are all settled in code first.

No test here touches the network. The judging path is driven through a stand-in for the SDK, and the
gate tests prove the real client is never even constructed.
"""

import re
from datetime import UTC, datetime, timedelta
from typing import Any, ClassVar

import pytest

from noma.adapters import jev
from noma.adapters.jev import Evidence, JevError, Reading, ask, evidence_from

NOW = datetime(2026, 9, 29, 12, 0, tzinfo=UTC)

#: The reading that prompted the gate: 4.34 MW measured at 01:09 on 2026-09-24, still being handed
#: to Jev as current five days later, from a feed that carries a rolling 24 hours.
STALE_HEAT = Reading(
    label="Thermal radiated power",
    value=4.34,
    unit="MW",
    observed_at=datetime(2026, 9, 24, 1, 9, tzinfo=UTC),
    expected_cadence=timedelta(hours=12),
    baseline="weekly median 1.2 MW",
)
FRESH_QUAKES = Reading(
    label="Earthquakes near the summit",
    value=11,
    unit="events in 24 h",
    observed_at=datetime(2026, 9, 29, 10, 0, tzinfo=UTC),
    expected_cadence=timedelta(hours=1),
    baseline="daily median 4",
)


def built(*readings: Reading, previous: str | None = None) -> Evidence:
    return evidence_from(readings, system="Etna", previous=previous, now=NOW)


# ── the stand-in for the SDK ──────────────────────────────────────────────────


class FakeScore:
    type = "score"

    def __init__(self, score: float, confidence: float) -> None:
        self.score, self.confidence = score, confidence
        self.probabilities = {0: 0.19, 1: 0.69, 2: 0.12}


class FakeResponse:
    model = "jev-1.13.0"
    request_id = "req_test"

    def __init__(self, score: float, confidence: float) -> None:
        self.scores = {"departure": FakeScore(score, confidence)}
        self.usage = type("U", (), {"input_tokens": 665, "output_tokens": 61})()


class FakeClient:
    """Records what it was sent, so a test can assert on the payload Jev would have seen."""

    sent: ClassVar[list[dict[str, Any]]] = []
    answer: ClassVar[tuple[float, float]] = (0.93, 0.54)

    def __init__(self, **_kwargs: object) -> None: ...
    def __enter__(self) -> "FakeClient":
        return self

    def __exit__(self, *_exc: object) -> None: ...

    def system_one(self, state: Any, questions: Any, **_kwargs: object) -> FakeResponse:
        FakeClient.sent.append({"state": state, "questions": questions})
        return FakeResponse(*FakeClient.answer)


class Forbidden:
    """Stands in where the client must never be constructed at all."""

    def __init__(self, **_kwargs: object) -> None:
        raise AssertionError("Jev was asked when it should not have been")


@pytest.fixture(autouse=True)
def offline(monkeypatch: pytest.MonkeyPatch) -> None:
    FakeClient.sent = []
    FakeClient.answer = (0.93, 0.54)
    monkeypatch.setattr(jev, "TypeSafeClient", FakeClient)
    monkeypatch.setattr(
        jev, "settings", lambda: type("S", (), {"jev_api_key": _Secret("test-key")})()
    )


class _Secret:
    def __init__(self, v: str) -> None:
        self._v = v

    def get_secret_value(self) -> str:
        return self._v


# ── the gate ─────────────────────────────────────────────────────────────────


class TestTheGate:
    def test_a_reading_too_old_to_mean_anything_is_named_not_judged(self):
        # The 112-hour case. It does not quietly vanish: a judgement made without knowing this
        # measurement is unavailable is a different judgement.
        evidence = built(STALE_HEAT)
        assert not evidence.facts
        assert len(evidence.missing) == 1
        assert "Thermal radiated power" in evidence.missing[0]
        assert "5 days" in evidence.missing[0]
        assert "expected every 12 hours" in evidence.missing[0]

    def test_jev_is_never_asked_when_nothing_survives_the_gate(
        self, monkeypatch: pytest.MonkeyPatch
    ):
        # Handed an empty state Jev would still answer, confidently. So the client must not even be
        # built — if it were, a network outage would be the only thing standing between a dead feed
        # and a verdict.
        monkeypatch.setattr(jev, "TypeSafeClient", Forbidden)
        judgement = ask(built(STALE_HEAT))

        assert judgement.verdict == "not_checked"
        assert judgement.decided_by == "noma"

    def test_the_reason_says_what_went_stale(self):
        # "No usable measurements" alone invites the reader to think there was nothing to measure.
        because = ask(built(STALE_HEAT)).because or ""
        assert "Thermal radiated power" in because and "no reading for 5 days" in because

    def test_a_fresh_reading_is_judged_and_the_stale_one_is_still_named(self):
        evidence = built(FRESH_QUAKES, STALE_HEAT)
        assert [f.label for f in evidence.facts] == ["Earthquakes near the summit"]
        assert len(evidence.missing) == 1

        judgement = ask(evidence)
        assert judgement.decided_by == "jev"
        # What Jev saw includes the absence, not just the presence.
        state = FakeClient.sent[0]["state"]
        assert state["missing"]

    def test_merely_late_is_still_judged(self):
        # Twice its cadence, not three times. A late reading is a reading; a stale one is a reading
        # about a feed that has stopped. Only the second is withheld.
        late = FRESH_QUAKES.model_copy(
            update={"observed_at": NOW - timedelta(hours=2), "expected_cadence": timedelta(hours=1)}
        )
        assert [f.label for f in built(late).facts] == [late.label]

    def test_a_reading_with_no_stated_rhythm_can_never_be_stale(self):
        # Honest consequence of not knowing: nothing can be late against a rhythm nobody published.
        # It is let through SAYING so, rather than dropped on a technicality.
        ancient = Reading(
            label="Eruption bulletin",
            value=3,
            unit="explosions",
            observed_at=datetime(2024, 1, 1, tzinfo=UTC),
        )
        fact = built(ancient).facts[0]
        assert "on no stated schedule" in (fact.measured or "")


# ── the words ────────────────────────────────────────────────────────────────


class TestWhatJevIsGiven:
    def test_no_dates_reach_jev(self):
        # The vendor documents that Jev reads dates as text rather than as ordered quantities, so
        # a timestamp in the payload is an invitation to reason wrongly about time.
        ask(built(FRESH_QUAKES))
        payload = repr(FakeClient.sent[0]["state"])
        assert not re.search(r"\d{4}-\d{2}-\d{2}", payload), payload
        assert "T12:00" not in payload

    def test_ages_arrive_in_words(self):
        assert built(FRESH_QUAKES).facts[0].measured == "2 hours ago"

    def test_a_value_carries_its_unit(self):
        assert built(FRESH_QUAKES).facts[0].value == "11 events in 24 h"

    def test_an_unreported_uncertainty_says_so_rather_than_vanishing(self):
        # Same rule as the interface: "not reported" and "±0" are different claims, and a bare
        # number claims a precision nobody stated.
        assert built(FRESH_QUAKES).facts[0].uncertainty == "not reported by the source"

    def test_a_reported_uncertainty_travels_with_its_unit(self):
        measured = FRESH_QUAKES.model_copy(update={"uncertainty": 1.7, "unit": "mm"})
        assert built(measured).facts[0].uncertainty == "±1.7 mm"

    def test_the_previous_verdict_is_offered(self):
        # So Jev can be asked whether anything moved, rather than forming a fresh opinion hourly.
        assert built(FRESH_QUAKES, previous="steady").previous == "steady"


# ── the answer ───────────────────────────────────────────────────────────────


class TestTheVerdict:
    def test_a_weighted_score_becomes_the_nearest_level(self):
        # Verified against the live service: levels are 0-based, and 0.93 sat at "changing" with
        # probabilities 0.19/0.69/0.12.
        judgement = ask(built(FRESH_QUAKES))
        assert judgement.verdict == "changing"
        assert judgement.level == 0.93
        assert judgement.probabilities == {"steady": 0.19, "changing": 0.69, "escalating": 0.12}

    def test_the_ends_of_the_scale(self):
        for score, expected in ((0.0, "steady"), (1.9, "escalating"), (2.0, "escalating")):
            FakeClient.answer = (score, 1.0)
            assert ask(built(FRESH_QUAKES)).verdict == expected

    def test_it_records_what_answered(self):
        # Provenance: model and version, the request id, and what it cost.
        judgement = ask(built(FRESH_QUAKES))
        assert judgement.model == "jev-1.13.0"
        assert judgement.request_id == "req_test"
        assert judgement.input_tokens == 665

    def test_a_failure_is_never_a_verdict(self, monkeypatch: pytest.MonkeyPatch):
        # A monitor that cannot reach Jev is `not_checked`, which is a fact about Noma. Turning an
        # outage into "steady" would be the worst available answer.
        class Broken(FakeClient):
            def system_one(self, state: Any, questions: Any, **_kwargs: object) -> FakeResponse:
                raise jev.SdkError("rate limited")

        monkeypatch.setattr(jev, "TypeSafeClient", Broken)
        with pytest.raises(JevError, match="could not be asked"):
            ask(built(FRESH_QUAKES))

    def test_no_key_is_an_error_and_not_a_verdict(self, monkeypatch: pytest.MonkeyPatch):
        monkeypatch.setattr(jev, "settings", lambda: type("S", (), {"jev_api_key": None})())
        with pytest.raises(JevError, match="NOMA_JEV_API_KEY"):
            ask(built(FRESH_QUAKES))
