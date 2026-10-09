const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** A calendar date with no time and no zone. `month` is 1–12. */
export type DateParts = {
  year: number;
  month: number;
  day: number;
};

/** The first and last dates a four-digit YYYY-MM-DD value can hold. */
export const EARLIEST_DATE_ONLY = '0001-01-01';
export const LATEST_DATE_ONLY = '9999-12-31';

export function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return leap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function isValidDateParts({ year, month, day }: DateParts): boolean {
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    year >= 1 &&
    year <= 9999 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month)
  );
}

export function parseDateOnly(value: string): DateParts | null {
  const parts = DATE_ONLY.exec(value);
  if (!parts) return null;
  const date = {
    year: Number(parts[1]),
    month: Number(parts[2]),
    day: Number(parts[3]),
  };
  return isValidDateParts(date) ? date : null;
}

export function isDateOnly(value: string): boolean {
  return parseDateOnly(value) !== null;
}

export function formatDateOnly({ year, month, day }: DateParts): string {
  const yyyy = String(year).padStart(4, '0');
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function assertDateOnly(name: string, value: string, empty = false) {
  if (empty && value === '') return;
  if (!isDateOnly(value))
    throw new RangeError(`${name} must be a valid YYYY-MM-DD date`);
}

/** Validates a picker's value and bounds; an empty value means no selection. */
export function assertDateBounds(value: string, min?: string, max?: string) {
  assertDateOnly('value', value, true);
  if (min !== undefined) assertDateOnly('min', min);
  if (max !== undefined) assertDateOnly('max', max);
  if (min !== undefined && max !== undefined && min > max)
    throw new RangeError('min must not be after max');
}

/** Valid date-only strings compare lexicographically. */
export function isOutsideDateRange(
  value: string,
  min?: string,
  max?: string,
): boolean {
  return (
    value !== '' &&
    ((min !== undefined && value < min) || (max !== undefined && value > max))
  );
}

/**
 * Moves a date-only value into `[min, max]` and into the four-digit years.
 * Also accepts a zero-padded year 0 or 10000 string from day arithmetic.
 */
export function clampDateOnly(
  value: string,
  min: string = EARLIEST_DATE_ONLY,
  max: string = LATEST_DATE_ONLY,
): string {
  const low = min > EARLIEST_DATE_ONLY ? min : EARLIEST_DATE_ONLY;
  const high = max < LATEST_DATE_ONLY ? max : LATEST_DATE_ONLY;
  // A five-digit year sorts before '9999' as text, so length decides first.
  if (value.length > 10 || value > high) return high;
  if (value < low) return low;
  return value;
}

/** The date on the device's local wall calendar, never converted through UTC. */
export function todayDateOnly(now: Date = new Date()): string {
  return formatDateOnly({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
}

/** A span of calendar days, both ends included. */
export type DateOnlyRange = { start: string; end: string };

/** Validates a range: two valid dates, the start not after the end. */
export function assertDateRange(range: DateOnlyRange | undefined) {
  if (range === undefined) return;
  assertDateOnly('range.start', range.start);
  assertDateOnly('range.end', range.end);
  if (range.start > range.end)
    throw new RangeError('range.start must not be after range.end');
}

/** Where a day sits in a range: its start, its end, inside it, or out. */
export function dayInRange(
  value: string,
  range: DateOnlyRange | undefined,
): 'start' | 'end' | 'inside' | null {
  if (!range || value < range.start || value > range.end) return null;
  if (value === range.start) return 'start';
  if (value === range.end) return 'end';
  return 'inside';
}
