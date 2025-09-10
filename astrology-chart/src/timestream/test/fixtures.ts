// TD2 Fixture factory for deterministic tiles
import type { TimestreamTile, PlanetId } from '../types';

export interface FixtureOptions { seed?: number; rows?: number; cols?: number; stepMs?: number; startTimeMs?: number; lod?: number; planets?: PlanetId[]; }

function lcg(seed: number) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff; }

export function makeDeterministicTile(opts: FixtureOptions = {}): TimestreamTile {
  const {
    seed = 1,
    rows = 8,
    cols = 64,
    stepMs = 60_000,
    startTimeMs = Date.now(),
    lod = 0,
    planets = Array.from({ length: rows }, (_, i) => `P${i}`)
  } = opts;
  const rand = lcg(seed);
  const buffer = new Uint8Array(rows * cols * 4);
  const variance = new Float32Array(cols);
  const colSums = new Float32Array(cols);
  const colSumsSq = new Float32Array(cols);
  for (let r=0;r<rows;r++) {
    for (let c=0;c<cols;c++) {
      const base = rand();
      const fire = Math.floor(((r/rows) * 0.6 + base*0.4) * 255) & 0xff;
      const earth = Math.floor(((c/cols) * 0.6 + (1-base)*0.4) * 255) & 0xff;
      const air = Math.floor(((r+c)/(rows+cols)) * 255) & 0xff;
      const water = 255 - fire; // complement style
      const idx = (r * cols + c) * 4;
      buffer[idx] = fire; buffer[idx+1] = earth; buffer[idx+2] = air; buffer[idx+3] = water;
      const total = (fire + earth + air + water)/255;
      colSums[c] += total; colSumsSq[c] += total * total;
    }
  }
  let maxVar = 0;
  for (let c=0;c<cols;c++) {
    const mean = colSums[c] / rows;
    const meanSq = colSumsSq[c] / rows;
    const v = Math.max(0, meanSq - mean*mean);
    variance[c] = v; if (v>maxVar) maxVar = v;
  }
  return {
    id: `fixture-${lod}-${startTimeMs}`,
    lod,
    startTimeMs,
    stepMs,
    cols,
    rows,
    bodies: planets,
    buffer,
    variance,
    maxVariance: maxVar,
    retrogradeCounts: new Uint8Array(cols),
    maxRetrogradeCount: 0,
    genMs: 0
  };
}
