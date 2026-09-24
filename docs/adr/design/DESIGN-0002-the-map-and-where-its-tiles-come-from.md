---
id: DESIGN-0002
title: MapLibre with self-cut Protomaps tiles, and terrain that is scenery rather than data
type: design
status: accepted
date: 2026-09-23
pinned-by: web/scripts/tiles.sh
---

# DESIGN-0002: MapLibre with self-cut Protomaps tiles, and terrain that is scenery rather than data

## Context

`CLAUDE.md` says map first, and DESIGN-0001 put the whole visual design in Noma's hands. A map
library renders nothing without a source of tiles, so the tiles were the real decision: most
providers hand you a look you cannot fully change, an account key, and a bill per view.

Volcanoes also need terrain. A dot at 0.3 km depth on a mountain 3 km tall means nothing on a flat
map.

## Decision

**MapLibre GL JS**, used directly rather than through a React wrapper. The map *is* the interface,
almost everything it does is imperative, and one `useEffect` owns its whole life. `react-map-gl`
was the alternative and is well maintained; it would mostly be something to fight.

**Basemap: Protomaps PMTiles, cut by Noma and served by Noma.** `web/scripts/tiles.sh` extracts a
region from Protomaps' daily planet file — the planet is ~138 GB, but the extract reads only the
byte ranges it needs, so Etna is **12 MB in about ten seconds**. No account, no key, no per-view
cost. OpenStreetMap data under ODbL, so attribution is set on the source itself where restyling
cannot lose it.

The extracts are **generated, not committed**: binary, large, and stale as soon as OpenStreetMap
moves.

**Terrain: Tilezen terrain tiles on AWS Open Data**, `terrarium` encoding, which MapLibre decodes
natively. Global, no key, zoom 15.

**And terrain is scenery, not data.** Nothing sampled from these tiles may become an OBSERVED or
CALCULATED record. They are a composite of elevation models of different ages and resolutions — a
pixel over Etna cannot say whether it came from a 30 m global survey or a national one — so a height
read from them has no honest provenance and no uncertainty to attach. A real elevation needs a named
source model behind it. This is written at the top of `web/src/map/basemap.ts` because it is the
kind of rule that erodes quietly.

**Earthquakes are drawn by size and depth**: circle area follows magnitude, because magnitude is
logarithmic and a linear radius would flatten the difference between a 2 and a 4; colour follows
depth, because shallow and deep swarms mean different things on a volcano. An **unreviewed** account
gets a dashed ring rather than being hidden — uncertainty shown, and shown quietly.

## Alternatives considered

**OpenFreeMap.** No key, no limits, commercial use allowed, and zero setup. The best *prototype*
choice. Rejected as a dependency: it is one person's donation-funded server with no service
guarantee, and its tiles use a different schema, so building Noma's styling against it and moving
later would mean redoing that styling.

**MapTiler, Stadia, Jawg.** All need an account and a key, and all three restrict their free tiers
to non-commercial or evaluation use. CARTO changed terms *the day this was decided* — a key is now
required and unkeyed tiles get a watermark — which is itself the argument: a keyed provider can
change the deal, and self-cut files cannot be changed from outside.

**Protomaps' own hosted API.** Simpler, but needs a key and returns 403 without one.

**Building tiles from an OpenStreetMap extract** with planetiler or tilemaker. More control and more
work: a planet build is hours of compute and tens of gigabytes. The extract tool gives the same file
format with none of that, and the planet remains available later if it is ever wanted.

**MapTiler terrain-RGB** for terrain: a key, and zoom 12 against the free source's 15.

## Evidence

Measured 2026-09-23.

```
pmtiles extract https://build.protomaps.com/20260923.pmtiles etna.pmtiles \
  --bbox=14.7,37.4,15.4,38.0 --maxzoom=14

Region tiles 1621, result tile entries 1369
fetching 1369 tiles, 79 chunks, 40 requests
Completed in 11.236683958s with 4 download threads
Extract transferred 12 MB (overfetch 0.05) for an archive size of 12 MB
```

12 MB out of a 138 GB planet, in 11 seconds, over 50 requests.

Rendered in a headless browser against the live backend: the basemap draws, terrain renders in
relief when the camera is pitched, and 21 real INGV earthquakes appear with the attribution line
`INGV · CC-BY-4.0`. Panning fetched more and the count rose to 73 — demand-driven loading
(domain-model point 20) working through the map.

Two things had to be fixed to get there, both worth recording:

- **MapLibre 6 is ESM-only and no longer finds its own worker under a bundler.** Without
  `setWorkerUrl`, it fails with "Worker failed to load" and no map appears.
- **The browser is a different origin from the API**, so the backend needed explicit CORS. Named
  origins from settings, never `*`.

## Consequences

A regional extract covers a region. Pan beyond Etna and the basemap simply stops — visible as grey.
Widening the box or cutting more regions is a line in `tiles.sh`; the planet file is the same format
if it is ever wanted whole.

Noma now owns tile operations: regenerating extracts as OpenStreetMap moves, and — once these are
served from object storage rather than a dev server — CORS, cache headers, and the fact that every
range request is a billed GET on some providers.

The terrain source's maintaining code has not been touched since 2021. The data is live and the tiles
are small, so the mitigation if it disappears is to mirror the ones Noma cares about.

The styling in place is Protomaps' default light flavour. It is a placeholder, not a design: the
tokens DESIGN-0001 calls for are not written yet.

## References

- Protomaps PMTiles — https://docs.protomaps.com/pmtiles/cli
- Tilezen terrain tiles — https://registry.opendata.aws/terrain-tiles/ · attribution:
  https://github.com/tilezen/joerd/blob/master/docs/attribution.md
- MapLibre GL JS — https://maplibre.org/maplibre-gl-js/docs/
