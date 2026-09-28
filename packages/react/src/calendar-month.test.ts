import { describe, expect, it } from 'vitest';

import {
  addDays,
  addMonths,
  monthGrid,
  monthsInRange,
  monthInRange,
  monthOf,
  shiftMonth,
  weekdayOf,
  weekdayOrder,
} from './calendar-month.js';

describe('calendar month', () => {
  it('shifts months across year boundaries in both directions', () => {
    expect(shiftMonth({ year: 2026, month: 12 }, 1)).toEqual({
      year: 2027,
      month: 1,
    });
    expect(shiftMonth({ year: 2026, month: 1 }, -1)).toEqual({
      year: 2025,
      month: 12,
    });
    expect(shiftMonth({ year: 2026, month: 5 }, -17)).toEqual({
      year: 2024,
      month: 12,
    });
  });

  it('adds days without a time zone, across months, leap days, and DST', () => {
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDays('2023-02-28', 1)).toBe('2023-03-01');
    expect(addDays('2024-03-09', 2)).toBe('2024-03-11');
    expect(addDays('2024-11-02', 2)).toBe('2024-11-04');
    expect(addDays('2025-01-01', -1)).toBe('2024-12-31');
    expect(addDays('1900-02-28', 1)).toBe('1900-03-01');
    expect(addDays('0001-01-07', -6)).toBe('0001-01-01');
  });

  it('keeps the day when adding months, capped at the month length', () => {
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29');
    expect(addMonths('2023-01-31', 1)).toBe('2023-02-28');
    expect(addMonths('2024-03-10', -1)).toBe('2024-02-10');
    expect(addMonths('2024-02-29', 12)).toBe('2025-02-28');
    expect(addMonths('2024-02-29', -48)).toBe('2020-02-29');
  });

  it('names weekdays from the day count, Sunday as 0', () => {
    expect(weekdayOf('1970-01-01')).toBe(4);
    expect(weekdayOf('2024-03-10')).toBe(0);
    expect(weekdayOf('2026-09-28')).toBe(1);
    expect(weekdayOf('1969-12-31')).toBe(3);
    expect(weekdayOf('0001-01-01')).toBe(1);
  });

  it('takes the month from a date-only value', () => {
    expect(monthOf('2026-09-21')).toEqual({ year: 2026, month: 9 });
    expect(() => monthOf('')).toThrow(RangeError);
  });

  it('pads six rows of seven starting on the configured weekday', () => {
    // September 2026 starts on a Tuesday.
    const monday = monthGrid({ year: 2026, month: 9 }, 1);
    expect(monday).toHaveLength(6);
    expect(monday.every((row) => row.length === 7)).toBe(true);
    expect(monday[0]?.[0]).toEqual({
      value: '2026-08-31',
      day: 31,
      inMonth: false,
    });
    expect(monday[0]?.[1]).toEqual({
      value: '2026-09-01',
      day: 1,
      inMonth: true,
    });
    expect(monday[4]?.[3]).toEqual({
      value: '2026-10-01',
      day: 1,
      inMonth: false,
    });

    const sunday = monthGrid({ year: 2026, month: 9 }, 0);
    expect(sunday[0]?.[0]?.value).toBe('2026-08-30');
    expect(sunday[0]?.[2]?.value).toBe('2026-09-01');
    expect(sunday[5]?.[6]?.value).toBe('2026-10-10');
  });

  it('lists weekday indexes in display order', () => {
    expect(weekdayOrder(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(weekdayOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
  });

  it('knows whether any day of a month is inside the bounds', () => {
    const march = { year: 2024, month: 3 };
    expect(monthInRange(march)).toBe(true);
    expect(monthInRange(march, '2024-03-31')).toBe(true);
    expect(monthInRange(march, '2024-04-01')).toBe(false);
    expect(monthInRange(march, undefined, '2024-03-01')).toBe(true);
    expect(monthInRange(march, undefined, '2024-02-29')).toBe(false);
  });

  it('leaves the padding past the four-digit years empty', () => {
    // January 1 of year 1 is a Monday, so a Sunday-first grid pads one day.
    const first = monthGrid({ year: 1, month: 1 }, 0);
    expect(first[0]?.[0]).toBeNull();
    expect(first[0]?.[1]?.value).toBe('0001-01-01');
    // December 31, 9999 is a Friday; the rest of the grid has no date.
    const last = monthGrid({ year: 9999, month: 12 }, 0);
    const cells = last.flat();
    expect(cells.filter((cell) => cell !== null).at(-1)?.value).toBe(
      '9999-12-31',
    );
    expect(cells.at(-1)).toBeNull();
    expect(last.every((row) => row.length === 7)).toBe(true);
    expect(last).toHaveLength(6);
  });

  it('lists the months of a year with a day inside the bounds', () => {
    expect(monthsInRange(2024)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(monthsInRange(2024, '2024-03-31', '2024-06-01')).toEqual([
      3, 4, 5, 6,
    ]);
    expect(monthsInRange(2025, '2024-03-31', '2025-02-01')).toEqual([1, 2]);
    expect(monthsInRange(2023, '2024-01-01')).toEqual([]);
  });
});
