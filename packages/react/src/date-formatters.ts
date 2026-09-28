import { type DateParts } from './date-only.js';

const formatters = new Map<string, Intl.DateTimeFormat>();

/**
 * One shared `Intl.DateTimeFormat` per locale and options, since building
 * one is slow and a calendar formats dozens of dates per render. Every
 * formatter reads UTC, so a cached one never meets a changed device time
 * zone; pair it with `formatterDate`.
 */
export function dateFormatter(
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatters.get(key);
  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat(locale, {
      ...options,
      timeZone: 'UTC',
    });
    formatters.set(key, formatter);
  }
  return formatter;
}

/**
 * Noon UTC on a calendar date, for `dateFormatter` only. `setUTCFullYear`
 * keeps years below 100 literal instead of mapping them to the 1900s.
 */
export function formatterDate({ year, month, day }: DateParts): Date {
  const date = new Date(Date.UTC(2000, 0, 1, 12));
  date.setUTCFullYear(year, month - 1, day);
  return date;
}
