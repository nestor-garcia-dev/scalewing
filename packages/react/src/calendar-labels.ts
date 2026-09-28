import {
  weekdayOrder,
  type CalendarMonth,
  type WeekStart,
} from './calendar-month.js';
import { parseDateOnly, toLocalDate } from './date-only.js';

/** A Sunday; any week works because only the weekday names are read. */
const REFERENCE_SUNDAY = { year: 2023, month: 1, day: 1 };

export type WeekdayLabel = {
  short: string;
  long: string;
};

/** Weekday column headers in display order, named by `Intl` for `locale`. */
export function weekdayLabels(
  locale: string,
  weekStartsOn: WeekStart,
): WeekdayLabel[] {
  const short = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const long = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  return weekdayOrder(weekStartsOn).map((weekday) => {
    const date = toLocalDate({
      ...REFERENCE_SUNDAY,
      day: REFERENCE_SUNDAY.day + weekday,
    });
    return { short: short.format(date), long: long.format(date) };
  });
}

/** The twelve month names, January first, as `locale` writes them alone. */
export function monthNames(locale: string): string[] {
  const format = new Intl.DateTimeFormat(locale, { month: 'long' });
  return Array.from({ length: 12 }, (_, index) =>
    format.format(toLocalDate({ year: 2023, month: index + 1, day: 1 })),
  );
}

export function monthTitle(month: CalendarMonth, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(toLocalDate({ ...month, day: 1 }));
}

/** A spoken date such as "Sunday, March 10, 2024"; empty for no date. */
export function formatDateLabel(value: string, locale: string): string {
  const parts = parseDateOnly(value);
  if (!parts) return '';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(
    toLocalDate(parts),
  );
}
