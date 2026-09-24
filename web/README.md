# web

Noma's browser client: Vite, React 19, TypeScript. Package manager is bun.

```sh
bun run dev      # dev server with HMR
bun run build    # tsc -b, then a production build into dist/
bun run preview  # serve the built dist/
bun run lint     # Biome: lint, formatting and import order, failing on any of them
bun run format   # Biome again, writing the fixes it can apply safely
```

The basemap needs `public/tiles/etna.pmtiles`, which is not in the repository because it is large
and goes stale. Run `./scripts/tiles.sh` to cut it.

## Linting and formatting

Both are [Biome](https://biomejs.dev), configured in `biome.json`: its recommended rules plus the
React domain, formatting to the house style already in `src/` (two spaces, single quotes, no
semicolons, 100 columns). `bun run lint` is what the repository's `bun run check` runs, so it has
to pass before anything lands.

Two suppressions are deliberate and carry their reason in a `biome-ignore` comment at the site:
the `Map` component shadows the global `Map`, and the MapLibre interpolate expressions in
`src/map/earthquakes.ts` are laid out by hand so each stop sits beside the value it produces.

## React Compiler

Not enabled: it costs dev and build time, and nothing here needs it yet. See
[the installation guide](https://react.dev/learn/react-compiler/installation) if that changes.
