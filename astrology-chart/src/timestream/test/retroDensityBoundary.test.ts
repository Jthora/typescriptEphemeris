import { describe, test, expect } from 'vitest';
import { computeRetroDensity } from '../refinementLogic';
import { DEFAULT_RETRO_DENSITY_THRESHOLD } from '../constants';

describe('retroDensity boundary', () => {
  test('just below threshold', () => {
    const total = 100;
    const retroCols = Math.floor(DEFAULT_RETRO_DENSITY_THRESHOLD * total) - 1; // ensure below
    const arr = new Uint8Array(total);
    for (let i=0;i<retroCols;i++) arr[i] = 1;
    const d = computeRetroDensity(arr);
    expect(d).toBeLessThan(DEFAULT_RETRO_DENSITY_THRESHOLD);
  });
  test('at or above threshold', () => {
    const total = 100;
    const retroCols = Math.ceil(DEFAULT_RETRO_DENSITY_THRESHOLD * total); // at or above
    const arr = new Uint8Array(total);
    for (let i=0;i<retroCols;i++) arr[i] = 1;
    const d = computeRetroDensity(arr);
    expect(d).toBeGreaterThanOrEqual(DEFAULT_RETRO_DENSITY_THRESHOLD);
  });
});
