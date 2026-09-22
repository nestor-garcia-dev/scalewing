import {
  weekdayOrder,
  type CalendarMonth,
  type WeekStart,
} from './calendar-month.js';
import { parseDateOnly, toLocalDate } from './date-only.js';

/** Sunday-first reference week; any week in any year works for labels. */
const REFERENCE_SUNDAY = new Date(2023, 0, 1, 12);

export function weekdayLabels(
  locale: string | undefined,
  weekStartsOn: WeekStart,
): string[] {
  const format = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  return weekdayOrder(weekStartsOn).map((weekday) => {
    const date = new Date(REFERENCE_SUNDAY);
    date.setDate(date.getDate() + weekday);
    return format.format(date);
  });
}

export function monthTitle(
  month: CalendarMonth,
  locale: string | undefined,
): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(month.year, month.month - 1, 1, 12));
}

export function formatDateLabel(
  value: string,
  locale: string | undefined,
  dateStyle: 'medium' | 'full',
): string {
  const parts = parseDateOnly(value);
  if (!parts) return '';
  return new Intl.DateTimeFormat(locale, { dateStyle }).format(
    toLocalDate(parts),
  );
}
