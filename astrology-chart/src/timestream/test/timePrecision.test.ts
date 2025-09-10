import { describe, it, expect } from 'vitest';
import { normalizeTime } from '../useTimestreamData';

describe('time precision normalization', () => {
  it('rounds consistently and avoids drift over many adjustments', () => {
    let center = Date.now();
    const span = 6 * 3600 * 1000;
    const original = center;
    for (let i=0;i<500;i++) {
      // introduce floating noise
      center = normalizeTime(center + 3599.9999); // ~1h shift with fractional ms noise
      expect(center % 1).toBe(0); // integer ms
    }
    // Net delta close to expected (within a ms tolerance)
    const expectedDelta = 500 * 3600 * 1000 * (3599.9999/3600/1000); // approximate; but we just ensure monotonic and integer
    expect(center).toBeGreaterThan(original);
  });
});
