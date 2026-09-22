import { describe, expect, it } from 'vitest';

import {
  monthGrid,
  monthOf,
  shiftMonth,
  weekdayOrder,
} from './calendar-month.js';

describe('calendar month', () => {
  it('shifts across year boundaries in both directions', () => {
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

  it('takes the month from a value or falls back to a date', () => {
    expect(monthOf('2026-09-21', new Date(2000, 0, 1))).toEqual({
      year: 2026,
      month: 9,
    });
    expect(monthOf('', new Date(2000, 5, 1))).toEqual({ year: 2000, month: 6 });
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
    expect(monday[4]?.[2]).toEqual({
      value: '2026-09-30',
      day: 30,
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
  });

  it('covers every day of a leap February exactly once', () => {
    const cells = monthGrid({ year: 2024, month: 2 }, 1)
      .flat()
      .filter((cell) => cell.inMonth);
    expect(cells.map((cell) => cell.day)).toEqual(
      Array.from({ length: 29 }, (_, index) => index + 1),
    );
  });

  it('orders weekdays from the week start', () => {
    expect(weekdayOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(weekdayOrder(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});
