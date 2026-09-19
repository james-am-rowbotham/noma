import { describe, expect, it } from 'bun:test';

// THE SPEC FOR THE FIRST ADAPTER, written against a REAL record rather than a made-up one.
//
// The fixture is one earthquake fetched from INGV on 2026-09-18: M3.9 ML, 7 km W Linguaglossa,
// on Etna's north-east flank, 2026-08-15. It was chosen because it exercises every awkward part
// at once — a depth in metres that would be absurd read as kilometres, an uncertainty on the
// magnitude, a full quality block, a 22-minute gap between the shaking and the published number,
// and INGV's own vendor extensions.
//
// RED UNTIL THE TYPES EXIST. `parseQuakeML` is not written yet, and its exact shape depends on
// decisions 1 and 4 in src/domain/quake.ts (how the envelope attaches; what the depth field is
// called). The VALUES below do not depend on either, so they are the stable part: whatever shape
// is chosen, these numbers must come out.

import { parseQuakeML } from './quakeml';

const FIXTURE = 'docs/research/example-quakeml-ingv-etna-2026-08-15.xml';

const xml = await Bun.file(FIXTURE).text();

describe('parsing one real INGV earthquake', () => {
  it('finds exactly one event', () => {
    const { events } = parseQuakeML(xml);
    expect(events).toHaveLength(1);
  });

  it('reads the event as an identity, not as a measurement', () => {
    // The Event carries NO magnitude and NO location. That is the whole point of the split.
    const [event] = parseQuakeML(xml).events;
    expect(event).toMatchObject({
      type: 'earthquake',
      description: '7 km W Linguaglossa (CT)',
      agencyID: 'INGV',
    });
    expect(event).not.toHaveProperty('mag');
    expect(event).not.toHaveProperty('latitude');
  });

  it('points at the origin and magnitude INGV stands behind', () => {
    const [event] = parseQuakeML(xml).events;
    expect(event?.preferredOriginID).toContain('originId=146858351');
    expect(event?.preferredMagnitudeID).toContain('magnitudeId=158311491');
  });

  it('reads depth in METRES, as QuakeML gives it', () => {
    // 1210 m = 1.2 km. Read as kilometres this earthquake would sit 1,210 km down — through the
    // crust, through the mantle, most of the way to the outer core. The unit is the whole test.
    const [origin] = parseQuakeML(xml).origins;
    expect(origin?.depth).toBe(1210);
  });

  it('places it on Etna', () => {
    const [origin] = parseQuakeML(xml).origins;
    expect(origin).toMatchObject({ latitude: 37.832, longitude: 15.07 });
  });

  it('keeps the two times apart', () => {
    // The ground shook at 10:24:08.910. INGV published the reviewed number at 10:46:43 — 22
    // minutes later, after a human checked it. Collapsing these into one timestamp loses the
    // ability to answer "what did we know at 10:25?".
    const [origin] = parseQuakeML(xml).origins;
    expect(origin?.time.toISOString()).toBe('2026-08-15T10:24:08.910Z');
  });

  it('keeps the uncertainty attached to the magnitude', () => {
    // 3.9 ± 0.2. A filter of "above magnitude 4" excludes this event, though it may honestly be
    // a 4.1. CLAUDE.md: make uncertainty explicit.
    const [magnitude] = parseQuakeML(xml).magnitudes;
    expect(magnitude).toMatchObject({ mag: 3.9, type: 'ML', uncertainty: 0.2, agencyID: 'INGV' });
  });

  it('keeps the location uncertainty', () => {
    const [origin] = parseQuakeML(xml).origins;
    expect(origin?.uncertainty).toMatchObject({ horizontal: 200, confidenceLevel: 68 });
  });

  it('keeps the quality block nothing will ever draw', () => {
    // azimuthalGap is how a seismologist decides whether to trust the location at all. Noma will
    // not put it on a map. Dropping it would mean Noma cannot re-serve this record faithfully —
    // domain-model point 8.
    const [origin] = parseQuakeML(xml).origins;
    expect(origin?.quality).toMatchObject({
      azimuthalGap: 108,
      standardError: 0.25,
      usedPhaseCount: 18,
      usedStationCount: 15,
    });
  });

  it('records that a human reviewed it', () => {
    const [origin] = parseQuakeML(xml).origins;
    expect(origin).toMatchObject({ evaluationMode: 'manual', evaluationStatus: 'reviewed' });
  });

  it('labels everything OBSERVED and attributes it to INGV', () => {
    // The provenance class is Noma's, not QuakeML's. QuakeML has no opinion about whether this is
    // a measurement or a simulation; Noma must.
    const { origins, magnitudes } = parseQuakeML(xml);
    for (const record of [...origins, ...magnitudes]) {
      expect(record.provenance).toBe('OBSERVED');
      expect(record.sourceId).toBe('ingv');
    }
  });
});
