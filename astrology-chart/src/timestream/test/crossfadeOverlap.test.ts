// Crossfade overlap guard test
import { describe, it, expect } from 'vitest';
import type { TimestreamTile } from '../types';

function tile(lod: number, start: number, step: number, cols: number): TimestreamTile {
  const rows = 2;
  return { id:`w-${lod}-${start}`, lod, startTimeMs:start, stepMs:step, cols, rows, bodies:['A','B'], buffer:new Uint8Array(rows*cols*4), variance:new Float32Array(cols), maxVariance:0, retrogradeCounts:new Uint8Array(cols), maxRetrogradeCount:0, genMs:0 };
}

function coverageSpan(tiles: TimestreamTile[]): [number, number] | null {
  if (!tiles.length) return null;
  const start = tiles[0].startTimeMs;
  const end = tiles[tiles.length-1].startTimeMs + tiles[tiles.length-1].cols * tiles[tiles.length-1].stepMs;
  return [start, end];
}

describe('crossfade overlap (pure logic)', () => {
  it('detects mismatch of temporal coverage', () => {
    const primary = [tile(1,0,1000,4), tile(1,4000,1000,4)]; // 0..8000
    const secondary = [tile(2,0,1000,4), tile(2,2000,1000,2)]; // ends earlier
    const pSpan = coverageSpan(primary)!;
    const sSpan = coverageSpan(secondary)!;
    const match = pSpan[0] === sSpan[0] && pSpan[1] === sSpan[1];
    expect(match).toBe(false);
  });
  it('recognizes identical span', () => {
    const primary = [tile(1,0,1000,4), tile(1,4000,1000,4)];
    const secondary = [tile(2,0,1000,4), tile(2,4000,1000,4)];
    const pSpan = coverageSpan(primary)!;
    const sSpan = coverageSpan(secondary)!;
    expect(pSpan[0]).toBe(sSpan[0]);
    expect(pSpan[1]).toBe(sSpan[1]);
  });
});
