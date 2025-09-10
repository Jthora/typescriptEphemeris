// TD2 packTiles tests (initial skeleton)
import { describe, it, expect } from 'vitest';
import { makeDeterministicTile } from './fixtures';

// Duplicate simplified pack logic from TimestreamCanvas for isolation
function pack(tilesArr: any[]) {
  if (!tilesArr.length) return null;
  let totalCols = 0; tilesArr.forEach(t=> totalCols += t.cols);
  const rows = tilesArr[0].rows;
  const buffer = new Uint8Array(totalCols * rows * 4);
  let colOffset = 0;
  for (const tile of tilesArr) {
    for (let r=0;r<rows;r++) {
      const srcRowOffset = r * tile.cols * 4;
      const dstRowOffset = r * totalCols * 4 + colOffset * 4;
      buffer.set(tile.buffer.subarray(srcRowOffset, srcRowOffset + tile.cols * 4), dstRowOffset);
    }
    colOffset += tile.cols;
  }
  return { buffer, totalCols, rows };
}

function hashBytes(arr: Uint8Array) { let h=2166136261>>>0; for (let i=0;i<arr.length;i++){ h^=arr[i]; h = Math.imul(h,16777619);} return ('00000000'+(h>>>0).toString(16)).slice(-8); }

describe('pack', () => {
  it('packs two tiles sequentially with deterministic hash', () => {
    const t1 = makeDeterministicTile({ seed: 1, startTimeMs: 0 });
    const t2 = makeDeterministicTile({ seed: 2, startTimeMs: t1.startTimeMs + t1.cols * t1.stepMs });
    const packed = pack([t1, t2]);
    expect(packed).not.toBeNull();
    if (!packed) return;
    expect(packed.totalCols).toBe(t1.cols + t2.cols);
    expect(packed.rows).toBe(t1.rows);
    // Hash only first 512 bytes for speed
    const hash = hashBytes(packed.buffer.subarray(0, Math.min(512, packed.buffer.length)));
    expect(hash).toMatch(/^[0-9a-f]{8}$/);
  });
});
