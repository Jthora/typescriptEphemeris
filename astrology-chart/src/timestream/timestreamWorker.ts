/**
 * Timestream generation Web Worker (Milestone M2 - initial draft)
 * NOTE: This is not yet wired; main thread loader forthcoming.
 */
import { DEFAULT_PLANET_ORDER, DEFAULT_ELEMENT_MAPPING } from './constants';
import { computeElementVector, encodeElementVector } from './elementMapping';
import type { TimestreamWorkerInboundMessage, TimestreamWorkerOutboundMessage } from './workerMessages';
import { validateRequestTileParams } from './workerValidation';
import type { TimestreamTile } from './types';

// Minimal placeholder planetary longitude computation.
// TODO: Replace with astronomy-engine calls or injected ephemeris service.
function syntheticLongitude(planetIndex: number, timeMs: number): number {
  const minutes = timeMs / 60000;
  return ((minutes * (0.2 + planetIndex * 0.05)) % 360 + 360) % 360;
}

function post(msg: TimestreamWorkerOutboundMessage) {
  (self as any).postMessage(msg);
}

// validation moved to workerValidation.ts

function buildTile(startTimeMs: number, cols: number, stepMs: number, lod: number, planets = DEFAULT_PLANET_ORDER): TimestreamTile {
  const tGenStart = performance.now();
  const rows = planets.length;
  const buffer = new Uint8Array(cols * rows * 4);
  // (M8 INIT) variance accumulator per column
  // Per-channel accumulators for variance (fire, earth, air, water) then aggregate via max channel variance
  const colVar = new Float32Array(cols); // final aggregated variance (max of channels)
  const chSums = [new Float32Array(cols), new Float32Array(cols), new Float32Array(cols), new Float32Array(cols)];
  const chSumsSq = [new Float32Array(cols), new Float32Array(cols), new Float32Array(cols), new Float32Array(cols)];
  const retroCounts = new Uint8Array(cols); // per-column retrograde counts
  let maxRetro = 0;
  // First fill + accumulate sums
  for (let p = 0; p < rows; p++) {
    for (let c = 0; c < cols; c++) {
      const t = startTimeMs + c * stepMs;
      const lon = syntheticLongitude(p, t);
      // Synthetic retrograde heuristic: alternate retro periods every 2000 minutes for outer planets (index>=5)
      if (p >= 5) {
        const phase = Math.floor((t / 60000) / 2000);
        const isRetro = (phase % 2) === 1;
        if (isRetro) {
          retroCounts[c]++;
          if (retroCounts[c] > maxRetro) maxRetro = retroCounts[c];
        }
      }
      const vec = computeElementVector(lon, DEFAULT_ELEMENT_MAPPING);
      const enc = encodeElementVector(vec);
      const idx = (p * cols + c) * 4;
      buffer[idx] = enc[0];
      buffer[idx + 1] = enc[1];
      buffer[idx + 2] = enc[2];
      buffer[idx + 3] = enc[3];
      // accumulate sum of normalized channels for variance basis
      // accumulate per-channel normalized values
      for (let ch=0; ch<4; ch++) {
        const norm = enc[ch] / 255;
        chSums[ch][c] += norm;
        chSumsSq[ch][c] += norm * norm;
      }
    }
  }
  // Compute variance per column (population variance of aggregated channel sum across planets)
  const n = rows;
  let maxVar = 0;
  for (let c=0;c<cols;c++) {
    let maxChVar = 0;
    for (let ch=0; ch<4; ch++) {
      const mean = chSums[ch][c] / n;
      const meanSq = chSumsSq[ch][c] / n;
      const v = Math.max(0, meanSq - mean * mean);
      if (v > maxChVar) maxChVar = v;
    }
    colVar[c] = maxChVar;
    if (maxChVar > maxVar) maxVar = maxChVar;
  }
  return {
    id: `w-${lod}-${startTimeMs}`,
    lod,
    startTimeMs,
    stepMs,
    cols,
    rows,
    bodies: planets,
    buffer,
  variance: colVar,
    maxVariance: maxVar,
    retrogradeCounts: retroCounts,
    maxRetrogradeCount: maxRetro,
    genMs: performance.now() - tGenStart
  };
}

self.onmessage = (e: MessageEvent<TimestreamWorkerInboundMessage>) => {
  const msg = e.data;
  switch (msg.type) {
    case 'init': {
      post({ type: 'log', level: 'info', message: 'Worker initialized.' });
      break;
    }
    case 'requestTile': {
      const { startTimeMs, cols, stepMs, lod } = msg;
      const err = validateRequestTileParams(cols, stepMs, lod);
      if (err) { post({ type: 'log', level: 'warn', message: `requestTile rejected: ${err}` }); break; }
      const tile = buildTile(startTimeMs, cols, stepMs, lod);
      post({ type: 'tile', tile });
      break;
    }
    case 'abort': {
      // No long-running tasks yet; placeholder.
      post({ type: 'log', level: 'info', message: `Abort not implemented (id=${msg.requestId})` });
      break;
    }
    case 'shutdown': {
      post({ type: 'log', level: 'info', message: 'Worker shutting down.' });
      close();
      break;
    }
    default:
      post({ type: 'log', level: 'warn', message: 'Unknown message.' });
  }
};
