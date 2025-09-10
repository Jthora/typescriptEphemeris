// TD2 snapshot summary test (simplified)
import { describe, it, expect } from 'vitest';
import type { TimestreamTile } from '../types';

interface Summary {
  tileCount: number;
  lodHistogram: Record<number, number>;
  totalCols: number;
}

function summarize(tiles: TimestreamTile[]): Summary {
  const lodHistogram: Record<number, number> = {};
  let totalCols = 0;
  for (const t of tiles) {
    lodHistogram[t.lod] = (lodHistogram[t.lod] || 0) + 1;
    totalCols += t.cols;
  }
  return { tileCount: tiles.length, lodHistogram, totalCols };
}

function makeTile(lod: number, startTimeMs: number): TimestreamTile {
  const cols = 8; const rows = 4;
  return {
    id: `${lod}-${startTimeMs}`,
    lod,
    startTimeMs,
    stepMs: 60_000 * Math.pow(4, lod),
    cols,
    rows,
    bodies: Array.from({ length: rows }, (_, i) => `P${i}`),
    buffer: new Uint8Array(rows * cols * 4),
    variance: new Float32Array(cols),
    maxVariance: 0,
    retrogradeCounts: new Uint8Array(cols),
    maxRetrogradeCount: 0,
    genMs: 0
  };
}

describe('snapshot summary', () => {
  it('produces stable summary JSON', () => {
    const tiles: TimestreamTile[] = [
      makeTile(2, 0),
      makeTile(2, 8 * 60_000 * Math.pow(4,2)),
      makeTile(1, 0),
      makeTile(0, 0)
    ];
    const summary = summarize(tiles);
    expect(summary).toEqual({
      tileCount: 4,
      lodHistogram: { '0': 1, '1': 1, '2': 2 },
      totalCols: 32
    });
  });
});
