/**
 * Element mapping & cusp blending utilities (Milestone M1)
 */
import { SIGN_STARTS, SIGN_ELEMENT, DEFAULT_ELEMENT_MAPPING } from './constants';
import type { ElementVector, ElementEncoded, ElementMappingConfig, BlendCurveType } from './types';

/** Normalize angle into [0,360). */
export function norm360(deg: number): number {
  let x = deg % 360;
  if (x < 0) x += 360;
  return x;
}

export function longitudeToSignIndex(longitude: number): number {
  const lon = norm360(longitude);
  return Math.floor(lon / 30) % 12;
}

export function applyBlendCurve(t: number, curve: BlendCurveType): number {
  switch (curve) {
    case 'smoothstep':
      return t * t * (3 - 2 * t);
    case 'cosine':
      return 0.5 * (1 - Math.cos(Math.PI * t));
    case 'linear':
    default:
      return t;
  }
}

/** Compute element vector for given longitude with cusp blending. */
export function computeElementVector(longitude: number, cfg: ElementMappingConfig = DEFAULT_ELEMENT_MAPPING): ElementVector {
  const lon = norm360(longitude);
  const signIndex = longitudeToSignIndex(lon);
  const signStart = SIGN_STARTS[signIndex];
  const nextSignIndex = (signIndex + 1) % 12;
  const nextSignStart = SIGN_STARTS[nextSignIndex];

  // Distance to next cusp
  const rel = lon - signStart; // 0..30
  const distToNext = 30 - rel; // 30..0

  const { cuspWidthDeg, curve } = cfg;
  let wThis = 1;
  let wNext = 0;

  if (distToNext < cuspWidthDeg) {
    const t = 1 - distToNext / cuspWidthDeg; // 0 at start of blend zone entering cusp, ->1 at cusp
    const shaped = applyBlendCurve(t, curve);
    wNext = shaped;
    wThis = 1 - shaped;
  } else if (rel < cuspWidthDeg) {
    // Optional: blend from previous sign near previous cusp. For simplicity only forward cusp blending now.
  }

  const elemThis = SIGN_ELEMENT[signIndex];
  const elemNext = SIGN_ELEMENT[nextSignIndex];

  const vector: ElementVector = { fire: 0, earth: 0, air: 0, water: 0 };
  (vector as any)[elemThis] += wThis;
  (vector as any)[elemNext] += wNext;

  // Ensure any minor FP drift removed
  return vector;
}

export function encodeElementVector(v: ElementVector): ElementEncoded {
  return [v.fire, v.earth, v.air, v.water].map(x => Math.max(0, Math.min(255, Math.round(x * 255)))) as ElementEncoded;
}

export interface MockElementSample {
  longitude: number;
  vector: ElementVector;
  encoded: ElementEncoded;
}

/** Simple mock generator producing a synthetic oscillation for dev (not astronomy accurate). */
export function mockGenerateSamples(startTimeMs: number, cols: number, stepMs: number, planetCount: number, cfg: ElementMappingConfig = DEFAULT_ELEMENT_MAPPING): MockElementSample[][] {
  const out: MockElementSample[][] = [];
  for (let p = 0; p < planetCount; p++) {
    const row: MockElementSample[] = [];
    for (let c = 0; c < cols; c++) {
      const tMs = startTimeMs + c * stepMs;
      // Synthetic longitude: different angular velocity per planet index
      const longitude = norm360(((tMs / 60000) * (0.2 + p * 0.05)) % 360);
      const vec = computeElementVector(longitude, cfg);
      const enc = encodeElementVector(vec);
      row.push({ longitude, vector: vec, encoded: enc });
    }
    out.push(row);
  }
  return out;
}
