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
| Top-left | **Wordmark → location**, 8px gap: the "noma" wordmark pill · place pill ("Earth" · "NOW · 06:41 UTC") | Wordmark pill · place pill ("← Earth" · name · region; status lives in the Status panel) |
| Top-right corner | Settings button (44px round glass), top 16 / right 16 | Settings button, same position; right column starts below it at top 72 |
| Bottom-right corner | Map controls (horizontal) | — |
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

**Wordmark:** a separate glass pill, 44px high, padding 0 16, "noma" 18/600, letter-spacing −0.02em. It is always visible in both views and is never inside the location pill.

**Settings:**
- A separate 44px round glass button in the top-right corner (top 16 / right 16) of both views. In the detail view the right column starts below it at top 72.
- It opens a centred glass modal: width 440, `--glass-bg-strong`, backdrop `rgba(8,11,14,.35)`. The × button, Esc or clicking outside closes it.
- Rows are grouped under instrument-label headings. Each row is a title (14/500) with an optional faint sub-line, and a control on the right:
  - **Appearance**
    - Theme: Light / Dark (segmented)
    - Motion: Full / Reduced. Reduced sets `data-motion="reduced"`, which disables all animations and transitions.
    - Map labels (Switch): names beside markers in filter views
  - **Data display**
    - Time: UTC / Local, for timestamps and the timeline
    - Units: Metric / Imperial, for distances, heights and wind
- The segmented control is a pill track in `--glass-hover`; the selected segment is `--ink-1` with `--paper-1` text.
- Settings apply immediately and persist (`localStorage['noma-settings']`, with theme also in `noma-theme`).
- In the prototype, Theme, Motion, Map labels and Time (on the world pill) are wired up. Units is stored only.

**Theme:**
- Set `data-theme="light"` or `"dark"` on `<html>` and persist it (the prototype uses `localStorage['noma-theme']`).
- The theme is set from the Settings modal.
- Overlays drawn on detail terrain imagery stay light-on-dark in both themes because the imagery is dark.

---

## View 1: World view

### Map
- Projection: Natural Earth 1, `fitExtent([[8,24],[vw-8,vh-16]], Sphere)`. The globe fills the viewport and all chrome (wordmark, location, settings, featured list, chat) floats over it on glass. The default view reserves no space for panels; filter fits still keep results clear of the featured list and chat.
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
  - Clicking a marker opens its card; the card's Explore button zooms into the detail view.
  - Clicking empty map closes the card.

### Featured list (inside the chat bar)
The featured list is part of the chat input on the world view; there is no separate panel.
- **Trigger:** the input's leading element. It is a 28px pill with a 1px `--line-1` border, followed by a 1px divider before the text field.
  - Normally: a list glyph, "Featured" (13/500), the count in mono 11, and ▲.
  - With a filter: "FILTER", then the filter label (ellipsis, pill max-width 200), the count and ▲, plus a 24px round × that clears the filter.
- **Popover:** clicking the trigger opens a glass popover above the dock, anchored to its left edge. Width 320, `--glass-bg-strong`, max-height min(380, viewport − dock − 110), with the body scrolling.
  - Header: "FEATURED NOW" or "FILTER · {label}", the count, and "Clear" when filtered.
  - Rows: an 8px marker in the status colour, the name (14/500; 600 when selected) over the status (12 faint), and the region as a right-aligned instrument label.
  - Clicking a row switches the system card to that system and closes the popover. Clicking outside or pressing Esc also closes it.
- **Mounting:** in the prototype the world view portals the trigger and popover into slots the chat dock exposes (`#nm-dock-leading`, `#nm-dock-pop`). In production, pass them as the dock's `leading` and `popover` props per view.
- The detail view does not show the trigger.

### System card (opens on click)
- **Opening and closing:**
  - A card is always shown: the first featured system on load, the first result when a filter is applied. Clicking any marker or list row switches the card to that system; clicking the selected one again keeps it open.
  - The card's ×, Esc or clicking empty map dismisses it until the next selection. Esc closes the card first, then clears the filter.
  - Clearing a filter keeps the current card if that system is featured; otherwise it returns to the first featured system.
- **Hover preview:** hovering a marker (or a row in the featured popover) shows that system's card immediately. Leaving it returns to the selected system's card after 280ms; moving the pointer onto the card keeps the preview open so its buttons can be used. Clicking pins the system as the selection.
- **Navigation:** clicking a marker **does not** navigate. Navigation happens only through the card's Explore button.
- **Card:** glass, width 290, padding 16, with a 600ms ease-out transition when it repositions.
- **Contents, top to bottom:**
  1. An optional 64px image strip.
  2. The name (17/600, ellipsis) and a 22px round × close button. The region sits on its own line underneath as an instrument label, wrapping rather than truncating.
  3. Status line (margin-top 8): 8px tone dot + status (14/500).
  4. Headline (margin-top 6), 13px muted, line-height 1.45.
  5. **Stats** (margin-top 14, padding-top 12, 1px top divider, height 70): 2 columns, **Activity** "92 / 100" and **Trend**, each an instrument label + evidence dot, a value (15/500) and a sub-line (11, faint).
  6. **Source line** (margin-top 12): a *retrieved* evidence dot, then "Reported by {source} · 06:41 UTC" (11px faint, wraps).
  7. **Question links** (margin-top 12, 1px top divider, padding-top 8): "↳ Why is {name} {status}?" and "↳ Show volcanoes like {name}", 13px muted, turning to body colour on hover.
  8. **Explore** (margin-top 14): a full-width dark sm Button "Explore {name} →".
- **Evidence dots:** 7px, evidence colour with a 1.5px ring `rgba(255,255,255,.55)`. Status is *retrieved*, Activity is *calculated*, and Trend is *observed* (local stream) or *inferred* (estimated from status). The hover tooltip is portalled to the body (fixed position, #1C1B18 on #F6F4EF) and names the category, e.g. "Calculated — derived by Noma from observations".
- **Placement:**
  - Candidates are to the right of the marker, to the left of it, and centred on it; each at top y−44, above, below, the top bound or the bottom bound.
  - The score penalises covering other markers and their labels, then distance.
  - The card never covers its own marker, and it is clamped above the measured chat dock.
  - A dashed leader line runs from the marker to the nearest card edge when they're more than 26px apart.
- **Degradation:** the core is the name, status, headline, source and Explore. Optional sections are added while they fit, in priority order: stats (84), questions (80), image (64). If even the core doesn't fit, the card becomes a 46px pill: dot · name · status · Explore · ×.
- **Selected marker:** a pulsing ring (r 6→22, fading out, 1.8s).
- **Filter fit:** uses the full width between 16px insets, above the measured chat dock.

### Map navigation
- **Scroll or pinch** zooms around the pointer; **drag** pans (cursor grab/grabbing); **double-click** empty map zooms ×2 at the point.
- The zoom range is 1×–12× over the fitted view. Returning to 1× snaps the pan back to centre.
- A drag of 4px or more suppresses the click, so panning never closes the card or selects a marker.
- **Map controls:** a horizontal glass pill (height 44, radius 22) in the bottom-right corner (bottom 16 / right 16). It holds + / − / reset view (a globe icon) as 42×44 buttons with 1px × 20px dividers. − and reset are disabled at 1×. The world chat dock's right inset is 168 so it never meets the controls.
- Markers, labels and strokes are counter-scaled so they keep their screen size at any zoom. The system card and its leader line track the marker through pan and zoom.
- The transform eases over 260ms for buttons and double-click, and has no transition while dragging.
- Applying or clearing a filter resets the user zoom so the filter fit is visible.
- In production, use the map engine's native navigation (MapLibre NavigationControl or equivalent), styled as above.

### Queries & the filter view
Questions asked in the world view produce a **filter view**:
- The featured list switches to its filter state and lists the results; see *Featured list*.
- The map zooms to fit the result set in the free area, with scale clamped between 0.5 and 3.2. The free area is between the left edge and the right edge, below the top chrome and above the measured chat dock. Markers and strokes are counter-scaled so they keep their screen size.
- Items outside the set fade to 0.12 opacity.
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
  - No status badge; status is shown only in the Status panel.
- Every child except the region is `flex:none`.

### Left column: Status, Data streams, Local conditions
All are **Panels**: foldable glass, header = mono uppercase title + meta + ▾ chevron. **Only Status is open by default**; every other panel (Data streams, Local conditions, Models & overlays, Time) starts folded, showing just its header and meta summary.
- **Status** (open).
  - Meta "Now · 06:41 UTC", or "At {date}".
  - Main status: 9px tone dot + status (17/600), or "Historical view" in the past.
  - Headline (14/500) and summary (13 muted).
  - A 2×2 fact grid below a 1px divider, each an instrument label over a value (14/500) and a faint sub-line:
    - **Activity:** "92 / 100 · 7-day index"
    - **Trend:** the main stream's trend
    - **Nearest town:** name, then distance and bearing; "Not mapped" when there's no local data
    - **Data:** "Complete", "{n} of {m} degraded" or "Partial" in amber, with the degraded streams named, e.g. "SO₂ flux stale"
  - Footer: EvidenceTag and "Local + global sources" or "Global sources only".
- **Data streams** (see *Thin data* above for the row spec).
  - Meta is a state summary ("4 streams · 1 stale"), or "At {date}" in the past.
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

## Thin data: uncertainty, freshness, absence
Principle: the interface must tell the truth when data is thin. A broken feed must never look like a quiet volcano, and an empty map must never look like "nothing here".

### Uncertainty on every value
- **Where it goes:** directly after the value, in the same mono run: `3.2 ±0.4 cm ↗`. The ± is 11px faint.
- **Reported:** show `±{value}`, and draw an uncertainty band (fill `currentColor` at 0.14 opacity) around the sampled line.
- **Not reported:** show `±?` with a 1px dotted underline, tooltip "Uncertainty not reported by the source", and no band. **Never omit the slot.** A bare 3.9 reads as 3.9 ± 0.0.
- **Examples:** GNSS uplift carries ±. Most earthquake depths show `4.1 km ±?`.
- **Data contract:** every observation value carries `uncertainty: number | null`. `null` means "not reported" and is different from 0.

### Freshness against expected cadence
- **The plot's right edge is now.** It has a 1px `--line-2` tick. Samples sit at their true times, so if the last reading is older than the latest possible, a **dashed tail** (`2 3`, faint) runs from it to the now edge. A stopped feed is visible at a glance.
- **Cadence sets the drawing.** `continuous` (≤5-min feeds) is a 1.25px line and may animate. Discrete feeds (daily GNSS, twice-daily satellite passes, bulletins) are 1.8px dots joined by a 0.45-opacity line and **do not animate**.
- **State,** computed from age ÷ expected cadence:

| State | Rule | Dot | Row |
|---|---|---|---|
| fresh | ≤ 1.5× | filled #5FA36F | "{age} ago · {cadence}" (e.g. "9 h ago · daily") |
| late | ≤ 3× | hollow #D9A02A | "{age} ago · expected {cadence}" in amber |
| stale | > 3× | hollow faint | "No update for {age} · expected {cadence}"; value and plot muted |
| historical | timeline in the past | filled faint | "At selected time" |

- **"Live"** is only used for fresh continuous feeds ("Live · every 1 min").
- **Panel header:** summarises instead of claiming live, e.g. "4 streams · 1 stale · 2 no source". It turns amber when any stream is late or stale.
- **Span label:** each row states the span it plots ("6 h", "24 h", "7 d", "30 d").
- **Data contract:** every stream provides `expectedCadence`, `lastObservedAt`, and its samples with timestamps. The client computes the state; the server must never mark a stream "live".

### Per-slot absence
| Slot | Treatment |
|---|---|
| Stream with no source here | Label (muted), value "—", a 24px hatched strip (`repeating-linear-gradient(135deg, var(--line-2) 0 1px, transparent 1px 6px)`) with the reason, e.g. "No source for Kīlauea yet". Not clickable. |
| Stream with no recent data | **Stale**, not empty. Keep the last reading visible with its age. |
| Value without reported uncertainty | `±?` |
| Model not run | State in amber: "Not run · Last run 3 d ago · needs SO₂ feed". Switch disabled. |
| Model not available here | State faint: "Not available · No terrain model for {name}". Switch disabled. |
| Map area with no source | A diagonal hatch over the uncovered area (detail: `rgba(233,237,241,.10)` 1px lines, 9px pitch), plus a **CoverageNote** naming what's missing and what is shown instead: "No local observations for Kīlauea. Towns, forests and ground data aren't connected yet. Streams below come from global sources." |
| Query the zoom can't fully serve | A CoverageNote, **never an error bar**. It says what is shown and why: "Showing M 4.5+ worldwide. Smaller earthquakes appear only where a local network reports them." The optional action is "Zoom in". |

In production, coverage should be a per-source polygon, so hatching is exact geography, not a whole-view wash.

**Components:**
- **StreamRow** (`label, value, unit, uncertainty, trend, evidence, samples[{x,v,e?}], continuous, span, freshness{state,text}, empty, width`)
- **CoverageNote** (`title, detail, action, onAction`)

A reference card showing every state is at `guidelines/data-honesty.html` in the design-system project.

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
