// THE TYPES FOR ONE EARTHQUAKE — QuakeML's Event / Origin / Magnitude, plus Noma's envelope.
//
// Why this shape: docs/architecture/domain-model.md (points 2, 3, 8, 9).
// A real record these were checked against: docs/research/example-quakeml-ingv-etna-2026-08-15.xml
//
// REQUIRED vs OPTIONAL follows the QuakeML 1.2 SPEC DOCUMENT, not its schema file. The schema file
// wraps every field in an any-order, any-count group, so by the schema alone an Origin with no
// latitude is valid. The spec's UML says time, latitude and longitude are required, and so do we.
// These types are therefore stricter than QuakeML's own schema file — deliberately.
//
// Field names are QuakeML's (domain-model point 3), including its capitalisation of `publicID`.

import type {
  EvaluationMode,
  EvaluationStatus,
  EventType,
  EventTypeCertainty,
  OriginDepthType,
} from './quakemlVocabulary';

// ── Brands ───────────────────────────────────────────────────────────────────
// A branded type is an ordinary value at runtime; the brand exists only for the compiler, which
// then refuses to use one kind where another is expected (see ADR-0002).

declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

export type SourceId = Brand<string, 'SourceId'>;
export type EventId = Brand<string, 'EventId'>;
export type OriginId = Brand<string, 'OriginId'>;
export type MagnitudeId = Brand<string, 'MagnitudeId'>;

/** A length in metres. QuakeML gives depth in metres; the FDSN text format gives KILOMETRES for the
 *  same field. The only way to make one is `metres()`, so any conversion is written down. */
export type Metres = Brand<number, 'Metres'>;

export const sourceId = (s: string) => s as SourceId;
export const eventId = (s: string) => s as EventId;
export const originId = (s: string) => s as OriginId;
export const magnitudeId = (s: string) => s as MagnitudeId;

export function metres(n: number): Metres {
  if (!Number.isFinite(n)) throw new RangeError(`not a length: ${n}`);
  return n as Metres;
}

// ── Provenance: Noma's, not QuakeML's ────────────────────────────────────────

export type ProvenanceClass =
  | 'OBSERVED' // someone measured it
  | 'HISTORICAL' // from an archive or an older account
  | 'RETRIEVED' // fetched from a live service
  | 'CALCULATED' // arithmetic over other records
  | 'MODELLED' // a scientific model produced it
  | 'SIMULATED' // a what-if run
  | 'INFERRED' // we worked it out, and could be wrong
  | 'FORECAST'; // a claim about the future

/** Noma's fields, kept apart from the standard's (see ADR-0002). Re-serving valid QuakeML
 *  is then `const { envelope, ...quakeml } = record` — nothing of ours can leak out, and nothing of
 *  ours can collide with a name the standard uses. */
export interface Envelope {
  provenance: ProvenanceClass; // required, never defaulted: missing is an error, not OBSERVED
  sourceId: SourceId;
  retrievedAt: Date; // when NOMA got it — not when it happened, not when the agency published it
  raw: string; // key of the untouched original (domain-model point 8)
}

// ── Quantities, as QuakeML defines them ──────────────────────────────────────
// In QuakeML a number is never bare: latitude, depth, time and magnitude each carry their own
// uncertainty. The UNCERTAINTY FIELDS are optional because feeds often omit them; the value is not.
//
// Whatever is chosen here, the type cannot make a screen SHOW uncertainty. A 3.9 with none reported
// looks exactly as precise as 3.9 ± 0.0. That is a display rule, and it is still owed.

export interface Uncertainty {
  uncertainty?: number; // symmetric: value ± this
  lowerUncertainty?: number; // asymmetric: value − this
  upperUncertainty?: number; // asymmetric: value + this
  confidenceLevel?: number; // percent
}

export interface RealQuantity<T extends number = number> extends Uncertainty {
  value: T;
}

export interface TimeQuantity extends Uncertainty {
  value: Date; // uncertainty fields are in SECONDS
}

// ── Event: that something happened ───────────────────────────────────────────
// An identity, not a measurement. Where and how big are separate records, because agencies
// disagree AND revise (domain-model point 2). Everything but the id is optional in QuakeML.

export interface Event {
  envelope: Envelope;
  publicID: EventId;
  type?: EventType;
  typeCertainty?: EventTypeCertainty;
  description?: string; // "7 km W Linguaglossa (CT)"
  preferredOriginID?: OriginId; // the account this agency stands behind
  preferredMagnitudeID?: MagnitudeId;
  agencyID?: string;
}

// ── Origin: where and when, according to ONE agency ──────────────────────────

export interface Origin {
  envelope: Envelope;
  publicID: OriginId;
  eventID: EventId; // QuakeML nests an Origin inside its Event; we keep the link explicitly

  time: TimeQuantity;
  latitude: RealQuantity; // degrees
  longitude: RealQuantity; // degrees
  depth?: RealQuantity<Metres>; // METRES, positive downward, may be NEGATIVE (above sea level)
  depthType?: OriginDepthType;

  /** Always present, possibly empty (see ADR-0002): code reading it never has to ask
   *  whether it exists, only what is in it. */
  uncertainty: OriginUncertainty;
  /** Never drawn on a map. Kept because it is how a seismologist decides whether to trust the
   *  location at all, and because a field dropped here cannot be re-served (point 8). */
  quality: OriginQuality;

  evaluationMode?: EvaluationMode;
  evaluationStatus?: EvaluationStatus;
  agencyID?: string;
  creationTime?: Date; // when the AGENCY produced this account — the other half of "what did we know when"
}

export interface OriginUncertainty {
  horizontalUncertainty?: number; // metres
  minHorizontalUncertainty?: number; // metres
  maxHorizontalUncertainty?: number; // metres
  azimuthMaxHorizontalUncertainty?: number; // degrees
  preferredDescription?: string;
  confidenceLevel?: number; // percent
}

export interface OriginQuality {
  associatedPhaseCount?: number;
  usedPhaseCount?: number;
  associatedStationCount?: number;
  usedStationCount?: number;
  depthPhaseCount?: number;
  standardError?: number; // seconds
  azimuthalGap?: number; // degrees — the largest gap in station coverage around the event
  secondaryAzimuthalGap?: number; // degrees
  maximumDistance?: number; // degrees
  minimumDistance?: number; // degrees
  medianDistance?: number; // degrees
}

// ── Magnitude: how big, according to ONE agency ──────────────────────────────

export interface Magnitude {
  envelope: Envelope;
  publicID: MagnitudeId;
  eventID: EventId;
  originID?: OriginId; // which location this size was computed from

  mag: RealQuantity;
  /** "ML", "Mw", "Md"… Free text in QuakeML, and the case varies between agencies (INGV "ML",
   *  USGS "ml"). Magnitudes of different types are not directly comparable — kept as given. */
  type?: string;
  stationCount?: number;
  azimuthalGap?: number; // degrees

  evaluationMode?: EvaluationMode;
  evaluationStatus?: EvaluationStatus;
  agencyID?: string;
  creationTime?: Date;
}
