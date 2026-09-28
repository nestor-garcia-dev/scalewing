import {
  daysInMonth,
  formatDateOnly,
  isValidDateParts,
  parseDateOnly,
  type DateParts,
} from './date-only.js';

export type CalendarMonth = {
  year: number;
  /** 1–12. */
  month: number;
};

/** 0 is Sunday, 1 is Monday, matching `Date.prototype.getDay`. */
export type WeekStart = 0 | 1;

/** Fails closed on a first weekday other than Sunday or Monday. */
export function assertWeekStart(weekStartsOn: number) {
  if (weekStartsOn !== 0 && weekStartsOn !== 1)
    throw new RangeError('weekStartsOn must be 0 or 1');
}

export type CalendarCell = {
  value: string;
  day: number;
  inMonth: boolean;
};

/*
 * Day arithmetic runs on a proleptic Gregorian day count, so it never passes
 * through a Date, a time zone, or a daylight-saving jump.
 * Algorithm: Howard Hinnant, "chrono-compatible low-level date algorithms".
 */
function toDayNumber({ year, month, day }: DateParts): number {
  const y = month <= 2 ? year - 1 : year;
  const era = Math.floor(y / 400);
  const yearOfEra = y - era * 400;
  const monthIndex = (month + 9) % 12;
  const dayOfYear = Math.floor((153 * monthIndex + 2) / 5) + day - 1;
  const dayOfEra =
    yearOfEra * 365 +
    Math.floor(yearOfEra / 4) -
    Math.floor(yearOfEra / 100) +
    dayOfYear;
  return era * 146097 + dayOfEra - 719468;
}

function fromDayNumber(dayNumber: number): DateParts {
  const z = dayNumber + 719468;
  const era = Math.floor(z / 146097);
  const dayOfEra = z - era * 146097;
  const yearOfEra = Math.floor(
    (dayOfEra -
      Math.floor(dayOfEra / 1460) +
      Math.floor(dayOfEra / 36524) -
      Math.floor(dayOfEra / 146096)) /
      365,
  );
  const dayOfYear =
    dayOfEra -
    (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const monthIndex = Math.floor((5 * dayOfYear + 2) / 153);
  const day = dayOfYear - Math.floor((153 * monthIndex + 2) / 5) + 1;
  const month = monthIndex < 10 ? monthIndex + 3 : monthIndex - 9;
  const year = yearOfEra + era * 400 + (month <= 2 ? 1 : 0);
  return { year, month, day };
}

function requireDate(value: string): DateParts {
  const parts = parseDateOnly(value);
  if (!parts) throw new RangeError('expected a valid YYYY-MM-DD date');
  return parts;
}

/** 0 is Sunday. */
export function weekdayOf(value: string): number {
  // Day 0 of the count is 1970-01-01, a Thursday.
  return (((toDayNumber(requireDate(value)) + 4) % 7) + 7) % 7;
}

export function addDays(value: string, delta: number): string {
  return formatDateOnly(fromDayNumber(toDayNumber(requireDate(value)) + delta));
}

/** Same day of the month `delta` months away, capped at that month's length. */
export function addMonths(value: string, delta: number): string {
  const parts = requireDate(value);
  const month = shiftMonth(parts, delta);
  return formatDateOnly({
    ...month,
    day: Math.min(parts.day, daysInMonth(month.year, month.month)),
  });
}

export function monthOf(value: string): CalendarMonth {
  const parts = requireDate(value);
  return { year: parts.year, month: parts.month };
}

export function shiftMonth(month: CalendarMonth, delta: number): CalendarMonth {
  const index = month.year * 12 + (month.month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function firstOfMonth(month: CalendarMonth): string {
  return formatDateOnly({ ...month, day: 1 });
}

export function lastOfMonth(month: CalendarMonth): string {
  return formatDateOnly({
    ...month,
    day: daysInMonth(month.year, month.month),
  });
}

/** Whether any day of the month falls inside `[min, max]`. */
export function monthInRange(
  month: CalendarMonth,
  min?: string,
  max?: string,
): boolean {
  return (
    (min === undefined || lastOfMonth(month) >= min) &&
    (max === undefined || firstOfMonth(month) <= max)
  );
}

/**
 * The months of `year` with any day inside `[min, max]`, 1–12, for a month
 * selector that only offers months a person can open.
 */
export function monthsInRange(
  year: number,
  min?: string,
  max?: string,
): number[] {
  return Array.from({ length: 12 }, (_, index) => index + 1).filter((month) =>
    monthInRange({ year, month }, min, max),
  );
}

/**
 * Six rows of seven cells covering the month, padded with the neighboring
 * months so the grid never changes height. Padding before 0001-01-01 or
 * after 9999-12-31 is `null`: no four-digit date exists there.
 */
export function monthGrid(
  month: CalendarMonth,
  weekStartsOn: WeekStart,
): (CalendarCell | null)[][] {
  const first = firstOfMonth(month);
  const leading = (weekdayOf(first) - weekStartsOn + 7) % 7;
  const start = toDayNumber(requireDate(first)) - leading;
  return Array.from({ length: 6 }, (_, row) =>
    Array.from({ length: 7 }, (_, column) => {
      const parts = fromDayNumber(start + row * 7 + column);
      if (!isValidDateParts(parts)) return null;
      return {
        value: formatDateOnly(parts),
        day: parts.day,
        inMonth: parts.year === month.year && parts.month === month.month,
      };
    }),
  );
}

/** Weekday indexes in display order for the given week start. */
export function weekdayOrder(weekStartsOn: WeekStart): number[] {
  return Array.from({ length: 7 }, (_, index) => (index + weekStartsOn) % 7);
}
