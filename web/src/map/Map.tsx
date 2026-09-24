import * as maplibregl from 'maplibre-gl'
// MapLibre 6 is ESM-only and no longer finds its own background worker under a bundler: without
// this it fails with "Worker failed to load" and the map never appears. `?worker&url` asks Vite to
// bundle the worker as a separate file and hand back its URL.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { Protocol } from 'pmtiles'
import { useEffect, useRef, useState } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'

maplibregl.setWorkerUrl(workerUrl)

import { type Earthquakes, fetchEarthquakes } from '../api'
import { basemapStyle } from './basemap'
import { addEarthquakeLayers, setEarthquakes } from './earthquakes'

// MapLibre is used directly rather than through a React wrapper. The map IS the interface here
// (CLAUDE.md, "map first"), most of what it does is imperative, and a wrapper would mostly be
// something to fight. One useEffect owns the map's whole life.

// Where Noma opens. One basemap file covers every region in web/scripts/regions.geojson, so
// flying to another volcano needs no change here — only that its polygon is in that file.
const OPENS_AT: { center: [number, number]; zoom: number } = {
  center: [14.999, 37.751],
  zoom: 10.5,
}

/* biome-ignore lint/suspicious/noShadowRestrictedNames: named Map on purpose — the map IS the
   interface (CLAUDE.md, "map first"). Where MapLibre's own Map class is needed alongside it,
   it is imported under an alias, as earthquakes.ts does. */
export function Map({ onLoad }: { onLoad?: (state: Earthquakes) => void }) {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!container.current) return

    // Teaches MapLibre the pmtiles:// scheme — one file, read by HTTP range request.
    const protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)

    const m = new maplibregl.Map({
      container: container.current,
      style: basemapStyle(`${window.location.origin}/tiles/volcanoes.pmtiles`),
      ...OPENS_AT,
      maxPitch: 75,
      attributionControl: { compact: false },
    })
    map.current = m
    // Exposed for screenshot checks in development only; never in a production build.
    if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__nomaMap = m

    m.on('load', () => {
      // Terrain: visualisation only, never a measurement — see basemap.ts.
      m.setTerrain({ source: 'terrain', exaggeration: 1.4 })
      addEarthquakeLayers(m)
      void load()
    })

    let inFlight: AbortController | null = null
    async function load() {
      inFlight?.abort()
      const controller = new AbortController()
      inFlight = controller
      const b = m.getBounds()
      try {
        const data = await fetchEarthquakes(
          [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
          { signal: controller.signal },
        )
        setEarthquakes(m, data)
        setError(null)
        onLoad?.(data)
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
        // Shown, not swallowed: an empty map must never stand in for a failed request.
        setError((e as Error).message)
      }
    }

    m.on('moveend', () => void load())
    return () => {
      inFlight?.abort()
      m.remove()
      maplibregl.removeProtocol('pmtiles')
    }
  }, [onLoad])

  return (
    <>
      <div ref={container} style={{ position: 'absolute', inset: 0 }} />
      {error && <div className="noma-error">Could not load earthquakes — {error}</div>}
    </>
  )
}
