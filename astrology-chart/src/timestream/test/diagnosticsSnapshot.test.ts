import { describe, test, expect } from 'vitest';
import { getTimestreamDiagnostics } from '../TimestreamCanvas';

describe('diagnostics snapshot API', () => {
  test('returns shallow copy and is immutable externally', () => {
    const a = getTimestreamDiagnostics();
    expect(Array.isArray(a)).toBe(true);
    const len = a.length;
    a.push({} as any);
    const b = getTimestreamDiagnostics();
    expect(b.length).toBe(len);
  });
});
