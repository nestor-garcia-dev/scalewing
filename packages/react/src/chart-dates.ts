import { parseDateOnly } from './date-only.js';

const dayMs = 24 * 60 * 60 * 1000;

/**
 * A `YYYY-MM-DD` date as a whole day count (days since 1970-01-01), so a
 * time axis places dates by the days between them; `null` for anything
 * that is not a real date.
 */
export function dayNumber(value: string): number | null {
  const parts = parseDateOnly(value);
  if (!parts) return null;
  const date = new Date(0);
  date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
  return Math.round(date.getTime() / dayMs);
}
