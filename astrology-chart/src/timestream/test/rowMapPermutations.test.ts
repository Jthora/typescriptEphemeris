// Row map permutation coverage: ensure sentinel -1 for missing, correct indices for present across permutations
import { describe, it, expect } from 'vitest';

function buildRowMap(canonical: string[], planetOrder: string[]) {
  return planetOrder.map(p => canonical.indexOf(p));
}

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr.slice()];
  const result: T[][] = [];
  for (let i=0;i<arr.length;i++) {
    const rest = arr.slice(0,i).concat(arr.slice(i+1));
    for (const sub of permutations(rest)) result.push([arr[i], ...sub]);
  }
  return result;
}

describe('rowMap permutations', () => {
  const canonical = ['Sun','Moon','Mercury'];
  const perms = permutations(canonical);
  // Add some with a missing body and an extra unknown body
  const extended: string[][] = [];
  for (const p of perms) {
    extended.push(p.slice()); // full
    extended.push(p.slice(0,2)); // one missing
    extended.push([...p.slice(0,2), 'Venus']); // includes unknown
  }

  it('maps indices or -1 only', () => {
    for (const order of extended) {
      const rowMap = buildRowMap(canonical, order);
      expect(rowMap.length).toBe(order.length);
      for (let i=0;i<rowMap.length;i++) {
        const idx = rowMap[i];
        if (canonical.includes(order[i])) {
          expect(idx).toBeGreaterThanOrEqual(0);
          expect(canonical[idx]).toBe(order[i]);
        } else {
          expect(idx).toBe(-1);
        }
      }
    }
  });
});
