---
id: 0002
title: The domain types — provenance nested, ids and units branded, vocabularies closed
type: architecture
status: accepted
date: 2026-09-19
pinned-by: src/adapters/quakeml/parse.test.ts, src/domain/quakemlVocabulary.test.ts
---

# ADR-0002: The domain types — provenance nested, ids and units branded, vocabularies closed

## Context

The first types in Noma hold one earthquake: QuakeML's `Event`, `Origin` and `Magnitude`
(domain-model point 2), plus the provenance envelope Noma adds on top (point 7). Five choices in
their shape recur in every later type — every station reading, every satellite image, every model
output — so they were settled together, before the second type existed, rather than separately and
inconsistently later.

They were checked against a real record rather than an invented one: an INGV QuakeML document for
the M3.9 of 2026-08-15 near Linguaglossa, kept at
`docs/research/example-quakeml-ingv-etna-2026-08-15.xml`.

## Decision

**1. Provenance is nested, not flat.** Every record carries `envelope: Envelope` beside the
standard's own fields. Re-serving valid QuakeML is then `const { envelope, ...quakeml } = record`:
nothing of Noma's can leak into standard output, and no field of Noma's can collide with a name the
standard uses.

**2. Ids are branded.** `EventId`, `OriginId`, `MagnitudeId`, `SourceId` are strings at runtime, but
the compiler refuses to pass one kind where another is expected.

**3. Units are branded.** Depth is `Metres`. The only way to make one is `metres()`, so a conversion
from kilometres has to be written out at the point where it could go wrong. The field keeps
QuakeML's own name, `depth`.

**4. Vocabularies are closed.** Where QuakeML defines a list of allowed values (event type,
evaluation mode and status, depth type, type certainty), Noma accepts only those values, and a
record carrying anything else fails to parse. The lists are generated from QuakeML's schema file,
not typed by hand.

**5. The uncertainty container is always present.** `origin.uncertainty` and `origin.quality` exist
on every origin, empty if the feed sent nothing. The fields inside are optional because real feeds
omit them.

And one that followed from checking the standard: **required versus optional follows the QuakeML
spec document, not its schema file.** The schema file wraps every field in an any-order, any-count
group, so by the schema alone an origin with no latitude is valid. The spec's class diagrams require
`time`, `latitude` and `longitude` on an origin and `mag` on a magnitude; so do these types. Depth,
event type and the preferred ids are optional in both, and optional here.

## Alternatives considered

**Flat provenance** (`type Origin = Envelope & { ... }`, read as `origin.provenance`). Nicer to
type. Rejected because nothing then shows which fields are the standard's and which are Noma's, and
re-serving means maintaining a list of Noma's keys to strip — a list that silently goes stale the day
someone adds an envelope field, which then leaks into output that claims to be valid QuakeML.

**Plain string ids.** Rejected because QuakeML's ids are all long look-alike URIs, and an `Event`
holds `preferredOriginID` and `preferredMagnitudeID` side by side. `findMagnitude(event.
preferredOriginID)` compiles with plain strings and fails only at runtime, as every earthquake on the
map showing no magnitude.

**`depthMetres: number`**, with the unit in the name. Its genuine advantage is that the unit survives
into JSON, logs and the database, where a TypeScript brand disappears. Rejected because it renames
the standard's field (domain-model point 3), and because it does not stop the actual mistake:
`depthMetres: row.depthKm` compiles, and puts the earthquake a thousand times too shallow.

**A plain number with a comment.** Rejected: nobody reads the comment at the line where the
kilometres are assigned.

**Open vocabularies** — the official values plus any other string, or any string at all. They never
fail to parse, which is their real appeal for a monitoring tool. Rejected because Noma re-serves
QuakeML (domain-model point 4), so a value outside the standard accepted on the way in becomes
invalid output on the way out; and because the compiler can then no longer check that a `switch`
over event types handles every case.

**Every field optional**, mirroring the feed exactly. Rejected for the containers: with `uncertainty?`,
"the feed sent nothing" and "the parser forgot" produce the same absent field and cannot be told
apart. **Every field required** was rejected outright — most real records lack a full uncertainty
block, and the Etna record itself has no vertical uncertainty.

**Following QuakeML's schema file for required fields.** It is the machine-readable artefact, so it
looked like the authoritative one. Rejected once read: it enforces only `publicID`.

## Evidence

Required versus optional, as each source states it — the schema file read with an XML parser, the
spec document from its class diagrams:

| Field | Schema file (`QuakeML-BED-1.2.xsd`) | Spec document (UML) | These types |
|---|---|---|---|
| Origin `time`, `latitude`, `longitude` | optional | required (no multiplicity marker) | required |
| Origin `depth` | optional | `[0..1]` | optional |
| Magnitude `mag` | optional | required | required |
| Magnitude `type` | optional | `[0..1]` | optional |
| Event `type`, `preferredOriginID`, `preferredMagnitudeID` | optional | optional | optional |
| any `publicID` | required | required | required |

The event type vocabulary has **44 values** in the schema file. It was estimated at "about 30" from
memory before the file was read, which is the reason the lists are generated.

The timezone failure the parser guards against, reproduced on 2026-09-19 with `TZ=Europe/Amsterdam`:

```
as given:       2026-08-15T08:24:08.910Z  <- read as LOCAL time
with Z:         2026-08-15T10:24:08.910Z
micro -> milli: 2026-08-15T10:24:08.123Z
```

The first line is the Etna earthquake placed two hours early, with no error. The parser appends `Z`
to an unmarked QuakeML timestamp. Removing that handling on purpose made two tests in
`parse.test.ts` fail with `Received: "2026-08-15T08:24:08.910Z"`; the test forces a non-UTC
timezone because on a UTC machine, such as a typical CI runner, the bug gives the right answer by
accident.

The third line is a real loss: JavaScript's `Date` keeps milliseconds, and QuakeML allows
microseconds. The untouched original keeps them (domain-model point 8).

## Consequences

The compiler now catches three classes of scientific-data mistake that would otherwise surface as
wrong dots on a map: swapped ids, kilometres read as metres, and invented event types. Even a test
cannot compare a depth to a bare `1210` — it must write `metres(1210)`.

It costs ceremony at the boundary. Every adapter converts raw strings with `eventId()`,
`metres()` and friends. That is intended: the boundary is where external data becomes trusted,
and it should look like it.

A feed that sends an unrecognised event type loses that record, loudly. For a monitoring tool that is
a real cost, and it is the one to revisit if it happens in practice — the likely response is to keep
the record out of the standard interfaces rather than out of Noma altogether.

A brand exists only in TypeScript. In the database the column needs the unit in its name.

**Not decided here, and owed:** the type cannot make a screen *show* uncertainty. A magnitude of 3.9
with none reported looks exactly as precise as 3.9 ± 0.0. That is a display rule.

## References

- QuakeML 1.2 Basic Event Description, `QuakeML-BED-20130214b.pdf` — https://quake.ethz.ch/quakeml/Documents
- QuakeML 1.2 schema files, vendored at `schemas/quakeml/1.2/` from
  `https://quake.ethz.ch/quakeml/docs/xml?action=AttachFile&do=get&target=QuakeML-BED-1.2.xsd`
