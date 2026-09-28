import { parseDateOnly } from './date-only.js';

/** How far the year list reaches past today and the shown month by default. */
export const YEARS_BACK = 120;
export const YEARS_AHEAD = 20;

export type YearRange = {
  first: number;
  last: number;
};

/**
 * The years a calendar's year selector offers: 120 years before and 20
 * after both today and the shown year, cut to `min` and `max`. The shown
 * year is always inside, so the selector can display it.
 */
export function calendarYearRange(
  shownYear: number,
  todayYear: number,
  min?: string,
  max?: string,
): YearRange {
  const minYear = min === undefined ? 1 : (parseDateOnly(min)?.year ?? 1);
  const maxYear = max === undefined ? 9999 : (parseDateOnly(max)?.year ?? 9999);
  return {
    first: Math.max(minYear, 1, Math.min(shownYear, todayYear) - YEARS_BACK),
    last: Math.min(maxYear, 9999, Math.max(shownYear, todayYear) + YEARS_AHEAD),
  };
}

export function yearsIn({ first, last }: YearRange): number[] {
  return Array.from({ length: last - first + 1 }, (_, index) => first + index);
}
