import { describe, expect, it } from 'vitest';

import {
  assertDateBounds,
  assertDateOnly,
  clampDateOnly,
  formatDateOnly,
  isDateOnly,
  isOutsideDateRange,
  parseDateOnly,
  todayDateOnly,
} from './date-only.js';

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

describe('date-only arithmetic helpers', () => {
  it('parses and formats parts with four-digit years', () => {
    expect(parseDateOnly('0050-02-03')).toEqual({ year: 50, month: 2, day: 3 });
    expect(formatDateOnly({ year: 50, month: 2, day: 3 })).toBe('0050-02-03');
    expect(parseDateOnly('2024-02-30')).toBeNull();
  });

  it('clamps into the bounds and the four-digit years', () => {
    expect(clampDateOnly('2024-03-09', '2024-03-10')).toBe('2024-03-10');
    expect(clampDateOnly('2024-12-01', undefined, '2024-11-03')).toBe(
      '2024-11-03',
    );
    expect(clampDateOnly('2024-06-01', '2024-01-01', '2024-12-31')).toBe(
      '2024-06-01',
    );
    expect(clampDateOnly('0000-12-31')).toBe('0001-01-01');
    expect(clampDateOnly('10000-01-01')).toBe('9999-12-31');
  });

  it('reads today from the local wall calendar, not UTC', () => {
    // 23:30 local on March 10 is already March 11 in UTC for western zones.
    expect(todayDateOnly(new Date(2024, 2, 10, 23, 30))).toBe('2024-03-10');
    expect(todayDateOnly(new Date(2024, 2, 10, 0, 15))).toBe('2024-03-10');
  });

  it('validates value and bounds together', () => {
    expect(() =>
      assertDateBounds('', '2024-01-01', '2024-12-31'),
    ).not.toThrow();
    expect(() => assertDateBounds('2024-13-01')).toThrow(RangeError);
    expect(() => assertDateBounds('', '2024-12-31', '2024-01-01')).toThrow(
      'min must not be after max',
    );
  });
});
