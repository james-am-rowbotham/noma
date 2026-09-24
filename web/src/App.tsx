import { useCallback, useEffect, useState } from 'react'
import { type Earthquakes, fetchSection, type Section as SectionData } from './api'
/* biome-ignore lint/suspicious/noShadowRestrictedNames: the component is deliberately called Map —
   the map IS the interface (CLAUDE.md, "map first"). MapLibre's own Map class is imported under an
   alias wherever both are needed. */
import { Map, type Profile } from './map/Map'
import { Section } from './section/Section'
import './App.css'

// The whole interface: a map, one quiet line saying where what you are looking at came from, and
// one thing you can ask for — a slice through the volcano. No dashboard, no sidebar, no layer list
// (CLAUDE.md, UX principles), and an obvious way back to the plain map.

const SECTION_WIDTH_M = 5000

export default function App() {
  const [state, setState] = useState<Earthquakes | null>(null)
  const [drawing, setDrawing] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [section, setSection] = useState<SectionData | null>(null)
  const [sectionError, setSectionError] = useState<string | null>(null)

  const onLoad = useCallback((data: Earthquakes) => setState(data), [])
  const onProfile = useCallback((p: Profile | null) => {
    setProfile(p)
    setDrawing(false)
  }, [])

  useEffect(() => {
    if (!profile) {
      setSection(null)
      return
    }
    const controller = new AbortController()
    fetchSection(profile.from, profile.to, {
      widthMetres: SECTION_WIDTH_M,
      signal: controller.signal,
    })
      .then((s) => {
        setSection(s)
        setSectionError(null)
      })
      .catch((e: Error) => {
        if (e.name === 'AbortError') return
        // Shown, never swallowed: an empty section and a failed request look identical.
        setSectionError(e.message)
      })
    return () => controller.abort()
  }, [profile])

  const count = state?.features.length ?? 0
  const unreported = state?.features.filter(
    (f) => (f.properties?.magnitude as { uncertainty: number | null } | null)?.uncertainty == null,
  ).length
  const asked = state?.noma.asked ?? []

  return (
    <main className="noma">
      <Map
        onLoad={onLoad}
        drawing={drawing}
        profile={profile}
        onProfile={onProfile}
        widthMetres={SECTION_WIDTH_M}
      />

      <div className="noma-ask">
        {drawing ? (
          <button type="button" onClick={() => setDrawing(false)}>
            Click two points on the map — or cancel
          </button>
        ) : section || profile ? (
          <button type="button" onClick={() => onProfile(null)}>
            Back to the map
          </button>
        ) : (
          <button type="button" onClick={() => setDrawing(true)}>
            Slice through it
          </button>
        )}
      </div>

      {sectionError && (
        <div className="noma-error">Could not build the section — {sectionError}</div>
      )}
      {section && (
        <div className="noma-section-panel">
          <Section data={section} />
        </div>
      )}

      {state && (
        <footer className="noma-provenance">
          <span>
            {count} {count === 1 ? 'earthquake' : 'earthquakes'}
          </span>
          {/* Uncertainty is always shown, including when it was NOT reported — because 3.9 alone
              looks exactly as precise as 3.9 ± 0.0 (CLAUDE.md). Said quietly, never louder than
              the values themselves. */}
          {unreported ? <span>{unreported} without a reported ±</span> : null}
          {/* Who was asked, whenever there is nothing to show: "nobody to ask" and "asked, and
              there were none" are different, and neither means the volcano is quiet. */}
          {count === 0 &&
            (asked.length === 0 ? (
              <span>no source covers this area — Noma has nobody to ask here</span>
            ) : (
              <span>none recorded by {asked.map((s) => s.toUpperCase()).join(', ')}</span>
            ))}
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
