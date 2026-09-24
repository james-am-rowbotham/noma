import { useCallback, useState } from 'react'
import type { Earthquakes } from './api'
/* biome-ignore lint/suspicious/noShadowRestrictedNames: the component is deliberately called
   Map — the map IS the interface (CLAUDE.md, "map first"), and MapLibre names its own class
   Map as well. Nothing in this file touches the Map collection. */
import { Map } from './map/Map'
import './App.css'

// The whole interface: a map, and one quiet line saying where what you are looking at came from.
// No dashboard, no sidebar, no layer list (CLAUDE.md, UX principles).

export default function App() {
  const [state, setState] = useState<Earthquakes | null>(null)
  const onLoad = useCallback((data: Earthquakes) => setState(data), [])

  const count = state?.features.length ?? 0
  const unreported = state?.features.filter(
    (f) => (f.properties?.magnitude as { uncertainty: number | null } | null)?.uncertainty == null,
  ).length

  return (
    <main className="noma">
      <Map onLoad={onLoad} />
      {state && (
        <footer className="noma-provenance">
          <span>
            {count} {count === 1 ? 'earthquake' : 'earthquakes'}
          </span>
          {/* Uncertainty is always shown, including when it was NOT reported — because 3.9 alone
              looks exactly as precise as 3.9 ± 0.0 (CLAUDE.md). Said quietly, never louder than
              the values themselves. */}
          {unreported ? <span>{unreported} without a reported ±</span> : null}
          {state.attribution.map((a) => (
            <span key={a.source} title={a.name}>
              {a.source.toUpperCase()} · {a.licence}
            </span>
          ))}
        </footer>
      )}
    </main>
  )
}
