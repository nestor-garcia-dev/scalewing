import { describe, expect, it } from 'vitest';

import { assertDateOnly, isDateOnly, isOutsideDateRange } from './date-only.js';

describe('date-only values', () => {
  it('accepts exact calendar dates including leap days and DST boundaries', () => {
    for (const value of [
      '2000-02-29',
      '2024-02-29',
      '2024-03-10',
      '2024-11-03',
    ]) {
      expect(isDateOnly(value)).toBe(true);
    }
  });

  it('rejects malformed and impossible dates without UTC conversion', () => {
    for (const value of [
      '2023-02-29',
      '1900-02-29',
      '2024-04-31',
      '2024-13-01',
      '2024-00-01',
      '0000-01-01',
      '2024-1-01',
      '2024-01-1',
      '2024-01-01T00:00:00Z',
    ]) {
      expect(isDateOnly(value)).toBe(false);
      expect(() => assertDateOnly('value', value)).toThrow(RangeError);
    }
    expect(() => assertDateOnly('value', '', true)).not.toThrow();
  });

  it('compares normalized dates lexically, including at range edges', () => {
    expect(isOutsideDateRange('2024-03-10', '2024-03-10', '2024-11-03')).toBe(
      false,
    );
    expect(isOutsideDateRange('2024-03-09', '2024-03-10')).toBe(true);
    expect(isOutsideDateRange('2024-11-04', undefined, '2024-11-03')).toBe(
      true,
    );
    expect(isOutsideDateRange('', '2024-03-10')).toBe(false);
  });
});
