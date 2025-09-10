// Out-of-order arrival test: coarse vs finer tiles appearing in different sequences
import { describe, it, expect } from 'vitest';
import type { TimestreamTile } from '../types';

function makeTile(opts: Partial<TimestreamTile> & { lod: number; startTimeMs: number; stepMs: number; cols: number; rows?: number; varScalar?: number; }): TimestreamTile {
  const rows = opts.rows ?? 4;
  const cols = opts.cols;
  const v = opts.varScalar ?? 0.2;
  const variance = new Float32Array(cols).fill(v);
  return {
    id: `w-${opts.lod}-${opts.startTimeMs}`,
    lod: opts.lod,
    startTimeMs: opts.startTimeMs,
    stepMs: opts.stepMs,
    cols,
    rows,
    bodies: Array.from({ length: rows }, (_, i) => `P${i}`),
    buffer: new Uint8Array(rows * cols * 4),
  variance,
  maxVariance: v,
    retrogradeCounts: new Uint8Array(cols),
    maxRetrogradeCount: 0,
    genMs: 0
  };
}

// Replicate adaptive selection logic segment from useTimestreamData for lod=2 replacing with lod=1 if variance high and all subtiles present.
function selectForLOD2(all: TimestreamTile[], varianceThreshold: number) {
  const lod = 2;
  const windowStartMs = 0; const windowEndMs = 1e12; // wide to include all
  const stepMsBase = all.find(t=> t.lod===0)?.stepMs || 60_000; // not used directly
  const coarseTiles = all.filter(t => t.lod === lod && t.startTimeMs <= windowEndMs && (t.startTimeMs + t.cols * t.stepMs) >= windowStartMs).sort((a,b)=> a.startTimeMs - b.startTimeMs);
  const fineStep = stepMsBase * Math.pow(4, lod-1); // aligns with hook conceptual formula
  const result: TimestreamTile[] = [];
  for (const ct of coarseTiles) {
    if ((ct.maxVariance ?? 0) < varianceThreshold) { result.push(ct); continue; }
    const expectedCoverage = ct.cols * ct.stepMs;
    const fineTileCoverage = ct.cols * fineStep;
    const needed = Math.round(expectedCoverage / fineTileCoverage);
    const fineTiles: TimestreamTile[] = [];
    for (let i=0;i<needed;i++) {
      const fineStart = ct.startTimeMs + i * fineTileCoverage;
      const fine = all.find(t => t.lod === lod-1 && t.startTimeMs === fineStart);
      if (fine) fineTiles.push(fine); else break;
    }
    if (fineTiles.length === needed) {
      fineTiles.sort((a,b)=> a.startTimeMs - b.startTimeMs);
      fineTiles.forEach(ft => result.push(ft));
    } else {
      result.push(ct);
    }
  }
  return result.sort((a,b)=> a.startTimeMs - b.startTimeMs).map(t=> t.id);
}

describe('adaptive selection arrival order stability', () => {
  it('produces identical final ids whether fine tiles arrive before or after coarse', () => {
    const cols = 8;
    const baseStep = 60_000 * 16; // coarse step for lod=2 in existing scheme
  const coarse = makeTile({ lod: 2, startTimeMs: 0, stepMs: baseStep, cols, varScalar: 0.5 });
    const fineStep = baseStep / 4; // conceptual ratio
  const fineTiles = Array.from({ length: 4 }, (_, i) => makeTile({ lod: 1, startTimeMs: i * (cols * fineStep), stepMs: fineStep, cols, varScalar: 0.1 }));
    // Scenario A: coarse then fine
    const finalA = selectForLOD2([coarse, ...fineTiles], 0.2);
    // Scenario B: fine tiles present before coarse (arrival ordering shouldn't change outcome)
    const finalB = selectForLOD2([...fineTiles, coarse], 0.2);
    expect(finalA).toEqual(finalB);
    // Expect replacement (no coarse id present)
    expect(finalA).not.toContain(coarse.id);
    expect(finalA.length).toBe(4);
  });
});
