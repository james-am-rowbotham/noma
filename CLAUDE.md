# Noma

Noma is an interface for exploring complex physical systems.

The initial domain is volcanology, but the architecture must remain general enough to support other dynamic physical systems such as earthquakes, glaciers, wildfires, storms, oceans and geological processes.

## Product principle

> **Look at a place. Ask a question. Explore what you discover.**

The map is the primary interface. Scientific complexity should emerge contextually rather than being exposed through complex navigation.

Noma combines:

* live scientific observations
* historical information
* scientific literature
* geospatial data
* deterministic scientific models
* natural-language interaction
* interactive visualization

The LLM is an **orchestrator and interpreter, not the scientific source of truth**.

Never invent observations, model outputs, measurements, citations or scientific conclusions.

## UX principles

* Map first.
* Keep the default interface extremely simple.
* Natural language is a powerful shortcut, not the only interaction.
* Complexity should emerge, not be navigated.
* Avoid permanent dashboards.
* Avoid permanent scientific-data sidebars.
* Avoid exposing GIS concepts such as layers and data sources in the primary UX.
* Use progressive disclosure.
* Keep the number of persistent controls small.
* Advanced functionality must always have an obvious path back to the simple map.
* Scientific provenance and uncertainty must remain accessible.
* **Uncertainty is always shown, and always subtly.** Never omitted: a value whose uncertainty was not reported says so, because 3.9 on its own looks exactly as precise as 3.9 ± 0.0. Never louder than the value itself.
* Prefer contextual actions over mode switching.

The target experience is:

**Look → Ask → Understand → Explore → Ask again**

## Scientific architecture

Separate the following concerns:

### Knowledge

Scientific papers, reports, documentation, historical accounts and other unstructured knowledge.

Use retrieval/RAG where appropriate.

### Observations

Numerical and structured scientific measurements such as:

* seismicity
* deformation
* GNSS
* InSAR
* gas
* thermal observations
* satellite observations
* weather
* environmental measurements

Do not use vector search as the primary representation for numerical observations.

### Models

Deterministic scientific models should perform scientific calculations.

Examples include:

* plume models
* ash transport
* dispersion
* deformation models
* other domain-specific physical models

The AI may select, configure and explain models, but should not replace them with LLM-generated calculations when a scientific model is appropriate.

### Visualization

The map should represent the current state of the user's investigation.

Natural-language requests can change map state.

Example:

> "Show earthquakes above magnitude 2."

→ query observations → update map.

> "Show today's wind."

→ retrieve weather → update visualization.

> "What if the plume reaches 8 km?"

→ run model → visualize result.

## Provenance

Scientific information should retain provenance wherever possible.

Record:

* source
* timestamp
* units
* quality information
* uncertainty
* processing method
* model and version
* parameters
* input datasets
* output datasets

Every record carries a **provenance class**, and it answers exactly one question: *what kind of claim is this?* See ADR-0005.

* **OBSERVED** — measured, by instrument or by a person. Includes an agency's own standard processing of its instruments: an earthquake location is OBSERVED, not CALCULATED.
* **CALCULATED** — Noma did arithmetic over other records. Noma is then the source, and Noma can be wrong.
* **MODELLED** — a scientific model produced it from real inputs. A claim about the real world, made by a model.
* **SIMULATED** — a model run on hypothetical inputs. Not a claim about the real world at all.
* **INFERRED** — a judgement that could be wrong, by Noma or by an LLM.
* **FORECAST** — an official forecast, issued by an agency responsible for it. **Noma never labels its own output FORECAST**; its own model run about tomorrow is MODELLED.

Never present a simulation as an observation or forecast.

*How* Noma obtained a record is not a provenance class: the source and the time it was fetched are already on every record. Nor is *when it is about*: every record carries its own time and the time it was produced.

## Architecture principles

Prefer a simple, modular architecture.

Decided:

* **Backend: Python on FastAPI** (`backend/`). ObsPy reads seismology formats; Pydantic models enforce Noma's rules on what it produces. See ADR-0003.
* **Browser: TypeScript and React**, with Base UI for primitives (DESIGN-0001). Its types are generated from the backend's OpenAPI, never copied by hand.
* **Database: PostgreSQL 18 with PostGIS 3.6**, reached from Python through SQLAlchemy Core and changed only through Alembic migrations, each reversible. Locally in Docker Compose; production via Terraform, not yet written. See ADR-0004.

Likely, not yet decided:

* MapLibre or Mapbox GL
* WebGL where appropriate
* object storage
* asynchronous jobs for long-running models

`bun run check` runs everything: the decision-record checks, and the backend's format, lint, strict type check and tests. The backend tests need the database: `bun run db:up` first.

Use adapters around external scientific systems rather than tightly coupling the application to a single provider or model.

Use PostGIS for spatial data and structured observations.

Use object storage for large scientific artifacts such as:

* GeoTIFF
* NetCDF
* DEMs
* satellite imagery
* waveform data
* model outputs

Do not move unnecessarily large scientific datasets into the browser.

## Documentation

Keep this file short.

Do not turn `CLAUDE.md` into a project encyclopedia.

Detailed decisions belong in:

```text
docs/adr/
docs/design/
docs/research/
docs/science/
docs/architecture/
```

Use ADRs for significant architectural decisions.

Before making a significant architectural change:

1. Check relevant ADRs.
2. Check existing design documentation.
3. Check existing components and libraries.
4. Prefer reuse over introducing new infrastructure.
5. Document significant decisions in the appropriate location.

ADR format: copy `docs/adr/0000-template.md`. Status, date and links live in frontmatter so that `scripts/adrIntegrity.test.ts` can check them; `bun run adr:index` regenerates the index. The `adr` skill has the procedure.

### Where writing goes

Apply this test in order and stop at the first match. Every fact has one home.

| # | Ask | If yes |
|---|---|---|
| 1 | Can a test assert it? | Write the test. It is the only home that fails when someone breaks it |
| 2 | Would a reader editing this line break something without it? | A code comment: the invariant, the units, the ordering constraint, plus `see ADR-NNNN`. Aim for a paragraph |
| 3 | Is it a rule that applies across the repo, an always or a never? | `CLAUDE.md`, the nearest nested one. Aim for a paragraph |
| 4 | Is it a procedure followed step by step? | A skill in `.claude/skills/`, which loads only when invoked |
| 5 | Is it a stable description of what something IS: a schema, a data source, a model, a token set? | A spec in `docs/design/`, `docs/science/`, `docs/architecture/` or `docs/research/` |
| 6 | Is it WHY, with the alternatives that lost, or measurements? | A record in `docs/adr/`: `architecture/` (ADR-NNNN) or `design/` (DESIGN-NNNN) |

A status snapshot ("X is currently broken") is none of these. It is an issue.

## Component architecture

Use a mature accessible React component library for common primitives where appropriate.

Prefer:

* reusable primitives
* composable components
* domain-specific components built on top of primitives
* consistent interaction patterns

Do not introduce multiple competing component libraries without documenting the reason in an ADR.

The component library should support the product design, not dictate it.

## Engineering principles

* Prefer simple solutions.
* Avoid premature abstraction.
* Keep domain logic separate from presentation.
* Keep scientific calculations outside the UI.
* Validate external data.
* Make asynchronous model execution explicit.
* Preserve reproducibility.
* Treat timestamps and units carefully.
* Make uncertainty explicit.
* Do not silently discard scientific metadata.
* Write tests for important domain behaviour.
* Prefer existing dependencies and components before adding new ones.

## Current scientific focus

The first domain is volcanology.

Initial candidate systems include:

* Etna
* Kīlauea
* Sakurajima

The architecture must not assume that these are the only supported systems.

Noma should eventually be capable of representing other dynamic physical systems without requiring a fundamentally different product architecture.
