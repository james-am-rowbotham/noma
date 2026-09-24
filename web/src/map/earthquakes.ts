import type { FeatureCollection } from 'geojson'
import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl'

// EARTHQUAKES ON THE MAP.
//
// Circle size means MAGNITUDE and colour means DEPTH, because those are the two things a
// volcanologist reads first: how big, and how deep. Depth matters on a volcano — shallow swarms
// mean something different from deep ones.
//
// The API sends GeoJSON with NO third coordinate, deliberately: that slot means height above the
// ellipsoid, and depth downward there would mean the opposite. Depth arrives as a property.

export const EARTHQUAKES_SOURCE = 'earthquakes'

/** Magnitude is logarithmic, so circle AREA follows it rather than radius — a magnitude 4 really
 *  is far more than twice a magnitude 2, and a linear radius would flatten that. */
/* biome-ignore format: a MapLibre interpolate expression is a flat list of (input, output)
   pairs. One stop per line keeps each magnitude beside the radius it produces; the formatter
   would put all twelve elements on lines of their own and lose the pairing. */
const RADIUS: unknown[] = [
  'interpolate', ['linear'], ['coalesce', ['get', 'magnitudeValue'], 0],
  0, 2.5,
  2, 5,
  4, 11,
  6, 22,
]

/** Shallow to deep. Kept colour-blind safe: it runs light-to-dark as well as warm-to-cool, so it
 *  reads as an ordering even without hue. Depth is in METRES (positive down). */
/* biome-ignore format: as above — each depth in metres stays on the line with the colour it
   maps to. */
const DEPTH_COLOUR: unknown[] = [
  'interpolate', ['linear'], ['coalesce', ['get', 'depthMetres'], 0],
  0, '#f6c85f',
  5000, '#ef8a62',
  15000, '#9e4f8d',
  40000, '#3b2c63',
]

export function addEarthquakeLayers(map: MapLibreMap): void {
  map.addSource(EARTHQUAKES_SOURCE, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  })

  map.addLayer({
    id: 'earthquakes-circle',
    type: 'circle',
    source: EARTHQUAKES_SOURCE,
    paint: {
      'circle-radius': RADIUS as never,
      'circle-color': DEPTH_COLOUR as never,
      'circle-opacity': 0.85,
      'circle-stroke-width': 1,
      'circle-stroke-color': 'rgba(255,255,255,0.7)',
    },
  })

  // An UNREVIEWED account is drawn differently, not hidden: a dashed ring says "a machine placed
  // this and no person has checked it yet". Uncertainty shown, and shown quietly (CLAUDE.md).
  map.addLayer({
    id: 'earthquakes-unreviewed',
    type: 'circle',
    source: EARTHQUAKES_SOURCE,
    filter: ['==', ['get', 'automatic'], true],
    paint: {
      'circle-radius': RADIUS as never,
      'circle-color': 'rgba(0,0,0,0)',
      'circle-stroke-width': 1.5,
      'circle-stroke-color': '#111',
      'circle-stroke-opacity': 0.55,
    },
  })
}

/** The API's GeoJSON, flattened where MapLibre expressions need scalars: they cannot read into
 *  nested objects, so `magnitude.value` becomes `magnitudeValue`. The nested originals are kept,
 *  because a click needs the uncertainty and the scale that go with the number. */
export function setEarthquakes(map: MapLibreMap, collection: FeatureCollection): void {
  const source = map.getSource(EARTHQUAKES_SOURCE) as GeoJSONSource | undefined
  if (!source) return
  source.setData({
    ...collection,
    features: collection.features.map((f) => {
      const p = (f.properties ?? {}) as Record<string, unknown>
      const magnitude = p.magnitude as { value?: number } | null
      const depth = p.depthMetres as { value?: number } | null
      return {
        ...f,
        properties: {
          ...p,
          magnitudeValue: magnitude?.value ?? null,
          depthMetres: depth?.value ?? null,
        },
      }
    }),
  })
}
