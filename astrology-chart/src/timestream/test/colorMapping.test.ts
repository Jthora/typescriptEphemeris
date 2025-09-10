import { describe, test, expect } from 'vitest';
import { elementVectorToRGB, DEFAULT_ELEMENT_COLOR_MAP } from '../elementColorMap';

describe('color mapping', () => {
  test('pure channels map directly', () => {
    const m = DEFAULT_ELEMENT_COLOR_MAP;
    expect(elementVectorToRGB([1,0,0,0])).toEqual(m.fire);
    expect(elementVectorToRGB([0,1,0,0])).toEqual(m.earth);
    expect(elementVectorToRGB([0,0,1,0])).toEqual(m.air);
    expect(elementVectorToRGB([0,0,0,1])).toEqual(m.water);
  });
  test('balanced mix within plausible range', () => {
    const [r,g,b] = elementVectorToRGB([0.25,0.25,0.25,0.25]);
    expect(r).toBeGreaterThan(0.2);
    expect(g).toBeGreaterThan(0.2);
    expect(b).toBeGreaterThan(0.2);
  });
  test('linear combination property', () => {
    const half = elementVectorToRGB([0.5,0.5,0,0]);
    const f = elementVectorToRGB([1,0,0,0]);
    const e = elementVectorToRGB([0,1,0,0]);
    expect(half[0]).toBeCloseTo((f[0]+e[0])/2,5);
    expect(half[1]).toBeCloseTo((f[1]+e[1])/2,5);
    expect(half[2]).toBeCloseTo((f[2]+e[2])/2,5);
  });
});
