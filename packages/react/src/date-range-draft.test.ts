import { describe, expect, it } from 'vitest';

import { daysBetween, monthsBetween, sameDayIn } from './calendar-month.js';
import {
  latestPick,
  pressDay,
  rangeDayCount,
  sameRange,
  settledDraft,
} from './date-range-draft.js';
import { firstShownMonth, shownMonths } from './date-range-view.js';

const week = { start: '2026-10-06', end: '2026-10-12' };

describe('pressDay', () => {
  it('sets the start, then the end', () => {
    const first = pressDay(settledDraft(week), '2026-09-14');
    expect(first).toEqual({
      range: { start: '2026-09-14', end: '2026-09-14' },
      awaitingEnd: true,
    });
    expect(pressDay(first, '2026-09-20')).toEqual({
      range: { start: '2026-09-14', end: '2026-09-20' },
      awaitingEnd: false,
    });
  });

  it('ends a one-day range on the start itself', () => {
    const first = pressDay(settledDraft(week), '2026-09-14');
    expect(pressDay(first, '2026-09-14')).toEqual({
      range: { start: '2026-09-14', end: '2026-09-14' },
      awaitingEnd: false,
    });
  });

  it('starts over from a day before the start, still waiting for the end', () => {
    const first = pressDay(settledDraft(week), '2026-09-14');
    expect(pressDay(first, '2026-09-02')).toEqual({
      range: { start: '2026-09-02', end: '2026-09-02' },
      awaitingEnd: true,
    });
  });

  it('starts a new range on a press after a whole one', () => {
    const whole = pressDay(
      pressDay(settledDraft(week), '2026-09-14'),
      '2026-09-20',
    );
    expect(pressDay(whole, '2026-09-30')).toEqual({
      range: { start: '2026-09-30', end: '2026-09-30' },
      awaitingEnd: true,
    });
  });
});

describe('latestPick', () => {
  it('is max for a whole range or without maxDays', () => {
    expect(latestPick(settledDraft(week), '2026-10-13', 7)).toBe('2026-10-13');
    expect(
      latestPick(
        pressDay(settledDraft(week), '2026-01-01'),
        '2026-10-13',
        undefined,
      ),
    ).toBe('2026-10-13');
    expect(
      latestPick(settledDraft(week), undefined, undefined),
    ).toBeUndefined();
  });

  it('is maxDays from the start while the end is awaited, when earlier than max', () => {
    const waiting = pressDay(settledDraft(week), '2025-10-01');
    // 366 days, both ends counted: Oct 1, 2025 to Oct 1, 2026.
    expect(latestPick(waiting, '2026-10-13', 366)).toBe('2026-10-01');
    expect(latestPick(waiting, undefined, 7)).toBe('2025-10-07');
    expect(latestPick(waiting, '2025-10-03', 7)).toBe('2025-10-03');
    expect(latestPick(waiting, undefined, 1)).toBe('2025-10-01');
  });

  it('stays inside the four-digit years', () => {
    const waiting = pressDay(settledDraft(week), '9999-12-30');
    expect(latestPick(waiting, undefined, 10)).toBe('9999-12-31');
  });
});

describe('range arithmetic', () => {
  it('counts both ends and compares ranges', () => {
    expect(rangeDayCount(week)).toBe(7);
    expect(rangeDayCount({ start: '2024-01-01', end: '2024-12-31' })).toBe(366);
    expect(rangeDayCount({ start: '2026-10-06', end: '2026-10-06' })).toBe(1);
    expect(sameRange(week, { ...week })).toBe(true);
    expect(sameRange(week, { ...week, end: '2026-10-13' })).toBe(false);
  });

  it('counts days and months between, and keeps a day in another month', () => {
    expect(daysBetween('2026-02-27', '2026-03-01')).toBe(2);
    expect(daysBetween('2026-03-01', '2026-02-27')).toBe(-2);
    expect(
      monthsBetween({ year: 2025, month: 11 }, { year: 2026, month: 2 }),
    ).toBe(3);
    expect(sameDayIn({ year: 2026, month: 2 }, '2026-01-31')).toBe(
      '2026-02-28',
    );
  });
});

describe('firstShownMonth', () => {
  const sep = { year: 2026, month: 9 };
  const oct = { year: 2026, month: 10 };

  it('opens with the focus day in the last month shown', () => {
    expect(firstShownMonth('2026-10-12', 2, undefined, undefined)).toEqual(sep);
    expect(firstShownMonth('2026-10-12', 1, undefined, undefined)).toEqual(oct);
    expect(firstShownMonth('2026-01-12', 2, undefined, undefined)).toEqual({
      year: 2025,
      month: 12,
    });
  });

  it('never opens on a month before min', () => {
    expect(firstShownMonth('2026-10-12', 2, undefined, '2026-10-03')).toEqual(
      oct,
    );
    expect(firstShownMonth('2026-10-12', 2, undefined, '2026-09-30')).toEqual(
      sep,
    );
  });

  it('keeps a view holding the focus day and follows one that leaves it', () => {
    expect(firstShownMonth('2026-09-03', 2, sep, undefined)).toEqual(sep);
    expect(firstShownMonth('2026-10-31', 2, sep, undefined)).toEqual(sep);
    expect(firstShownMonth('2026-08-31', 2, sep, undefined)).toEqual({
      year: 2026,
      month: 8,
    });
    expect(firstShownMonth('2026-11-01', 2, sep, undefined)).toEqual(oct);
    expect(firstShownMonth('2026-11-01', 1, oct, undefined)).toEqual({
      year: 2026,
      month: 11,
    });
  });

  it('opens the first year on its own month', () => {
    expect(firstShownMonth('0001-01-05', 2, undefined, undefined)).toEqual({
      year: 1,
      month: 1,
    });
  });

  it('lists the months shown', () => {
    expect(shownMonths({ year: 2026, month: 12 }, 2)).toEqual([
      { year: 2026, month: 12 },
      { year: 2027, month: 1 },
    ]);
  });
});
