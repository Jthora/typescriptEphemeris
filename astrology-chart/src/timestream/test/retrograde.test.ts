// TD2 retrograde pattern test
import { describe, it, expect } from 'vitest';
import type { TimestreamTile } from '../types';

function makeRetroTile(cols: number, retroPattern: number[]): TimestreamTile {
  const rows = 4;
  const buffer = new Uint8Array(rows * cols * 4); // not important for this test
  const retroCounts = new Uint8Array(cols);
  let maxRetro = 0;
  for (let c=0;c<cols;c++) {
    const v = retroPattern[c % retroPattern.length];
    retroCounts[c] = v;
    if (v > maxRetro) maxRetro = v;
  }
  return {
    id: 'retro-test', lod: 1, startTimeMs: 0, stepMs: 60_000, cols, rows,
    bodies: Array.from({ length: rows }, (_, i) => `P${i}`), buffer,
    variance: new Float32Array(cols), maxVariance: 0,
    retrogradeCounts: retroCounts, maxRetrogradeCount: maxRetro, genMs: 0
  };
}

describe('retrograde metrics', () => {
  it('computes maxRetrogradeCount correctly from pattern', () => {
    const tile = makeRetroTile(64, [0,1,2,0,3,1]);
    expect(tile.maxRetrogradeCount).toBe(3);
  });
});
