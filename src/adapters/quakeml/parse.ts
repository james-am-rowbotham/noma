import { XMLParser } from 'fast-xml-parser';
import {
  type Envelope,
  type Event,
  eventId,
  type Magnitude,
  magnitudeId,
  metres,
  type Origin,
  type OriginQuality,
  type OriginUncertainty,
  originId,
  type RealQuantity,
  type TimeQuantity,
  type Uncertainty,
} from '../../domain/quake';
import {
  EVALUATION_MODES,
  EVALUATION_STATUSES,
  EVENT_TYPE_CERTAINTIES,
  EVENT_TYPES,
  isOneOf,
  ORIGIN_DEPTH_TYPES,
} from '../../domain/quakemlVocabulary';

// QUAKEML 1.2 → NOMA'S TYPES. The only place in Noma that reads QuakeML XML. Generic: INGV and
// USGS serve the same format, so the source is supplied by the caller in the envelope.
//
// Three rules, each of which is a way this can silently corrupt data:
//
//  1. TIMES ARE UTC. QuakeML timestamps usually carry no timezone marker, and JavaScript reads an
//     unmarked timestamp as LOCAL time. On a machine in Amsterdam in August that moves every
//     earthquake two hours early without an error. See `time()`.
//
//  2. NUMBERS ARE PARSED ON PURPOSE. The XML library is told not to convert anything, and every
//     number goes through `num()`, which refuses text that is not a number instead of producing NaN.
//
//  3. UNKNOWN VALUES FAIL LOUDLY. A vocabulary value outside the QuakeML 1.2 lists throws — Noma
//     re-serves QuakeML and must not pass on something the standard does not define.
//
// What this does NOT keep is not lost: the original document is stored whole (envelope.raw), and
// that is what makes it safe to type only the fields Noma uses.

export class QuakeMLError extends Error {
  override name = 'QuakeMLError';
}

export interface ParsedQuakeML {
  events: Event[];
  origins: Origin[];
  magnitudes: Magnitude[];
}

const xml = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false, // rule 2: nothing converted behind our back
  parseAttributeValue: false,
  removeNSPrefix: false, // keep `ingv:quality` distinct from QuakeML's own `quality`
  trimValues: true,
  // These repeat in QuakeML. Without this, ONE event parses as an object and TWO as an array.
  isArray: (name) => ['event', 'origin', 'magnitude', 'description', 'comment'].includes(name),
});

/** Parse a QuakeML 1.2 document. Every record gets the same envelope: one document, one source,
 *  one retrieval. */
export function parseQuakeML(document: string, envelope: Envelope): ParsedQuakeML {
  const root = xml.parse(document)?.['q:quakeml'];
  if (!root) throw new QuakeMLError('not a QuakeML document: no <q:quakeml> root');

  const out: ParsedQuakeML = { events: [], origins: [], magnitudes: [] };

  for (const e of root.eventParameters?.event ?? []) {
    const id = eventId(required(e['@_publicID'], 'event publicID'));
    out.events.push(parseEvent(e, id, envelope));
    for (const o of e.origin ?? []) out.origins.push(parseOrigin(o, id, envelope));
    for (const m of e.magnitude ?? []) out.magnitudes.push(parseMagnitude(m, id, envelope));
  }
  return out;
}

// ── records ──────────────────────────────────────────────────────────────────

// biome-ignore lint/suspicious/noExplicitAny: parsed XML is untyped until validated here
type Node = any;

function parseEvent(e: Node, publicID: Event['publicID'], envelope: Envelope): Event {
  const event: Event = { envelope, publicID };
  const type = e.type;
  if (type !== undefined) event.type = vocab(EVENT_TYPES, type, 'event type', publicID);
  if (e.typeCertainty !== undefined)
    event.typeCertainty = vocab(EVENT_TYPE_CERTAINTIES, e.typeCertainty, 'event type certainty', publicID);
  const description = e.description?.[0]?.text;
  if (description !== undefined) event.description = String(description);
  if (e.preferredOriginID !== undefined) event.preferredOriginID = originId(e.preferredOriginID);
  if (e.preferredMagnitudeID !== undefined) event.preferredMagnitudeID = magnitudeId(e.preferredMagnitudeID);
  const agency = e.creationInfo?.agencyID;
  if (agency !== undefined) event.agencyID = String(agency);
  return event;
}

function parseOrigin(o: Node, eventID: Event['publicID'], envelope: Envelope): Origin {
  const publicID = originId(required(o['@_publicID'], 'origin publicID'));
  const where = `origin ${publicID}`;

  // Required by the QuakeML 1.2 spec document, though not by its schema file.
  const origin: Origin = {
    envelope,
    publicID,
    eventID,
    time: timeQuantity(o.time, `${where} time`),
    latitude: realQuantity(o.latitude, `${where} latitude`),
    longitude: realQuantity(o.longitude, `${where} longitude`),
    uncertainty: originUncertainty(o.originUncertainty),
    quality: originQuality(o.quality),
  };

  if (o.depth !== undefined) {
    // METRES in QuakeML. The brand makes this the one place the unit is asserted.
    const depth = realQuantity(o.depth, `${where} depth`);
    origin.depth = { ...depth, value: metres(depth.value) };
  }
  if (o.depthType !== undefined) origin.depthType = vocab(ORIGIN_DEPTH_TYPES, o.depthType, 'depth type', where);
  if (o.evaluationMode !== undefined)
    origin.evaluationMode = vocab(EVALUATION_MODES, o.evaluationMode, 'evaluation mode', where);
  if (o.evaluationStatus !== undefined)
    origin.evaluationStatus = vocab(EVALUATION_STATUSES, o.evaluationStatus, 'evaluation status', where);
  if (o.creationInfo?.agencyID !== undefined) origin.agencyID = String(o.creationInfo.agencyID);
  if (o.creationInfo?.creationTime !== undefined)
    origin.creationTime = time(o.creationInfo.creationTime, `${where} creationTime`);
  return origin;
}

function parseMagnitude(m: Node, eventID: Event['publicID'], envelope: Envelope): Magnitude {
  const publicID = magnitudeId(required(m['@_publicID'], 'magnitude publicID'));
  const where = `magnitude ${publicID}`;

  const magnitude: Magnitude = {
    envelope,
    publicID,
    eventID,
    mag: realQuantity(m.mag, `${where} mag`), // required by the spec document
  };
  if (m.originID !== undefined) magnitude.originID = originId(m.originID);
  if (m.type !== undefined) magnitude.type = String(m.type); // free text in QuakeML: kept as given
  if (m.stationCount !== undefined) magnitude.stationCount = num(m.stationCount, `${where} stationCount`);
  if (m.azimuthalGap !== undefined) magnitude.azimuthalGap = num(m.azimuthalGap, `${where} azimuthalGap`);
  if (m.evaluationMode !== undefined)
    magnitude.evaluationMode = vocab(EVALUATION_MODES, m.evaluationMode, 'evaluation mode', where);
  if (m.evaluationStatus !== undefined)
    magnitude.evaluationStatus = vocab(EVALUATION_STATUSES, m.evaluationStatus, 'evaluation status', where);
  if (m.creationInfo?.agencyID !== undefined) magnitude.agencyID = String(m.creationInfo.agencyID);
  if (m.creationInfo?.creationTime !== undefined)
    magnitude.creationTime = time(m.creationInfo.creationTime, `${where} creationTime`);
  return magnitude;
}

// ── quantities ───────────────────────────────────────────────────────────────

function uncertainty(q: Node, where: string): Uncertainty {
  const u: Uncertainty = {};
  for (const k of ['uncertainty', 'lowerUncertainty', 'upperUncertainty', 'confidenceLevel'] as const)
    if (q[k] !== undefined) u[k] = num(q[k], `${where} ${k}`);
  return u;
}

function realQuantity(q: Node, where: string): RealQuantity {
  if (q === undefined) throw new QuakeMLError(`${where} is missing`);
  return { value: num(q.value, where), ...uncertainty(q, where) };
}

function timeQuantity(q: Node, where: string): TimeQuantity {
  if (q === undefined) throw new QuakeMLError(`${where} is missing`);
  return { value: time(q.value, where), ...uncertainty(q, where) };
}

function originUncertainty(u: Node): OriginUncertainty {
  const out: OriginUncertainty = {};
  if (!u) return out; // ADR-0002: always present, possibly empty
  for (const k of [
    'horizontalUncertainty',
    'minHorizontalUncertainty',
    'maxHorizontalUncertainty',
    'azimuthMaxHorizontalUncertainty',
    'confidenceLevel',
  ] as const)
    if (u[k] !== undefined) out[k] = num(u[k], `originUncertainty ${k}`);
  if (u.preferredDescription !== undefined) out.preferredDescription = String(u.preferredDescription);
  return out;
}

function originQuality(q: Node): OriginQuality {
  const out: OriginQuality = {};
  if (!q) return out;
  for (const k of [
    'associatedPhaseCount',
    'usedPhaseCount',
    'associatedStationCount',
    'usedStationCount',
    'depthPhaseCount',
    'standardError',
    'azimuthalGap',
    'secondaryAzimuthalGap',
    'maximumDistance',
    'minimumDistance',
    'medianDistance',
  ] as const)
    if (q[k] !== undefined) out[k] = num(q[k], `quality ${k}`);
  return out;
}

// ── primitives ───────────────────────────────────────────────────────────────

function required(v: unknown, what: string): string {
  if (v === undefined || v === '') throw new QuakeMLError(`${what} is missing`);
  return String(v);
}

/** Rule 2. `Number('')` is 0 and `Number('abc')` is NaN; both would pass silently. */
function num(v: unknown, where: string): number {
  const s = String(v ?? '').trim();
  const n = Number(s);
  if (s === '' || !Number.isFinite(n)) throw new QuakeMLError(`${where}: not a number: ${JSON.stringify(v)}`);
  return n;
}

/** Rule 1. QuakeML times are UTC; an unmarked one gets a Z before JavaScript sees it.
 *  Sub-millisecond digits (QuakeML allows microseconds) are truncated by Date — the untouched
 *  original keeps them. */
function time(v: unknown, where: string): Date {
  const s = String(v ?? '').trim();
  const utc = /(Z|[+-]\d{2}:?\d{2})$/.test(s) ? s : `${s}Z`;
  const d = new Date(utc);
  if (s === '' || Number.isNaN(d.getTime())) throw new QuakeMLError(`${where}: not a time: ${JSON.stringify(v)}`);
  return d;
}

/** Rule 3. */
function vocab<T extends string>(list: readonly T[], v: unknown, what: string, where: string): T {
  const s = String(v).trim();
  if (!isOneOf(list, s)) throw new QuakeMLError(`${where}: "${s}" is not a QuakeML 1.2 ${what}`);
  return s;
}
