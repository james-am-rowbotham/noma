"""Jev, TypeSafe's System One model: computed facts in, a typed verdict out.

Jev is not a chat model. It answers named, typed questions about state and returns a structured
answer with calibrated probabilities — nothing to parse, nothing generated.

THE ARITHMETIC NEVER LEAVES OUR SIDE, and that is the vendor's own instruction rather than our
caution. TypeSafe's known-limitations page for jev-1.13 says "keep arithmetic, counting, and date
calculations in code", because the model "recognizes the shape of an answer rather than tallying",
gets worse as the data gets larger, and reads dates as text rather than as ordered quantities. A
monitor is made almost entirely of counting and dates, so everything Jev sees here is already
reduced to a comparison in words: not thirty-four rows with timestamps, but "34 earthquakes in the
last 24 hours, against a daily median of 4".

Two consequences of that, which are the whole reason this module exists rather than a bare client
call at the point of use:

  - `Evidence` carries facts that have already been compared against something. There is no field
    for a record list, so the shape of the type is the reminder.
  - Jev is asked NOTHING when there is nothing to judge. Handed an empty state it would still
    answer, confidently, because it reads instructions literally and has no way to notice that a
    feed died three days ago. Absence is decided here, in code, before the call.

The verdict vocabulary describes THE MEASUREMENTS, not the volcano. "Steady" and "escalating" are
claims about whether numbers have moved away from their own baseline; "no risk" would be a claim
about what a volcano is about to do, which belongs to the agency responsible for issuing it and
never to Noma (CLAUDE.md, and ADR-0005 on FORECAST).
"""

from collections.abc import Mapping, Sequence
from datetime import UTC, datetime, timedelta
from typing import Literal

from pydantic import AwareDatetime
from typesafe_sdk import Score, TypeSafeClient
from typesafe_sdk import TypeSafeError as SdkError

from noma.domain.quake import Model
from noma.settings import settings

#: The verdicts Jev may return, IN ORDER, least to most departed from baseline. Ordered on purpose:
#: see `ask` for why this is a Score and not a Choice.
LEVELS: tuple["Verdict", ...] = ("steady", "changing", "escalating")

#: Decided by Noma, never by Jev. `not_checked` is the state a monitor must be able to report and
#: the one most easily left out: a monitor whose feed has stopped and which keeps showing its last
#: verdict is a broken feed wearing the face of a quiet volcano (DESIGN-0004).
NOT_CHECKED = "not_checked"

Verdict = Literal["steady", "changing", "escalating", "not_checked"]

#: `jev-latest` for now. WHEN MONITORS BEGIN KEEPING HISTORY THIS SHOULD BE PINNED: the vendor
#: documents that the same question put to different primitives is not comparable, and a model
#: version changing under a stored series of verdicts is the same hazard by a slower route. The
#: version that actually answered is recorded on every judgement either way.
MODEL = "jev-latest"

TIMEOUT = 30.0

#: A reading older than this multiple of its own expected cadence is too old to judge. The same
#: number the interface uses for "stale" (DESIGN-0004), deliberately: a monitor calling something
#: stale while the screen calls it fine would be two answers to one question.
#:
#: ONLY the stale threshold lives here, not "late" as well. A reading that is merely late is still
#: a reading and Jev can judge it; one that is stale is a reading about a feed that has stopped.
#:
#: The browser holds its own copy of this number, which is one fact in two homes. Serving the
#: thresholds from the API would fix that and is not worth an endpoint yet — written down here so
#: the next person changing 3.0 knows to change both.
STALE_AFTER = 3.0


class JevError(RuntimeError):
    """Jev could not be asked, or could not be understood. Never a verdict — a monitor that cannot
    reach Jev is `not_checked`, which is a fact about Noma and not about the volcano."""


class Fact(Model):
    """One measurement, already compared against something. Everything here is a string because
    every number has already been turned into a comparison — the point at which Jev stops being
    asked to do arithmetic."""

    label: str
    #: The value as a person would read it, unit included: "4.34 MW", "34 earthquakes".
    value: str
    #: What it is being compared against, in words: "weekly median 1.2 MW", "daily median 4".
    #: Without this a value is not evidence of change, and change is the whole question.
    baseline: str | None = None
    #: Carried through because a change smaller than its own uncertainty is not a change. Says so
    #: explicitly when the source reported none, rather than going quiet (DESIGN-0004).
    uncertainty: str | None = None
    #: How old the reading is, in words — "6 hours ago". Never a timestamp: Jev reads dates as text.
    measured: str | None = None


class Reading(Model):
    """What the detection layer produces: a measurement with its real time and rhythm attached.

    This is the INPUT side, and it is machine-readable on purpose — `evidence_from` is the only
    place that turns a reading into words, so the freshness arithmetic happens in code exactly once
    and Jev is never handed a date to reason about.
    """

    label: str
    value: float
    #: UCUM where the source gives one. Travels with the value because a number without its unit
    #: is not a measurement.
    unit: str
    #: None means the source reported none, which is said out loud rather than omitted: a bare
    #: value claims a precision nobody stated (CLAUDE.md, DESIGN-0004).
    uncertainty: float | None = None
    #: When the measurement was made. Used ONLY by the gate; never sent to Jev as a date.
    observed_at: AwareDatetime
    #: How often the next one is expected. None means no stated rhythm, so this reading can never
    #: be called stale — the honest consequence of not knowing (domain model, point 25).
    expected_cadence: timedelta | None = None
    #: What the value is being compared against, in words. Supplied by the caller because the
    #: comparison is the detection layer's job, not this module's.
    baseline: str | None = None


class Evidence(Model):
    """Exactly what is sent to Jev, stored verbatim with the verdict it produced. A judgement whose
    inputs were not kept is a rumour: you cannot ask later why it said what it said."""

    system: str
    facts: Sequence[Fact]
    #: Named out loud, because a judgement made without knowing what was missing is a different
    #: judgement. "Volcanic tremor is not published as data" changes what "steady" can mean.
    missing: Sequence[str] = ()
    #: The previous verdict, so Jev can be asked whether anything moved rather than forming a fresh
    #: opinion every hour from scratch.
    previous: str | None = None


class Judgement(Model):
    """A verdict and everything needed to account for it later.

    Not yet a stored record with an envelope: monitors are not specified, and inventing the
    provenance shape before the spec exists is how a schema gets stuck. When it is stored, its
    provenance class is INFERRED — a judgement that could be wrong (ADR-0005)."""

    verdict: Verdict
    #: Which of the two decided. Jev never returns `not_checked`, so this is not decoration.
    decided_by: Literal["jev", "noma"]
    #: The probability-weighted position across LEVELS, so 1.6 sits between "changing" and
    #: "escalating". THIS, not `verdict`, is what a monitor should threshold on: a measured
    #: jev-1.13 call on a deliberately stacked payload saturated a Choice to exactly 1.0/0.0/0.0,
    #: so a discrete answer carries less signal than it appears to. A number between levels leaves
    #: the hysteresis — how far it must move before a monitor changes its mind — on our side.
    level: float | None = None
    confidence: float | None = None
    probabilities: Mapping[str, float] = {}
    #: The version that actually answered, e.g. "jev-1.13.0", and the request id, for provenance.
    model: str | None = None
    request_id: str | None = None
    input_tokens: int | None = None
    #: Why, when Noma decided rather than Jev: "no usable measurements", "Jev unreachable".
    because: str | None = None


def evidence_from(
    readings: Sequence[Reading],
    *,
    system: str,
    previous: str | None = None,
    now: datetime | None = None,
) -> Evidence:
    """Turn readings into the words Jev sees — and drop the ones too old to mean anything.

    THE GATE. A reading older than `STALE_AFTER` times its own cadence is not judged, it is NAMED:
    it moves from `facts` into `missing`, so the judgement is made in the knowledge that this
    measurement is unavailable rather than on a number that stopped being true days ago.

    Found by running the real thing: a 112-hour-old thermal reading was handed to Jev as though it
    were current, from a feed that carries a rolling 24 hours. Jev has no way to notice — it reads
    what it is given, literally — so noticing has to happen here.

    A reading with no stated cadence passes, and says so. That is not a loophole: nothing can be
    called late against a rhythm that was never published, and silently dropping it would be a
    judgement dressed as a technicality.
    """
    at = now or datetime.now(tz=UTC)
    facts: list[Fact] = []
    missing: list[str] = []

    for r in readings:
        age = at - r.observed_at
        if r.expected_cadence and age > r.expected_cadence * STALE_AFTER:
            missing.append(
                f"{r.label} — no reading for {_in_words(age)}, expected every "
                f"{_in_words(r.expected_cadence)}"
            )
            continue
        facts.append(
            Fact(
                label=r.label,
                value=f"{r.value:g} {r.unit}",
                baseline=r.baseline,
                # Never omitted, even to a model: "not reported" and "±0" are different claims.
                uncertainty=(
                    f"±{r.uncertainty:g} {r.unit}"
                    if r.uncertainty is not None
                    else "not reported by the source"
                ),
                measured=f"{_in_words(age)} ago"
                + ("" if r.expected_cadence else ", on no stated schedule"),
            )
        )

    return Evidence(system=system, facts=facts, missing=missing, previous=previous)


def _in_words(d: timedelta) -> str:
    """A duration a reader — human or Jev — does not have to do arithmetic on. Coarse on purpose:
    "5 days" is the useful fact, and "5 days, 3:42:11" invites someone to compute with it."""
    seconds = int(abs(d.total_seconds()))
    for size, name in ((86_400, "day"), (3_600, "hour"), (60, "minute")):
        if seconds >= size:
            n = seconds // size
            return f"{n} {name}{'s' if n != 1 else ''}"
    return "less than a minute"


def ask(evidence: Evidence, *, model: str = MODEL, timeout: float = TIMEOUT) -> Judgement:
    """Ask Jev where these measurements sit, from steady to escalating.

    A **Score** rather than a Choice, because the three levels are ORDERED and a Score returns the
    probability-weighted average across them — a position rather than a bucket. That matters here
    for a measured reason: on a stacked payload jev-1.13 returned a Choice at confidence 1.0 with
    every other option at zero, which is a verdict with nowhere to go. A Score between levels gives
    a monitor something to apply its own threshold to.

    Returns `not_checked` WITHOUT asking Jev when there is nothing to judge.
    """
    if not evidence.facts:
        # The gate. Not an optimisation: handed no measurements Jev would still answer, and the
        # answer would be indistinguishable from one made on real data.
        # `missing` is carried into the reason: "no usable measurements" on its own invites the
        # reader to think there is nothing to measure, when what happened is that everything
        # measurable had gone stale.
        why = f"no usable measurements for {evidence.system}"
        if evidence.missing:
            why += f" — {'; '.join(evidence.missing)}"
        return Judgement(verdict=NOT_CHECKED, decided_by="noma", because=why)

    key = settings().jev_api_key
    if key is None:
        raise JevError("no Jev key configured — set NOMA_JEV_API_KEY (see .env.example)")

    question = Score(
        instructions=(
            "These measurements have already been compared against their own recent baselines. "
            "Choose the level that describes where they sit. Judge only what is listed; treat "
            "anything named as missing as unknown rather than as absence of change."
        ),
        # Ordered, least to most. The descriptions are the rubric Jev is scoring against, and they
        # are about the MEASUREMENTS — no level here says anything about danger.
        criteria=[
            "Every measurement is within its usual range for this system.",
            "At least one measurement has moved away from its baseline, by more than its "
            "uncertainty, but the others have not.",
            "Several measurements have moved away from their baselines together, in the same "
            "direction.",
        ],
    )

    # The SDK is built on httpx2, the same client every other adapter here uses, and its RetryPolicy
    # already backs off on 429 and 529 with Retry-After respected — which is the reason to take the
    # SDK rather than hand-roll the POST.
    try:
        with TypeSafeClient(api_key=key.get_secret_value(), timeout=timeout) as client:
            # pyright: ignore is narrow and earned: the SDK's own JSONContent alias is recursive
            # and resolves to `Sequence[Unknown | None]`, so strict mode calls the whole method
            # partially unknown. The vendor's typing, not ours, and the answer is typed.
            answer = client.system_one(  # pyright: ignore[reportUnknownMemberType]
                state=evidence.model_dump(by_alias=False, exclude_none=True),
                questions={"departure": question},
                model=model,
            )
        scored = answer.scores["departure"]
    except SdkError as e:
        # Every failure mode of the SDK lands here — auth, rate limit, timeout, a response that did
        # not validate. The caller turns this into `not_checked`; it must never become a verdict.
        raise JevError(f"Jev could not be asked: {type(e).__name__}: {e}") from e
    except KeyError as e:
        raise JevError("Jev answered without the question that was asked") from e

    return Judgement(
        verdict=_level_name(scored.score),
        decided_by="jev",
        level=scored.score,
        confidence=scored.confidence,
        # Re-keyed from Jev's integer levels to our own words, so a stored judgement stays readable
        # when the rubric is edited.
        probabilities={_level_name(float(i)): p for i, p in sorted(scored.probabilities.items())},
        model=answer.model,
        request_id=answer.request_id,
        input_tokens=answer.usage.input_tokens,
    )


def _level_name(score: float) -> Verdict:
    """The nearest level to a weighted score. Clamped rather than trusted: the rubric has three
    levels and a response claiming a fourth is a change at the far end, not a new verdict."""
    return LEVELS[min(range(len(LEVELS)), key=lambda i: abs(i - score))]
