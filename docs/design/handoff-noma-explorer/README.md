# Handoff: Noma Explorer

## Overview
Noma is an interface for exploring complex physical systems. Volcanology is the first domain; earthquakes, glaciers, wildfires, storms and oceans may follow. The core loop is **look at a place → ask a question → the map answers → ask again**.

This package specifies the explorer, which has two views sharing one persistent chat:

1. **World view.** A world map of active volcanoes and earthquakes. One "spotlight" card cycles through featured systems on the map itself. Questions filter and re-frame the map.
2. **Detail view.** You reach it by clicking any event; the map zooms into that system. It shows terrain, the live plume and wind, nearby towns and forests, live data streams, local conditions, model overlays and a timeline. Clicking features on the terrain or in panels offers contextual questions.

### Product principles (must hold in implementation)
- **The map is the interface.** Chrome is sparse, translucent and foldable.
- **No dashboards, no modes.** The same surface adapts to the question.
- **Natural language is a compact layer.** There is one input, and a conversation grows out of it on demand. There is never a permanent chat sidebar.
- **Questions manipulate the world.** Answers change the map: filters, zoom, overlays, time.
- **Evidence is always shown.** Every answer and stream carries an evidence classification. Sources are one click away.
- **Uncertainty is drawn, not disclaimed.** Use opacity ramps, dashed boundaries, and alternatives at lower opacity.
- **Don't expose the data architecture.** No "layers", "datasets", "APIs" or "WMS" in the UI.

## About the design files
The files in this bundle are **design references built in HTML/React (in-browser Babel)**. They show intended look and behaviour; they are not production code. Recreate them in the target codebase using its own patterns. If starting fresh, a sensible choice is:
- React + TypeScript
- **MapLibre GL / deck.gl** for the world map
- **CesiumJS** or deck.gl TerrainLayer for 3D detail terrain

To run the prototype, serve the bundle root over HTTP, for example `npx serve .`, and open `/prototype/index.html`. It loads world geometry from jsDelivr.

## Fidelity
- **High-fidelity:** chrome, glass surfaces, typography, colour, spacing, component styling, interaction flows, copy.
- **Illustrative:**
  - The world map is a flat d3 Natural Earth projection.
  - The detail terrain is one reference image (`assets/imagery/terrain-reference.png`) with overlays positioned in screen percentages. In production, overlays must be georeferenced (lat/lon/elevation).
  - All data values are samples (`prototype/data.js`).
  - NL understanding is keyword routing.

---

## Global layout & persistent concepts
Four things are always present: **where am I** (the place pill), **what am I looking at** (the map and overlays), **what time** (Now / the timeline), and **what can I ask** (the chat).

| Region | World view | Detail view |
|---|---|---|
| Top-left | Place pill: wordmark · "Earth" · "NOW · 06:41 UTC" · theme toggle | Place pill: "← Earth" · name · region · theme toggle · status badge |
| Top-centre | Filter pill (only when a filter is active) | — |
| Left column | — (map is full-bleed) | Data streams, Local conditions (top 72, width 340; 300 when vw < 1100) |
| Right column | — | Models & overlays, then Time (top 16, width 340/300) |
| On map | Spotlight card anchored to the selected marker | Clickable towns, forests, vent; "Ask about…" menus |
| Bottom-centre | Chat dock (max 620 wide), spanning the space between the side insets | Chat dock between the columns; full width when vw < 1100 |

Insets and margins are 16px. Glass panels in a column have a 10px gap.

---

## Surfaces: smoked glass
Every surface over the map is glass, in two classes:
- `.nm-glass` remaps semantic tokens (`--text-*`, `--ink-*`, `--line-*`, `--surface-*`) to the `--glass-*` content tokens.
- `.nm-glass-surface` applies:
  - `background: var(--glass-bg)`
  - `backdrop-filter: var(--glass-blur)`, which is `blur(22px) saturate(1.6)`
  - `border: 1px solid var(--glass-border)`
  - `box-shadow: var(--glass-shadow)`

Radius is `--glass-radius` 12px for panels and 999 for pills.

| Token | Dark (default) | Light (`[data-theme="light"]`) |
|---|---|---|
| `--glass-bg` | rgba(18,23,28,.44) | rgba(250,250,248,.58) |
| `--glass-bg-strong` (expanded chat) | rgba(18,23,28,.66) | rgba(250,250,248,.82) |
| `--glass-border` | rgba(255,255,255,.13) | rgba(255,255,255,.75) |
| `--glass-shadow` | 0 10px 36px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.09) | 0 10px 36px rgba(20,30,40,.14), inset 0 1px 0 rgba(255,255,255,.85) |
| `--glass-hover` | rgba(255,255,255,.08) | rgba(0,0,0,.06) |
| `--glass-bubble` (user message) | rgba(255,255,255,.13) | rgba(0,0,0,.06) |
| `--glass-text-body` / `-muted` / `-faint` | #EEF1F4 / #BAC3CB / #8D99A4 | #1C1B18 / #4A4843 / #7A766C |
| `--glass-line-1` / `-2` | rgba(255,255,255,.12) / .24 | rgba(0,0,0,.09) / .18 |

**Theme:**
- Set `data-theme="light"` or `"dark"` on `<html>` and persist it (the prototype uses `localStorage['noma-theme']`).
- The toggle is a 26px round button in the place pill (☀ in dark, ☾ in light).
- Overlays drawn on detail terrain imagery stay light-on-dark in both themes because the imagery is dark.

---

## View 1: World view

### Map
- Projection: Natural Earth 1, `fitExtent([[16,72],[vw-24,vh-40]], Sphere)`.
- Page `--map-page` (dark #0F1317 / light #DADFE3).
- Sphere fill `--map-ground`, stroke `--map-line`.
- Land fill `--map-ground-2`, stroke `--map-land-stroke`, 0.6px.
- Graticule (10°) `--map-grat`.
- Background earthquakes: circles r = M×0.9, `rgba(var(--overlay-rgb),.2)`. They brighten to .5 when the answer is about earthquakes.
- **Markers:**
  - Volcano: a triangle `M0,-6 L6,4 L-6,4Z`. Non-featured volcanoes are smaller (`M0,-4 L4,3 L-4,3Z`) at 0.45 opacity.
  - Earthquake: a circle, r 4.5.
  - Stroke is 1px in `--map-page`.
  - Hit radius 14.
  - Status colours: alert `#E0442F`, caution `#D9A02A`, neutral `--map-mark`, quiet `#7D8893`, ok `#5FA36F`.
- **Selected marker:** a pulsing ring (r 6→22, fading to 0, 1.8s, repeating). It has no text label, because the spotlight card names it.
- **Filtered-in labels:** Geist Mono 10.5px uppercase with 0.06em tracking, 10px right of the marker. They are placed greedily so they don't collide (≥90px apart horizontally or ≥16px vertically), with the selected item first and then by activity. The rest stay unlabelled.
- **Interactions:**
  - Hovering a marker spotlights it.
  - Clicking a marker zooms into its detail view.
  - Clicking empty map clears the filter.

### Spotlight card (replaces any list panel)
- Glass, width 290, with a 600ms ease-out transition on left/top as it moves between markers.
- **Contents, top to bottom:**
  1. An optional 64px image strip (only when the system has imagery and there's room).
  2. Header row: 8px status dot, name (16/600, ellipsis), status as an instrument label.
  3. Headline, 13px muted, line-height 1.4.
  4. Live sparkline (width−28 × 22), with the label "{STREAM} · LIVE" and the unit.
  5. Pager row: ‹ / "1 / 5" / › / ❚❚▶ as 24px round buttons, then a dark sm "Explore →" button.
  6. Two question links, "↳ Why is {name} {status}?" and "↳ Show volcanoes like {name}", 13px muted, turning to body colour on hover.
- **Placement:**
  - Candidate positions: marker right +22, marker left −22−W, and centred; each with top at y−44, above, below, the top bound (72) and the bottom bound.
  - Score each candidate by how many *other* current-set markers it covers, counting each marker's box as [x−8, x+110] × [y−8, y+8] (the marker plus its label). Break ties by distance to the marker.
  - Never cover the selected marker itself.
  - Clamp to the viewport and to above the chat dock (bottom reserve = measured dock height + 24).
- **Degradation:** when vertical room is short, drop the image first, then the stream.
- **Leader line:** when the card sits more than 26px from the marker, a 1px dashed line (`2 3`, `rgba(233,237,241,.45)`) runs from the marker to the nearest card edge.
- **Auto-cycle:** advances every 7000ms through the current set (the featured set, or the filter results). Any manual interaction pauses it.

### Queries & the filter view
Questions asked in the world view produce a **filter view**:
- A filter pill appears at the top centre: glass pill with "FILTER", the label (14/500), the count, and a 26px round ×.
- The map zooms to fit the result set in the free area, with scale clamped between 0.5 and 3.2. The free area is between the left edge and the right edge, below the top chrome and above the measured chat dock. Markers and strokes are counter-scaled so they keep their screen size.
- Items outside the set fade to 0.12 opacity.
- The spotlight card cycles through the results.
- The answer is added to the chat.
- To clear the filter, press **×**, **Esc**, or click empty map.

Prototype routing:

| Query contains | Filter | Evidence |
|---|---|---|
| a system name + "like/similar" | That system plus others of the same kind sharing a tectonic tag | retrieved |
| a system name + "last year/compare" | That system | historical |
| a system name | That system; the answer title is its headline | observed |
| atlantic / ridge / rift | Mid-Atlantic Ridge set; also draws the ridge line (dashed 1.5px `rgba(var(--overlay-rgb),.45)`) | retrieved |
| most active / active | Top 6 volcanoes by 7-day activity index | calculated |
| ring of fire / pacific | Ring-of-Fire tag | observed |
| erupt | Status matches erupting, fountaining, Strombolian or explosive | observed |
| earthquake / quake | Earthquake events, with background dots highlighted | observed |
| anything else | Featured set: "Notable right now" | observed |

### Enter transition (world → detail)
- The world `<g>` animates to the event at scale 7 (`transform 800ms cubic-bezier(.2,0,0,1)`) while fading to 0.2 opacity.
- The overlay UI fades out over 400ms and the spotlight hides.
- At 750ms the detail view mounts with `opacity 0→1, scale 1.04→1` over 700ms.

---

## View 2: Detail view

### Terrain & overlays (back to front)
1. **Terrain.** Full-bleed imagery; production should use real 3D terrain.
2. **Protection gradient.** `linear-gradient(180deg, rgba(15,19,23,.4), transparent 16%, transparent 78%, rgba(15,19,23,.5))`.
3. **Live plume.** Shown only when the timeline is at Now. 6 blurred puffs (70px, radial grey, blur 6px) rise from the vent along the wind direction. Loop 6.6s, staggered 1.1s, ending at scale 2.6 and opacity 0.
4. **Wind field.** 14 "→" glyphs at `rgba(233,237,241,.35)`, rotated to the direction the wind blows toward.
5. **Ash forecast** (on request or via toggle). A radial footprint from the vent along the wind (+14°), white falling from 0.55 to 0 opacity. The fade expresses forecast uncertainty.
6. **Lava paths** (toggle). Three dashed (`4 3`) curves in #E0442F. The primary is 2.5px at 0.95 opacity; the alternatives are 1.5px at 0.6.
7. **Earthquakes** (on request). Rings with a 1.5px border in #E9EDF1, fill `rgba(233,237,241,.2)`, diameter = M×8.
8. **Towns** (default on; clickable). A 9px dot (square for cities) in #F6F4EF with a 2px #161B20 border. Next to it, a small glass plate: name at 13px, then the instrument label "{dist} {bearing} · {pop}".
9. **Forests** (clickable). A dashed 1px outline `rgba(143,190,128,.8)`, fill `rgba(62,124,79,.22)`, radius 40%, labelled in #CFE3C4.
10. **Vent label** (clickable). "▲ ACTIVE VENT", mono, with a text shadow.

### Place pill (top-left)
- Glass pill, padding `6px 16px 6px 6px`, `box-sizing: border-box`, max-width `calc(100% − RW − 48px)`, overflow hidden.
- Contents:
  - Secondary sm Button "← Earth" (pill-shaped)
  - Name (17/600)
  - Region (14, muted, ellipsis, min-width 0)
  - ThemeToggle
  - Badge with the status, or "Historical" when the timeline is in the past
- Every child except the region is `flex:none`.

### Left column: Data streams, Local conditions
All are **Panels**: foldable glass, header = mono uppercase title + meta + ▾ chevron.
- **Data streams.**
  - Meta "● Live" (#5FA36F), or "Paused".
  - Each row:
    - Label (14/500, ellipsis) with the value in mono 13 (nowrap, no shrink) and the unit in 11 faint.
    - A live sparkline, width RW−30 × 24.
    - EvidenceTag (or *historical* when in the past) and the trend.
  - **Rows are clickable** and open an Ask menu.
  - Sample streams: volcanic tremor, SO₂ flux, summit uplift, thermal anomaly.
- **Local conditions.** Meta is the wind summary. A 2-column grid of Wind / Temperature / Cloud / Visibility (instrument label over mono 13), plus EvidenceTag *forecast*.

### Right column: Models & overlays, Time
- **Models & overlays.** Meta "{n} running". Rows show the name (14) and "{state} · {detail}" (12, faint), each with a Switch. The switches are Ash dispersion → forecast footprint, Lava flow paths → paths, and Towns & forests → places.
- **Time** (open by default).
  - Meta "● Now" or the date.
  - The track is 2px `--line-1`, filled `--ink-3` up to the playhead.
  - Month labels (Oct, Dec, Feb…; every second month) are mono 10.
  - Event marks: major ones are 10px #E0442F, minor ones 7px `--ink-3`, each with a 2px #1D242B border. Clicking a mark jumps to it.
  - Playhead: a 2px ink line with a 12px knob. Drag anywhere on the track to scrub.
  - "Return to now" (sm secondary) appears when in the past.
  - The range is 1 Oct 2025 → 25 Sep 2026. Anything above 0.97 counts as Now.
  - Past positions pause streams, set stream evidence to *historical*, set the badge to "Historical", and hide the live plume.

On viewports narrower than 1100px, both columns end at the measured chat-dock height + 26 so they never sit under an expanded chat.

### Ask menus (click-to-ask)
- **Triggers:** clicking a town, forest, the vent or a data-stream row.
- **Popover:** glass, width 280, placed at the click point +12 and clamped to the viewport. Header "ASK ABOUT {THING}", then 2–3 question buttons (14px, radius 6, hover `--glass-hover`). Picking one asks it; Esc or clicking outside closes the menu.
- **Questions:**
  - Town: "Will ash reach {town}?", "How exposed is {town}?", "Who lives nearby?"
  - Forest: "Is {forest} at risk?", "Where would lava flow?"
  - Vent: "Where is the plume going?", "Where would lava flow?", "Show me the earthquakes". Systems without local data get only the plume question plus "Why is {stream} rising?".
  - Stream: "Why is {stream} {trend}?", "Show {stream} over the last year"

### Detail routing (prototype)

| Query | Effect | Evidence |
|---|---|---|
| a stream name + "over the last year / history" | Opens the timeline | historical |
| a stream name + "why" | Explanation only | inferred |
| a town name + "reach / exposed / ash / risk" | Forecast footprint + places | forecast |
| "at risk" + forest words | Lava paths + places | modelled |
| plume / wind / ash / smoke | Forecast footprint | forecast |
| earthquake / quake / seism | Earthquakes overlay | observed |
| city / town / near / who / forest | Places | retrieved |
| lava / flow | Lava paths | modelled |
| before / history / last year / past | Timeline jumps to the last major episode (t 0.52) | historical |
| otherwise | Headline and summary | observed |

Systems without local data answer "Not available yet for {name}" to place, earthquake, lava and history questions.

---

## Chat dock (shared by both views)
- **Position:** bottom 16, centred between the view's insets (world: 16/16; detail: RW+32 on each side, or 16/16 when vw < 1100). Max-width 620.
- **Collapsed:** a glass pill (radius 28) containing the input.
- **Expanded:** a glass panel (radius 12, `--glass-bg-strong`) whose **conversation grows upward** from the input.
- The dock reports its height through a ResizeObserver so the other layouts can avoid it.
- **Input** (QueryBar, embedded):
  - A 15px text field and a 32px round submit button (`--ink-1` fill, `--paper-1` arrow).
  - While empty, the placeholder **rotates through example questions every 3.8s**: "Try: {question}   ⇥". **Tab** fills in the one shown.
  - There are no chip rows, which saves vertical space.
  - When a conversation exists and is hidden, a trailing count button ("{n} ▲") reopens it.
  - **Previous chats button:** a 28px round button with a three-line list glyph sits directly left of send and is always visible. It opens a glass popover (width 320, `--glass-bg-strong`, anchored bottom-right above the dock):
    - Header: "PREVIOUS CHATS" and a "New chat" link.
    - The current chat is shown first with a highlighted background, its first question and "Current · {n} questions".
    - Then saved chats, each with a title (14/500, ellipsis) and "{place} · {n} questions · {date}" in mono 11 faint.
    - Selecting one saves the current chat to the list first, loads the selected thread, expands the conversation and restores the map state of its last answer, switching view if needed.
    - Esc or clicking outside closes it.
    - New (in the header or popover) also saves the current chat to the list before clearing.
- **Header** (expanded): the context line (mono 11, faint, ellipsis), e.g. "Etna · Now · Ash forecast · Towns", then text buttons Share · New · Hide ▾.
- **Messages:** oldest first, newest at the bottom, auto-scrolling to the latest. Max height `min(420px, 100vh − 220px)`, with a 18px gap between messages.
  - **User:** a right-aligned bubble, max 80% width, `--glass-bubble` background, radius `16 16 4 16`, padding `7px 12px`, 14px.
  - **Answer:** left-aligned, no bubble, max 92% width. Title 15/600 (line-height 1.35), body 14 muted (line-height 1.5).
  - **Footer row:**
    - EvidenceTag
    - "{n} sources ▾", which expands the points ("— …") and the sources (name + EvidenceTag)
    - "Show on map", or "● On map" (#5FA36F) for the message currently reflected on the map
- **Behaviour:**
  - Asking always expands the conversation.
  - Every answer stores the map state that produced it: the world filter query, or the detail event plus overlay and time state. "Show on map" restores it, switching views if needed.
  - Opening or leaving a detail view clears the "On map" marker.
  - Share copies a link to the current state (prototype: shows a toast).
  - New clears the thread.
  - The thread persists across world ↔ detail navigation.

---

## State model
- **App:** `openEvent`, `thread[]`, `history[]` (`{id, title, place, date, thread[]}`; seeded with 3 samples in the prototype), `chatOpen`, `ctx[]` (context chips reported by the active view), `restore` (`{view, state, eventId, nonce}`), `currentId`, `dockHeight`, `theme`.
  - A `thread[]` item is `{id, q, view, eventId?, state, ctx, time, answer:{title, body, ev, points?, sources?:[{n,k}]}}`.
- **WorldView:** `sel`, `auto`, `filter` (`{q, label, title?, items[], summary, ev, ridge?, quakes?}`), `zoom`, `size`, `land`.
- **DetailView:** `o = {plume, quakes, places, lava, t, timeOpen}` and `menu`.
- **Production data contracts:**
  - An active-events feed: id, kind, name, region, lat/lon, status and tone, activity index, tags, headline, summary, primary stream.
  - Per-system detail: streams (time series with evidence type and provenance), weather/wind, places (population, distance, bearing), land cover, model runs (state and outputs as geo layers), and an episode history.
  - Saved chats: list, load and save by user, storing each thread with its per-answer map state.
  - An NL endpoint: `ask(question, context) → {answer, evidence, sources, mapOps}`. `mapOps` is filter, fit, overlays on/off, or time jump. The context is the current view, place, time, active overlays and the thread.

## Motion
- Easing is `cubic-bezier(.2,0,0,1)`.
- 120ms for micro-interactions, 220ms for panels, 600ms for spotlight moves, 800ms for the map zoom.
- There are no bounces or springs.
- The entrance keyframes animate `transform`. **Never put them on an element centred with `translateX(-50%)`**, because the animation overrides the centring.

## Design tokens
All tokens are in `tokens/`:
- `colors.css` (ink, paper, lines, accent, map, status, evidence)
- `typography.css`
- `spacing.css`
- `effects.css`
- `glass.css`
- `theme-light.css`

The key values:

**Type:**
- `--font-sans` Geist (400/500/600) and `--font-mono` Geist Mono, both loaded from Google Fonts. These are substitutes; no brand fonts exist.
- Scale: 12/13/15/17/21/28/40.
- **Instrument label:** mono 10–11px, uppercase, letter-spacing 0.08em, faint colour.

**Spacing:** 4/8/12/16/24/32/48/64. **Radii:** 3/6/10/12 (glass)/999.

**Colours:**
- Ink: #1C1B18 / #55524B / #8B867B
- Paper: #F6F4EF / #FFF / #ECE9E1
- Accent (stone): #6E6A60
- Status: ok #3E7C4F, caution #A8770F, alert #BE3120. The map markers use the brighter versions listed above.

**Evidence** (7px dot + mono uppercase label):

| Kind | Colour |
|---|---|
| observed | #3E7C4F |
| historical | #75685B |
| retrieved | #4E6E82 |
| calculated | #5E6A46 |
| modelled | #3A6EA5 |
| simulated | #6E6A60 |
| inferred | #8B867B |
| forecast | #A8770F |

## Components
Full source and prop types are in `reference/components-source.md`.
- **Panel** (foldable glass).
- **QueryBar** (glass pill; `embedded`, `examples` for the rotating placeholder, `leading`/`trailing`, `placement`).
- **EvidenceTag**.
- **Card** (`floating` = glass).
- **Badge**, **Button** (primary/secondary/ghost/dark; sm/md/lg; radius 6), **IconButton**, **Switch**, **Tabs**, **Toast**, **Dialog**, **Tooltip**, **TimeStrip**, **ScenarioCard**.
- **Prototype-only:** Spotlight, ChatDock/Message, AskMenu, Timeline, ThemeToggle, Spark. These are defined in the `prototype/*.jsx` files.

## Assets
- `assets/imagery/terrain-reference.png`: the user-supplied look reference for terrain (dark relief, warm rim light, grid ground). It is **not** real Etna topography.
- World geometry: `world-atlas@2.0.2/countries-110m.json` (Natural Earth, public domain).
- Mid-Atlantic Ridge polyline: approximate, in `data.js`. Replace it with a real plate-boundary dataset such as PB2002.
- Icons are Unicode glyphs in the prototype (▲ ● → ‹ › ❚❚ ▶ ← ☀ ☾ ⇥). Use Lucide (1.5px stroke) in production.
- There is no logo; the wordmark is "noma" in the sans at 600, letter-spacing −0.02em.

## Files
- `prototype/index.html`: App shell, theme bootstrap, state, keyframes
- `prototype/world-view.jsx`: world map, markers, spotlight, filter parsing
- `prototype/detail-view.jsx`: terrain overlays, panels, timeline, ask menus, detail routing
- `prototype/chat.jsx`: ChatDock, Message, AskMenu, answer sources (`WORLD_EXTRA`, `DETAIL_EXTRA`)
- `prototype/streams.jsx`: live sparkline hook, ThemeToggle, label style
- `prototype/data.js`: sample events, Etna detail data, ridge line
- `prototype/image-slot.js`: prototype-only image placeholder
- `styles.css`, `tokens/`: design tokens (link `styles.css`)
- `_ds_bundle.js`: compiled design-system components the prototype loads
- `reference/components-source.md`: component source and types

## Known gaps / next steps
- Replace the image and percentage overlays with georeferenced 3D terrain.
- Only Etna has full local data; the other systems need places, land cover, models and history.
- Simulations (question-first "what if the column reaches 8 km?") are deliberately **removed from this phase**. ScenarioCard exists in the design system for later.
- Evidence inspection (a provenance detail view) is not yet designed beyond the source list.
- Implement context carry-over in NL ("only the deeper ones", "compare with last year") using `ctx` + `thread`.
- Keyboard: Esc clears filters and closes menus, Tab accepts the example question. Full focus order and screen-reader labelling still need specifying.
