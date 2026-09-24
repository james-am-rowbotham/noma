import type { Feature, FeatureCollection } from 'geojson'
import type { Map as MapLibreMap } from 'maplibre-gl'

// The line a section is taken along, drawn on the map so the chart and the map say the same thing.

export const PROFILE_SOURCE = 'profile'

export function addProfileLayers(map: MapLibreMap): void {
  map.addSource(PROFILE_SOURCE, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  })
  map.addLayer({
    id: 'profile-corridor',
    type: 'fill',
    source: PROFILE_SOURCE,
    filter: ['==', ['geometry-type'], 'Polygon'],
    paint: { 'fill-color': '#111', 'fill-opacity': 0.06 },
  })
  map.addLayer({
    id: 'profile-line',
    type: 'line',
    source: PROFILE_SOURCE,
    filter: ['==', ['geometry-type'], 'LineString'],
    paint: { 'line-color': '#111', 'line-width': 1.5, 'line-dasharray': [3, 2] },
  })
  map.addLayer({
    id: 'profile-ends',
    type: 'circle',
    source: PROFILE_SOURCE,
    filter: ['==', ['geometry-type'], 'Point'],
    paint: {
      'circle-radius': 4,
      'circle-color': '#fff',
      'circle-stroke-color': '#111',
      'circle-stroke-width': 1.5,
    },
  })
}

/** The line, its end points, and the corridor either side — so what the chart included is visible
 *  on the map rather than being a number in a caption. */
export function setProfile(
  map: MapLibreMap,
  from: [number, number] | null,
  to: [number, number] | null,
  widthMetres: number,
): void {
  const source = map.getSource(PROFILE_SOURCE)
  if (!source || !('setData' in source)) return
  const features: Feature[] = []

  for (const end of [from, to]) {
    if (end)
      features.push({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: end },
      })
  }
  if (from && to) {
    features.push({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: [from, to] },
    })
    features.push(corridor(from, to, widthMetres))
  }
  ;(source as { setData: (d: FeatureCollection) => void }).setData({
    type: 'FeatureCollection',
    features,
  })
}

/** A rectangle either side of the line. Drawn in degrees, which is a small distortion at a
 *  volcano's scale — the chart's own corridor test is done properly in metres by PostGIS. */
function corridor(from: [number, number], to: [number, number], widthMetres: number): Feature {
  const midLat = ((from[1] + to[1]) / 2) * (Math.PI / 180)
  const dLat = widthMetres / 111_000
  const dLon = widthMetres / (111_000 * Math.max(Math.cos(midLat), 0.01))

  const [ax, ay] = from
  const [bx, by] = to
  const len = Math.hypot(bx - ax, by - ay) || 1
  // Perpendicular to the line, scaled separately in each axis so it stays a corridor rather than
  // a lozenge away from the equator.
  const nx = (-(by - ay) / len) * dLon
  const ny = ((bx - ax) / len) * dLat

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [ax + nx, ay + ny],
          [bx + nx, by + ny],
          [bx - nx, by - ny],
          [ax - nx, ay - ny],
          [ax + nx, ay + ny],
        ],
      ],
    },
  }
}
