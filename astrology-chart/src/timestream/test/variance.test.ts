// TD2 variance verification test
import { describe, it, expect } from 'vitest';
import { makeDeterministicTile } from './fixtures';

function recomputeVariance(tile: ReturnType<typeof makeDeterministicTile>) {
  const { rows, cols, buffer } = tile;
  const sums = new Float32Array(cols);
  const sumsSq = new Float32Array(cols);
  for (let r=0;r<rows;r++) {
    for (let c=0;c<cols;c++) {
      const idx = (r * cols + c) * 4;
      const fire = buffer[idx];
      const earth = buffer[idx+1];
      const air = buffer[idx+2];
      const water = buffer[idx+3];
      const total = (fire + earth + air + water) / 255; // 0..4
      sums[c] += total;
      sumsSq[c] += total * total;
    }
  }
  const variance = new Float32Array(cols);
  let maxVar = 0;
  for (let c=0;c<cols;c++) {
    const mean = sums[c] / rows;
    const meanSq = sumsSq[c] / rows;
    const v = Math.max(0, meanSq - mean*mean);
    variance[c] = v;
    if (v > maxVar) maxVar = v;
  }
  return { variance, maxVar };
}

describe('fixture variance', () => {
  it('matches recomputed column population variance within 1e-6', () => {
    const tile = makeDeterministicTile({ seed: 42, rows: 6, cols: 128 });
    const { variance, maxVar } = recomputeVariance(tile);
    const orig = tile.variance!;
    let maxDiff = 0;
    for (let i=0;i<orig.length;i++) {
      const diff = Math.abs(orig[i] - variance[i]);
      if (diff > maxDiff) maxDiff = diff;
      expect(diff).toBeLessThan(1e-6);
    }
    expect(Math.abs((tile.maxVariance ?? 0) - maxVar)).toBeLessThan(1e-6);
    // Guard: ensure variance spans a sensible range (not all zero)
    expect(maxVar).toBeGreaterThan(0.0001);
  });
});
