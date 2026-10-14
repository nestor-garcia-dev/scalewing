import { describe, expect, it } from 'vitest';

import { dayNumber } from './chart-dates.js';

describe('day numbers', () => {
  it('counts days since 1970-01-01, across months, leap days and years', () => {
    expect(dayNumber('1970-01-01')).toBe(0);
    expect(dayNumber('1970-01-02')).toBe(1);
    expect(dayNumber('2024-03-01')! - dayNumber('2024-02-28')!).toBe(2);
    expect(dayNumber('2027-01-01')! - dayNumber('2026-12-31')!).toBe(1);
    expect(dayNumber('0050-06-01')).toBeLessThan(dayNumber('0100-06-01')!);
  });

  it('is null for anything that is not a real date', () => {
    expect(dayNumber('2026-02-30')).toBeNull();
    expect(dayNumber('2026-7-1')).toBeNull();
    expect(dayNumber('')).toBeNull();
  });
});
