const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return leap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function isDateOnly(value: string): boolean {
  const parts = DATE_ONLY.exec(value);
  if (!parts) return false;
  const year = Number(parts[1]);
  const month = Number(parts[2]);
  const day = Number(parts[3]);
  return (
    year >= 1 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month)
  );
}

export function assertDateOnly(name: string, value: string, empty = false) {
  if (empty && value === '') return;
  if (!isDateOnly(value))
    throw new RangeError(`${name} must be a valid YYYY-MM-DD date`);
}

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
