# Handoff update 2 — monitoring

Received as text on 2026-09-28. **Kept verbatim below**; nothing here has been assimilated yet.

## What this note depends on and does not contain

It amends a first monitoring note that has not arrived, and refers to it seven times. Missing, and
needed before this can become a spec:

* **`Verdict`** — the type and its full set of values. This note implies Risk, No risk and Paused.
* **`Monitor`** — the object. `key` and `label` appear here; the schedule, `notify` (`change` or
  `every`), quiet hours, the paused flag and the per-monitor "Show on map" state do not.
* **The setup flow** — what you choose when you press Monitor. The question, the threshold, the
  cadence. This is the centre of the feature and none of it is here.
* **`MonitorButton`** and **`MonitorRow`** — the component specs, in their glass, pill and icon-only
  variants, and the bell path the map badge reuses.
* **The Panel change** — "44px high when closed (see the Panel change in the first note)".
* **The entry points** — the monitor items in the stream, town and vent click menus.
* **What Jev is**, and what each check is given.
* The files it says are updated: `monitor.card.html`, `readme.md`, and
  `components/noma/AlertRow.{jsx,d.ts,prompt.md}`.

The bundle in `../handoff-noma-explorer/` is the 2026-09-28 version and contains **no** monitoring
content, so this note cannot be read against it.

---

## The note, verbatim

Noma: handoff update 2 (after the monitoring note)

### 1. Featured is removed

Delete every trace of "featured": the featured flag in the data, the Featured button in the chat bar,
the Featured list, and the default selected volcano.

On load, the world map shows every marker at full strength (all 6px triangles) and no card is open.

The fallback answer "Notable right now" now filters to a fixed set of ids: etna, kilauea, sakurajima,
reykjanes, kamchatka.

### 2. Filter bar (replaces the Featured and filter chip in the chat bar)

Shown only while a question has filtered the map.

Position:

- Viewport ≥ 1100px: top 16, centred horizontally, max width viewport − 780px.
- Narrower: top 72, left 16, max width viewport − 32px.
- zIndex 7.

Style: a glass pill 44px high, `padding: 0 6px 0 16px`, gap 10.

Contents, left to right:

- "FILTER" in mono caps, faint.
- The filter label (15px, weight 600, truncates; the original question is its tooltip).
- A results toggle, a 28px outline pill reading "6 volcanoes ▾". The noun is volcano, earthquake or
  system depending on what's in the set, pluralised correctly.
- A Monitor bell, for region filters only (Mid-Atlantic Ridge, Pacific Ring of Fire).
- A 32px round × clear button.

Results list: drops down below the bar, centred, 340 wide, max height min(380, viewport − dock −
140). Each row shows the tone dot, name, status and region, with an icon-only MonitorButton on the
right. It closes on a click outside or Esc.

Clicking a result selects it and opens its card.

Esc clears the card first, then the filter.

The "Showing M 4.5+ worldwide" coverage note moves to top 72 on wide screens and top 124 on narrow
ones.

When a filter is showing on a narrow screen, map cards start at 124 rather than 72, so the bar never
covers a card.

### 3. Hover previews are removed

There is no hover behaviour on map markers, result rows or monitor rows. Only a click opens a card.
Remove the hover state, its timers and the card's preview styling.

### 4. Monitor button placement (final)

Detail view: a MonitorButton at top 16, right 68, next to Settings. It shows for every event,
earthquakes included, and is styled as glass: 44px high, `padding: 0 16px 0 14px`, 14px text, with
the glass background, blur, border and shadow. It's no longer inside the name pill, which keeps its
original `padding: 6px 16px 6px 6px`, with max width `calc(100% − 240px)`.

- Inactive, it reads "Monitor" and opens setup.
- Active, it reads "Monitoring" with the verdict dot and opens the monitor for editing.
- Earthquake default question: "Is the <name> sequence escalating?"

Chat answer: use the MonitorButton component (28px pill), right-aligned (`margin-left: auto`) in the
answer's action row. It replaces the text link.

The click menus (stream, town, vent), the result rows and the region filter keep the entry points
from the first note.

The detail view does not show the Monitors panel.

### 5. World map badges for monitored events

Draw the badge inside each monitored marker's group, which is counter-scaled so it stays the same
size at every zoom level.

- Offset (7, −11), `pointer-events: none`.
- A circle, r 6.5, filled with `--map-page` and stroked 1.5px in the verdict colour.
- Inside it, a bell (the same path as MonitorButton) scaled 0.333 and filled with the verdict colour.
- Colours: Risk #E0442F, No risk #5FA36F, Paused `--map-ink-2`.
- SVG title: "Monitoring · <verdict>".

This replaces the dashed ring.

### 6. Monitors panel: position and tabs

World view only: top 16, right 68 (next to Settings), width 300. It starts closed and is 44px high
when closed (see the Panel change in the first note).

Header meta: "● N new" when there are unread alerts; otherwise the risk and paused summary, or "All
clear".

The body has Tabs: Alerts | Monitoring. It opens on Alerts if anything is unread, otherwise on
Monitoring.

- Alerts: a list of AlertRows, newest first, with a "Mark all read" link on the right when anything
  is unread. Empty state: "No alerts yet. You'll see one here each time a monitor's verdict
  changes." Clicking an alert marks it read and runs the monitor's "Show on map".
- Monitoring: the MonitorRow list from the first note, with hover preview removed.

### 7. Alerts (in-app notifications)

```ts
interface Alert {
  id: string;
  key: string;              // Monitor.key
  label: string;
  from?: Verdict;           // omitted for "monitoring started"
  to: Verdict;
  time: string;             // "05:50" or "Yesterday 18:12"
  text: string;             // one-line reason
  read: boolean;
}
```

The prototype stores alerts in `localStorage['noma-alerts-v1']`.

When an alert is created:

- A monitor is created: `to` is the first verdict, with the text "Monitoring started. First check:
  <verdict>." A toast shows as well.
- Pause or resume: `from` is the old verdict and `to` the new one. Text: "Paused by you. No checks
  run until you resume." or "Resumed by you."

Production: each Jev check whose verdict differs from the previous one creates an alert (if `notify`
is `change`). With `notify` set to `every`, every check creates one. During quiet hours, alerts are
stored but no toast shows.

### 8. New design system component: AlertRow

`{label, from?, to, time, text?, unread?, onClick?}`

- A full-width button, 8px padding, rounded `--radius-2`, `--glass-hover` background on hover.
- A 7px unread dot on the left, filled with `--text-body` when unread, otherwise transparent.
- First line: the label (14px, weight 600 when unread, 500 when read, truncates) and the time in
  mono 11px faint on the right.
- Second line (12px): the verdict change, e.g. "No risk → Risk". Each verdict word is weight 600 in
  its colour (Risk #E0442F, No risk #5FA36F, Paused `--text-muted`); the arrow is faint.
- Third line: the text (13px, muted, line-height 1.4).

### Files touched in this round

- `WorldView.jsx`
  - Removed: FeaturedTrigger, FeaturedPopover and hover logic.
  - Added: FilterBar, ResultsPopover, RowMon, RegionMon, the marker badges and a `minT` prop on the
    map card.
- `DetailView.jsx`: the Monitor button moved to top right.
- `Investigation.jsx`: the chat answer uses MonitorButton.
- `Monitors.jsx`: alerts, tabs, seedAlerts, and the earthquake question.
- `index.html`: alerts state, pushAlert, markAll, openAlert.
- `data.js`: removed the featured flags.
- New files: `components/noma/AlertRow.{jsx,d.ts,prompt.md}`. `monitor.card.html` and `readme.md` are
  updated.
