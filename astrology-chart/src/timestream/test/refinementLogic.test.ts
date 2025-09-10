import { describe, test, expect } from 'vitest';
import { shouldRefineTile, computeRetroDensity } from '../refinementLogic';
import type { TimestreamTile } from '../types';

function tile(partial: Partial<TimestreamTile>): TimestreamTile {
  return {
    id: 'w-1-0', startTimeMs: 0, cols: 4, stepMs: 60_000, rows: 1, lod: 1,
    bodies: ['Sun'] as any,
    buffer: new Uint8Array(4*4),
    maxVariance: 0,
    ...partial
  } as TimestreamTile;
}

describe('computeRetroDensity', () => {
  test('empty counts => 0', () => {
    expect(computeRetroDensity(undefined)).toBe(0);
    expect(computeRetroDensity(new Uint8Array())).toBe(0);
  });
  test('all retro => 1', () => {
    const arr = new Uint8Array([1,2,3,1]);
    expect(computeRetroDensity(arr)).toBe(1);
  });
  test('mixed retro / direct', () => {
    const arr = new Uint8Array([0,1,0,2]); // 2 of 4 retro
    expect(computeRetroDensity(arr)).toBeCloseTo(0.5, 5);
  });
});

describe('shouldRefineTile', () => {
  const vt = 0.2;
  const rdT = 0.05;
  test('refines on variance >= threshold', () => {
    expect(shouldRefineTile(tile({ maxVariance: 0.25 }), vt, rdT)).toBe(true);
  });
  test('does not refine when both below thresholds', () => {
    expect(shouldRefineTile(tile({ maxVariance: 0.1, retrogradeCounts: new Uint8Array([0,0,0,0]) }), vt, rdT)).toBe(false);
  });
  test('refines on retro density alone', () => {
    // retro density 0.25 > 0.05
    expect(shouldRefineTile(tile({ maxVariance: 0.0, retrogradeCounts: new Uint8Array([0,1,0,2]) }), vt, rdT)).toBe(true);
  });
  test('retro density exactly at threshold triggers refinement', () => {
    // Need array where retro fraction = 0.05 => e.g., 1 of 20
    const counts = new Uint8Array(20); counts[3] = 1;
    expect(computeRetroDensity(counts)).toBeCloseTo(0.05,5);
    expect(shouldRefineTile(tile({ maxVariance: 0.0, retrogradeCounts: counts }), vt, rdT)).toBe(true);
  });
});
