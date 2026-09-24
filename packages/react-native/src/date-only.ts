const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export type DateParts = {
  year: number;
  month: number;
  day: number;
};

export function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return leap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function parseDateOnly(value: string): DateParts | null {
  const parts = DATE_ONLY.exec(value);
  if (!parts) return null;
  const year = Number(parts[1]);
  const month = Number(parts[2]);
  const day = Number(parts[3]);
  const valid =
    year >= 1 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month);
  return valid ? { year, month, day } : null;
}

export function isDateOnly(value: string): boolean {
  return parseDateOnly(value) !== null;
}

export function formatDateOnly(parts: DateParts): string {
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  return `${String(parts.year).padStart(4, '0')}-${month}-${day}`;
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

/** Date-only strings compare lexicographically once they are valid. */
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

/** A local Date at noon, so Intl formatting never crosses a day boundary. */
export function toLocalDate(parts: DateParts): Date {
  return new Date(parts.year, parts.month - 1, parts.day, 12);
}
