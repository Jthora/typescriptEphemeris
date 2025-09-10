import { describe, it, expect } from 'vitest';
import { computeOrderSignature, ordersMatch, validateTileOrders } from '../orderIntegrity';

describe('orderIntegrity utilities', () => {
  it('computes signature', () => {
    expect(computeOrderSignature(['Sun','Moon'])).toBe('Sun|Moon');
  });
  it('matches identical orders', () => {
    expect(ordersMatch(['A','B'], ['A','B'])).toBe(true);
    expect(ordersMatch(['A','B'], ['B','A'])).toBe(false);
  });
  it('validates tile orders and detects mismatch', () => {
    const tiles = [
      { id: 't1', bodies: ['Sun','Moon'] },
      { id: 't2', bodies: ['Sun','Moon'] },
      { id: 't3', bodies: ['Moon','Sun'] }
    ];
    const res = validateTileOrders(tiles);
    expect(res.signature).toBe('Sun|Moon');
    expect(res.mismatchedTileIds).toEqual(['t3']);
  });
});