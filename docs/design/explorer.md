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
| **Where am I** | the location pill, top-left, beside the wordmark |
| **What am I looking at** | the map and its overlays |
| **What time** | Now, or a position on the timeline |
| **What can I ask** | the chat dock, bottom-centre |

Every surface over the map is smoked glass — translucent, heavily blurred, foldable. The map is
never fully covered and is always the thing behind everything.

Two utilities sit in the corners rather than in that list, because they are not part of the
investigation: a settings button top-right, and the map controls bottom-right. **Settings** is a
modal, and what it holds says something about the product: theme, reduced motion, marker labels,
UTC or local time, metric or imperial. Every one of those is a preference about how a thing is
*shown* — none of them changes what is being looked at, so none of them belongs in a shareable
link.

## World view

A world map of active volcanoes and earthquakes. Volcanoes are triangles, earthquakes are circles,
and **colour is status** — alert, caution, neutral, quiet, ok. Background earthquakes sit at low
opacity and brighten when the answer is about earthquakes.

The globe fills the viewport and everything else floats over it. It pans and zooms like a map, 1× to
12×, with controls in the bottom-right corner; markers are counter-scaled so they keep their size on
screen however far you zoom. A drag of more than a few pixels suppresses the click, so panning never
selects something by accident.

One **system card** replaces every list panel. It is anchored to the selected marker and names it,
with its status, headline, an activity figure, a trend, and who reported it. Hovering a marker
previews that system's card; clicking pins it. Its placement is scored against how many *other*
markers each candidate position would cover — the rule is in the bundle, and it matters: a card that
hides the data is worse than a card in an odd place. When there is not enough room it sheds sections
in a fixed order and, at worst, becomes a single pill.

**Clicking a marker does not navigate.** It opens the card; the card's Explore button enters the
detail view. A click that both selects and travels gives you no chance to read what you selected.

**The list of what is featured lives inside the chat input**, as its leading element, not in a panel
of its own. Asking a question turns it into the filter's list: the same control, now naming the
filter and counting its results, with a × that clears it. So the one persistent control in the world
view is the thing you type into, and the list of places is something it opens.

A question produces a **filter view**: the map zooms to fit the results, everything outside the set
fades to near-invisible, the answer is added to the chat. Clear it with ×, Esc, or a click on empty
map.

## Detail view

One system, close up. Back to front: terrain, a protection gradient so chrome stays legible, the
live plume, the wind field, the ash forecast, lava paths, earthquakes, towns, forests, the vent
label.

Five foldable glass panels in two columns: **status**, **data streams** and **local conditions** on
the left, **models & overlays** and **time** on the right.

**Only status is open.** Everything else arrives folded, showing its title and a one-line summary —
"4 streams · 1 stale", the wind, "{n} running" — and opens when you want it. That is what keeps this
from being a dashboard: what is on screen before you ask anything is one panel saying what is
happening here, and four headers saying what else there is to see.

The status panel is the answer to "what is going on", in the order a person asks it: the status
itself, a headline, a summary, then four facts — an activity figure, the main stream's trend, the
nearest town, and **how complete the data is** ("Complete", or "SO₂ flux stale"). A panel that
reports on its own gaps is unusual, and it is the most Noma-ish thing in the design.

A stream row shows a value, its unit, **its uncertainty**, a plot, its evidence class, its trend, the
span it covers and how fresh it is. See *Thin data*.

**Clicking anything offers questions.** A town, a forest, the vent, a stream row — each opens a
small "Ask about…" menu with two or three questions worth asking of that thing. This is the
mechanism that makes natural language a shortcut rather than the only way in: every question the
chat can answer, something on the map can also offer.

The **timeline** is not a control for a chart, it is the time of the whole investigation. Dragging
into the past pauses the streams, marks their evidence *historical*, turns the status panel into
"Historical view", and hides the live plume. Everything on screen has to agree about when it is.

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
| Marker colour, and the status | an alert level per volcano | **nothing open.** VONA notices and the ICAO colour code are PDF only; the Smithsonian catalogue's terms block re-serving. The design labels status *retrieved* and names who reported it, so the claim is at least honest about being someone else's |
| Activity figure ("92 / 100") | Noma computing it | labelled *calculated* in the design, which is right — Noma is the source. It still needs a written formula before it is drawn |
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
| **Uncertainty on every value** | the record | **served already.** `uncertainty: null` travels on every magnitude and depth, distinct from zero |
| **Expected cadence, and when a stream last updated** | the datastream | **not served.** Nothing in Noma states how often a stream should arrive, so freshness cannot be computed yet — the smallest piece of backend work the design asks for |

Read as build order: Etna's detail view has four slots fillable today — earthquakes, ground
movement, heat, and wind — which is enough for a real screen. The world view's primary visual
channel is the one with no source at all, and the streams the prototype happens to sample are mostly
the ones that are published as pictures. **The rule that follows is about slots, not sources: a slot
with nothing true in it degrades honestly rather than being filled with something that looks right.**

## Thin data

The part of the design that is most specific to Noma, and the reason the rest of it can be built
against real sources rather than samples. Its own statement of the principle:

> A broken feed must never look like a quiet volcano, and an empty map must never look like "nothing
> here".

Exact sizes, thresholds and copy are in the bundle. What matters here is the three rules, and they
are decided in [DESIGN-0004](../adr/design/DESIGN-0004-the-interface-when-data-is-thin.md).

**Uncertainty sits in the value, and its slot is never empty.** `3.2 ±0.4 cm`, in the same run of
mono, the ± quieter than the number. Where a source reported no uncertainty, the slot reads `±?`
under a dotted underline, and says so on hover. There is no third option: a bare `3.9` claims a
precision nobody stated. Noma's API already works this way — `uncertainty: null` travels on every
magnitude and depth, distinct from zero, and is never omitted.

**Freshness is measured against the cadence expected of that stream, and the client decides it.**
The right-hand edge of every plot is now. A reading older than that leaves a dashed tail running to
the edge, so a stopped feed is visible without reading a word. Age divided by expected cadence gives
four states — fresh, late, stale, historical — and a continuous feed is drawn as a line while a
discrete one is drawn as dots, because a daily position joined into a smooth curve invents readings
between the days. **"Live" is reserved for a fresh continuous feed**, and the server never claims it:
it sends when the reading was made and how often to expect the next, and the client works out what
that means now. A server that says "live" is stating something it cannot know by the time it arrives.

**Absence is stated per slot, and it names what is missing.** A stream with no source here keeps its
label and shows a hatched strip saying why. A model that has not run says what it is waiting for. An
area no source covers is hatched on the map with a note saying what *is* shown instead. And a query
the current view cannot fully serve gets that same note rather than an error — "showing M 4.5+
worldwide; smaller earthquakes appear only where a local network reports them" is a fact about
coverage, and drawing it as a failure teaches people to dismiss it.

Two components carry all of this: `StreamRow` and `CoverageNote`. The design references a reference
card at `guidelines/data-honesty.html`, which lives in the design-system project and is **not in this
bundle**.

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

* Real 3D terrain: MapLibre's own terrain, deck.gl's `TerrainLayer`, or CesiumJS. DESIGN-0002 chose
  MapLibre and called terrain scenery rather than data; the handoff suggests the other two. Adding
  either is a second rendering stack and needs its own record.
* The world view is global, and Noma's sources are regional. Coverage hatching and a note are the
  design's answer, and the honest version of it needs a per-source polygon rather than a whole-view
  wash — which Noma already has (domain model, point 21), and has never drawn.
* Where does a stream's expected cadence live? A property of the datastream, of the source, or
  computed from the readings already held? The first two can be wrong and say so; the third is right
  by construction and cannot tell you a feed that has *never* arrived is late.
* The activity index has no formula. It is drawn as a number out of 100 with a *calculated* tag,
  which means Noma is standing behind it, and nothing yet says what it is.
