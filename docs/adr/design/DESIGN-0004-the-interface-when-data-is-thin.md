---
id: DESIGN-0004
title: The interface when data is thin
type: design
status: accepted
date: 2026-09-28
amends: DESIGN-0003
---

# DESIGN-0004: The interface when data is thin

## Context

[DESIGN-0003](DESIGN-0003-the-explorer-design-language.md) adopted the explorer design language and
recorded two holes, found by asking what a row needs regardless of which measurement fills it:

* the stream row had nowhere to put an uncertainty, which `CLAUDE.md` requires unconditionally;
* nothing anywhere said how fresh a reading was, so a daily position, a twice-daily satellite pass
  and a five-minute feed would all render as one smooth line under a green "● Live".

It also left one conflict open: the detail view's two columns of always-present panels against
`CLAUDE.md`'s "avoid permanent dashboards" and "avoid permanent scientific-data sidebars".

An updated handoff on 2026-09-28 answers all three. This records the decisions in it, because they
are the part of the design that is specific to Noma — every other part of the explorer could belong
to any map product, and this part could not.

It matters because Noma's data is thin in exactly this way and will stay thin. Of the four streams
the design's detail view shows, two are published as pictures and PDFs; the ground-movement station
nearest Etna's craters is 6 km away; the thermal feed is a few satellite passes a day. An interface
that only looks right when the data is complete would be lying most of the time.

## Decision

The design's own statement of the principle, which is the test to apply to anything built from it:

> A broken feed must never look like a quiet volcano, and an empty map must never look like "nothing
> here".

**1. Uncertainty occupies a slot in the value, and the slot is never empty.** `3.2 ±0.4 cm`, in the
same run of mono, the ± quieter than the number. Where the source reported none, the slot reads `±?`
with a dotted underline and says so on hover. There is no third option — omitting it is a claim.

**2. Freshness is computed by the reader, from the cadence expected of that stream.** The server
sends `lastObservedAt` and `expectedCadence` and never sends "live". Age ÷ expected cadence gives
fresh, late or stale; the timeline being in the past gives historical. A plot's right edge is now, and
a last reading short of that edge trails off in a dashed line. A continuous feed is drawn as a line,
a discrete one as dots. "Live" is reserved for a fresh continuous feed.

**3. Absence is stated where the value would have been, and it names what is missing.** A stream with
no source here keeps its label and shows why. A model that has not run says what it is waiting for.
An area no source covers is hatched, with a note saying what is shown instead. A query the current
view cannot fully serve gets that same note — **never an error**.

**4. In the detail view, only the status panel is open.** Every other panel arrives folded, showing
its title and a one-line summary. That settles DESIGN-0003's open conflict, and the test it passes is
the one worth keeping: *what is on screen before you ask anything?* One panel saying what is
happening here, and four headers saying what else there is to see.

## Alternatives considered

**Omit the ± when a source did not report one.** Quieter rows, and it is what almost every scientific
interface does. Rejected on the numbers below: it would have silently upgraded the precision of most
of Noma's earthquake depths, and the case where nothing was reported is the case that matters.

**Let the server compute freshness and send a `live` flag.** Much less client logic. Rejected: the
flag is wrong the moment it is serialised, a cached or replayed response keeps claiming live, and
freshness is a function of when a thing is *read*, which only the reader knows. The server sends
facts; the reader draws the conclusion.

**Draw every stream as a smooth line**, whatever its cadence. Rejected: joining daily positions into
a curve invents readings between the days, which is fabrication with a stylistic excuse.

**Show an error when a query exceeds what the view can serve.** This is what the code does today — a
red banner when the map is zoomed out past 20°. Rejected twice over: it is not an error but a
statement about coverage, and an error bar raised by an ordinary gesture teaches people to dismiss
error bars, which is where real failures then go unnoticed.

**One "data quality" panel** rather than per-slot treatment. Rejected: a gap belongs to one
measurement, and a panel about gaps is a panel people stop opening. The absence has to be in the
place the value would have been.

**Keep the panels open**, as the first handoff had them. Rejected: it made the detail view a
dashboard on arrival, and a folded header carries most of the value anyway — "4 streams · 1 stale"
says more than four open panels do at a glance.

## Evidence

Why the `±?` slot is not a nicety, measured on real catalogues:

| | |
|---|---|
| INGV origins fetched for Etna | **147**, every one with a depth |
| …of those, stating a depth uncertainty | **64** |
| One real vertical section through the volcano | **35 of 35** origins had no stated depth uncertainty |
| ESLN GNSS readings | **every one** carries its own σ; ±1.7 mm on a 2.43 cm eastward movement through 2025 |

So on a typical screen most depths will show `±?` and every ground-movement value will show a real ±.
Omitting the slot would have made those two look identical.

Cadence, measured: RING GNSS publishes one position per day; NASA FIRMS gave five detections at a
single 01:09 overpass on 2026-09-24, a few passes a day; INGV's volcanic tremor images refresh every
five minutes. Three feeds spanning three orders of magnitude in cadence, all of which the old design
would have drawn identically.

The thresholds (late at 1.5× the expected cadence, stale at 3×) come from the design. They are not
measured, and nothing in Noma has yet run long enough to measure them.

## Consequences

**The backend has to serve two new things per stream:** `expectedCadence` and `lastObservedAt`.
Nothing does, and no datastream records the first — it is the smallest piece of backend work this
design asks for, and freshness cannot be drawn at all until it exists.

**A row's appearance now changes with time and no new data.** A fresh reading becomes late becomes
stale while nobody touches anything, so the client re-renders on a clock, and any test of it has to
control that clock. Noma has been bitten by this shape before: GNSS tests whose fixtures sat in the
future passed or failed depending on the time of day they ran.

**Coverage wants a polygon, not a flag.** Hatching the exact ground no source covers needs per-source
geometry, which Noma already stores (`source.region`, geometry rather than geography, for containment)
and has never served to the browser.

**Most depths will carry `±?`**, which will look surprising and is correct. The alternative was
looking clean and being wrong.

**What would make us revisit it:** a stream whose cadence is genuinely irregular — an eruption
bulletin, a campaign survey — where "expected cadence" has no honest value and late/stale cannot be
computed from it.

## References

* The bundle: `docs/design/handoff-noma-explorer/README.md`, section *Thin data*, and the `StreamRow`
  and `CoverageNote` components in `reference/components-source.md`
* [`docs/design/explorer.md`](../../design/explorer.md)
* The design references a reference card at `guidelines/data-honesty.html`, which lives in the
  design-system project and is not part of the bundle.
