// Window edge inclusion tests replicate filtering predicate in useTimestreamData
import { describe, it, expect } from 'vitest';
import type { TimestreamTile } from '../types';

function makeTile(startTimeMs: number, cols: number, stepMs: number, lod = 1): TimestreamTile {
  const rows = 2;
  return {
    id: `t-${lod}-${startTimeMs}`,
    lod,
    startTimeMs,
    stepMs,
    cols,
    rows,
    bodies: ['A','B'],
    buffer: new Uint8Array(rows * cols * 4),
    variance: new Float32Array(cols),
    maxVariance: 0,
    retrogradeCounts: new Uint8Array(cols),
    maxRetrogradeCount: 0,
    genMs: 0
  };
}

// Mirror predicate: t.startTimeMs <= windowEnd && (t.startTimeMs + t.cols * t.stepMs) >= windowStart
function overlapsWindow(t: TimestreamTile, windowStartMs: number, windowEndMs: number) {
  return t.startTimeMs <= windowEndMs && (t.startTimeMs + t.cols * t.stepMs) >= windowStartMs;
}

describe('window edge overlap predicate', () => {
  const step = 60_000; // 1 minute
  it('includes tile starting exactly at windowEnd - coverage beyond end', () => {
    const windowStart = 0;
    const windowEnd = step * 10; // 10 minutes span
    const tile = makeTile(windowEnd - step, 4, step); // spans [9,13) minutes
    expect(overlapsWindow(tile, windowStart, windowEnd)).toBe(true);
  });
  it('includes tile whose end exactly equals windowStart', () => {
    const windowStart = step * 10; // 10
    const windowEnd = step * 20; // 20
    // Tile covering [6,10) minutes: end == windowStart -> should pass second condition equality
    const tile = makeTile(step * 6, 4, step); // covers minutes 6..10
    expect(overlapsWindow(tile, windowStart, windowEnd)).toBe(true);
  });
  it('excludes tile entirely before window', () => {
    const windowStart = step * 10; // 10
    const windowEnd = step * 20; // 20
    const tile = makeTile(0, 4, step); // [0,4)
    expect(overlapsWindow(tile, windowStart, windowEnd)).toBe(false);
  });
  it('excludes tile entirely after window', () => {
    const windowStart = step * 10;
    const windowEnd = step * 20;
    const tile = makeTile(step * 21, 4, step); // [21,25)
    expect(overlapsWindow(tile, windowStart, windowEnd)).toBe(false);
  });
});
