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

This layer exists before Noma's first line of application code, because the two projects before it
each paid for getting it wrong in a different way.

**repcheck got the layer late.** Its ADR-0001 is dated 2026-08-28; the earliest decision in its own
timeline is 2026-07-12. Forty-seven days of decisions were reconstructed afterwards from code and
memory.
By then the working file had absorbed them — the measurements in the Evidence section below are
what that cost. Worse, the same argument was being written twice at full length, once in a code
comment and once in the project file, with nothing keeping the two copies in step and no way to
tell which was current.

**tellus got the records but not the enforcement.** It has `docs/adr/`, two sequences and a
routing test in its project file. No test was found that reads any of it. Nothing fails when a
record is wrong, so nothing stops it going wrong.

**And numbering by guesswork collided.** In repcheck two sessions each wrote an ADR-0028 and an
ADR-0029 three minutes apart. It was found by hand, which is the wrong way to find it.

Noma has a reason of its own, beyond inheriting those lessons. **The product promise is that Noma
never presents a scientific claim without saying where it came from.** Which earthquake catalogue
is authoritative, which magnitude scale a threshold means, which model version produced a plume,
which licence governs a dataset — these are not implementation details that happen to need
documenting. They are the product. A system whose entire pitch is *here is where this came from*
cannot be unable to say where its own decisions came from.

Three such decisions arrived on day one, before any code: which component library and what it
costs; whether to build or run four standards-compliant servers; and whether an earthquake belongs
to a volcano. Each had alternatives that lost for concrete reasons, and none of those reasons is
recoverable from the code that results.

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

**`## Alternatives considered` is required.** A record without it restates the code. An audit of
repcheck's first 27 records found this missing in 6, and its absence is most of why the rest read
as clutter.

**`## Evidence` is required if any number was tuned or measured, and measurements are carried over
verbatim.** Tables, timings, query plans, registry output, model runs with their parameters. A
record that summarises its own measurements has kept the word count and thrown away what the words
were for. For a scientific choice, `## References` carries the papers and provider documentation it
rests on.

**Immutability starts when a record lands on `main`, not when the file is written.** A draft —
especially one written retroactively, where the consequences are still being discovered — is edited
freely until then. After that a record is immutable **with exactly one exception: a forward pointer
may be added** (`status`, `superseded-by`, `amended-by`, and a one-line note saying which part moved
and where). Without that exception a reader who lands on a stale record has no signal to keep going.

A reversal is a **new** record with `supersedes:`; the old one stays. A change that leaves the old
reasoning intact uses `amends:`. A factual error — something that was never true — is corrected in
place with a dated note.

**The index is generated, not maintained.** `bun run adr:index` rewrites the tables and timeline in
`docs/adr/README.md` from the records' own frontmatter.

**`scripts/adrIntegrity.test.ts` is what makes all of the above fail rather than merely read.** It
checks unique ids, filenames matching declared ids, types matching directories, resolving
cross-references, symmetric supersession and amendment, `pinned-by` files that exist, alternatives
present in every accepted record, and the index matching disk.

## Alternatives considered

**The heading-only format this project started with.** `CLAUDE.md` originally specified a record as
`# ADR-XXXX: Title` followed by `## Status`, `## Context`, `## Decision`, `## Alternatives
Considered`, `## Consequences`, `## References`. Rejected because a test cannot reliably read a
heading: status, date and the supersession graph have to be parsed out of prose, and any record
that formats a heading differently silently drops out of every check. Machine-readable frontmatter
is what makes the integrity test possible at all. The section structure survived; only the metadata
moved.

**Records with no integrity test** — what tellus has. Rejected on the principle that motivated the
whole layer: *the prose is not what holds the system together, the tests are.* Documentation rots
precisely because nothing breaks when it is wrong. A records layer with no test is a folder of
markdown with a good intention attached.

**A hand-maintained index checked by a test** — what repcheck has. Its `README.md` carries every
record twice, in a subject table and in a timeline, and it needs two separate assertions to notice
either falling behind. Rejected because anything hand-copied drifts; generating from frontmatter
removes the failure mode instead of detecting it. The cost is that the index is no longer
hand-editable, which is the point.

**A third sequence, `science/` (`SCI-NNNN`)**, for choices like which earthquake catalogue is
authoritative for Etna, or which plume model to trust. Genuinely tempting: the evidence behind such
a record is papers and provider documentation rather than benchmarks and timings. **Rejected for
now**, because the reader is the same person and the `## References` section already carries that
kind of evidence — a third sequence adds machinery without separating audiences. **Revisit when
science records are crowding architecture records out of the architecture table**, which is a
countable trigger rather than a feeling.

**Starting the layer once the shape is clearer.** This is what repcheck did, and the six weeks of
reconstruction is the reason it is rejected. The decisions most worth recording are the earliest
ones, because they constrain everything after them and are the least recoverable from the code.

## Evidence

Measured in repcheck before its ADR-0001, carried over verbatim from that record:

| | |
|---|---|
| CLAUDE.md | 6,067 lines / 447KB ≈ 124k tokens, loaded into every session |
| Comment lines in `apps/` + `packages/` + `scripts/` | 16,642 of 56,327 — 30% of the source |
| Dated decisions in CLAUDE.md | 160 |
| Decisions CLAUDE.md claims are "pinned" by a test | 67, against 76 real test files |

That last row is the one that unlocks this. **The prose is not what holds the system together —
the tests are.** 67 decisions already failed the test suite if reverted. The prose only ever has to
explain, never to enforce.

Fault injection against this repo's own integrity test on 2026-09-18, to check it fails when it
should. Four files were planted at once, carrying seven distinct faults — a duplicate id; an
accepted record with no alternatives, a free-text date (`18 Sept`), an empty `pinned-by` line
followed by a dangling `supersedes: 0099`, and a link to a record that does not exist; a design
record without its `DESIGN-` prefix; and a source file citing
`docs/adr/architecture/9999-nope.md`. The index went stale as a consequence of the first three:

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

One defect was found in repcheck's parser while porting it and is fixed here: the frontmatter field
regex used `\s*`, which matches across a newline, so an empty `pinned-by:` line would consume the
following line and report `supersedes: 0003` as a missing test file. This version matches `[ \t]*`.

## Consequences

Knowing why a constant is what it is costs a hop to a second file. That is the trade, and it is
acceptable only because the pointer is always left at the constant, so the hop is one click and
never a search.

`CLAUDE.md` stays short — its own instruction — and becomes working rules plus an index, rather
than an encyclopedia that is loaded in full into every session.

The integrity test is now a thing that can fail for boring reasons: a renamed file, a moved
directory, a forgotten `bun run adr:index`. That noise is the price of the check being real, and
the failure messages name the offending file.

**The risk to watch is records written as summaries.** If that starts happening this has made
things worse, and the check is simple: a record whose Evidence section has no numbers in it is
either about a decision that genuinely had no measurements, or it has lost them.

**The second risk is specific to Noma.** Scientific decisions will want to cite papers, and a
citation is easy to write and hard to verify. `## References` must point at things that were
actually read — the standards research in `docs/research/` marks what could *not* be verified, and
records should inherit that habit. A record that cites a paper nobody opened is the same failure as
an LLM inventing an observation, committed by a human instead.

## References

- repcheck `docs/adr/architecture/0001-record-decisions-in-adrs.md` — the record this inherits from
- [MADR](https://adr.github.io/madr/) — "Markdown **Any** Decision Records", the convention for
  widening decision records beyond architecture without inventing a new prefix
