---
id: 0001
title: Decisions are recorded, and a test keeps the records navigable
type: architecture
status: proposed
date: 2026-09-18
pinned-by: scripts/adrIntegrity.test.ts
---

# ADR-0001: Decisions are recorded, and a test keeps the records navigable

<!-- JAMES WRITES THIS ONE. The prompts below are the decision points, not the answers. Delete each
     comment as you replace it. Retitle freely — then rename the file to match and run
     `bun run adr:index`. Flip `status: accepted` when it says what you mean; the test will then
     insist that Alternatives considered exists. -->

## Context

<!-- Two things to cover, in your words:
     1. What you have already paid for. repcheck got this layer late (ADR-0001 there is dated six
        weeks after its first decision, and opens with a 6,067-line CLAUDE.md). tellus has records
        but no test. What did each of those cost, and why is Noma getting it before line one?
     2. What is different HERE. Noma's product promise is that it never presents something it
        cannot source. Is "why this catalogue, this magnitude scale, this model version" just
        engineering hygiene for this project, or is it part of the product? -->

## Decision

<!-- State the rule someone can act on. At minimum:
     - the homes a fact can live in (test / comment / CLAUDE.md / skill / spec in docs/ / record)
       and that a record is the LAST of them
     - where the line sits between a record here and the other folders CLAUDE.md names
       (docs/science, docs/research, docs/design, docs/architecture) — WHY vs WHAT IS
     - the sequences, and the prefix rule
     - immutability, and when it starts
     - evidence is carried verbatim -->

## Alternatives considered

<!-- The ones that were really on the table today:
     - The heading-only format CLAUDE.md started with (`## Status` as a section, no frontmatter).
       What can a test read from it?
     - Records without an integrity test (what tellus has).
     - A hand-maintained index checked by a test (what repcheck has) vs the generated one here.
     - OPEN: a third sequence, `science/` (SCI-NNNN), for choices like "which earthquake catalogue
       is authoritative for Etna" or "which plume model". Different reader, different evidence
       (papers rather than benchmarks). Or is that just an architecture record with References?
       If you want it, it is one line in TYPES in scripts/adrIndex.ts plus a directory. -->

## Consequences

<!-- What this costs (a hop from the code to the reasoning; a test to keep green), what it makes
     easy, and what would make you revisit it. -->
