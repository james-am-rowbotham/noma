import type { OnProfile, Section as SectionData } from '../api'

// A VERTICAL SLICE THROUGH THE VOLCANO: distance along the line across, depth down.
//
// This is what volcano seismologists actually read, and it is the one view whose entire vertical
// axis is depth — the worst-constrained of an earthquake's three coordinates.
//
// SO THIS CHART HAS TO BE HONEST ABOUT DEPTH ABOVE ALL ELSE:
//
//   - Where the agency stated a depth uncertainty, it is drawn as a whisker.
//   - Where it did NOT, no whisker is invented. The dot is drawn hollow, and the caption says how
//     many are hollow and why. On a real section across Etna's summit that was 35 out of 35 — a
//     plain filled dot would have claimed a precision not one of those records asserted.
//
// Depth is positive DOWNWARD, so the vertical axis runs downward and sea level is at the top.

const PADDING = { top: 14, right: 16, bottom: 14, left: 52 }

/** Magnitude is logarithmic, so circle AREA follows it — the same rule as the map. */
function radius(magnitude: number | null | undefined): number {
  if (magnitude == null) return 2
  return Math.max(2, Math.sqrt(Math.max(magnitude, 0) + 0.5) * 2.6)
}

/** Shallow to deep, matching the map so a dot means the same thing in both views. */
function depthColour(metres: number): string {
  const stops: [number, string][] = [
    [0, '#f6c85f'],
    [5000, '#ef8a62'],
    [15000, '#9e4f8d'],
    [40000, '#3b2c63'],
  ]
  for (let i = 1; i < stops.length; i++) {
    const [d1, c1] = stops[i - 1]
    const [d2, c2] = stops[i]
    if (metres <= d2) return metres - d1 < (d2 - d1) / 2 ? c1 : c2
  }
  return stops[stops.length - 1][1]
}

export function Section({
  data,
  width = 1600,
  height = 300,
}: {
  data: SectionData
  width?: number
  height?: number
}) {
  const points = data.earthquakes.filter((q) => q.depthMetres != null)
  const inner = {
    w: width - PADDING.left - PADDING.right,
    h: height - PADDING.top - PADDING.bottom,
  }

  const maxAlong = data.profile.lengthMetres
  // The deepest point, or 10 km, whichever is greater — so a shallow swarm is not stretched to
  // fill the chart and made to look deep.
  const maxDepth = Math.max(
    10_000,
    ...points.map((q) => (q.depthMetres as { value: number }).value),
  )

  const x = (m: number) => PADDING.left + (m / maxAlong) * inner.w
  const y = (m: number) => PADDING.top + (m / maxDepth) * inner.h

  const withoutUncertainty = points.filter((q) => q.depthMetres?.uncertainty == null).length

  return (
    <figure className="noma-section">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label="Earthquake depths along the section"
      >
        <title>Depth against distance along the section</title>

        {/* Sea level: a datum, not a claim about anything. */}
        <line
          x1={PADDING.left}
          x2={width - PADDING.right}
          y1={y(0)}
          y2={y(0)}
          className="noma-section-datum"
        />
        <text x={PADDING.left - 6} y={y(0) + 3} className="noma-section-tick">
          0
        </text>

        {[0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line
              x1={PADDING.left}
              x2={width - PADDING.right}
              y1={y(maxDepth * f)}
              y2={y(maxDepth * f)}
              className="noma-section-grid"
            />
            <text x={PADDING.left - 6} y={y(maxDepth * f) + 3} className="noma-section-tick">
              {Math.round((maxDepth * f) / 1000)}
            </text>
          </g>
        ))}

        {points.map((q) => (
          <Earthquake key={q.id + q.time} q={q} x={x} y={y} />
        ))}
      </svg>

      {/* The axis labels are HTML, not SVG text: inside the scaled viewBox they drifted below
          the chart's own box and were clipped. As HTML they sit where the layout puts them,
          and a screen reader reads them as text. */}
      <div className="noma-section-axes">
        <span>0 km</span>
        <span>{(maxAlong / 1000).toFixed(1)} km along</span>
      </div>

      <figcaption className="noma-section-caption">
        <span>
          {points.length} {points.length === 1 ? 'earthquake' : 'earthquakes'} within{' '}
          {(data.profile.widthMetres / 1000).toFixed(0)} km of the line
        </span>
        <span>depth in km, positive downward</span>
        {/* Uncertainty always shown, including when it was not reported (CLAUDE.md). */}
        {withoutUncertainty > 0 && (
          <span>
            {withoutUncertainty} of {points.length} state no depth uncertainty — drawn hollow, with
            no whisker invented for them
          </span>
        )}
        {data.attribution.map((a) => (
          <span key={a.source} title={a.name}>
            {a.source.toUpperCase()} · {a.licence}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

function Earthquake({
  q,
  x,
  y,
}: {
  q: OnProfile
  x: (m: number) => number
  y: (m: number) => number
}) {
  const depth = q.depthMetres as { value: number; uncertainty: number | null }
  const cx = x(q.alongMetres)
  const cy = y(depth.value)
  const r = radius(q.magnitude?.value)
  const stated = depth.uncertainty != null

  return (
    <g>
      {stated && (
        // The whisker is the stated uncertainty, drawn to scale — never a default length.
        <line
          x1={cx}
          x2={cx}
          y1={y(depth.value - (depth.uncertainty as number))}
          y2={y(depth.value + (depth.uncertainty as number))}
          className="noma-section-whisker"
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={stated ? depthColour(depth.value) : 'none'}
        stroke={depthColour(depth.value)}
        strokeWidth={stated ? 0.5 : 1.4}
        strokeDasharray={q.automatic ? '2 2' : undefined}
        opacity={0.9}
      >
        <title>
          {`M${q.magnitude?.value ?? '?'} ${q.magnitude?.scale ?? ''} · ${(depth.value / 1000).toFixed(1)} km deep` +
            (stated
              ? ` ± ${((depth.uncertainty as number) / 1000).toFixed(1)} km`
              : ' · depth uncertainty not stated') +
            ` · ${q.agency ?? q.source} · ${q.time.slice(0, 16)}`}
        </title>
      </circle>
    </g>
  )
}
