/**
 * Milestone M1 development harness: generate one mock tile and log summary.
 * This is a temporary file used to verify core utilities before worker/WebGL layers.
 */
import { generateMockTile } from './mockTile';
import { DEFAULT_BASE_STEP_MS } from './constants';
import { logElementMappingValidation } from './validateElementMapping';

function summarizeTile() {
  const start = Date.now();
  const tile = generateMockTile({ startTimeMs: start, cols: 240, stepMs: DEFAULT_BASE_STEP_MS });
  console.log('[M1] Mock tile generated');
  console.log(' id:', tile.id);
  console.log(' lod:', tile.lod, 'rows:', tile.rows, 'cols:', tile.cols);
  console.log(' stepMs:', tile.stepMs, 'spanMinutes:', (tile.cols * tile.stepMs) / 60000);
  console.log(' planets:', tile.bodies.join(', '));
  // Log first 3 samples of first planet for inspection
  const colsToShow = 3;
  const firstRow = 0;
  const rowOffset = firstRow * tile.cols * 4;
  const samples: number[][] = [];
  for (let c = 0; c < colsToShow; c++) {
    const idx = rowOffset + c * 4;
    samples.push([
      tile.buffer[idx],
      tile.buffer[idx + 1],
      tile.buffer[idx + 2],
      tile.buffer[idx + 3]
    ]);
  }
  console.log(' firstRow firstSamples (Fire,Earth,Air,Water):', samples);
  const maxVal = tile.buffer.reduce((m, v) => (v > m ? v : m), 0);
  console.log(' max channel value:', maxVal);
  return tile;
}

function runHarness() {
  summarizeTile();
  logElementMappingValidation();
}

if (import.meta.hot) {
  runHarness();
} else {
  runHarness();
}

export {};
