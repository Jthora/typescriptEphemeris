import { describe, test, expect } from 'vitest';
import { packPool } from '../packPool';

describe('packPool', () => {
  test('grows to next power of two and reuses buffer', () => {
    const startAllocs = packPool.allocCount;
    const v1 = packPool.getView(1000);
    const after1 = packPool.allocCount;
    expect(after1).toBe(startAllocs + 1);
    const cap1 = v1.buffer.byteLength;
    expect(cap1).toBeGreaterThanOrEqual(1000);
    const v2 = packPool.getView(500);
    expect(packPool.allocCount).toBe(after1);
    const v3 = packPool.getView(cap1 - 10);
    expect(packPool.allocCount).toBe(after1);
    const v4 = packPool.getView(cap1 + 1);
    expect(packPool.allocCount).toBe(after1 + 1);
    expect(v4.buffer.byteLength).toBeGreaterThan(cap1);
  });
});
