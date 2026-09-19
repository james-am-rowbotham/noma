---
id: 0001
title: Decisions are recorded, and a test keeps the records navigable
type: architecture
status: accepted
date: 2026-09-18
pinned-by: scripts/adrIntegrity.test.ts
---

# ADR-0001: Decisions are recorded, and a test keeps the records navigable

## Context

**Noma's product promise is that it never presents a scientific claim without saying where it came
from.** Which earthquake catalogue is authoritative for a volcano, which magnitude scale a
threshold actually means, which model version produced a plume, which licence governs a dataset —
these are not implementation details that happen to need documenting. They are the product. A
system whose pitch is *here is where this came from* cannot be unable to say where its own
decisions came from.

Three such decisions arrived on day one, before any application code existed: which component
library and what it costs; whether to build or run standards-compliant servers for four different
scientific interfaces; and whether an earthquake belongs to a volcano. Each had alternatives that
lost for concrete reasons, and none of those reasons is recoverable from the code that results.
Left unwritten, each would be rediscovered as an argument in six months.

This layer is built before the first line of application code rather than once the shape is clear,
because **the earliest decisions are the ones most worth recording**: they constrain everything
after them, and they are the least visible in the finished code.

Writing it down is not sufficient on its own. Documentation rots precisely because nothing breaks
when it is wrong — a stale record is indistinguishable from a current one until someone acts on it.
The three failure modes this layer has to survive are the same argument written in two places and
drifting apart, two numbers issued for the same record, and a pointer to reasoning that has moved.
All three are structural, which means a test can catch them.

## Decision

Every fact about this codebase has **one home**, chosen by who is reading it and what they are
doing. The routing test is in `CLAUDE.md` under *Where writing goes*; **apply it in order and stop
at the first match.** A record is the last row.

| Home | Holds |
|---|---|
| **Test** | that it stays true — the only home that fails when someone breaks it |
| **Code comment** | what a reader editing *this line* must not break: the invariant, the units, the ordering constraint, plus `see ADR-NNNN` |
| **`CLAUDE.md`** | how to work here — rules that must fire unprompted |
| **Skill** (`.claude/skills/`) | a procedure followed step by step, loaded when invoked rather than costing every session |
| **Spec** (`docs/design/`, `docs/science/`, `docs/architecture/`, `docs/research/`) | what something IS: a schema, a data source, a standard, a token set |
| **Record** (`docs/adr/`) | **why** it is this way, with the alternatives that lost or the measurements behind it |

The sharpest disqualifier: **does this decision span more than one file?** If it lives in one
well-commented file, the comment is the right home and a record is clutter. A status snapshot —
"X is currently broken" — is an issue, not a decision.

**One sequence per concern, and the prefix is part of the reference.** `architecture/` gives
`ADR-NNNN`, `design/` gives `DESIGN-NNNN`. Two sessions working on different concerns cannot
collide on a number. A bare `0007` is ambiguous and is never written.

**`## Alternatives considered` is required.** A record without it restates the code: it says what
was built, which the code already says, and omits the only thing the code cannot say.

**`## Evidence` is required if any number was tuned or measured, and measurements are carried over
verbatim.** Tables, timings, query plans, registry output, model runs with their parameters. A
record that summarises its own measurements has kept the word count and thrown away what the words
were for. For a scientific choice, `## References` carries the papers and provider documentation it
rests on.

**Immutability starts when a record becomes visible to someone else** — pushed to a shared remote,
or sent to another person. Until then, including after it is committed locally, it is a draft and
is edited freely. The rule exists so that a reader who relied on reasoning does not find it changed
underneath them; where there is no such reader, it does not apply.

After that a record is immutable **with exactly one exception: a forward pointer may be added**
(`status`, `superseded-by`, `amended-by`, and a one-line note saying which part moved and where).
Without that exception a reader who lands on a stale record has no signal to keep going.

A reversal is a **new** record with `supersedes:`; the old one stays, because the reasoning of a
reversal is only legible next to what it reversed. A change that leaves the old reasoning intact
uses `amends:`. A factual error — something that was never true — is corrected in place with a
dated note.

**The index is generated, not maintained.** `bun run adr:index` rewrites the tables and timeline in
`docs/adr/README.md` from the records' own frontmatter.

**`scripts/adrIntegrity.test.ts` is what makes all of the above fail rather than merely read.** It
checks unique ids, filenames matching declared ids, types matching directories, resolving
cross-references, symmetric supersession and amendment, `pinned-by` files that exist, alternatives
present in every accepted record, and the index matching disk.

## Alternatives considered

**The heading-only format `CLAUDE.md` originally specified.** A record was to be `# ADR-XXXX:
Title` followed by `## Status`, `## Context`, `## Decision`, `## Alternatives Considered`,
`## Consequences`, `## References`. Rejected because a test cannot reliably read a heading: status,
date and the supersession graph would have to be parsed out of prose, and any record that formatted
a heading differently would silently drop out of every check. Machine-readable frontmatter is what
makes the integrity test possible at all. The section structure survived; only the metadata moved.

**Records with no integrity test.** Rejected on the principle the whole layer rests on: *the prose
is not what holds the system together — the tests are.* Prose only ever has to explain, never to
enforce, and it can only be trusted to explain if something fails when it stops being true. A
records layer with no test is a folder of markdown with a good intention attached.

**A hand-maintained index, checked by a test.** Each record would be listed by hand in the subject
table and again in the timeline, with assertions catching omissions. Rejected because anything
hand-copied drifts, and two views of one set are two things to fall behind; generating from
frontmatter removes the failure mode rather than detecting it. The cost is that the index is no
longer hand-editable, which is the point.

**A third sequence, `science/` (`SCI-NNNN`)**, for choices like which earthquake catalogue is
authoritative for a volcano, or which plume model to trust. Genuinely tempting, because the
evidence behind such a record is papers and provider documentation rather than benchmarks and
timings. **Rejected for now**: the reader is the same person, and `## References` already carries
that kind of evidence, so a third sequence adds machinery without separating audiences. **Revisit
when science records are crowding architecture records out of the architecture table** — a
countable trigger rather than a feeling.

**Deferring the layer until the architecture settles.** Rejected for the reason given in Context:
decisions made before the shape is clear are the ones that determine the shape, and reconstructing
them later means reconstructing them from the code they produced, which is the one source that
cannot contain what was rejected.

## Evidence

Fault injection against this repo's integrity test on 2026-09-18, to check that it fails when it
should. Four files were planted at once, carrying seven distinct faults — a duplicate id; an
accepted record with no alternatives, a free-text date (`18 Sept`), an empty `pinned-by` line
followed by a dangling `supersedes: 0099`, and a link to a record that does not exist; a design
record without its `DESIGN-` prefix; and a source file citing a record path that does not exist
(`9999-nope.md`, under `architecture/`). The index went stale as a consequence of the first three:

```
(fail) ADR integrity > has no duplicate ids
(fail) ADR integrity > gives every record the frontmatter a reader navigates by
(fail) ADR integrity > gives each type its own id scheme
(fail) ADR integrity > resolves every link from one record to another
(fail) ADR integrity > points supersedes / superseded-by / amends / amended-by at records that exist
(fail) ADR integrity > keeps supersession symmetric
(fail) ADR integrity > has an index that matches disk
(fail) ADR integrity > resolves every record path mentioned ANYWHERE in the repo
(fail) ADR integrity > requires the alternatives that lost in every accepted record
 3 pass
 9 fail
```

Nine checks fired; the three that passed had no fault aimed at them. After removing the planted
faults: 12 pass, 0 fail.

One defect in the frontmatter parser was found this way and fixed. The field regex matched `\s*`
after the field name, and `\s` crosses a newline — so an empty `pinned-by:` line consumed the
line below it and reported `supersedes: 0003` as a missing test file. It now matches `[ \t]*`.

## Consequences

Knowing why a constant is what it is costs a hop to a second file. That is the trade, and it is
acceptable only because the pointer is always left at the constant, so the hop is one click and
never a search.

`CLAUDE.md` stays short — its own instruction — and becomes working rules plus a routing test,
rather than an encyclopedia loaded in full into every session.

The integrity test can now fail for boring reasons: a renamed file, a moved directory, a forgotten
`bun run adr:index`. That noise is the price of the check being real, and the failure messages name
the offending file.

The reference check fires on any full `docs/adr/…md` path in any tracked file, **prose included**,
so a record that wants to quote a path it does not want resolved must name the file without the
prefix. An escape-hatch marker was considered and rejected: a check with an opt-out is a check
people opt out of.

**The risk to watch is records written as summaries.** If that starts happening this has made
things worse, and the check is simple: a record whose Evidence section has no numbers in it is
either about a decision that genuinely had no measurements, or it has lost them.

**The second risk is specific to Noma.** Scientific decisions will want to cite papers, and a
citation is easy to write and hard to verify. `## References` must point at things that were
actually read — the standards research in `docs/research/` marks what could *not* be verified, and
records should inherit that habit. A record that cites a paper nobody opened is the same failure as
an LLM inventing an observation, committed by a human instead.

## References

- [MADR](https://adr.github.io/madr/) — "Markdown **Any** Decision Records", the convention for
  widening decision records beyond architecture without inventing a second prefix
