// devWarnOnce behavior test: ensure only first call emits a warning per key
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { devWarnOnce } from '../orderIntegrity';

describe('devWarnOnce', () => {
  beforeEach(() => {
    // Reset window cache between tests
    (globalThis as any).window = (globalThis as any).window || {};
    (globalThis as any).window.__timestreamWarnedKeys = new Set();
  });

  it('warns only once per key', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    devWarnOnce('k1', 'message-1');
    devWarnOnce('k1', 'message-1');
    devWarnOnce('k1', 'message-1');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('warns again for different key', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    devWarnOnce('k1', 'm');
    devWarnOnce('k2', 'm');
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });
});
