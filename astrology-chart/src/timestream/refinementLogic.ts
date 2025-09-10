import type { TimestreamTile } from './types';

/** Compute retrograde density: fraction of columns with any retrograde motion count > 0. */
export function computeRetroDensity(counts: Uint8Array | undefined | null): number {
  if (!counts || counts.length === 0) return 0;
  let retroCols = 0;
  for (let i = 0; i < counts.length; i++) if (counts[i] > 0) retroCols++;
  return retroCols / counts.length;
}

/** Decide whether a coarse tile should be refined based on variance or retro density thresholds. */
export function shouldRefineTile(tile: TimestreamTile, varianceThreshold: number, retroDensityThreshold: number): boolean {
  const mv = tile.maxVariance ?? 0;
  if (mv >= varianceThreshold) return true;
  const rd = computeRetroDensity(tile.retrogradeCounts as Uint8Array | undefined);
  return rd >= retroDensityThreshold;
}
