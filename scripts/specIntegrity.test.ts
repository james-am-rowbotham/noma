import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { ROOT } from './adrIndex';

// SPEC INTEGRITY — the measurement half of the specs, as adrIntegrity.test.ts is for the records.
//
// A spec is worth having only if you can tell which of it is real. Without a check, a rule and a
// test have no connection: nobody can say which parts of a spec are built, which were never
// implemented, or which were quietly deleted while their test lived on. That is how a `docs/` folder
// ends up describing a product slightly different from the one that exists, and everyone learns to
// read the code instead.
//
// So a testable claim in a spec gets an id — `**DET-5**`, `**EXP-3**` — and the test that holds it
// names the id. This checks the two sides agree. `(unbuilt)` is a DECLARED state: a rule can be
// written before it is built, and `grep '(unbuilt)' docs/` is then the build queue.
//
// It cannot tell you a rule is wise, or that the test asserting it is any good. It tells you the
// map matches the ground.

const ID = /\*\*([A-Z]{2,4}-\d{1,3})\*\*/g;

// Record ids look identical to rule ids and are bolded in prose all over the records. They are not
// rules and must not be collected as such.
const NOT_RULES = new Set(['ADR', 'DES', 'RFC']);

// Citations are searched for by DECLARED PREFIX, never by shape. Harvesting anything that looks
// like an id found "BED-1" in `QuakeML-BED-1.2.xsd` and "BY-4" in `CC-BY-4.0`, and reported both
// as tests citing rules that do not exist. The consequence worth knowing: deleting a spec's LAST
// rule also stops its orphans being noticed, because the prefix goes with it.

const tracked = (): string[] =>
  Bun.spawnSync(['git', 'ls-files', '--cached', '--others', '--exclude-standard'], { cwd: ROOT })
    .stdout.toString()
    .split('\n')
    .filter(Boolean);

const files = tracked();

// A rule is one blank-line-separated block beginning with its id, so a rule wrapping over several
// lines — and an `(unbuilt)` marker on the last of them — is read as one thing.
const declared = new Map<string, { file: string; unbuilt: boolean }>();
const duplicates: string[] = [];
for (const file of files.filter((f) => f.startsWith('docs/') && f.endsWith('.md'))) {
  for (const block of readFileSync(`${ROOT}${file}`, 'utf8').split(/\n\s*\n/)) {
    const first = block.trimStart().match(/^\*\*([A-Z]{2,4}-\d{1,3})\*\*/);
    if (!first?.[1] || NOT_RULES.has(first[1].split('-')[0] ?? '')) continue;
    const id = first[1];
    if (declared.has(id)) duplicates.push(`${id}: ${declared.get(id)?.file} and ${file}`);
    declared.set(id, { file, unbuilt: /\(unbuilt\)/.test(block) });
  }
}

// Where a rule may be held. The integrity test itself is excluded: it names ids in its own prose,
// and counting those as citations would let it vouch for everything including itself.
const TESTS = (f: string) =>
  (f.startsWith('backend/tests/') && f.endsWith('.py')) ||
  (f.endsWith('.test.ts') && !f.endsWith('specIntegrity.test.ts')) ||
  f.endsWith('.test.tsx');

const prefixes = [...new Set([...declared.keys()].map((id) => id.split('-')[0]))].filter(Boolean);
const CITATION = new RegExp(`\\b((?:${prefixes.join('|')})-\\d{1,3})\\b`, 'g');

const cited = new Map<string, string[]>();
for (const file of files.filter(TESTS)) {
  for (const m of readFileSync(`${ROOT}${file}`, 'utf8').matchAll(CITATION)) {
    const id = m[1];
    if (!id) continue;
    if (!cited.get(id)?.includes(file)) cited.set(id, [...(cited.get(id) ?? []), file]);
  }
}

describe('spec integrity', () => {
  it('finds the rules at all', () => {
    // A silent zero would make every check below pass by vacuum, which is the one failure mode a
    // consistency check cannot afford.
    expect(declared.size).toBeGreaterThan(0);
  });

  it('declares each rule id once', () => {
    expect(duplicates).toEqual([]);
  });

  it('has a test for every rule that is not marked unbuilt', () => {
    // The point of the whole file. A rule with neither a test nor a marker is a claim nothing
    // keeps: it reads as settled and would survive being broken.
    const unheld = [...declared]
      .filter(([id, { unbuilt }]) => !unbuilt && !cited.has(id))
      .map(([id, { file }]) => `${id} (${file}) has no test and is not marked (unbuilt)`);
    expect(unheld).toEqual([]);
  });

  it('has no test citing a rule that no longer exists', () => {
    // The other direction, and the one that rots invisibly: a rule edited out of a spec leaves its
    // test behind, still passing, now asserting something nothing claims.
    const orphans = [...cited]
      .filter(([id]) => !declared.has(id))
      .map(([id, where]) => `${id} is cited by ${where.join(', ')} but declared nowhere`);
    expect(orphans).toEqual([]);
  });

  it('has no rule both tested and marked unbuilt', () => {
    // A stale marker is worse than none: it hides a built rule from anyone reading the spec to
    // find out what works, and `grep '(unbuilt)'` stops being the build queue.
    const stale = [...declared]
      .filter(([id, { unbuilt }]) => unbuilt && cited.has(id))
      .map(([id, { file }]) => `${id} (${file}) is marked (unbuilt) but ${cited.get(id)} tests it`);
    expect(stale).toEqual([]);
  });
});
