import { describe, expect, it } from 'vitest';

import { calendarYearRange, yearsIn } from './calendar-years.js';

describe('calendar year range', () => {
  it('reaches 120 years back and 20 ahead of today and the shown year', () => {
    expect(calendarYearRange(2026, 2026)).toEqual({ first: 1906, last: 2046 });
    expect(calendarYearRange(1890, 2026)).toEqual({ first: 1770, last: 2046 });
  });

  it('is cut to min and max', () => {
    expect(calendarYearRange(2024, 2026, '2020-06-01', '2025-01-31')).toEqual({
      first: 2020,
      last: 2025,
    });
  });

  it('never leaves the four-digit years', () => {
    expect(calendarYearRange(50, 2026).first).toBe(1);
    expect(calendarYearRange(9990, 2026).last).toBe(9999);
  });

  it('lists the years in order', () => {
    expect(yearsIn({ first: 2022, last: 2025 })).toEqual([
      2022, 2023, 2024, 2025,
    ]);
  });
});
