import { describe, test, expect } from 'vitest';
import { normalizeTime } from '../useTimestreamData';

describe('normalizeTime edge cases', () => {
  test('fractional positive rounds correctly', () => {
    expect(normalizeTime(1000.0000004)).toBe(1000);
    expect(normalizeTime(1000.6)).toBe(1001); // typical rounding
  });
  test('negative near zero becomes 0 (no -0)', () => {
    const v = normalizeTime(-0.00000004);
    expect(Object.is(v, -0)).toBe(false);
    expect(v).toBe(0);
  });
  test('monotonic for ascending micro-increments', () => {
    let prev = -1;
    for (let i=0;i<100;i++) {
      const val = normalizeTime(i + 0.0000003);
      expect(val).toBeGreaterThan(prev);
      prev = val;
    }
  });
});
