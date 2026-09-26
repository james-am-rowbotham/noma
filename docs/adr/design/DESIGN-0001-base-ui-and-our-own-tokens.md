---
id: DESIGN-0001
title: Base UI for behaviour, and the look is ours
type: design
status: accepted
date: 2026-09-18
amended-by: DESIGN-0003
---

# DESIGN-0001: Base UI for behaviour, and the look is ours

## Context

Noma's interface is a map with a small amount of chrome floating over it. CLAUDE.md asks for "a
mature accessible React component library for common primitives" and forbids a second one without
a record. James asked for "something new and beautiful".

Those pull in different directions only if the library is where the beauty comes from. There are
two kinds of library. A **styled kit** ships a look; the look is someone else's, and it is built for
pages of forms, not for translucent controls over a WebGL canvas. A **headless** library ships
behaviour only — focus trapping, keyboard navigation, screen-reader roles, positioning — and no
appearance at all.

What Noma needs is short: an ask bar (a text input that offers suggestions — a *combobox*), popover,
tooltip, dialog, drawer, a slider with two thumbs for a time window, toast, tabs, scroll area. The
hard part of every one of those is behaviour, not paint.

## Decision

Use **Base UI** (`@base-ui/react`) for primitives. It is headless. Everything visible — colour,
type, spacing, radius, motion, the way provenance classes are told apart — comes from Noma's own
design tokens, which are a later record.

Domain components (an observation card, a provenance badge, the time scrubber) are built on these
primitives and never reach past them to a second library.

Two setup lines Base UI requires, so they are not rediscovered as bugs: the app root gets
`isolation: isolate` (popups stack above the page without z-index fights — this matters over a map
canvas), and `body { position: relative }` for backdrops on iOS 26+ Safari.

**Not decided here:** how styles are written (Tailwind, CSS Modules, plain CSS — Base UI takes any),
and the tokens themselves.

## Alternatives considered

**Radix Primitives.** The established option, and still publishing, so not rejected on maintenance. Rejected because it ships **no combobox, no autocomplete and no
drawer** (see Evidence). The ask bar is Noma's central control; on Radix it would need a second
library beside it (cmdk, downshift), which is the exact thing CLAUDE.md forbids. Base UI is from
people who built Radix and covers the gap in one package.

**React Aria Components (Adobe).** The most rigorous accessibility of the set, strong sliders and
date/time fields, published the day this was written. The runner-up, and the one to revisit if Base
UI's slider or combobox falls short for the time scrubber or the ask bar. Lost on weight: a larger
API with its own conventions for styling and state (render props, its own press/hover events), for
an interface that needs about nine primitives.

**Ark UI.** Headless, actively published, state-machine based. Not rejected on a defect; nothing it
offers over Base UI for this list, and a smaller pool of prior art to lean on.

**A styled kit (Mantine, MUI, HeroUI, Chakra).** Rejected because the look arrives with the
behaviour. Floating map chrome means overriding most of it, and every override is a fight with the
next upgrade.

**shadcn/ui.** Not a library but copied-in component source, now available on top of Base UI. Not
rejected forever: it is a way of *starting* token work, and can be adopted later without changing
this decision. Not the starting point because its default look is the most recognisable one on the
web, which is the opposite of the brief.

## Evidence

Registry state on 2026-09-18, `npm view <pkg> version time.modified` (`time.modified` is the last
change to the registry entry, in practice the last publish):

```
=== @base-ui-components/react ===
version = '1.0.0-rc.0'
time.modified = '2026-07-15T15:29:00.457Z'
=== @base-ui/react ===
version = '1.8.0'
time.modified = '2026-09-04T08:52:52.307Z'
=== react-aria-components ===
version = '1.21.1'
time.modified = '2026-09-18T09:09:35.253Z'
=== radix-ui ===
version = '1.6.7'
time.modified = '2026-07-31T15:50:52.213Z'
=== @ark-ui/react ===
version = '5.39.2'
time.modified = '2026-09-13T21:24:01.440Z'
```

**Three things have been called "Base UI", and two of them are dead.** This is where "isn't Base UI
unmaintained?" comes from — it was asked while this record was being written. `npm view <pkg>
version deprecated`, 2026-09-18:

```
@mui/base                   5.0.0-beta.70   deprecated = 'This package has been replaced by @base-ui/react'
@base-ui-components/react   1.0.0-rc.0      deprecated = 'Package was renamed to @base-ui/react'
@base-ui/react              1.8.0           (not deprecated)
```

The old names still install, with only a deprecation warning. Install `@base-ui/react`.

The live one, `npm view @base-ui/react time`:

```
"1.2.0": "2026-02-12T15:52:50.650Z",
"1.3.0": "2026-03-12T13:40:01.766Z",
"1.4.0": "2026-04-13T07:22:06.252Z",
"1.4.1": "2026-04-20T12:24:35.520Z",
"1.5.0": "2026-05-19T13:22:48.843Z",
"1.6.0": "2026-06-18T12:04:15.326Z",
"1.7.0": "2026-08-04T09:55:20.089Z",
"1.8.0": "2026-09-04T08:52:51.986Z"
```

GitHub `mui/base-ui`, 2026-09-18: `archived: false`, `pushed_at: 2026-09-18T15:21:14Z`, 10,930
stars, 445 open issues and pull requests. Commits since 2026-08-19: at least 100 (the query caps at
100).

Base UI releases (base-ui.com/react/overview/releases): v1.0.0 stable 2025-12-11; v1.6.0
2026-06-18; v1.7.0 2026-08-04; v1.8.0 2026-09-04. Drawer: preview in v1.2.0 (2026-02-12), stable in
v1.3.0 (2026-03-12).

Base UI components, from its documentation on 2026-09-18:

```
Accordion, Alert Dialog, Autocomplete, Avatar, Button, Checkbox, Checkbox Group, Collapsible,
Combobox, Context Menu, Dialog, Drawer, Field, Fieldset, Form, Input, Menu, Menubar, Meter,
Navigation Menu, Number Field, OTP Field, Popover, Preview Card, Progress, Radio Group, Scroll Area,
Select, Separator, Slider, Switch, Tabs, Toast, Toggle, Toggle Group, Toolbar, Tooltip
```

Slider, from its documentation: `value` accepts `number | number[]`; "To create a range slider: Pass
an array of values and place a `<Slider.Thumb>` for each value in the array"; `minStepsBetweenValues`;
`thumbCollisionBehavior` of `push`, `swap` or `none`.

Radix, the primitives `radix-ui@1.6.7` depends on (`npm view radix-ui@1.6.7 dependencies`), helper
packages removed:

```
form menu tabs label toast avatar dialog select slider switch toggle menubar popover toolbar tooltip
checkbox progress accordion separator hover-card collapsible radio-group scroll-area alert-dialog
aspect-ratio context-menu toggle-group dropdown-menu navigation-menu password-toggle-field
one-time-password-field
```

No combobox, autocomplete or drawer.

## Consequences

Beauty is now our job. Nothing will look good by default, and there is no design to copy — the
tokens record is the next design decision and it carries real weight.

Accessibility behaviour is inherited rather than hand-built, which is what CLAUDE.md asked for.

Base UI reached 1.0 nine months before this was written. That is young for "mature", and the risk
that follows from it is **churn, not abandonment** — a library this new is still settling its API,
so expect breaking changes between minor versions. Abandonment is the less likely failure: Base UI
is MUI's flagship next-generation product rather than a side project, with 8 releases in 9 months
and 100+ commits in the 30 days before this record.

The mitigation is that it is headless: our components wrap its primitives, so replacing it means
rewriting the insides of about nine wrappers, not restyling an application. **That mitigation is
only real if the discipline holds — nothing outside those wrappers imports Base UI directly.** If
that rule erodes, this record's risk assessment is void.

Revisit if: the two-thumb slider cannot carry the time scrubber, the combobox cannot carry the ask
bar, or releases stop.

## References

- Base UI — https://base-ui.com/ · releases https://base-ui.com/react/overview/releases ·
  setup https://base-ui.com/react/overview/quick-start · slider https://base-ui.com/react/components/slider
- React Aria Components — https://react-spectrum.adobe.com/react-aria/
- Radix Primitives — https://www.radix-ui.com/primitives
- Ark UI — https://ark-ui.com/
