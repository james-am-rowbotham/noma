# Noma

> **Look at a place. Ask a question. Explore what you discover.**

Noma is an interface for exploring complex physical systems. The map *is* the interface: you look
somewhere, ask something in plain language, and the map answers. Volcanology is the first domain —
Etna in particular — but nothing in the architecture assumes volcanoes.

**This is early.** A working prototype with a real database, real agency data and no product around
it yet. The interface is being rebuilt from a design that is further along than the code.

## What works today

- **Earthquakes** from INGV and USGS, fetched because somebody looked rather than on a schedule.
  Every version of every record is kept, so *what did we know at 10:25?* is a query.
- **Ground movement** from INGV's GNSS network, every reading with its own uncertainty.
- **Satellite thermal detections** from NASA FIRMS — the only live, open, numeric signal Etna has.
- **A vertical slice** through the volcano, with depth uncertainty drawn to scale where it was
  reported and marked absent where it was not.

## The rules it tries to keep

These are the point of the project more than any feature is.

- **Never invent a measurement.** No made-up observations, model outputs, citations or conclusions.
- **Every record knows where it came from** — the source, the moment it was fetched, the units, the
  method, and the untouched document it arrived in.
- **Uncertainty is always shown, including when nobody reported any.** `3.9` on its own looks
  exactly as precise as `3.9 ± 0.0`, so a value with no stated uncertainty says so.
- **A broken feed must never look like a quiet volcano.** An empty map is a statement; it has to be
  able to say whether anyone was asked.
- **Agencies disagree, and that is kept.** The same earthquake recorded by two networks stays two
  records, not an average.

## Running it

You need [Bun](https://bun.sh), [Docker](https://docker.com), [uv](https://docs.astral.sh/uv/) and
— for the basemap — [`pmtiles`](https://protomaps.com/docs/pmtiles).

```sh
bun install
bun run db:up          # PostgreSQL 18 + PostGIS in Docker, on port 5433
bun run db:migrate

cd web && ./scripts/tiles.sh && cd ..   # cuts a ~26 MB basemap from Protomaps' planet file

bun run api            # http://localhost:8000/docs
bun run web            # http://localhost:5173
```

`bun run check` runs everything: the decision-record and spec checks, then the backend's format,
lint, strict type check and tests. The tests need the database up.

## Where the thinking lives

The code is the smaller half of this repository.

| | |
|---|---|
| [`docs/adr/`](docs/adr/) | decisions, with the alternatives that lost and the measurements behind them |
| [`docs/architecture/`](docs/architecture/) | the domain model, and what a fact has to be |
| [`docs/design/`](docs/design/) | the interface, its design tokens, and the handoff it came from |
| [`docs/research/`](docs/research/) | what is actually publishable about Etna, and what is locked behind PDFs and images |

[`docs/research/volcanic-activity.md`](docs/research/volcanic-activity.md) is the one to read if you
only read one: it is a survey of what a volcano observatory publishes as *data* versus as pictures
and bulletins, and the answer is bleaker than you would expect.

## Data, and attribution

Noma's code is MIT licensed. **The data is not Noma's** and keeps its own terms:

- **INGV** — earthquake catalogues and GNSS position series, CC BY 4.0. Attribution travels with
  every record the API serves.
- **NASA FIRMS** — active-fire detections. Open, with acknowledgement requested.
- **USGS** — earthquake catalogue, public domain.
- **OpenStreetMap via Protomaps** — the basemap, ODbL. Attribution is set on the map source itself
  so restyling cannot lose it.

Material under [`docs/design/handoff-noma-explorer/`](docs/design/handoff-noma-explorer/) is a
design reference, not production code, and is not covered by the MIT licence above.

## Licence

[MIT](LICENSE), for the code.
