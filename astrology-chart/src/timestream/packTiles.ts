/**
 * Shared tile packing helper for WebGL texture uploads (TD3 harness + runtime).
 */
import type { TimestreamTile } from './types';
import { packPool } from './packPool';

export interface PackedTexture {
  buffer: Uint8Array;
  totalCols: number;
  rows: number;
}

export interface PackTilesOptions {
  pool?: { getView(size: number): Uint8Array };
}

export function packTiles(tiles: TimestreamTile[], options: PackTilesOptions = {}): PackedTexture | null {
  if (!tiles.length) return null;
  const rows = tiles[0].rows;
  if (rows <= 0) return null;
  let totalCols = 0;
  for (const tile of tiles) {
    if (tile.rows !== rows) {
      throw new Error(`packTiles row mismatch: expected ${rows}, received ${tile.rows}`);
    }
    totalCols += tile.cols;
  }
  if (totalCols <= 0) return null;
  const pool = options.pool ?? packPool;
  const buffer = pool.getView(totalCols * rows * 4);
  let colOffset = 0;
  for (const tile of tiles) {
    const stride = tile.cols * 4;
    for (let r = 0; r < rows; r++) {
      const srcRowOffset = r * stride;
      const dstRowOffset = r * totalCols * 4 + colOffset * 4;
      buffer.set(tile.buffer.subarray(srcRowOffset, srcRowOffset + stride), dstRowOffset);
    }
    colOffset += tile.cols;
  }
  return { buffer, totalCols, rows };
}
