import {
  daysInMonth,
  formatDateOnly,
  parseDateOnly,
  toLocalDate,
  type DateParts,
} from './date-only.js';

export type CalendarMonth = {
  year: number;
  month: number;
};

/** 0 is Sunday, 1 is Monday, matching `Date.prototype.getDay`. */
export type WeekStart = 0 | 1;

export type CalendarCell = {
  value: string;
  day: number;
  inMonth: boolean;
};

export function monthOf(value: string, fallback: Date): CalendarMonth {
  const parts = parseDateOnly(value);
  return parts
    ? { year: parts.year, month: parts.month }
    : { year: fallback.getFullYear(), month: fallback.getMonth() + 1 };
}

export function shiftMonth(month: CalendarMonth, delta: number): CalendarMonth {
  const index = month.year * 12 + (month.month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function isSameMonth(a: CalendarMonth, b: CalendarMonth): boolean {
  return a.year === b.year && a.month === b.month;
}

function weekdayOf(parts: DateParts): number {
  return toLocalDate(parts).getDay();
}

function shiftDay(parts: DateParts, delta: number): DateParts {
  const date = toLocalDate(parts);
  date.setDate(date.getDate() + delta);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

/**
 * Six rows of seven cells covering the month, padded with the neighboring
 * months so the grid never changes height.
 */
export function monthGrid(
  month: CalendarMonth,
  weekStartsOn: WeekStart,
): CalendarCell[][] {
  const first: DateParts = { year: month.year, month: month.month, day: 1 };
  const leading = (weekdayOf(first) - weekStartsOn + 7) % 7;
  const lastDay = daysInMonth(month.year, month.month);
  const rows: CalendarCell[][] = [];
  let cursor = shiftDay(first, -leading);
  for (let row = 0; row < 6; row += 1) {
    const cells: CalendarCell[] = [];
    for (let column = 0; column < 7; column += 1) {
      cells.push({
        value: formatDateOnly(cursor),
        day: cursor.day,
        inMonth:
          cursor.year === month.year &&
          cursor.month === month.month &&
          cursor.day <= lastDay,
      });
      cursor = shiftDay(cursor, 1);
    }
    rows.push(cells);
  }
  return rows;
}

/** Weekday indexes in display order for the given week start. */
export function weekdayOrder(weekStartsOn: WeekStart): number[] {
  return Array.from({ length: 7 }, (_, index) => (index + weekStartsOn) % 7);
}
