import { layers, namedFlavor } from '@protomaps/basemaps'
import type { StyleSpecification } from 'maplibre-gl'

// THE BASEMAP. A Protomaps PMTiles file: one file, read over HTTP range requests, served from
// public/tiles (run ./scripts/tiles.sh to cut it). No API key, no account, no per-view cost, and
// the style is ours to rewrite — which DESIGN-0001 requires, since the look is our job.
//
// OpenStreetMap data under ODbL. ATTRIBUTION IS A LICENCE CONDITION, not decoration: it is set on
// the source below so it cannot be lost by restyling.

export const BASEMAP_ATTRIBUTION =
  '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'

// Tilezen terrain on AWS Open Data: global, no key, zoom 15. MapLibre decodes the "terrarium"
// encoding natively (since 0.43.0), so no plugin.
//
// TERRAIN IS VISUALISATION ONLY, and that is a Noma rule rather than a preference. These tiles are
// a composite of DEMs of different ages and resolutions — a pixel over Etna cannot say whether it
// came from SRTM at 30 m or a national survey — so a height sampled from them has no honest
// provenance. Nothing read from this may ever become an OBSERVED or CALCULATED record; a real
// elevation needs a named source DEM behind it.
export const TERRAIN_TILES =
  'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
export const TERRAIN_ATTRIBUTION =
  '<a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md">Tilezen Joerd</a>'

export function basemapStyle(pmtilesUrl: string): StyleSpecification {
  return {
    version: 8,
    // Protomaps' own glyphs and sprites; swapping these is part of owning the look.
    glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
    sprite: 'https://protomaps.github.io/basemaps-assets/sprites/v4/light',
    sources: {
      basemap: {
        type: 'vector',
        url: `pmtiles://${pmtilesUrl}`,
        attribution: BASEMAP_ATTRIBUTION,
      },
      terrain: {
        type: 'raster-dem',
        tiles: [TERRAIN_TILES],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 15,
        attribution: TERRAIN_ATTRIBUTION,
      },
    },
    layers: layers('basemap', namedFlavor('light'), { lang: 'en' }),
  }
}
