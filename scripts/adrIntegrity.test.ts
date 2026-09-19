import { describe, expect, it } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { DIR, loadAdrs, renderIndex, ROOT, spliceIndex, STATUSES, TYPES } from './adrIndex';

// ADR INTEGRITY — the measurement half of the decision records. Ported from repcheck, where it was
// written after a real collision: two sessions each wrote an ADR-0028 and an ADR-0029 three minutes
// apart, and nothing noticed. A numbering scheme with no uniqueness check is not a numbering scheme.
//
// Everything here is cheap and structural. It cannot tell you a record is TRUE (only reading the
// code does that); it tells you the set is navigable — ids unique, links resolvable, pinned-by files
// real, the index matching disk. Those are the failures that make a reader stop trusting the set.

const { files, adrs } = await loadAdrs();
const byId = new Map(adrs.map((a) => [a.id, a]));
const readme = await Bun.file(`${DIR}/README.md`).text();

describe('ADR integrity', () => {
  it('has no duplicate ids', () => {
    const seen = new Map<string, string[]>();
    for (const a of adrs) seen.set(a.id, [...(seen.get(a.id) ?? []), a.file]);
    expect([...seen].filter(([, fs]) => fs.length > 1)).toEqual([]);
  });

  it('gives every record the frontmatter a reader navigates by', () => {
    const bad = adrs
      .filter(
        (a) =>
          !a.id ||
          !a.title ||
          !(a.type in TYPES) ||
          !STATUSES.includes(a.status) ||
          // The timeline SORTS on this, so a free-text date silently lands in the wrong place.
          !/^\d{4}-\d{2}-\d{2}$/.test(a.date),
      )
      .map((a) => a.file);
    expect(bad).toEqual([]);
  });

  it('gives each type its own id scheme', () => {
    const wrong = adrs.filter((a) => {
      const type = TYPES[a.type];
      return type && !new RegExp(`^${type.prefix}\\d{4}$`).test(a.id);
    });
    expect(wrong.map((a) => `${a.file}: ${a.id}`)).toEqual([]);
  });

  it('names every file for the id it declares, in the directory its type names', () => {
    // architecture -> `architecture/0007-slug.md` with id 0007
    // design       -> `design/DESIGN-0007-slug.md` with id DESIGN-0007
    const bad = adrs.filter((a) => !a.file.startsWith(`${a.type}/${a.id}-`));
    expect(bad.map((a) => `${a.file} declares id ${a.id}, type ${a.type}`)).toEqual([]);
  });

  it('resolves every link from one record to another', () => {
    // A dangling pointer is worse than no pointer: it says the reasoning exists somewhere it does not.
    const known = new Set(files);
    const dangling: string[] = [];
    for (const a of adrs)
      for (const m of a.body.matchAll(/\]\(((?:\.\.\/[a-z]+\/)?(?:[A-Z]+-)?\d{4}-[a-z0-9-]+\.md)\)/g)) {
        const target = m[1];
        if (!target) continue;
        const rel = target.startsWith('../') ? target.slice(3) : `${a.dir}/${target}`;
        if (!known.has(rel)) dangling.push(`${a.file} -> ${target}`);
      }
    expect(dangling).toEqual([]);
  });

  it('points supersedes / superseded-by / amends / amended-by at records that exist', () => {
    const bad: string[] = [];
    for (const a of adrs)
      for (const rel of ['supersedes', 'supersededBy', 'amends', 'amendedBy'] as const)
        for (const target of a[rel]) if (!byId.has(target)) bad.push(`${a.file} ${rel}: ${target}`);
    expect(bad).toEqual([]);
  });

  it('keeps supersession symmetric', () => {
    // Half a supersession is how a reader lands on a stale record with no signal to keep going.
    const bad: string[] = [];
    for (const a of adrs) {
      for (const t of a.supersedes)
        if (!byId.get(t)?.supersededBy.includes(a.id)) bad.push(`${a.id} supersedes ${t}, not returned`);
      for (const t of a.supersededBy)
        if (!byId.get(t)?.supersedes.includes(a.id))
          bad.push(`${a.id} superseded-by ${t}, which supersedes nothing`);
      if (a.supersededBy.length && a.status !== 'superseded')
        bad.push(`${a.id} is superseded but status=${a.status}`);
    }
    expect(bad).toEqual([]);
  });

  it('keeps amendment symmetric', () => {
    // The same claim as supersession, and in repcheck it was the unchecked half: `amended-by` was
    // maintained by hand, read by nothing, and two back-pointers had gone missing.
    const bad: string[] = [];
    for (const a of adrs) {
      for (const t of a.amends)
        if (!byId.get(t)?.amendedBy.includes(a.id)) bad.push(`${a.id} amends ${t}, not returned`);
      for (const t of a.amendedBy)
        if (!byId.get(t)?.amends.includes(a.id)) bad.push(`${a.id} amended-by ${t}, which amends nothing`);
    }
    expect(bad).toEqual([]);
  });

  it('pins to test files that actually exist', () => {
    // A wrong pinned-by silently voids the whole "the tests hold the system together" argument.
    const missing: string[] = [];
    for (const a of adrs)
      for (const t of a.pinnedBy) if (!existsSync(`${ROOT}${t}`)) missing.push(`${a.file} -> ${t}`);
    expect(missing).toEqual([]);
  });

  it('has an index that matches disk — run `bun run adr:index` if this fails', () => {
    expect(spliceIndex(readme, renderIndex(adrs))).toBe(readme);
  });

  it('resolves every record path mentioned ANYWHERE in the repo', () => {
    // Code comments say `see docs/adr/...`, nested CLAUDE.md files link across, skills name the
    // template. In repcheck those were the half of the references nothing was watching, and a
    // directory move broke them silently. git lists the files so ignored trees are never walked.
    //
    // NOTE: this fires on ANY full `docs/adr/...md` path in any tracked file, prose included. A
    // record describing a broken link as EVIDENCE must therefore not write the full path — say
    // `9999-nope.md, under architecture/` instead. ADR-0001 hit exactly this. The alternative was
    // an escape hatch, rejected: a check with an opt-out is a check people opt out of.
    const tracked = Bun.spawnSync(['git', 'ls-files', '--cached', '--others', '--exclude-standard'], {
      cwd: ROOT,
    })
      .stdout.toString()
      .split('\n')
      .filter((f) => /\.(md|ts|tsx|js|mjs|py|sql)$/.test(f) && existsSync(`${ROOT}${f}`));
    expect(tracked.length).toBeGreaterThan(0); // git missing must not read as "nothing is broken"

    const broken: string[] = [];
    for (const f of tracked)
      for (const m of readFileSync(`${ROOT}${f}`, 'utf8').matchAll(/docs\/adr\/[A-Za-z0-9/-]+\.md/g))
        if (!existsSync(`${ROOT}${m[0]}`)) broken.push(`${f} -> ${m[0]}`);
    expect(broken).toEqual([]);
  });

  it('requires the alternatives that lost in every accepted record', () => {
    // A record without them is a restatement of the code. repcheck had to make this a ratchet
    // because 19 records predated the rule; nothing here does, so it is simply zero.
    const thin = adrs
      .filter((a) => a.status === 'accepted')
      .filter((a) => !/^#{2,3}\s+.*(Alternatives|rejected|considered)/im.test(a.body))
      .map((a) => a.file);
    expect(thin).toEqual([]);
  });
});
