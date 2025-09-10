/** Validate requestTile parameters; returns error string or null if ok. */
export function validateRequestTileParams(cols: number, stepMs: number, lod: number): string | null {
  if (!Number.isFinite(cols) || cols <= 0 || cols > 1_000_000) return 'invalid cols';
  if (!Number.isFinite(stepMs) || stepMs <= 0 || stepMs > 365*24*3600*1000) return 'invalid stepMs';
  if (!Number.isFinite(lod) || lod < -1 || lod > 5) return 'invalid lod';
  return null;
}
