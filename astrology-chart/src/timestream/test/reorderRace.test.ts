// Reorder race test: simulate rapid planet order changes and verify rowMap invariants
import { describe, it, expect } from 'vitest';

function buildRowMap(canonical: string[], current: string[]) {
  return current.map(p => canonical.indexOf(p));
}

// Deterministic PRNG for reproducibility
function lcg(seed: number) { let s = seed>>>0; return () => (s = (s * 1664525 + 1013904223)>>>0) / 0xffffffff; }

describe('reorder race invariants', () => {
  it('maintains correct indices or -1 across 250 random reorders', () => {
    const canonical = ['Sun','Moon','Mercury','Venus','Mars'];
    let current = canonical.slice();
    const rand = lcg(12345);
    for (let iter=0; iter<250; iter++) {
      // Random operation: swap, remove, insert unknown, shuffle slice
      const op = Math.floor(rand()*4);
      if (op === 0 && current.length > 1) { // swap two
        const i = Math.floor(rand()*current.length);
        const j = Math.floor(rand()*current.length);
        [current[i], current[j]] = [current[j], current[i]];
      } else if (op === 1 && current.length > 2) { // remove one
        current.splice(Math.floor(rand()*current.length),1);
      } else if (op === 2) { // maybe add unknown
        if (!current.includes('Juno')) current.splice(Math.floor(rand()*(current.length+1)),0,'Juno');
      } else { // partial shuffle
        if (current.length > 3) {
          const start = Math.floor(rand()*(current.length-2));
          const slice = current.slice(start,start+2).reverse();
          current.splice(start,2,...slice);
        }
      }
      const rowMap = buildRowMap(canonical, current);
      // Invariant: For each present canonical planet, mapping is unique and correct.
      const seen: Record<string, number> = {};
      for (let k=0;k<current.length;k++) {
        const planet = current[k];
        const idx = rowMap[k];
        if (canonical.includes(planet)) {
          expect(idx).toBeGreaterThanOrEqual(0);
          expect(canonical[idx]).toBe(planet);
          if (seen[planet] !== undefined) throw new Error('Duplicate planet row mapping');
          seen[planet] = idx;
        } else {
          expect(idx).toBe(-1); // unknown sentinel
        }
      }
    }
  });
});
