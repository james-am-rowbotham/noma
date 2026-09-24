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
  const asked = state?.noma.asked ?? []

  return (
    <main className="noma">
      <Map onLoad={onLoad} />
      {state && (
        <footer className="noma-provenance">
          <span>
            {count} {count === 1 ? 'earthquake' : 'earthquakes'}
          </span>
          {/* WHO WAS ASKED, whenever there is nothing to show. Sakurajima is among the most active
              volcanoes on Earth, and Noma currently has no source for Japan — so a bare "0
              earthquakes" there would read as a claim about the volcano when it is a fact about
              Noma. "Nobody to ask" and "asked, and there were none" are different, and neither is
              "the volcano is quiet". */}
          {count === 0 &&
            (asked.length === 0 ? (
              <span>no source covers this area — Noma has nobody to ask here</span>
            ) : (
              <span>none recorded by {asked.map((s) => s.toUpperCase()).join(', ')}</span>
            ))}
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
