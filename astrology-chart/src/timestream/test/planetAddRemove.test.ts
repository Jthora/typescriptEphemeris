import { describe, test, expect } from 'vitest';
import type { TimestreamTile } from '../types';
import { validateTileOrders } from '../orderIntegrity';

function makeTile(start:number, lod:number, bodies:string[]): TimestreamTile {
  // Minimal synthetic tile; only fields used by validateTileOrders / canvas logic in tests.
  const cols = 4; // small for test
  const stepMs = 60_000 * Math.pow(4,lod);
  const rows = bodies.length;
  const buffer = new Uint8Array(cols * rows * 4); // zeroed
  return {
    id: `w-${lod}-${start}`,
    startTimeMs: start,
    cols,
    stepMs,
    rows,
    lod,
    bodies: bodies as any,
    buffer,
    // variance / retro placeholders
    maxVariance: 0,
  } as TimestreamTile; // cast to satisfy any extra fields
}

describe('planetAddRemove robustness', () => {
  test('validateTileOrders detects body count increase and mismatch ids reported', () => {
    const baseBodies = ['Sun','Moon','Mercury'];
    const grownBodies = ['Sun','Moon','Mercury','Venus'];
    const t1 = makeTile(0,1, baseBodies);
    const t2 = makeTile(0,1, grownBodies);
    const { mismatchedTileIds } = validateTileOrders([t1, t2]);
    expect(mismatchedTileIds.length).toBe(1); // second tile mismatch
    expect(mismatchedTileIds[0]).toBe(t2.id);
  });

  test('validateTileOrders detects body removal mismatch', () => {
    const baseBodies = ['Sun','Moon','Mercury','Venus'];
    const shrunkBodies = ['Sun','Moon','Mercury'];
    const t1 = makeTile(0,1, baseBodies);
    const t2 = makeTile(0,1, shrunkBodies);
    const { mismatchedTileIds } = validateTileOrders([t1, t2]);
    expect(mismatchedTileIds.length).toBe(1);
    expect(mismatchedTileIds[0]).toBe(t2.id);
  });

  test('mixed sequence (grow then shrink) keeps reporting mismatches only for divergent tiles', () => {
    const a = makeTile(0,1,['Sun','Moon']);
    const b = makeTile(0,1,['Sun','Moon','Mercury']);
    const c = makeTile(0,1,['Sun','Moon']);
    const res = validateTileOrders([a,b,c]);
    // b mismatches relative to a; c matches a again (length + order)
    expect(res.mismatchedTileIds).toEqual([b.id]);
  });
});
