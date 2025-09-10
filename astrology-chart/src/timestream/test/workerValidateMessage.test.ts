import { describe, test, expect } from 'vitest';
import { validateRequestTileParams } from '../workerValidation';

describe('worker message validation', () => {
  test('rejects invalid params', () => {
    expect(validateRequestTileParams(0, 60000, 0)).toBeTruthy();
    expect(validateRequestTileParams(1024, -1, 0)).toBeTruthy();
    expect(validateRequestTileParams(1024, 60000, -2)).toBeTruthy();
  });
  test('accepts valid params', () => {
    expect(validateRequestTileParams(3072, 60000, 1)).toBeNull();
  });
});
