/**
 * Milestone M2 worker integration harness.
 * Spawns the timestream worker, requests a single tile, logs receipt.
 * Temporary development file; not part of production bundle.
 */
import { TimestreamWorkerClient } from './workerClient';
import { DEFAULT_BASE_STEP_MS } from './constants';
import { MockEphemerisProvider } from './providers/mockProvider';

function runWorkerTest() {
  console.group('[M2] Worker Test');
  const provider = new MockEphemerisProvider();
  const client = new TimestreamWorkerClient(
    // Vite-friendly module URL reference for the worker source
    new URL('./timestreamWorker.ts', import.meta.url).href,
    {
      onTile: (tile) => {
        console.log('Tile received:', {
          id: tile.id,
          lod: tile.lod,
          cols: tile.cols,
            rows: tile.rows,
          stepMs: tile.stepMs,
          firstBytes: Array.from(tile.buffer.slice(0, 16))
        });
        console.groupEnd();
        client.shutdown();
      },
      onLog: (level, message) => console.log(`[worker ${level}]`, message)
    },
    provider.meta
  );

  const now = Date.now();
  const cols = 180; // smaller test tile
  client.requestTile(now, cols, DEFAULT_BASE_STEP_MS, 0);
}

runWorkerTest();

export {};
