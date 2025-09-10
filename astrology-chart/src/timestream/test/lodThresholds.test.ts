import { describe, test, expect } from 'vitest';
import { computeLod } from '../useTimestreamData';

const H = 3600*1000;
function ms(h:number){ return h*H; }

describe('extended LOD thresholds (computeLod)', () => {
  test('boundary mapping', () => {
    expect(computeLod(ms(1))).toBe(-1);
    expect(computeLod(ms(2))).toBe(-1);
    expect(computeLod(ms(2)+1)).toBe(0);
    expect(computeLod(ms(12))).toBe(0);
    expect(computeLod(ms(12)+1)).toBe(1);
    expect(computeLod(ms(72))).toBe(1);
    expect(computeLod(ms(72)+1)).toBe(2);
    expect(computeLod(14*24*H)).toBe(2);
    expect(computeLod(14*24*H + 1)).toBe(3);
  });
});
