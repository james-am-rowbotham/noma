# Design tokens

The visual language: colour, type, spacing, radius, shadow, motion, glass. Adopted in
[DESIGN-0003](../adr/design/DESIGN-0003-the-explorer-design-language.md); used by everything in
[explorer.md](explorer.md).

**The CSS files are the tokens.** They live in
[`handoff-noma-explorer/tokens/`](handoff-noma-explorer/tokens/) and are copied into the app rather
than transcribed, so there is exactly one place a value can be wrong. This document is the part CSS
cannot state: how the layers work, and the rules.

```
styles.css          imports all of the below, in this order
tokens/fonts.css    Geist + Geist Mono, from Google Fonts
tokens/colors.css   ink, paper, lines, accent, map, status, evidence, semantic aliases
tokens/typography.css
tokens/spacing.css  spacing 4→64, radii 3/6/10/12/999
tokens/effects.css  shadows, easing, durations
tokens/glass.css    the smoked-glass surface and its content colours
tokens/theme-light.css
```

## Three layers, and components only ever touch the third

1. **Raw scales** — `--ink-1..3`, `--paper-1..3`, `--line-1..2`, the type scale, the spacing scale.
2. **Domain colours** — `--map-*` for the canvas, `--ok/--caution/--alert` for status, `--ev-*` for
   the eight evidence tags.
3. **Semantic aliases** — `--text-body`, `--text-muted`, `--text-faint`, `--surface-*`,
   `--border-*`, `--focus-ring`.

A component that reaches past the semantic layer to a raw scale — or worse, to a hex value — breaks
both themes and the glass remap at once. That is the whole reason the layers exist.

## Glass, and why it needs two classes

Every surface floating over the map is glass, and glass inverts the content colours: light text on a
dark, blurred, saturated pane.

* `.nm-glass` **remaps** the semantic tokens onto the `--glass-*` content tokens. Anything inside it
  gets light-on-dark for free, without knowing it is on glass.
* `.nm-glass-surface` paints the pane itself: background, `backdrop-filter`, border, shadow.

A panel needs both. Only the remap, and the pane is invisible; only the pane, and the text inside it
stays ink-on-paper and disappears.

`--glass-bg-strong` is the same pane, less transparent, for the one surface that holds a lot of text:
the expanded conversation.

## Theme

`data-theme="light"` or `"dark"` on `<html>`, persisted. Dark is the default and the map canvas
changes with it, not only the chrome.

One exception, and it is deliberate: overlays drawn **on terrain imagery** stay light-on-dark in both
themes, because the imagery is dark in both. A light-theme rule applied there would make labels
vanish into the mountain.

## The instrument label

Mono, 10–11px, uppercase, `letter-spacing: 0.08em`, in the faint colour. It is the voice for
anything read off an instrument or a dataset — units, statuses, stream names, distances, dates,
counts. Sentence-case sans is for things written for a person to read; the instrument label is for
things a machine measured. Keeping them visibly different is how a reader can tell, at a glance,
which is which.

## Motion

Easing is `--ease-out` everywhere: `cubic-bezier(.2,0,0,1)`. 120ms for micro-interactions, 220ms for
panels, 600ms for the spotlight moving between markers, 800ms for the map zoom. **No bounces and no
springs** — this is an instrument, and instruments do not bounce.

One trap worth the line: the entrance keyframes animate `transform`, so they must never be put on an
element centred with `translateX(-50%)`. The animation overrides the centring and the element jumps
to the left.

**Reduced motion** is `data-motion="reduced"` on `<html>`, set from Settings, and it disables every
animation and transition rather than shortening them. It is a switch in the interface and not only a
reading of `prefers-reduced-motion`, because the person who needs it is not always on the machine
that declares it. One thing it must not disable: the dashed tail that says a feed has stopped, and
anything else whose job is to state a fact rather than to move.

## Fonts

Geist and Geist Mono, loaded from Google Fonts. They are **substitutes** — no brand fonts exist, and
nothing about the design depends on them beyond being a clean grotesque with a matching mono. A
self-hosted pair would remove the third-party request and the layout shift; not decided.
