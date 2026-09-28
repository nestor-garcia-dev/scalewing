import { type DateFieldLabels } from './date-field-labels.js';
import { isOutsideDateRange } from './date-only.js';

/**
 * The message a date entry reports through `setCustomValidity`, so a form
 * will not submit while it shows something other than an allowed date, as
 * a native date input's `badInput`, `rangeUnderflow` and `rangeOverflow`
 * would block it. `parsed` is the date the text forms, '' when blank, or
 * null when the text is not a date. Empty means valid; `required` covers a
 * blank entry.
 */
export function dateEntryValidity(
  parsed: string | null,
  labels: Pick<DateFieldLabels, 'invalidEntry' | 'outOfRange'>,
  min?: string,
  max?: string,
): string {
  if (parsed === null) return labels.invalidEntry;
  if (isOutsideDateRange(parsed, min, max)) return labels.outOfRange;
  return '';
}
