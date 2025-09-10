/**
 * Mock tile generator for Milestone M1 (CPU only, synthetic data).
 */
import { DEFAULT_PLANET_ORDER, DEFAULT_BASE_STEP_MS, DEFAULT_TILE_COLS, DEFAULT_ELEMENT_MAPPING } from './constants';
import type { MockTileParams, TimestreamTile } from './types';
import { mockGenerateSamples } from './elementMapping';

export function generateMockTile(params: MockTileParams): TimestreamTile {
  const {
    startTimeMs,
    cols = DEFAULT_TILE_COLS,
    stepMs = DEFAULT_BASE_STEP_MS,
    lod = 0,
    planets = DEFAULT_PLANET_ORDER,
    cuspWidthDeg = DEFAULT_ELEMENT_MAPPING.cuspWidthDeg,
    curve = DEFAULT_ELEMENT_MAPPING.curve
  } = params;

  const samples = mockGenerateSamples(startTimeMs, cols, stepMs, planets.length, { cuspWidthDeg, curve });
  const rows = planets.length;
  const buffer = new Uint8Array(cols * rows * 4);

  for (let p = 0; p < rows; p++) {
    for (let c = 0; c < cols; c++) {
      const { encoded } = samples[p][c];
      const idx = (p * cols + c) * 4;
      buffer[idx] = encoded[0];
      buffer[idx + 1] = encoded[1];
      buffer[idx + 2] = encoded[2];
      buffer[idx + 3] = encoded[3];
    }
  }

  return {
    id: `mock-${lod}-${startTimeMs}`,
    lod,
    startTimeMs,
    stepMs,
    cols,
    rows,
    bodies: planets,
    buffer
  };
}
