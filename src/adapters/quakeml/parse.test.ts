import { beforeAll, describe, expect, it } from 'bun:test';
import { type Envelope, metres, sourceId } from '../../domain/quake';
import { parseQuakeML, QuakeMLError } from './parse';

// THE SPEC FOR THE QUAKEML ADAPTER, written against a REAL record rather than a made-up one.
//
// The fixture is one earthquake fetched from INGV on 2026-09-18: M3.9 ML, 7 km W Linguaglossa, on
// Etna's north-east flank, 2026-08-15. It exercises every awkward part at once — a depth in metres
// that would be absurd read as kilometres, an uncertainty on the magnitude, a full quality block,
// a 22-minute gap between the shaking and the published number, and INGV's own extensions.

const FIXTURE = 'docs/research/example-quakeml-ingv-etna-2026-08-15.xml';

// Rule 1 in parse.ts is only tested if this runs somewhere that is NOT UTC. A CI machine is usually
// UTC, where reading a timestamp as local time happens to give the right answer.
beforeAll(() => {
  process.env.TZ = 'Europe/Amsterdam';
});

const xml = await Bun.file(FIXTURE).text();
const envelope: Envelope = {
  provenance: 'OBSERVED',
  sourceId: sourceId('ingv'),
  retrievedAt: new Date('2026-09-18T19:51:00Z'),
  raw: FIXTURE,
};
const parse = (doc = xml) => parseQuakeML(doc, envelope);

describe('parsing one real INGV earthquake', () => {
  it('finds one event, one origin, one magnitude', () => {
    const { events, origins, magnitudes } = parse();
    expect([events.length, origins.length, magnitudes.length]).toEqual([1, 1, 1]);
  });

  it('reads the event as an identity, not as a measurement', () => {
    // The Event carries NO magnitude and NO location. That is the whole point of the split.
    const [event] = parse().events;
    expect(event).toMatchObject({
      type: 'earthquake',
      description: '7 km W Linguaglossa (CT)',
      agencyID: 'INGV',
    });
    expect(event).not.toHaveProperty('mag');
    expect(event).not.toHaveProperty('latitude');
  });

  it('points at the origin and magnitude INGV stands behind, and they exist', () => {
    const { events, origins, magnitudes } = parse();
    const [event] = events;
    if (!event?.preferredOriginID || !event.preferredMagnitudeID) throw new Error('no preferred ids');
    expect(origins.map((o) => o.publicID)).toContain(event.preferredOriginID);
    expect(magnitudes.map((m) => m.publicID)).toContain(event.preferredMagnitudeID);
  });

  it('reads depth in METRES, as QuakeML gives it', () => {
    // 1210 m = 1.2 km. Read as kilometres this earthquake would sit 1,210 km down — through the
    // crust, through the mantle, most of the way to the outer core.
    const [origin] = parse().origins;
    // `metres(1210)`, not `1210`: the brand refuses a bare number even here.
    expect(origin?.depth?.value).toBe(metres(1210));
  });

  it('places it on Etna', () => {
    const [origin] = parse().origins;
    expect([origin?.latitude.value, origin?.longitude.value]).toEqual([37.832, 15.07]);
  });

  it('reads the time as UTC, even on a machine that is not', () => {
    // QuakeML writes 2026-08-15T10:24:08.910000 with no timezone marker. JavaScript reads that as
    // local time: in Amsterdam, 08:24 UTC — two hours early, with no error.
    const [origin] = parse().origins;
    expect(new Date(0).getTimezoneOffset()).not.toBe(0); // proves this test is not running in UTC
    expect(origin?.time.value.toISOString()).toBe('2026-08-15T10:24:08.910Z');
  });

  it('keeps when it happened apart from when the agency published it', () => {
    // 22 minutes. Collapsing these loses the ability to answer "what did we know at 10:25?".
    const [origin] = parse().origins;
    expect(origin?.time.value.toISOString()).toBe('2026-08-15T10:24:08.910Z');
    expect(origin?.creationTime?.toISOString()).toBe('2026-08-15T10:46:43.000Z');
  });

  it('keeps the uncertainty attached to the magnitude', () => {
    // 3.9 ± 0.2. A filter of "above magnitude 4" excludes this event, though it may honestly be 4.1.
    const [magnitude] = parse().magnitudes;
    expect(magnitude?.mag).toEqual({ value: 3.9, uncertainty: 0.2 });
    expect(magnitude).toMatchObject({ type: 'ML', agencyID: 'INGV' });
  });

  it('keeps the location uncertainty', () => {
    const [origin] = parse().origins;
    expect(origin?.uncertainty).toMatchObject({ horizontalUncertainty: 200, confidenceLevel: 68 });
  });

  it('keeps the quality block nothing will ever draw', () => {
    // azimuthalGap is how a seismologist decides whether to trust the location at all.
    const [origin] = parse().origins;
    expect(origin?.quality).toMatchObject({
      azimuthalGap: 108,
      standardError: 0.25,
      usedPhaseCount: 18,
      usedStationCount: 15,
    });
  });

  it('records that a human reviewed it', () => {
    const [origin] = parse().origins;
    expect(origin).toMatchObject({ evaluationMode: 'manual', evaluationStatus: 'reviewed' });
  });

  it('labels every record with the envelope it was given', () => {
    // The provenance class is Noma's, not QuakeML's: QuakeML has no opinion about whether this is a
    // measurement or a simulation.
    const { events, origins, magnitudes } = parse();
    for (const record of [...events, ...origins, ...magnitudes]) {
      expect(record.envelope.provenance).toBe('OBSERVED');
      expect(record.envelope.sourceId).toBe(sourceId('ingv'));
    }
  });

  it("keeps Noma's fields out of QuakeML's", () => {
    // ADR-0002: re-serving is `const { envelope, ...quakeml } = record`. That is only safe if no
    // envelope field has leaked to the top level.
    const [origin] = parse().origins;
    const { envelope: _, ...quakeml } = origin ?? {};
    for (const ours of Object.keys(envelope)) expect(quakeml).not.toHaveProperty(ours);
  });
});

describe('refusing what the standard does not allow', () => {
  const edit = (from: string, to: string) => {
    if (!xml.includes(from)) throw new Error(`fixture no longer contains ${from}`);
    return xml.replace(from, to);
  };

  it('refuses an event type QuakeML does not define', () => {
    expect(() => parse(edit('<type>earthquake</type>', '<type>quake-ish</type>'))).toThrow(
      '"quake-ish" is not a QuakeML 1.2 event type',
    );
  });

  it('refuses an origin with no latitude — required by the spec, though not by the schema file', () => {
    expect(() =>
      parse(edit('<latitude>\n          <value>37.832</value>\n        </latitude>', '')),
    ).toThrow(QuakeMLError);
  });

  it('refuses a number that is not a number, instead of producing NaN', () => {
    expect(() => parse(edit('<value>1210</value>', '<value>deep</value>'))).toThrow('not a number');
  });

  it('accepts an origin with no depth — optional in QuakeML', () => {
    const [origin] = parse(edit('<depth>\n          <value>1210</value>\n        </depth>', '')).origins;
    expect(origin?.depth).toBeUndefined();
  });
});
