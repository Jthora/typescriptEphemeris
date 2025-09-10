// Adaptive rounding tolerance test
import { describe, it, expect } from 'vitest';
import type { TimestreamTile } from '../types';

function coarseFineNeeded(coarse: TimestreamTile, fineStep: number): number {
  const expectedCoverage = coarse.cols * coarse.stepMs;
  const fineTileCoverage = coarse.cols * fineStep;
  const ratio = expectedCoverage / fineTileCoverage;
  const needed = Math.max(1, Math.round(ratio));
  return Math.abs(ratio - needed) > 0.01 ? Math.floor(ratio) : needed;
}

function makeCoarse(start: number, step: number, cols: number): TimestreamTile {
  const rows = 2;
  return { id:`w-2-${start}`, lod:2, startTimeMs:start, stepMs:step, cols, rows, bodies:['A','B'], buffer:new Uint8Array(rows*cols*4), variance:new Float32Array(cols), maxVariance:0.5, retrogradeCounts:new Uint8Array(cols), maxRetrogradeCount:0, genMs:0 };
}

describe('adaptive rounding fix', () => {
  it('rounding stable under small epsilon drift', () => {
    const coarse = makeCoarse(0, 16000, 4); // coverage 64000
    const fineStepIdeal = 4000; // ratio 4
    const epsilons = [0, 0.0005, -0.0005];
    for (const eps of epsilons) {
      const fineStep = fineStepIdeal * (1+eps);
      const needed = coarseFineNeeded(coarse, fineStep);
      expect(needed === 4 || needed === 3 || needed === 5).toBeTruthy();
    }
  });
});
