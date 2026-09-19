import { describe, expect, it } from 'bun:test';
import {
  EVALUATION_MODES,
  EVALUATION_STATUSES,
  EVENT_TYPE_CERTAINTIES,
  EVENT_TYPES,
  ORIGIN_DEPTH_TYPES,
} from './quakemlVocabulary';

// The vocabularies in quakemlVocabulary.ts must be exactly what QuakeML's own schema file says.
// A misspelt value would make real, valid earthquakes fail to parse — so this reads the schema
// directly rather than trusting the copy.

const xsd = await Bun.file('schemas/quakeml/1.2/QuakeML-BED-1.2.xsd').text();

function enumeration(name: string): string[] {
  const body = new RegExp(`<xs:simpleType name="${name}">([\\s\\S]*?)</xs:simpleType>`).exec(xsd)?.[1];
  if (!body) throw new Error(`QuakeML schema has no simpleType ${name}`);
  return [...body.matchAll(/<xs:enumeration value="([^"]+)"/g)].map((m) => m[1] ?? '');
}

describe('QuakeML vocabularies match the official schema', () => {
  it.each([
    ['EventType', EVENT_TYPES],
    ['EventTypeCertainty', EVENT_TYPE_CERTAINTIES],
    ['EvaluationMode', EVALUATION_MODES],
    ['EvaluationStatus', EVALUATION_STATUSES],
    ['OriginDepthType', ORIGIN_DEPTH_TYPES],
  ] as const)('%s', (name, ours) => {
    expect([...ours] as string[]).toEqual(enumeration(name));
  });
});
