/**
 * Words the DateField control speaks or shows on its own. Products pass
 * their translations; month and weekday names come from `Intl` instead.
 */
export type DateFieldLabels = {
  /**
   * Calendar button name; the field label describes the button. A page with
   * several date fields may pass a distinct name per field.
   */
  chooseDate: string;
  previousMonth: string;
  nextMonth: string;
  /** Month selector name in the calendar header. */
  month: string;
  /** Year selector name in the calendar header. */
  year: string;
  /** Selects today's date and closes the calendar. */
  today: string;
  /** Empties an optional field and closes the calendar. */
  clear: string;
  /** Shown when typed text is not a date. */
  invalidEntry: string;
  /** Placeholder letters, arranged in the locale's field order. */
  dayPlaceholder: string;
  monthPlaceholder: string;
  yearPlaceholder: string;
};

export const defaultDateFieldLabels: DateFieldLabels = {
  chooseDate: 'Choose date',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  month: 'Month',
  year: 'Year',
  today: 'Today',
  clear: 'Clear',
  invalidEntry: 'Enter a valid date.',
  dayPlaceholder: 'DD',
  monthPlaceholder: 'MM',
  yearPlaceholder: 'YYYY',
};

/** Consumer labels over the English defaults; empty strings fail closed. */
export function resolveDateFieldLabels(
  labels: Partial<DateFieldLabels> = {},
): DateFieldLabels {
  const resolved = { ...defaultDateFieldLabels, ...labels };
  for (const [key, text] of Object.entries(resolved))
    if (typeof text !== 'string' || text.trim() === '')
      throw new RangeError(`labels.${key} must be non-empty text`);
  return resolved;
}
