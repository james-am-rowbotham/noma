# Rendering the subsurface: what exists, and what does not

Checked 2026-09-24. This is a snapshot of what can honestly be drawn beneath a volcano, and it is
mostly a record of absences — which is why it is worth keeping.

## The finding that decides everything

**The global crustal models do not know Etna is there.**

| Model | Grid | One cell at Etna (37.75°N) |
|---|---|---|
| CRUST1.0, LITHO1.0 | 1° | **111 km × 88 km** |
| GEMMA, EPcrust | 0.5° | 44 km |
| Etna's whole edifice | | **~40 km across** |

The volcano fits inside about a quarter of one CRUST1.0 cell. "The Moho under Etna" from these
models is the Moho under eastern Sicily and part of the Ionian Sea, bilinearly interpolated. It is
not a coarse answer about Etna; it is an answer about somewhere much larger that happens to contain
Etna.

Drawing a crisp shaded sheet from that data would state a boundary the data does not resolve within
100 km horizontally. **If a Moho is ever shown, the grid cell's footprint should be visible** — the
value being flat across the entire volcano is itself the honest statement.

Of the global set, **Szwillus et al. 2019** (doi:10.1029/2018JB016593) is the most usable here for
one reason: it publishes uncertainty (<4 km in Europe and North America, ≥10 km where data is
sparse). CRUST1.0 and LITHO1.0 publish none per cell.

## The fine-scale model for Etna exists, and cannot be obtained

Totaro et al. 2024 (*Scientific Reports* 14:28469, doi:10.1038/s41598-024-74349-w) inverted ~4,600
earthquakes from 1997–2022 for a 3D velocity model of Etna, 0–25 km depth, on INGV's own network.
Its data availability statement, verbatim:

> "Earthquake data are available on the INGV institutional website (http://www.ingv.it). The LOTOS
> code can be downloaded from http://www.ivan-art.com/science/LOTOS. … Data not available on these
> websites can be provided by the corresponding author on reasonable request."

The velocity grid is deposited nowhere. The same is true of Lo Bue et al. 2024
(doi:10.1029/2024GL108733) and Zhang et al. 2026 (doi:10.1029/2025GC012831).

**No downloadable, licensed 3D velocity model for Etna was found.** So the honest fine-scale layer
has no source, and the answer is to draw nothing there until one exists — or to ask the authors.

## The lithosphere–asthenosphere boundary is not a surface

Definitions disagree by more than 100 km at the same place:

- **Thermal**: the ~1300 °C isotherm, inside a gradual conductive-to-convective transition.
- **Seismic**: a velocity drop, which under cratons appears at 60–120 km while the thermal and
  petrological boundary is 200–400 km.
- **Rheological**: where viscosity falls below ~10²¹ Pa·s.

Sources: Fischer et al. 2010, *Annu. Rev. Earth Planet. Sci.* 38:551–575
(doi:10.1146/annurev-earth-040809-152438); Rychert et al. 2020 (doi:10.1029/2018JB016463).

It is a definition-dependent zone, not a horizon. Drawing it as a solid sheet would invent a
boundary the science does not agree exists at one depth.

## MapLibre cannot show the subsurface well

- **Terrain occludes everything below it.** Terrain writes to the depth buffer, and a custom layer
  with `renderingMode: '3d'` shares it. Correct, and useless.
- **There is no translucent terrain.** `map.setTerrain()` takes `TerrainSpecification | null`.
- The escapes are all bad: drop terrain entirely for an "underground" mode; use `renderingMode:
  '2d'` and lose occlusion; or reach for `painter.getDepthModeForSublayer`, which is internal.
- **CesiumJS has first-class subsurface support** (`scene.globe.translucency`, underground camera).
  That is a genuine fork in the road if full 3D subsurface ever becomes central.

What MapLibre *does* support: `MercatorCoordinate.fromLngLat()` takes an altitude in metres and
**accepts negative values**, so hypocentres can be placed below sea level. `CustomLayerInterface` in
v6 gives `onAdd(map, gl: WebGL2RenderingContext)`, `render`, optional `prerender`, and a
`CustomRenderMethodInput` carrying `modelViewProjectionMatrix`, `nearZ`, `farZ`, `fov`,
`defaultProjectionData` and `getProjectionData`. There is an official three.js-on-terrain example.

**Globe projection breaks naive custom layers** — a plain matrix will not bend onto the globe. Keep
any subsurface view in Mercator.

**Do not use a wrapper library.** `threebox` targets Mapbox; `threelibre` advertises MapLibre 4.1.3
and claims no v5/v6, terrain or globe support. The official example is ~100 lines.

## Prior art separates the map from the 3D view

**Concord Consortium's Seismic Explorer** (MIT, github.com/concord-consortium/seismic-explorer) is
the closest: Leaflet for the 2D map, three.js for a *separate* rotatable 3D box. You draw a
cross-section line on the map, then open the 3D view. The separation looks deliberate.

Also: EarthScope/IRIS Interactive Earthquake Browser (plain WebGL, up to 5,000 events); LDEO's
double-difference viewer (three.js).

**No operational public 3D subsurface viewer from USGS/HVO, INGV or EMSC could be found.** HVO
publishes map views plus depth plots — not 3D.

## Cross-sections are what volcanologists actually read

Volcano-seismology papers universally pair a map view with vertical cross-sections: distance along
a profile against depth. The workhorse is GMT/PyGMT, whose `project` exists for exactly this.

**ObsPy does not do cross-sections.** `Catalog.plot()` offers only map projections with depth as
colour. A cross-section is our own arithmetic — project each hypocentre onto a profile azimuth,
plot distance against depth. numpy and pyproj in the backend.

## What Noma actually holds

Measured against the development database, 2026-09-24, 147 INGV origins around Etna:

```
origins: 147 | with depth: 147 | with DEPTH uncertainty: 64 | with horizontal uncertainty: 147
```

Every earthquake has a depth. **Fewer than half say how uncertain it is** — and depth is the
worst-constrained of the three coordinates. A plain dot at a depth asserts a precision that 83 of
these 147 records never claimed.

## Could not verify

Explicit licences for CRUST1.0 and LITHO1.0 (neither page states one; both ask that authors be
cited or contacted). The direct netCDF URL for LITHO1.0 at EarthScope EMC. Any downloadable Etna
velocity grid. Any public 3D subsurface viewer run by a volcano observatory.
