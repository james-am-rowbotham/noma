# Serving the standards: build it, or run someone else's?

Checked 2026-09-18 against project repositories, the OGC compliance database and fdsn.org. Companion
to [`standards.md`](standards.md), which covers the formats themselves. This is a snapshot of what
exists, not a decision.

**Terms.** A *reference implementation* is the server the standards body itself points to as proof
the standard works. A *conformance test suite* is an official set of tests you run against your own
server to prove it obeys the standard. A *schema* is the layout of tables inside a database.

## The answer differs for all four

| Standard | Verdict | Why |
|---|---|---|
| fdsnws-event | **Build it** | 11 required parameters, 5 endpoints, one XML format with a downloadable schema to validate against. The only real server is an AGPL C++ platform needing its own database. |
| OGC API – Features | **Run pygeoapi** | Certified reference implementation, MIT, reads our existing PostGIS tables *and views* with no copying. Cost is one YAML block per collection. |
| STAC API | **Neither — use the framework** | `stac-fastapi` lets us implement 6 read methods over our own tables and inherit routing, OpenAPI and conformance declarations. Its usual backend, `pgstac`, would impose its own schema. |
| SensorThings | **Run FROST-Server** *(and it is not needed yet)* | Hardest to build by a wide margin. Sole certified product. But it owns its schema, so this one costs us a duplicate copy. |

## The correction that matters most

**Several of these cannot be conformance-tested at all.** This directly limits the proposal that
"compliant means a test passes":

| Interface | What can actually run in CI |
|---|---|
| QuakeML output | **Yes** — `QuakeML-1.2.xsd` + `QuakeML-BED-1.2.xsd`, both HTTP 200 on 2026-09-18 at `https://quake.ethz.ch/quakeml/docs/xml?action=AttachFile&do=get&target=QuakeML-1.2.xsd` (and `...target=QuakeML-BED-1.2.xsd`). The wrapper imports the 41 KB BED file by relative path, so fetch both and validate locally. ObsPy vendors both plus RELAX NG under `obspy/io/quakeml/data/`. |
| fdsnws-event behaviour | **No official suite.** fdsn.org links no validator or reference implementation. Only `crotwell/fdsn-service-check` exists (34 tests, 7 event-specific) and it is browser-only, CORS-dependent, `npm test` unimplemented, v3.0.0-alpha.1. A manual smoke check, not a CI gate. |
| OGC API – Features | **Partly** — `ogccite/ets-ogcapi-features10` (Docker, or a standalone `-aio.jar` producing `testng-results.xml`). But its `testng.xml` runs **only Core + Part 2 CRS**; GeoJSON, HTML and OAS30 are unimplemented with issues open since 2020. 47 abstract tests, 32 in Core. **The JAR exits 0 even on failure — parse the XML.** |
| STAC API | **Partly** — `stac-api-validator` v0.6.8 is the only thing testing API *behaviour* (conformsTo, link relations, search semantics, media types, paging). Its own README says it "only validates a subset of behavior"; recent commits are Dependabot-only. Do not confuse it with `stac-validator` (PyPI package now `stac-valid`), which validates static JSON against JSON Schema, not the API. |
| SensorThings 1.1 | **Nothing.** OGC certified FROST-Server on 2025-11-01 **for 1.0 only**; the OGC dropdown has no 1.1 entry, and the production CITE instance lists SensorThings **1.0** (ETS rev 1.3). There is no 1.1 compliance programme and no 1.1 test suite anywhere. Every "1.1 compliant" claim in the wild is self-assessed. |

Consequence for Noma: **the compliance claim itself needs provenance.** Where a suite exists we run
it and can say so. Where none exists we say "built to spec, not verified" — which is the same
standard of honesty Noma applies to scientific data, applied to its own claims.

## Detail

### fdsnws-event
Spec: [v1.2, 2019-06-27](https://www.fdsn.org/webservices/fdsnws-event-1.2.pdf) plus
[Commonalities v1.2](https://www.fdsn.org/webservices/FDSN-WS-Specification-Commonalities-1.2.pdf).
**28 query parameters, 11 required** (starttime, endtime, min/maxlatitude, min/maxlongitude,
min/maxdepth, min/maxmagnitude, orderby). **5 methods**: `query`, `catalogs`, `contributors`,
`version`, `application.wadl`. Output: QuakeML 1.2 (`application/xml`) and a 14-column
pipe-delimited text format. Prescribed status codes 200/204/400/413/414/500/503 with a plain-text
error body.

Servers: the **SeisComP `fdsnws` module** (gempa GmbH, **AGPL-3.0**, Python/Twisted inside a C++
platform; SeisComP 7.4.0 released 2026-09-04, actively developed) is the only real one. It reads
from a **SeisComP database** — its own datamodel — so using it means duplicating every event into
that schema. No official Docker namespace. Its own `event.py` is 42 KB and its header admits
`updatedafter` is unimplemented. The alternatives are marginal: `bclswl0827/fdsnws-go` (0 stars),
`crotwell/scsn_fdsnws` (1 star), `INGV/x-fdsnws-event` (XQuery research prototype). `EIDA/eidaws`
is a federator over existing nodes, not an origin server. ObsPy (1.5.1, 2026-08-28) is a client
only.

Note the licence: AGPL-3.0 requires publishing source for software offered as a network service.

### OGC API – Features
Three **Official Reference Implementations** in the
[OGC compliance database](https://portal.ogc.org/public_ogc/compliance/compliant.php): **pygeoapi
0.22.0** (OSGeo, certified 2026-01-10, valid to 2027-01-09), **ldproxy 4** (certified 2024-09-29,
**expires 2026-09-28**), **deegree ogcapi 2.0** (certified 2026-05-10). GeoServer 2.28 is compliant
but not an RI. `pg_featureserv`, `tipg` and `martin` appear in neither the certified nor the
implementing registry. **Certifications expire annually.**

Serving from existing PostGIS without copying: `pg_featureserv` and `tipg` auto-discover every
table and view from a connection string alone. **pygeoapi** reflects arbitrary tables *and views*
via SQLAlchemy and synthesises a primary key from `id_field`, so no real primary key is needed —
but wants one YAML block per collection, with no auto-discovery.

Health: pygeoapi MIT/Python 0.24.0 (2026-07-28), active. ldproxy MPL-2.0/Java v4.8.1 (2026-09-01).
GeoServer's `ogcapi-features` graduated from community module to `src/extension/` in 2.26.x.
**`pg_featureserv` is dormant** — v1.3.1 from 2024-02-06, zero commits in 12 months, 62 open issues,
only a personal Docker image.

Spec size: 6 required paths, **3 required query parameters** (limit, bbox, datetime), 6 conformance
classes of which only Core is mandatory. Traps: HTTP 400 on *any* unknown query parameter; `type`
required on every link; `limit` above the maximum must clamp rather than error.

Image sizes (compressed): pg_featureserv 15 MB, tipg 67 MB, ldproxy 270 MB, pygeoapi 318 MB,
GeoServer 594 MB.

### STAC
STAC API is still **1.0.0** (2023-04-25); the core STAC spec is 1.1.0. No OGC certification exists
for the API.

`stac-fastapi` 7.0.0 (2026-09-09, MIT, Python ≥3.11) separates API from backend: implement
`AsyncBaseCoreClient` — **6 abstract methods** for read-only (`post_search`, `get_search`,
`get_item`, `all_collections`, `get_collection`, `item_collection`). Writes are a separate class you
simply do not implement. Its usual backend `pgstac` (v0.9.12) owns schema `pgstac`, its own roles,
an `items` table partitioned by collection with JSONB `content`, and a `pypgstac` loader.
`stac-fastapi-sqlalchemy` is **dead** (last commit 2023-08-04, "abandoned in favor of pgstac").
`stac-server` (Element 84) needs AWS Lambda and OpenSearch.

Search takes **6 parameters** (limit, bbox, datetime, intersects, ids, collections) and 7
`conformsTo` strings. Verified: a conforming STAC API – Features implementation is also a valid OGC
API – Features Part 1 implementation, since it requires Core + GeoJSON + OAS30.

### SensorThings
| Project | Licence | Language | Latest | State |
|---|---|---|---|---|
| **FROST-Server** | LGPL-3.0 | Java 21 | v2.8.1 (2026-09-06) | active, last commit 2026-09-17 |
| GOST | MIT | Go | 0.5 (2017) | **dead**, last commit 2020-07-07 |
| istSOS4 | Apache-2.0 | Python | 1.0.0 (2025-07-15) | small, young |

FROST is the **Official OGC Reference Implementation**
([pid=1827](https://portal.ogc.org/public_ogc/compliance/product.php?pid=1827)), certified
2025-11-01, **for 1.0**.

Schema: Liquibase changelogs create `THINGS`, `DATASTREAMS`, `OBSERVATIONS` and the rest;
PostgreSQL + PostGIS required. FROST 2.x's `Plugins/ModelLoader` can bind entity types to existing
tables and columns through JSON model files, and a `ModelExtractor` can generate a model from an
existing database — but this is hand-edited JSON plus Java classes, not turnkey. Whether it works
over database views **could not be verified**. Operational weight: 264 MB image, JVM 21, in-repo
Helm chart requests 500m CPU and 1 GiB memory.

Why building it is the hardest of the four: 8 entity types, 48 requirements, arbitrary-depth path
traversal, and `$filter` normatively deferring to the **OData 4.0 ABNF** with ~38 built-in functions
(10 string, 13 date, 3 math, 3 `geo.*`, 9 `st_*`). Nested `$expand` carries its own
`$filter`/`$top`/`$skip`/`$orderby` per level, so a correct implementation needs LATERAL and window
subqueries. Estimate from the review: a scoped read-only subset is 1–3 weeks; full 1.1 read
conformance is months.

### Running the OGC test suites in CI
Official images exist: `ogccite/ets-ogcapi-features10` (tag `1.9-teamengine-6.0.0-RC2`, 2025-01-03,
47.7k pulls), `ogccite/ets-sta10` (`1.5-teamengine-6.0.0-RC2`), `ogccite/teamengine-production`. The
better CI route is the standalone all-in-one JAR:

```
java -jar ets-ogcapi-features10-${version}-aio.jar [-o $TMPDIR] test-run-props.xml
```

It writes `testng-results.xml`. **It exits 0 even when tests fail**, so the XML must be parsed.
`ets-sta10` documents only the TEAM Engine route, and covers SensorThings **1.0**.
