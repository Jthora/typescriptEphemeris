import { describe, test, expect } from 'vitest';
import { validateTileOrders, ordersMatch } from '../orderIntegrity';
import type { TimestreamTile } from '../types';

function makeTileWithBodies(id:string, bodies:string[], cols=8, rows?:number): TimestreamTile {
  const r = rows ?? bodies.length;
  return {
    id,
    lod: 1,
    startTimeMs: 0,
    stepMs: 60_000,
    cols,
    rows: r,
    bodies: bodies.slice(),
    buffer: new Uint8Array(r*cols*4),
    variance: new Float32Array(cols),
    maxVariance: 0,
    retrogradeCounts: new Uint8Array(cols),
    maxRetrogradeCount: 0,
    genMs: 0
  } as TimestreamTile;
}

describe('planet dynamic ordering stress', () => {
  test('validateTileOrders catches mismatches amid add/remove/reorder', () => {
    const base = ['Sun','Moon','Mercury','Venus','Mars'];
    const seq: string[][] = [];
    // build sequence with operations
    seq.push(base);
    seq.push([...base, 'Jupiter']); // add
    seq.push(['Sun','Moon','Venus','Mercury','Mars']); // reorder
    seq.push(['Sun','Moon','Mercury']); // remove
    const tiles = seq.map((b,i)=> makeTileWithBodies(`t${i}`, b));
    const res = validateTileOrders(tiles);
    // Expect mismatches for all after first because signature changes at each step
    expect(res.mismatchedTileIds.length).toBe(tiles.length - 1);
    // OrdersMatch sanity
    expect(ordersMatch(tiles[0].bodies!, tiles[0].bodies!)).toBe(true);
    expect(ordersMatch(tiles[0].bodies!, tiles[1].bodies!)).toBe(false);
  });
});
