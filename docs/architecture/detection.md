# Detection: turning records into facts

The layer between what Noma holds and what anything judges. It reads stored records and produces
**facts** — a value, its unit, its uncertainty, when it was measured, how often to expect the next
one, and what it is being compared against.

It exists because the gate in front of Jev
([DESIGN-0004](../adr/design/DESIGN-0004-the-interface-when-data-is-thin.md), `adapters/jev.py`)
can catch a number that has gone **stale**, and cannot catch a number whose **label lies**. Both
of the failures below were real, both were in throwaway queries written in about a minute, and
neither is detectable downstream:

* "Eastward ground movement: **37.98 cm**" — the total since 2005, presented where recent movement
  was meant. Like answering "how far did you drive today?" with the odometer.
* "**83** earthquakes near Etna" — `count(*)` over a table that keeps every revision. The real
  number is **61**. Measured 2026-10-09: 83 origin rows, 61 distinct origins, 61 distinct
  earthquakes. A 36% over-count, from a query that looks completely ordinary.

Jev judged both faithfully. It cannot do otherwise: it reads what it is given, and what it was given
was arithmetic with a label that did not match it.

## Rules

Each one is a claim a test asserts, in `backend/tests/test_detect.py`.
`scripts/specIntegrity.test.ts` checks that every rule here has one, so a rule that stops being
enforced cannot sit in this list looking settled. `(unbuilt)` is how a rule agreed but not yet built
declares itself; nothing here carries it any more.

**DET-1** A fact's label names the arithmetic that produced it. If the same label would be true of
two different computations, the label is wrong: "eastward movement" is not a fact, "eastward
movement over the last 30 days" is.

**DET-2** Every fact computed over a period states that period. A count without a window is not a
count — "0 earthquakes" says nothing until it says since when. An instantaneous measurement, such
as a single satellite pass, has no period to state and says so by having none.

**DET-3** A fact carries a baseline, or it is not evidence of change. A value alone cannot support
"changing": changing against what?

**DET-4** A baseline states how much history it was computed from. A "weekly median" derived from
one day of data is not a weekly median, and the one thermal overpass Noma holds is exactly that
case.

**DET-5** A count counts distinct things, never rows. Every table here keeps every version of every
record (domain-model point 19), so `count(*)` counts revisions as events.

**DET-6** A change smaller than its own uncertainty is not a change. Every GNSS reading carries a
standard deviation of about 1.5 mm; a 1 mm "movement" is noise wearing a number.

**DET-7** A fact is produced only from records that are held and fresh, and absence is never zero.
"No earthquakes" from a source Noma has not asked is not a measurement of the ground.

**DET-8** A fact names the records it came from, so a verdict can be re-derived from the same
inputs. A judgement whose inputs were not kept is a rumour.

**DET-9** A derived fact is CALCULATED and Noma is its source (ADR-0005). Noma can be wrong, and the
record has to say whose arithmetic it was.

## What this is not

**Not the thresholds.** How far a value must move before it means something is the monitor's
business, and how stale is too stale is the gate's. This layer produces facts; it does not judge
them.

**Not a general query API.** It answers the questions a monitor and a stream row ask, which are
narrow: what is the latest value, what is it usually, has it moved. A fact nobody displays or judges
does not need to exist.

## Open

* Where the baseline window comes from. A fixed 30 days is simple and wrong for a feed with three
  days of history; derived from what is held is honest and moves under your feet. DET-4 requires it
  to be *stated* either way, which is the part that matters.
* Whether a fact is stored or computed on demand. Storing makes a verdict reproducible without
  re-running the arithmetic; computing keeps one source of truth. Point 19's revision keeping makes
  the stored version answerable as of a moment, which is an argument for storing.
