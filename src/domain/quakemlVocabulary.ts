// QuakeML 1.2 VOCABULARIES — generated from schemas/quakeml/1.2/QuakeML-BED-1.2.xsd, not typed by hand.
// quakemlVocabulary.test.ts re-reads the schema and fails if these drift from it.
//
// QuakeML 1.2 is frozen (2013), so these lists will not change. The test exists to catch a
// transcription error, which would matter: a misspelt type makes real, valid data fail to parse.
//
// Noma accepts ONLY these values (see ADR-0002). Noma re-serves QuakeML, so a value
// outside the standard would make Noma's own output invalid.

// What happened. 44 values, including several Noma's later domains need (volcanic eruption, ice quake, landslide, debris avalanche).
export const EVENT_TYPES = [
  'not existing',
  'not reported',
  'earthquake',
  'anthropogenic event',
  'collapse',
  'cavity collapse',
  'mine collapse',
  'building collapse',
  'explosion',
  'accidental explosion',
  'chemical explosion',
  'controlled explosion',
  'experimental explosion',
  'industrial explosion',
  'mining explosion',
  'quarry blast',
  'road cut',
  'blasting levee',
  'nuclear explosion',
  'induced or triggered event',
  'rock burst',
  'reservoir loading',
  'fluid injection',
  'fluid extraction',
  'crash',
  'plane crash',
  'train crash',
  'boat crash',
  'other event',
  'atmospheric event',
  'sonic boom',
  'sonic blast',
  'acoustic noise',
  'thunder',
  'avalanche',
  'snow avalanche',
  'debris avalanche',
  'hydroacoustic event',
  'ice quake',
  'slide',
  'landslide',
  'rockslide',
  'meteorite',
  'volcanic eruption',
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

// How sure the agency is of the event type.
export const EVENT_TYPE_CERTAINTIES = [
  'known',
  'suspected',
] as const;
export type EventTypeCertainty = (typeof EVENT_TYPE_CERTAINTIES)[number];

// Whether a human was involved.
export const EVALUATION_MODES = [
  'manual',
  'automatic',
] as const;
export type EvaluationMode = (typeof EVALUATION_MODES)[number];

// How far through review. `rejected` means the agency decided it was wrong.
export const EVALUATION_STATUSES = [
  'preliminary',
  'confirmed',
  'reviewed',
  'final',
  'rejected',
] as const;
export type EvaluationStatus = (typeof EVALUATION_STATUSES)[number];

// How the depth was arrived at. `operator assigned` means a person set it, not an algorithm.
export const ORIGIN_DEPTH_TYPES = [
  'from location',
  'from moment tensor inversion',
  'from modeling of broad-band P waveforms',
  'constrained by depth phases',
  'constrained by direct phases',
  'constrained by depth and direct phases',
  'operator assigned',
  'other',
] as const;
export type OriginDepthType = (typeof ORIGIN_DEPTH_TYPES)[number];

export function isOneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}
