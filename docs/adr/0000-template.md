---
id: 0000
title: Short noun phrase naming the decision, not the problem
type: architecture        # architecture | design
status: proposed          # proposed | accepted | superseded | rejected
date: YYYY-MM-DD          # when the DECISION was made. Never changes.
pinned-by:                # test file(s) that fail if this decision is reverted, comma-separated, or omit
supersedes:               # record id(s) this one reverses, or omit
superseded-by:            # added to the OLD record when it is reversed, or omit
amends:                   # record id(s) this one changes while leaving their reasoning intact, or omit
amended-by:               # added to the OLD record when it is amended, or omit
---

# ADR-0000: <title>

<!-- BEFORE WRITING, run the test in CLAUDE.md (**Where writing goes**) and stop at the first match.
     A record is the LAST option, and it is only the right one if this is WHY — with alternatives
     that lost, or measurements.

     The sharpest single check: does this decision span MORE THAN ONE FILE? If it lives in one
     well-commented file, the comment is the right home and this is clutter.

     A design record is titled `# DESIGN-0000: <title>` and lives in design/. -->

## Context

What forced the decision. If it came from a failure, say what actually happened and what it
cost — an incident is the strongest form of context there is.

## Decision

What we do, stated so someone can act on it. Present tense.

## Alternatives considered   **[REQUIRED — a record without this is a restatement of the code]**

Each one that was genuinely on the table, and the concrete reason it lost. "Rejected because it
felt wrong" is not a reason; "rejected because it put a modelled plume in the observed style" is.

## Evidence   **[REQUIRED if any number here was tuned or measured]**

**Carry measurements over VERBATIM. Never summarise them.** Tables, timings, query plans, model
runs with their parameters. This section is why the constant is the value it is, and a paraphrase
of it is worth nothing to the next person who wants to change that value.

## Consequences

What this costs, stated so it stays a choice rather than becoming folklore. What it makes easy,
what it makes hard, and what would make us revisit it.

## References

Papers, data-provider documentation, standards, prior art. Omit if there are none.
