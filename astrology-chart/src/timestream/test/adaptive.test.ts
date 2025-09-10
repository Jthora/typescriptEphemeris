// TD2 adaptive selection property tests
import { describe, it, expect } from 'vitest';
import type { TimestreamTile } from '../types';

function makeTile(partial: Partial<TimestreamTile>): TimestreamTile {
  const rows = partial.rows ?? 4;
  const cols = partial.cols ?? 16;
  return {
    id: partial.id || `${partial.lod}-${partial.startTimeMs}`,
    lod: partial.lod ?? 1,
    startTimeMs: partial.startTimeMs ?? 0,
    stepMs: partial.stepMs ?? 60_000,
    cols,
    rows,
    bodies: partial.bodies || Array.from({ length: rows }, (_, i) => `P${i}`),
    buffer: partial.buffer || new Uint8Array(rows * cols * 4),
    variance: partial.variance || new Float32Array(cols).fill(0.01),
    maxVariance: partial.maxVariance ?? 0.01,
    retrogradeCounts: partial.retrogradeCounts || new Uint8Array(cols),
    maxRetrogradeCount: partial.maxRetrogradeCount ?? 0,
    genMs: partial.genMs ?? 0
  };
}

// Minimal adaptive selection replicating logic in useTimestreamData
function selectTiles(all: TimestreamTile[], lod: number, varianceThreshold: number, windowStartMs: number, windowEndMs: number): TimestreamTile[] {
  const coarseTiles = all.filter(t => t.lod === lod && t.startTimeMs <= windowEndMs && (t.startTimeMs + t.cols * t.stepMs) >= windowStartMs).sort((a,b)=> a.startTimeMs - b.startTimeMs);
  if (lod === 0) return coarseTiles;
  const baseStep = coarseTiles[0]?.stepMs || 60_000;
  const fineStep = baseStep * Math.pow(4, lod-1) / Math.pow(4, lod); // same as original: fineStep = stepMs * 4^(lod-1)
  const result: TimestreamTile[] = [];
  for (const ct of coarseTiles) {
    const mv = ct.maxVariance ?? 0;
    if (mv < varianceThreshold) { result.push(ct); continue; }
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
  return result.sort((a,b)=> a.startTimeMs - b.startTimeMs);
}

describe('adaptive selection', () => {
  it('keeps coarse tile below variance threshold', () => {
    const coarse = makeTile({ lod: 2, startTimeMs: 0, stepMs: 60_000*16, maxVariance: 0.05 });
    const selected = selectTiles([coarse], 2, 0.1, 0, coarse.cols * coarse.stepMs);
    expect(selected).toHaveLength(1);
    expect(selected[0].id).toBe(coarse.id);
  });
  it('does not replace coarse tile until ALL finer tiles present', () => {
    const coarse = makeTile({ lod: 2, startTimeMs: 0, stepMs: 60_000*16, maxVariance: 0.2 });
    // Suppose needed=4 finer tiles (each covers coarse.cols * fineStep). Provide only 3.
    const fineStep = 60_000*4; // lod-1 step
    const fineTiles: TimestreamTile[] = [];
    for (let i=0;i<3;i++) {
      fineTiles.push(makeTile({ lod: 1, startTimeMs: i * (coarse.cols * fineStep), stepMs: fineStep, maxVariance: 0.05 }));
    }
    const selected = selectTiles([coarse, ...fineTiles], 2, 0.15, 0, coarse.cols * coarse.stepMs);
    // Should keep coarse because incomplete finer set
    expect(selected.find(t => t.id === coarse.id)).toBeTruthy();
  });
  it('replaces coarse tile when ALL finer tiles present and variance high', () => {
    const coarse = makeTile({ lod: 2, startTimeMs: 0, stepMs: 60_000*16, maxVariance: 0.3 });
    const fineStep = 60_000*4;
    const fineTiles: TimestreamTile[] = [];
    for (let i=0;i<4;i++) {
      fineTiles.push(makeTile({ lod: 1, startTimeMs: i * (coarse.cols * fineStep), stepMs: fineStep, maxVariance: 0.05 }));
    }
    const selected = selectTiles([coarse, ...fineTiles], 2, 0.15, 0, coarse.cols * coarse.stepMs);
    expect(selected.find(t => t.id === coarse.id)).toBeFalsy();
    // Contains all finer tiles in order
    for (let i=0;i<4;i++) {
      expect(selected[i].lod).toBe(1);
      expect(selected[i].startTimeMs).toBe(i * (coarse.cols * fineStep));
    }
  });
});
