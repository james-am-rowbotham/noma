// THE FIRST SIX TYPES. Everything Noma needs to hold one earthquake, honestly.
//
// Shape and reasons: docs/architecture/domain-model.md
// A real record to check them against: docs/research/example-quakeml-ingv-etna-2026-08-15.xml
// The spec, as a failing test: src/domain/quake.test.ts
//
// SKELETON — the five decisions marked DECISION are James's. Each lists what it costs.
// Delete each DECISION comment as you resolve it.

// ── 1. Provenance ────────────────────────────────────────────────────────────
// The eight classes from CLAUDE.md. This is the field the standards refuse to have, and the one
// that stops a simulation being drawn as a measurement.

export type ProvenanceClass =
  | 'OBSERVED' // someone measured it
  | 'HISTORICAL' // from an archive or an older account
  | 'RETRIEVED' // fetched from a live service
  | 'CALCULATED' // arithmetic over other records
  | 'MODELLED' // a scientific model produced it
  | 'SIMULATED' // a what-if run
  | 'INFERRED' // we worked it out, and could be wrong
  | 'FORECAST'; // a claim about the future

// DECISION 1 — how does a record wear its provenance?
//
//   (a) intersection:  type Origin = Envelope & { time: ... }
//       flat. `origin.provenance`. Every field at one level.
//
//   (b) nested field:  type Origin = { envelope: Envelope; time: ... }
//       `origin.envelope.provenance`. Longer to write, but the envelope can be passed around on
//       its own, and it is obvious which fields are ours and which came from QuakeML.
//
// This is the one to think hardest about: it is on every record in the system forever, and
// changing it later touches every file. My lean is (b), because the QuakeML fields and Noma's
// fields have different owners and different rules, and (a) mixes them into one bag where a
// reader cannot tell which is which. But (a) is nicer to use, and that counts for something.

// ── 2. Source ────────────────────────────────────────────────────────────────

export interface Source {
  id: SourceId;
  name: string; // "Istituto Nazionale di Geofisica e Vulcanologia"
  rorId?: string; // permanent id for the organisation
  licence: string; // "CC-BY-4.0" — governs what Noma may re-serve. Never optional.
}

// DECISION 2 — are ids branded, or plain strings?
//
//   (a) type SourceId = string
//       simple. Nothing stops `getSource(eventId)` compiling.
//
//   (b) type SourceId = string & { readonly __brand: 'SourceId' }
//       a "branded" type: still a string at runtime, but the compiler refuses to swap one kind of
//       id for another. Costs a cast at every boundary where a raw string becomes an id.
//
// There will be at least five id kinds (Source, System, Event, Origin, Magnitude) and QuakeML's
// are all long `smi:` URIs that look identical.

export type SourceId = /* DECISION 2 */ string;

// ── 3. The envelope ──────────────────────────────────────────────────────────

export interface Envelope {
  provenance: ProvenanceClass; // required, never defaulted — a missing one is an error, not OBSERVED
  sourceId: SourceId;
  retrievedAt: Date; // when NOMA got it. Not when it was measured.
  raw: string; // key of the untouched original in object storage (domain-model point 8)
  // generatedBy?: RunId   — added with models, not now
}

// ── 4. Event — the thing that happened ───────────────────────────────────────
// Just an identity. Not where, not how big. Those are separate records because agencies disagree
// AND revise: see domain-model point 2.

export interface Event {
  publicID: string;
  type: EventType;
  description?: string; // "7 km W Linguaglossa (CT)"
  preferredOriginID: string; // which account this agency stands behind
  preferredMagnitudeID: string;
  agencyID: string;
}

// DECISION 3 — what is EventType?
//
//   (a) a union of the values we expect:  'earthquake' | 'eruption' | 'explosion'
//       the compiler checks a switch is exhaustive. But QuakeML 1.2 defines ~30 event types, and
//       an unexpected one from a real feed would fail to parse.
//
//   (b) string
//       nothing ever fails. Nothing is ever checked either.
//
//   (c) the known ones, plus an escape hatch:  KnownEventType | (string & {})
//       parses anything, and still autocompletes the known ones.
//
// The real question behind it: when INGV sends a type we have never seen, should Noma refuse the
// record, or keep it and show it as-is? Point 8 of the domain model ("keep what we were given")
// pushes one way; validating external data pushes the other.

export type EventType = /* DECISION 3 */ string;

// ── 5. Origin — where and when, according to ONE agency ──────────────────────

export interface Origin {
  publicID: string;
  eventID: string;
  time: Date;
  latitude: number;
  longitude: number;

  // DECISION 4 — depth.
  // QuakeML gives METRES, positive downward, and it may be NEGATIVE: this real Etna record is
  // 1210 (1.2 km down), and a quake on a volcano's flank can sit above sea level. The fdsnws text
  // format uses KILOMETRES for the same field. Mixing them up moves an earthquake a thousand-fold.
  //
  //   (a) depth: number             plus a comment saying metres
  //   (b) depthMetres: number       the unit is in the name, unmissable at every call site
  //   (c) depth: Metres             a branded number; the compiler refuses kilometres
  //
  // CLAUDE.md says "treat timestamps and units carefully". This is where that starts.
  depth: number /* DECISION 4 */;

  uncertainty: OriginUncertainty;
  quality: OriginQuality;
  agencyID: string;
  evaluationMode?: 'manual' | 'automatic';
  evaluationStatus?: string; // "reviewed"
}

// DECISION 5 — uncertainty and quality: how hard do we insist?
//
// The Etna record HAS horizontalUncertainty 200 m at 68% confidence, and a full quality block.
// Many records do not. Options:
//
//   (a) every field optional          — easy to parse anything, easy to forget to show it
//   (b) the container required, fields inside optional  — `origin.uncertainty` always exists,
//       so a UI cannot silently skip it; `.horizontal` may be undefined and must be handled
//   (c) required everywhere           — honest about what we want, refuses real data
//
// CLAUDE.md: "Make uncertainty explicit." Does explicit mean impossible-to-omit in the type, or
// impossible-to-ignore in the UI? They are not the same choice.

export interface OriginUncertainty {
  horizontal?: number; // metres
  vertical?: number; // metres
  confidenceLevel?: number; // percent — 68 in the Etna record
}

// Not drawn on any map. Kept because point 8 says a field dropped here can never be given back,
// and because azimuthalGap is how a seismologist judges whether to trust the location at all.
export interface OriginQuality {
  azimuthalGap?: number; // degrees. 108 in the Etna record.
  standardError?: number;
  associatedPhaseCount?: number;
  usedPhaseCount?: number;
  associatedStationCount?: number;
  usedStationCount?: number;
  minimumDistance?: number; // degrees
  maximumDistance?: number;
}

// ── 6. Magnitude — how big, according to ONE agency ──────────────────────────

export interface Magnitude {
  publicID: string;
  eventID: string;
  originID: string;
  mag: number;
  type: string; // "ML", "Mw", "Md" — free text in QuakeML, and the case varies (INGV "ML", USGS "ml")
  uncertainty?: number; // 0.2 in the Etna record: the 3.9 could honestly be 3.7 or 4.1
  agencyID: string;
}
