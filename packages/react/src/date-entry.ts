import {
  formatDateOnly,
  isValidDateParts,
  parseDateOnly,
  toLocalDate,
  type DateParts,
} from './date-only.js';

export type DateEntryPart = 'day' | 'month' | 'year';

/** How a locale writes a numeric date: field order and the separator. */
export type DateEntryPattern = {
  order: readonly [DateEntryPart, DateEntryPart, DateEntryPart];
  separator: string;
};

const FALLBACK: DateEntryPattern = {
  order: ['month', 'day', 'year'],
  separator: '/',
};

function isEntryPart(type: string): type is DateEntryPart {
  return type === 'day' || type === 'month' || type === 'year';
}

/**
 * Reads the numeric field order and separator from `Intl` for `locale`, for
 * example month/day/year with "/" for en-US and day.month.year for de.
 */
export function dateEntryPattern(locale: string): DateEntryPattern {
  const parts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(toLocalDate({ year: 2023, month: 12, day: 31 }));
  const order = parts.map((part) => part.type).filter(isEntryPart);
  const separator = parts.find((part) => part.type === 'literal')?.value;
  if (order.length !== 3 || new Set(order).size !== 3 || !separator?.trim())
    return FALLBACK;
  return {
    order: [order[0], order[1], order[2]] as DateEntryPattern['order'],
    separator: separator.trim(),
  };
}

const WIDTH: Record<DateEntryPart, number> = { day: 2, month: 2, year: 4 };

/** Zero-padded, Latin digits in the pattern's order; empty for no date. */
export function formatDateEntry(
  value: string,
  pattern: DateEntryPattern,
): string {
  const parts = parseDateOnly(value);
  if (!parts) return '';
  return pattern.order
    .map((part) => String(parts[part]).padStart(WIDTH[part], '0'))
    .join(pattern.separator);
}

/** A hint such as "MM/DD/YYYY" from the consumer's per-part letters. */
export function dateEntryPlaceholder(
  pattern: DateEntryPattern,
  letters: Record<DateEntryPart, string>,
): string {
  return pattern.order.map((part) => letters[part]).join(pattern.separator);
}

function splitDigits(text: string, pattern: DateEntryPattern): string[] | null {
  const groups = text.match(/\d+/g) ?? [];
  if (groups.length === 3) return groups;
  // Eight digits with no separators, as typed on a numeric keypad.
  const digits = groups[0];
  if (groups.length !== 1 || digits?.length !== 8) return null;
  let start = 0;
  return pattern.order.map((part) => {
    const group = digits.slice(start, start + WIDTH[part]);
    start += WIDTH[part];
    return group;
  });
}

const ISO_ORDER: DateEntryPattern['order'] = ['year', 'month', 'day'];

/**
 * Parses typed text in the pattern's order. Day and month take one or two
 * digits, the year exactly four, and any non-digit run separates fields.
 * Eight bare digits split by field width in the same order (MMDDYYYY for
 * en-US). A four-digit first field reads as ISO year-month-day in every
 * locale, since no locale starts a day or month with four digits. Returns
 * the YYYY-MM-DD value, '' for blank text, or null when it is not a date.
 */
export function parseDateEntry(
  text: string,
  pattern: DateEntryPattern,
): string | null {
  const trimmed = text.trim();
  if (trimmed === '') return '';
  if (/\p{L}/u.test(trimmed)) return null;
  const groups = splitDigits(trimmed, pattern);
  if (!groups) return null;
  const order = groups[0]?.length === 4 ? ISO_ORDER : pattern.order;
  const date: DateParts = { year: 0, month: 0, day: 0 };
  for (const [index, part] of order.entries()) {
    const digits = groups[index] ?? '';
    const width = part === 'year' ? digits.length === 4 : digits.length <= 2;
    if (!width) return null;
    date[part] = Number(digits);
  }
  return isValidDateParts(date) ? formatDateOnly(date) : null;
}
