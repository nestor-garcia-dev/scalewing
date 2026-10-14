import {
  defaultNameSeparator,
  type CalendarButtonLabels,
} from './calendar-button-labels.js';

/**
 * DateRangeButton's own words. Products pass their translations; month and
 * weekday names, and the dates themselves, come from `Intl` instead.
 */
export type DateRangeButtonLabels = Pick<
  CalendarButtonLabels,
  'previousMonth' | 'nextMonth' | 'nameSeparator'
> & {
  /** Names the list of presets, such as "Quick ranges". */
  presets: string;
  /** Applies the chosen range and closes the calendar, such as "Apply". */
  apply: string;
  /** Closes the calendar and keeps the range it opened with. */
  cancel: string;
  /** The bottom sheet's close button. */
  close: string;
  /** How to pick, shown under the calendar, such as "Choose a first and a last day." */
  hint: string;
  /** The length of the chosen range, such as "7 days". */
  dayCount: (days: number) => string;
};

export const defaultDateRangeButtonLabels: DateRangeButtonLabels = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  nameSeparator: defaultNameSeparator,
  presets: 'Presets',
  apply: 'Apply',
  cancel: 'Cancel',
  close: 'Close',
  hint: 'Choose a first and a last day.',
  dayCount: (days) => (days === 1 ? '1 day' : `${days} days`),
};

/** Consumer words over the English defaults; empty words fail closed. */
export function resolveDateRangeButtonLabels(
  labels: Partial<DateRangeButtonLabels> = {},
): DateRangeButtonLabels {
  const resolved = { ...defaultDateRangeButtonLabels, ...labels };
  const { dayCount, nameSeparator, ...words } = resolved;
  for (const [key, text] of Object.entries(words))
    if (typeof text !== 'string' || text.trim() === '')
      throw new RangeError(`labels.${key} must be non-empty text`);
  // Only an empty string is refused: a lone space is a valid separator.
  if (typeof nameSeparator !== 'string' || nameSeparator === '')
    throw new RangeError('labels.nameSeparator must be non-empty text');
  if (typeof dayCount !== 'function')
    throw new RangeError('labels.dayCount must be a function');
  return resolved;
}
