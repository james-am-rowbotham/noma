---
id: DESIGN-0003
title: The explorer design language, and Base UI stays underneath it
type: design
status: accepted
date: 2026-09-26
amends: DESIGN-0001
---

# DESIGN-0003: The explorer design language, and Base UI stays underneath it

## Context

Noma's interface was a placeholder. `web/src/App.css` said so in its first line: nothing in it was a
decision, it existed so the map was legible while the rest was built. The one visible feature was
earthquakes as dots, and its UX was — accurately — described as strange: a month of activity
flattened into one frame, dots that could not be clicked, and colour carrying depth with nothing on
screen to say so.

[DESIGN-0001](DESIGN-0001-base-ui-and-our-own-tokens.md) chose Base UI for behaviour and put the look
in Noma's hands, leaving the tokens to "a later record" and explicitly not deciding how styles are
written. This is that record.

A design handoff arrived on 2026-09-26: a full specification of a two-view explorer with tokens, a
component set, a running HTML/React prototype and a written behaviour spec. It is the first time the
product principles in `CLAUDE.md` — map first, no dashboards, complexity emerges, uncertainty drawn
rather than disclaimed — have had a concrete shape to be judged against.

## Decision

**Adopt the handoff as Noma's design language**, described in
[`docs/design/explorer.md`](../../design/explorer.md) and
[`docs/design/tokens.md`](../../design/tokens.md).

1. **The bundle lives in the repository**, at `docs/design/handoff-noma-explorer/`, and is the source
   of truth for every measurement — sizes, timings, placement rules, copy. Specs point at it and do
   not copy its numbers.
2. **The token CSS is copied into the app, not transcribed.** Components use the semantic layer
   (`--text-*`, `--surface-*`, `--border-*`) and never raw scales or hex values, so both themes and
   the glass remap keep working.
3. **Base UI stays, for behaviour.** The handoff's components are an appearance specification; they
   are rebuilt on Base UI primitives in TypeScript. The compiled `_ds_bundle.js` never ships.
4. **Evidence tags render provenance classes.** Six of the design's eight map straight onto
   [ADR-0005](../architecture/0005-one-question-per-provenance-class.md); `retrieved` (how it
   arrived) and `historical` (when it is about) are different axes and are drawn as a second signal,
   never as rivals to the six.
5. **Every visual degrades honestly.** Most of what the design shows has no source yet, and the gap
   table in the explorer spec is part of this decision rather than a note beside it. Nothing is drawn
   from nothing — in particular the live plume, whose height no open feed publishes, is a dial the
   user turns and is therefore SIMULATED.

## Alternatives considered

**Ship the prototype.** It runs, it looks right, and it would be the fastest visible progress
available. Rejected: it is in-browser Babel with a compiled design-system bundle, no types, and its
own Button/Panel/Switch/Dialog set — which would put a second component library into the app, against
`CLAUDE.md`, to get an appearance the tokens already give us. The handoff itself says to rebuild it.

**Transcribe the tokens into this repository's own file** — a Tailwind config, a TypeScript theme
object, or a table in this record. Rejected: it makes two copies of every value, and the copy that
drifts is always the one a person reads. Copying the CSS keeps one home per fact.

**Keep the bundle outside the repository** and link to it. Rejected: the part that gets lost is
exactly the part that is hard to recover — the placement scoring, the degradation order, the timings.
A link that rots takes the design with it. It costs 3.6 MB, most of it one reference image.

**Adopt all eight evidence kinds as provenance classes.** It would make the interface and the
database use one word list, which is worth something. Rejected on ADR-0005: `retrieved` answers *how
Noma got it* and `historical` answers *when it is about*, and a class that answers a second question
makes "is this observed, or retrieved?" a question with no answer.

**Drop Base UI and keep the handoff's components.** Rejected: they specify appearance, and the hard
part of a combobox, a popover over a WebGL canvas, or a two-thumb time slider is focus trapping,
keyboard handling and screen-reader roles. DESIGN-0001's reasoning is untouched by this handoff.

**Build the world view first**, since the design opens there. Rejected on data: the world view's
primary visual channel is marker colour, and colour is status — for which there is no open source at
all. Etna's detail view is where Noma actually has data.

## Evidence

The design specifies slots rather than sources, and which measurement fills a slot will change. What
follows is evidence about **which slots can be filled truthfully today** — measured against the four
streams the prototype happens to sample, using
[`docs/research/volcanic-activity.md`](../../research/volcanic-activity.md):

| Stream in the design | Reality |
|---|---|
| Volcanic tremor | published by INGV as **four PNG images**, refreshed every 5 minutes. Not data |
| SO₂ flux | INGV FLAME: **PDF bulletins** |
| Summit uplift | RING GNSS is open and built — but **summit stations are not published**. The nearest open station (ESLN) is ~6 km from the craters, and most of its 38 cm of eastward motion over twenty years is the tectonic plate carrying Sicily |
| Thermal anomaly | NASA FIRMS, open and built. **A few satellite passes a day, not a line.** The prototype's sample reads 412 MW; Etna measured **4.34 MW** at the summit at 01:09 UTC on 2026-09-24 |

Two of four cannot be obtained at all. The sample value for the one true live stream is two orders of
magnitude above what was actually measured, which is the difference between a lava flow and a warm
crater — a caution about sparkline scales drawn from sample data.

Two slots the design does not have, found by asking what a row needs regardless of which measurement
fills it: somewhere for uncertainty, which `CLAUDE.md` requires unconditionally and which the stream
row has no room for, and somewhere for freshness, since a daily position, a twice-daily satellite
pass and a five-minute feed all currently render as one smooth line under "● Live".

Bundle: 3.6 MB total — `assets/imagery/terrain-reference.png` 3.1 MB, `_ds_bundle.js` 320 KB
(compiled reference, not shipped), everything else under 100 KB.

## Consequences

**The interface stops being a placeholder**, and every piece of it now has somewhere to be checked
against. The earthquake styling changes: colour becomes status, not depth, so the current depth ramp
in `web/src/map/earthquakes.ts` is superseded and depth needs a different channel.

**Glass is not free.** `backdrop-filter: blur(22px) saturate(1.6)` on several panels over a live
WebGL canvas is real GPU work, and the detail view has four panels plus a dock. If it costs frames,
the answer is fewer glass surfaces rather than less blur — a thin blur reads as a bug.

**Dark-first means two full surfaces to maintain**, not one with inverted colours: the map canvas, the
markers and the glass all change, and overlays on terrain imagery deliberately do not.

**Most of the design cannot be honestly filled yet.** That is the point of the gap table, and it
reframes the work: the next question is not "what else can we draw?" but "what can we draw that is
true?".

**One conflict stays open.** The detail view has two columns of always-present panels, and
`CLAUDE.md` says avoid permanent dashboards and permanent scientific-data sidebars. The design's own
principles claim no dashboards, and the panels fold — but four panels present before anything is
asked is the closest this design comes to one. Either the principle gets an exception written into
it, or the panels arrive on demand. Left open rather than resolved by whoever implements it first.

**What would make us revisit it:** the world view needing a global status source that does not exist,
or real 3D terrain forcing a second rendering stack (deck.gl or CesiumJS), which
[DESIGN-0002](DESIGN-0002-the-map-and-where-its-tiles-come-from.md) did not contemplate.

## References

* The bundle: [`docs/design/handoff-noma-explorer/README.md`](../../design/handoff-noma-explorer/README.md)
* [`docs/design/explorer.md`](../../design/explorer.md),
  [`docs/design/tokens.md`](../../design/tokens.md),
  [`docs/design/investigation-state.md`](../../design/investigation-state.md)
* World geometry: Natural Earth via `world-atlas@2.0.2` (public domain). Plate boundaries should come
  from a real dataset such as PB2002; the prototype's ridge line is approximate.
* Icons: Unicode glyphs in the prototype, Lucide (1.5px stroke) in production.
