---
name: adr
description: Write, amend, supersede or correct a decision record in docs/adr/. Use when capturing WHY a change is the way it is, when a code comment is growing past a paragraph, when asked to "write this up" or "record this decision", or when reading turns up a record that no longer matches the code.
---

# Writing a decision record

## 1. First decide it belongs here at all

**Run the routing test in `CLAUDE.md` ("Where writing goes") and stop at the first match.** A
record is the LAST row. It is the right home only for WHY that spans more than one file, with
alternatives that lost or measurements behind it.

The two that send most would-be records elsewhere:

- **A status snapshot** — "X is broken", "these three still fail" — is an issue, not a decision.
- **A decision about ONE file** is a `README.md` beside it, or the comment itself. If it lives in
  one well-commented file, a record is clutter.

## 2. Take a number

One sequence per directory, prefix disambiguates. Never guess — look:

```bash
ls docs/adr/architecture/ | sed 's/-.*//' | sort -n | tail -1        # architecture
ls docs/adr/design/ | sed 's/DESIGN-//;s/-.*//' | sort -n | tail -1  # design
```

Copy `docs/adr/0000-template.md` into `architecture/` or `design/`. The filename must start with
the declared id (`0007-slug.md`, `DESIGN-0007-slug.md`); `type:` must match the directory. Always
write the prefix in prose — a bare number is ambiguous.

## 3. Fill in the two sections that decide whether it is worth writing

`## Alternatives considered` is **required**. A record without it is a restatement of the code.
"Rejected because it felt wrong" is not a reason; a concrete failure or a number is.

`## Evidence` is **required if any number here was tuned or measured**. Carry measurements over
**verbatim** — tables, timings, query plans, model runs with their parameters. For a scientific
choice, `## References` carries the papers and provider documentation it rests on.

If a test would fail were the decision reverted, name it in `pinned-by:`.

## 4. Regenerate the index

```bash
bun run adr:index
```

The tables and timeline in `docs/adr/README.md` are generated from the frontmatter. Never edit
them by hand.

## 5. Verify

```bash
bun test scripts/adrIntegrity.test.ts
```

## Changing an existing record

Accepted records are **immutable except for a forward pointer**. Never edit the reasoning.
Immutability starts when the record lands on `main`; a draft is edited freely until then.

- A reversal → a **new** record with `supersedes:`, and `superseded-by:` plus `status: superseded`
  on the old one.
- A change that leaves the old reasoning intact → `amends:` on the new, `amended-by:` on the old.
- A **factual error** is corrected in place with a dated note, because it was never true.
