import {
  resolveDateFieldLabels,
  type DateFieldLabels,
} from './date-field-labels.js';

/**
 * CalendarButton's own words: the calendar's words from DateFieldLabels,
 * plus the text between its label and the spoken date in its name.
 */
export type CalendarButtonLabels = Pick<
  DateFieldLabels,
  'previousMonth' | 'nextMonth' | 'month' | 'year' | 'today'
> & {
  /**
   * Joins the label and the spoken date in the button's name. Defaults to
   * ", "; pass the locale's own pause, such as "、" in Japanese.
   */
  nameSeparator: string;
};

export const defaultNameSeparator = ', ';

export type ResolvedCalendarButtonLabels = {
  calendar: DateFieldLabels;
  nameSeparator: string;
};

/** Consumer words over the English defaults; empty words fail closed. */
export function resolveCalendarButtonLabels(
  labels: Partial<CalendarButtonLabels> = {},
): ResolvedCalendarButtonLabels {
  const { nameSeparator = defaultNameSeparator, ...calendar } = labels;
  // Only an empty string is refused: a lone space is a valid separator.
  if (typeof nameSeparator !== 'string' || nameSeparator === '')
    throw new RangeError('labels.nameSeparator must be non-empty text');
  return { calendar: resolveDateFieldLabels(calendar), nameSeparator };
}
