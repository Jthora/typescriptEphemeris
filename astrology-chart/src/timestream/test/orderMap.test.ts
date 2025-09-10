// Minimal test for ordering integrity rowMap sentinel handling
import { describe, it, expect } from 'vitest';

describe('rowMap sentinel handling', () => {
  it('preserves -1 for missing planets', () => {
    const canonical = ['Sun','Moon','Mercury'];
    const planetOrder = ['Sun','Venus','Moon']; // Venus missing
    const rowMap = planetOrder.map(p => canonical.indexOf(p));
    expect(rowMap).toEqual([0,-1,1]);
  });
});