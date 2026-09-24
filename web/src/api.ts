// Noma's backend. Types here are hand-written ONLY until the generator is wired: ADR-0003 says the
// browser's types come from the backend's OpenAPI description and are never copied by hand.
// TODO: generate from http://localhost:8000/openapi.json and delete these.

import type { FeatureCollection } from 'geojson'

export interface Quantity {
  value: number
  uncertainty: number | null
}

export interface MagnitudeValue extends Quantity {
  /** "ML", "Mw", "Md"… Scales are NOT interchangeable, so it always travels with the number. */
  scale: string | null
}

export interface EarthquakeProperties {
  time: string
  magnitude: MagnitudeValue | null
  /** Positive DOWNWARD, and negative is real on a volcano's flank. */
  depthMetres: (Quantity & { positive: 'down' }) | null
  place: string | null
  eventType: string | null
  source: string
  provenance: string
  agency: string | null
  retrievedAt: string
  producedAt: string | null
  reviewed: string | null
  automatic: boolean | null
  originID: string
  magnitudeID: string | null
}

export interface Attribution {
  source: string
  name: string
  licence: string
}

export interface Earthquakes extends FeatureCollection {
  attribution: Attribution[]
  noma: {
    fetched: boolean
    coverage: string
    /** Which sources were consulted — always, not only those that had something. An empty result
     *  says nothing about the ground until you know who was asked. */
    asked: string[]
  }
}

const BASE = import.meta.env.VITE_API ?? 'http://localhost:8000'

export async function fetchEarthquakes(
  bounds: [number, number, number, number],
  options: { start?: Date; end?: Date; minMagnitude?: number; signal?: AbortSignal } = {},
): Promise<Earthquakes> {
  const params = new URLSearchParams({ bbox: bounds.join(',') })
  if (options.start) params.set('start', options.start.toISOString())
  if (options.end) params.set('end', options.end.toISOString())
  if (options.minMagnitude !== undefined) params.set('minMagnitude', String(options.minMagnitude))

  const response = await fetch(`${BASE}/earthquakes?${params}`, { signal: options.signal })
  if (!response.ok) {
    // Never swallowed into an empty map: "no earthquakes here" and "the request failed" look
    // identical on screen and mean opposite things.
    throw new Error(`${response.status}: ${(await response.text()).slice(0, 200)}`)
  }
  return response.json()
}
