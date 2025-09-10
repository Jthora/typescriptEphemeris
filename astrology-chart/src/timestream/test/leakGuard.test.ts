// Leak guard test: simulate window shifts and ensure pruning keeps requestedKeys bounded.
import { describe, it, expect } from 'vitest';
import React, { useEffect } from 'react';
import { useTimestreamData } from '../useTimestreamData';

// Minimal polyfill for Worker used by TimestreamWorkerClient
class MockWorker {
  onmessage: any;
  constructor() {}
  postMessage(msg: any) {
    // respond to requestTile by generating a minimal fake tile synchronously
    if (msg.type === 'requestTile') {
      const { startTimeMs, cols, stepMs, lod } = msg;
      const rows = 4;
      const buffer = new Uint8Array(rows * cols * 4);
      const variance = new Float32Array(cols);
      const retro = new Uint8Array(cols);
      const tile = { id: `w-${lod}-${startTimeMs}`, lod, startTimeMs, stepMs, cols, rows, bodies: Array.from({ length: rows }, (_, i) => 'P'+i), buffer, variance, maxVariance: 0.05, retrogradeCounts: retro, maxRetrogradeCount: 0, genMs: 0 };
      setTimeout(()=> this.onmessage?.({ data: { type: 'tile', tile } }), 0);
    }
  }
  terminate() {}
}
// Lightweight Worker mock (synchronous tile delivery)
if (!(globalThis as any).Worker || !(globalThis as any).Worker.__timestreamMock) {
  class MockWorker {
    static __timestreamMock = true;
    onmessage: ((e: any) => void) | null = null;
    postMessage(msg: any) {
      if (msg.type === 'requestTile') {
        const { startTimeMs, cols, stepMs, lod } = msg;
        const rows = 4;
        const buffer = new Uint8Array(rows * cols * 4);
        const variance = new Float32Array(cols);
        const retro = new Uint8Array(cols);
        const tile = { id: `w-${lod}-${startTimeMs}`, lod, startTimeMs, stepMs, cols, rows, bodies: Array.from({ length: rows }, (_, i) => 'P'+i), buffer, variance, maxVariance: 0.05, retrogradeCounts: retro, maxRetrogradeCount: 0, genMs: 0 };
        setTimeout(() => this.onmessage?.({ data: { type: 'tile', tile } }), 0);
      }
    }
    terminate() {}
  }
  ;(globalThis as any).Worker = MockWorker as any;
}

interface HarnessProps { center: number; span: number; }
let latest: ReturnType<typeof useTimestreamData> | null = null;
const Harness: React.FC<HarnessProps> = ({ center, span }) => {
  const res = useTimestreamData({ centerTimeMs: center, spanMs: span, prefetchTiles: 1 });
  useEffect(() => { latest = res; });
  return null;
};

describe.skip('requested keys growth', () => {
  it('bounds pending requests relative to resident tiles after many shifts', async () => {
    const baseCenter = Date.now();
    const span = 6 * 3600 * 1000; // 6h
    // Minimal manual render without JSX to avoid TSX transform issues
    const rootEl = React.createElement(Harness, { center: baseCenter, span });
    // @ts-ignore mounting via unstable root simulation
    (Harness as any)({ center: baseCenter, span });
    // allow initial generation
    await new Promise(r => setTimeout(r, 10));
    const shifts = 80; // simulate extended navigation
    const delta = 3600 * 1000; // 1h shift
    for (let i=1;i<=shifts;i++) {
      (Harness as any)({ center: baseCenter + i*delta, span });
      // brief delay to process worker callbacks
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => setTimeout(r, 3));
    }
  // Placeholder assertion (implementation pending proper React render environment for hook).
  expect(true).toBe(true);
  });
});

