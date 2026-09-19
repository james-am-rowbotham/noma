---
id: 0003
title: The backend is Python, on FastAPI, with ObsPy reading and Pydantic enforcing
type: architecture
status: accepted
date: 2026-09-19
pinned-by: backend/tests/test_quakeml.py
amends: 0002
---

# ADR-0003: The backend is Python, on FastAPI, with ObsPy reading and Pydantic enforcing

## Context

Noma's first parser was written in TypeScript: a QuakeML reader for one real INGV earthquake
(ADR-0002). It worked, and it passed 34 tests. It was also written before anyone checked whether a
maintained open-source reader already existed — the step `CLAUDE.md` asks for first.

Checking afterwards changed the picture. Every server-side piece Noma plans to run or extend turned
out to be Python:

| Job | What Noma would use | Language |
|---|---|---|
| Read and write seismology formats (QuakeML, StationXML, miniSEED) | ObsPy | Python |
| Serve map shapes (OGC API – Features) | pygeoapi, a certified reference implementation | Python |
| Serve imagery and model grids (STAC) | stac-fastapi | Python |
| Gridded data: ash concentration, ground deformation | xarray, rasterio | Python |
| Scientific models: plume height, ash dispersion | model codes and their wrappers | Python, or Fortran behind Python |
| Serve station time series (SensorThings) | FROST-Server | Java — a separate server whatever the backend is |

A TypeScript API server would have been the only non-Python component on the server, and every
future seismology format would have meant writing a parser that ObsPy already has.

## Decision

**The backend is Python.** The browser stays TypeScript — React, MapLibre, Base UI (DESIGN-0001).

**The web framework is FastAPI.** It is the canonical modern Python API framework, and it is not
only the popular choice here but the one Noma's other pieces already assume: `stac-fastapi` is
built on it, and `pygeoapi` ships a Starlette app — the layer FastAPI itself is built on.

**ObsPy reads seismology formats; Pydantic enforces Noma's rules on what ObsPy produces.** ObsPy is
faithful on valid data and lenient on invalid data (see Evidence). Noma cannot be lenient, so the
adapter does two things ObsPy does not:

- ObsPy's QuakeML warnings — a `UserWarning` from `obspy.io.quakeml` — are turned into errors.
  Nothing is dropped silently.
- ObsPy's objects are converted into Noma's own Pydantic models, which carry ADR-0002's rules:
  required fields per the QuakeML spec document, closed vocabularies, timezone-aware times, the
  provenance envelope.

**ADR-0002's five decisions stand; their mechanism changes.** This amends it rather than
superseding it, because none of its reasoning changed — only the language it is expressed in:

| ADR-0002 decision | TypeScript (before) | Python (now) |
|---|---|---|
| Provenance nested | `envelope: Envelope` | same — a nested Pydantic model |
| Ids branded | `string & { [brand]: 'EventId' }` | `NewType('EventId', str)`, checked by pyright |
| Depth branded | `Metres` brand, made only by `metres()` | `NewType('Metres', float)` |
| Vocabularies closed | a union type, checked by hand in the parser | `Literal[...]`, checked by Pydantic at runtime |
| Uncertainty container always present | required field | required field |

Internal names are Python's `snake_case`. Serialised names — what the API emits and what OpenAPI
publishes — are QuakeML's exactly, including its `ID` capitalisation (`publicID`,
`preferredOriginID`), so domain-model point 3 holds wherever another tool can see.

**The browser gets its types from the API.** FastAPI publishes an OpenAPI description of every
endpoint; TypeScript types are generated from it. Nothing is copied by hand between the two
languages.

**Tooling:** `uv` for environments and dependencies, `pytest`, `ruff` for linting and formatting,
`pyright` in strict mode for types — the same checker VS Code runs, so editor and CI agree. The
backend lives in `backend/`. Repository tooling (this records layer and its integrity test) stays on
Bun at the root.

## Alternatives considered

**Keep the TypeScript backend; use Python only for model workers.** This is where `CLAUDE.md`
started ("Python scientific workers"). Rejected because the split puts the language boundary in the
wrong place: every standard service Noma would run is Python, so a TypeScript API would sit alone
between Python on both sides, and every seismology format would need a hand-written TypeScript
parser duplicating one ObsPy already has.

**Keep the TypeScript backend and use seisplotjs** — a maintained, MIT-licensed JavaScript library
for seismic data, with a fuller QuakeML model than Noma's own parser. Rejected on three measured
grounds. It does not load on a server: importing it defines a browser element and fails, through
its server entry point as well. It substitutes invented values for missing ones — an
`UNKNOWN_PUBLIC_ID` constant used to fill absent ids — which is the one thing Noma must never do. And
run under a simulated browser to get past the first problem, it returned **zero** earthquakes from
the real INGV record with no error, because the simulated browser mishandled XML namespaces.

**Keep Noma's own TypeScript parser.** It worked and it was strict. Rejected because it was already
losing data ObsPy keeps — JavaScript's `Date` truncates QuakeML's microseconds to milliseconds, and
INGV's own extension fields were not carried — and because StationXML and miniSEED would each have
been another parser written from scratch.

**Flask.** pygeoapi's default, and older and more widely deployed than FastAPI. Rejected because it
has no native request validation or OpenAPI generation, and Noma needs both: Pydantic validation is
the strict layer, and OpenAPI is the contract with the browser.

**Django.** Rejected as the wrong shape: its strength is its own ORM, admin and templating, and
Noma's data layer is PostGIS plus scientific libraries rather than Django models.

**Litestar.** Modern, Pydantic-native, generates OpenAPI — technically a fair match. Rejected as
less canonical, and because stac-fastapi assumes FastAPI specifically.

## Evidence

All run on 2026-09-19 against `docs/research/example-quakeml-ingv-etna-2026-08-15.xml`.

**ObsPy on valid data**, with the process timezone forced to `Europe/Amsterdam`:

```
obspy 1.5.1
events        1  origins 1  magnitudes 1
event type    earthquake
time          2026-08-15T10:24:08.910000Z    want 2026-08-15T10:24:08.910000Z
depth         1210.0    want 1210 (metres)
lat/lon       37.832 15.07
mag           3.9 ML  uncertainty: 0.2
h-uncertainty 200.0  conf 68.0
quality       gap 108.0  stderr 0.25  stations 15
evaluation    manual reviewed
creation      2026-08-15T10:46:43.000000Z INGV
INGV extras   kept AttribDict({'quality': AttribDict({'value': 'CB', 'namespace': 'http://webservices.ingv.it/'})})
```

Every value correct, the six microsecond digits kept, and INGV's extension field kept with its
namespace so it can be written back out.

**ObsPy on invalid data** — the fixture edited one way at a time:

```
unknown event type           REJECTED  IndexError: list index out of range
                               warning: Event type 'quake-ish' does not comply with QuakeML standard -- event will be ignored.
missing latitude             ACCEPTED  type='earthquake'  lat=None  depth=1210.0
missing depth                ACCEPTED  type='earthquake'  lat=37.832  depth=None
depth not a number           ACCEPTED  type='earthquake'  lat=37.832  depth=None
                               warning: Could not convert deep to type <class 'float'>. Returning None.
```

The first row's `IndexError` is the test script indexing an empty catalogue: ObsPy **dropped the
earthquake** and only warned. A missing required latitude passes without comment. A non-numeric
depth becomes a missing depth. Only the missing-depth row is correct for Noma.

**ObsPy details the strict layer depends on:**

```
1. does a VALID record raise any warnings at all?
    0 warnings []
2. is UTCDateTime.datetime timezone-aware?
    datetime.datetime(2026, 8, 15, 10, 24, 8, 910000)  tzinfo = None
3. what category and module are the bad-data warnings?
    bad type ['UserWarning in obspy/io/quakeml/core.py']
    bad number ['UserWarning in obspy/io/quakeml/core.py']
```

Row 2 is the timezone trap from ADR-0002 again, in Python: ObsPy's times carry no timezone. The
Pydantic models use `AwareDatetime`, which refuses a time without one.

**seisplotjs 3.2.7**, imported under Bun, through its default and its server entry points alike:

```
ReferenceError: HTMLElement is not defined
      at .../seisplotjs/dist/util.mjs:211:43
```

Under `happy-dom`, a simulated browser, it loaded but found no events. The cause was the simulated
browser, not seisplotjs:

```
root: quakeml ns: http://quakeml.org/xmlns/quakeml/1.2
eventParameters found via namespace lookup: 0
event elements (by plain tag): 1
event elements (by namespace): 0
```

**Package registry**, 2026-09-19:

```
fastapi            0.141.1    2026-07-29
pydantic           2.13.5     2026-08-28
starlette          1.6.0      2026-08-08
obspy              1.5.1      2026-08-28  GNU Lesser General Public Li
pygeoapi           0.24.0     2026-07-28  MIT
stac-fastapi-api   7.0.0      2026-09-09
pytest             9.1.1      2026-06-19
ruff               0.16.8     2026-09-16
pyright            1.1.414    2026-09-10  MIT
uvicorn            0.53.0     2026-09-14
```

`stac-fastapi.types` 7.0 requires `fastapi>=0.141.1`. `pygeoapi` 0.24.0 contains the modules
`django_`, `django_app`, `flask_app` and `starlette_app`. Mounting pygeoapi's Starlette app inside
Noma's FastAPI app has **not** been tried yet.

## Consequences

**The load-bearing backend code is written in Python rather than TypeScript.** That is the real cost
for a project built partly to learn from — and the science lives in Python, so learning ObsPy and
xarray is learning the domain.

Two toolchains to install, run and keep green: `uv`/`pytest`/`ruff`/`pyright` for the backend,
Bun/TypeScript for the browser and repository tooling.

**Brands do not survive the trip to the browser.** OpenAPI has no concept of a branded id or unit,
so generated TypeScript types see plain strings and numbers. The browser mostly displays; the
scientific checks stay in the backend, where they matter.

**Python keeps microseconds.** Its `datetime` holds them, so the precision JavaScript was dropping
is now kept — one of ADR-0002's recorded losses is gone.

ObsPy is licensed LGPL-3.0. Using it unmodified, as a library in a server, places no obligation on
Noma's own code; modifying ObsPy itself and distributing that would oblige publishing the
modifications.

The TypeScript domain types and parser are removed once the Python version passes the same
specification. Their commit stays in history as the evidence this record was decided against.

**Revisit if** a standard service turns out not to run alongside FastAPI after all — the
pygeoapi mounting above is the first thing to try — or if ObsPy's leniency proves impossible to
contain with warnings and validation alone.

## References

- ObsPy — https://docs.obspy.org/
- FastAPI — https://fastapi.tiangolo.com/
- Pydantic — https://docs.pydantic.dev/
- stac-fastapi — https://github.com/stac-utils/stac-fastapi
- pygeoapi — https://pygeoapi.io/
- seisplotjs — https://github.com/crotwell/seisplotjs
