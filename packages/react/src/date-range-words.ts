import { dateFormatter, formatterDate } from './date-formatters.js';
import { parseDateOnly, type DateOnlyRange } from './date-only.js';

const shortRange: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

const longRange: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

function formatRange(
  range: DateOnlyRange,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const start = parseDateOnly(range.start);
  const end = parseDateOnly(range.end);
  if (!start || !end) return '';
  const format = dateFormatter(locale, options);
  // Browsers before formatRange (Safari 14.0) write both ends in full.
  if (typeof format.formatRange !== 'function')
    return range.start === range.end
      ? format.format(formatterDate(start))
      : `${format.format(formatterDate(start))} – ${format.format(formatterDate(end))}`;
  return format.formatRange(formatterDate(start), formatterDate(end));
}

/**
 * A range as the button shows it, the locale sharing what both ends have,
 * such as "Oct 6 – 12, 2026", or "Oct 6, 2026" for one day.
 */
export function formatRangeShort(range: DateOnlyRange, locale: string): string {
  return formatRange(range, locale, shortRange);
}

/**
 * A range with its weekdays, as the calendar states the one being picked,
 * such as "Tue, Oct 6 – Mon, Oct 12, 2026".
 */
export function formatRangeLong(range: DateOnlyRange, locale: string): string {
  return formatRange(range, locale, longRange);
}
