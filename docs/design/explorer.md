# The explorer

What Noma's interface IS: two views over one map, sharing one conversation. Decided in
[DESIGN-0003](../adr/design/DESIGN-0003-the-explorer-design-language.md); the visual language it is
built from is in [tokens.md](tokens.md).

The loop the whole thing exists to serve, from `CLAUDE.md`:

> **Look at a place → ask a question → the map answers → ask again.**

## Where the pixel detail lives

A design handoff bundle sits in [`handoff-noma-explorer/`](handoff-noma-explorer/README.md). It is
the source of truth for every measurement — sizes, timings, placement rules, copy — and this
document deliberately does not copy those numbers, because a second copy is a copy that drifts.

What that bundle is:

* **High fidelity, to be matched:** chrome, glass, typography, colour, spacing, component styling,
  interaction flows, copy.
* **Illustrative only:** the world map is a flat d3 projection, the detail terrain is one reference
  image with overlays positioned in *screen percentages*, every value in `prototype/data.js` is a
  sample, and natural-language understanding is keyword routing.

To run it: serve the bundle root over HTTP (`npx serve .`) and open `/prototype/index.html`. It
pulls world geometry from jsDelivr, so it needs a network.

The prototype is a reference, not a starting point: it is in-browser Babel with a compiled
design-system bundle. Noma rebuilds it in its own patterns — React, TypeScript, MapLibre, Base UI.

## Four things are always on screen

Everything else is contextual. These are not:

| | |
|---|---|
| **Where am I** | the place pill, top-left |
| **What am I looking at** | the map and its overlays |
| **What time** | Now, or a position on the timeline |
| **What can I ask** | the chat dock, bottom-centre |

Every surface over the map is smoked glass — translucent, heavily blurred, foldable. The map is
never fully covered and is always the thing behind everything.

## World view

A world map of active volcanoes and earthquakes. Volcanoes are triangles, earthquakes are circles,
and **colour is status** — alert, caution, neutral, quiet, ok. Background earthquakes sit at low
opacity and brighten when the answer is about earthquakes.

One **spotlight card** replaces every list panel in the interface. It is anchored to the selected
marker, names it, gives its status and headline and one live sparkline, offers two follow-up
questions, and cycles through the current set every seven seconds until you touch anything. Its
placement is scored against how many *other* markers each candidate position would cover — the rule
is in the bundle, and it matters: a card that hides the data is worse than a card in an odd place.

A question produces a **filter view**: a pill at the top centre naming the filter and its count, the
map zoomed to fit the result set, everything outside it faded to near-invisible, and the spotlight
cycling the results. Clear it with ×, Esc, or a click on empty map.

Clicking a marker enters the detail view: the world zooms into the event and fades, then the detail
view mounts over it.

## Detail view

One system, close up. Back to front: terrain, a protection gradient so chrome stays legible, the
live plume, the wind field, the ash forecast, lava paths, earthquakes, towns, forests, the vent
label.

Two columns of foldable glass panels: **data streams** and **local conditions** on the left,
**models & overlays** and **time** on the right. Streams show a value, its unit, a sparkline, its
evidence class and its trend.

**Clicking anything offers questions.** A town, a forest, the vent, a stream row — each opens a
small "Ask about…" menu with two or three questions worth asking of that thing. This is the
mechanism that makes natural language a shortcut rather than the only way in: every question the
chat can answer, something on the map can also offer.

The **timeline** is not a control for a chart, it is the time of the whole investigation. Dragging
into the past pauses the streams, marks their evidence *historical*, sets the place badge to
"Historical", and hides the live plume. Everything on screen has to agree about when it is.

## The chat

One input, bottom-centre, collapsed to a pill. The conversation grows **upward** out of it when
there is one, and folds away again. There is never a permanent chat sidebar.

While the input is empty the placeholder rotates through example questions and Tab fills in the one
showing — which is how a person learns what can be asked without a row of chips taking up space.

Every answer carries an evidence tag, its sources one click away, and **the map state that produced
it**. "Show on map" puts you back in front of the thing the answer was about, switching view if
necessary. That is what makes the thread a record of an investigation rather than a log of text.

## Evidence tags and provenance classes

The design draws an evidence tag on every answer and every stream. Its eight kinds are **not** eight
provenance classes: [ADR-0005](../adr/architecture/0005-one-question-per-provenance-class.md) says a
provenance class answers exactly one question — *what kind of claim is this?* — and rules out both
*how Noma got it* and *when it is about*.

Six of the eight are provenance classes, straight through. Two are other axes wearing the same
badge:

| Evidence tag | What it is |
|---|---|
| observed, calculated, modelled, simulated, inferred, forecast | the record's provenance class |
| **retrieved** | *how it arrived* — a document states it. The class is still whatever the claim is |
| **historical** | *when it is about* — the timeline is in the past. Every record already carries its own time |

So the tag is a rendering of provenance, and those two extra words must be rendered as a *second*
signal rather than as rivals to the six — otherwise the interface teaches a vocabulary the database
does not have, and "is this observed or retrieved?" becomes a question with no answer.

One thing this exposes and does not settle: Noma has no class for *a paper says so*. Reading a
measurement out of a publication is not inferring it. The proposed reading is that such a record is
OBSERVED with a document as its source, and `retrieved` describes the route — but that is proposed,
not decided, and it is in the domain model's open list.

## What can fill this design today

**The design specifies slots, not sources.** A stream row, an overlay, a marker colour — which
measurement goes into each one will change as sources come and go, and the sample values in the
prototype are illustrative. So this table is not a list of requirements the design got wrong. It is
the build order: which slots can be filled with something true right now, and which are still
waiting on a source.

The licence facts behind it are in [`../research/volcanic-activity.md`](../research/volcanic-activity.md).

| What the design shows | Where it comes from | Today |
|---|---|---|
| Marker colour, and the status badge | an alert level per volcano | **nothing open.** VONA notices and the ICAO colour code are PDF only; the Smithsonian catalogue's terms block re-serving |
| "Most active" ordering, activity index | Noma computing it | **CALCULATED — Noma is the source and can be wrong.** Needs a written formula before it is drawn |
| Headline and summary per system | editorial, or an LLM | **INFERRED.** Nothing publishes these openly |
| Background and detail earthquakes | fdsnws-event | **built** — INGV for Italy, USGS worldwide |
| Mid-Atlantic Ridge line | a plate-boundary dataset (PB2002) | not fetched; the prototype's line is approximate |
| 3D terrain | a DEM | MapLibre terrain is wired as scenery (DESIGN-0002); real elevation is not |
| **Live plume** | — | **not observable.** See the warning below |
| Wind field | NOAA GFS or Open-Meteo | both verified reachable, neither wired |
| Ash forecast footprint | a dispersion model Noma runs | MODELLED. No model chosen |
| Lava flow paths | a flow model over a DEM | MODELLED. No model chosen |
| Towns, population, distance, bearing | a settlements dataset | not fetched |
| Forests, land cover | a land-cover dataset | not fetched |
| Stream: volcanic tremor | INGV | **blocked — published as four PNG images** |
| Stream: SO₂ flux | INGV FLAME | **blocked — PDF bulletins** |
| Stream: summit uplift | RING GNSS | **built, with a caveat that must be shown:** summit stations are not published. The nearest open one is ~6 km from the craters, and most of its motion is the tectonic plate carrying Sicily |
| Stream: thermal anomaly | NASA FIRMS | **built, and it is not a smooth line:** a few satellite passes a day. The sample reads 412 MW; Etna measured 4.34 MW on 2026-09-24 — the difference between a lava flow and a warm crater |
| Episode history on the timeline | INGV eruption catalogues | usable (CC BY 4.0), but they carry no coordinates and their dates are prose |
| `ask(question, context)` | an NL endpoint | not built |
| Saved chats per user | accounts | deliberately deferred (domain model, point 16) |

Read as build order: Etna's detail view has four slots fillable today — earthquakes, ground
movement, heat, and wind — which is enough for a real screen. The world view's primary visual
channel is the one with no source at all, and the streams the prototype happens to sample are mostly
the ones that are published as pictures. **The rule that follows is about slots, not sources: a slot
with nothing true in it degrades honestly rather than being filled with something that looks right.**

### Two slots the design does not have yet

Both are UX questions rather than data questions, so they stay true whichever measurement arrives.

**Uncertainty has nowhere to go in a stream row.** The row holds a label, a value, a unit, a
sparkline, an evidence tag and a trend — and no ±. `CLAUDE.md` is unconditional: uncertainty is
always shown, and a value whose uncertainty was never reported has to be able to say so, because 3.9
alone looks exactly as precise as 3.9 ± 0.0. Every GNSS reading Noma holds carries one; most
earthquake depths do not. Both cases need a place to be.

**Nothing says how fresh a reading is.** A daily GNSS position, a satellite pass twice a day and a
five-minute tremor feed all render as the same smooth line under a green "● Live". Live is the
strongest claim the interface makes, and it is the one most likely to be wrong: a stale feed looks
identical to a quiet volcano. A row needs to be able to say when it last changed, and how often it
is expected to.

### The live plume is the sharpest case

The detail view rises puffs from the vent along the wind whenever the timeline is at Now. Drawn from
nothing, that says three things Noma does not know: that there is a plume, roughly how tall it is,
and where it is going.

Plume height is the number that decides everything downstream — ash dispersion, aviation, fallout —
and no open feed publishes it live. What Noma *can* see is heat at the vent and the wind above it,
so the honest version is: the plume appears when there is evidence of activity, its height is a
**dial the user turns** and therefore SIMULATED, and it is drawn in the style that says so.
`CLAUDE.md` is unambiguous — never present a simulation as an observation.

## Out of this phase, on purpose

* **Simulations** — question-first "what if the column reaches 8 km?". `ScenarioCard` exists in the
  design system for when they return.
* **Evidence inspection** — a provenance view beyond the source list is not designed yet, which is
  awkward given how much of Noma's value sits there.
* **Accessibility beyond the basics** — Esc clears and closes, Tab accepts the example question.
  Focus order and screen-reader labelling are unspecified, and a map-first interface is exactly
  where that is hardest.

## Open

* Do the detail view's two columns of always-present panels survive contact with `CLAUDE.md`'s
  "avoid permanent dashboards" and "avoid permanent scientific-data sidebars"? They are foldable and
  translucent, and the design's own principles claim no dashboards — but four panels that are there
  before anything is asked is the closest thing in this design to one. The test worth applying: is
  any of it there *before* you ask?
* Real 3D terrain: MapLibre's own terrain, deck.gl's `TerrainLayer`, or CesiumJS. DESIGN-0002 chose
  MapLibre and called terrain scenery rather than data; the handoff suggests the other two. Adding
  either is a second rendering stack and needs its own record.
* The world view is global, and Noma's sources are regional. A world map of volcano status implies a
  global source that does not exist, so what the world view shows when it can only speak for Italy
  is unsettled — the same problem as the empty map over Kīlauea (domain model, point 21).
