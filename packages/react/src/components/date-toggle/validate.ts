import {
  assertWeekStart,
  monthOf,
  monthsBetween,
} from '../../calendar-month.js';
import { isDateOnly } from '../../date-only.js';
import { type DateToggleCalendarProps } from './types.js';

/** The most months one calendar draws: two years. */
export const maxToggleMonths = 24;

const name = 'DateToggleCalendar';

/**
 * Fails closed on a calendar it cannot draw: a blank label or toggled
 * words, a bound or value that is not a YYYY-MM-DD date, `min` after
 * `max`, more than `maxToggleMonths` months, or an unknown week start.
 */
export function assertDateToggleCalendar({
  label,
  max,
  min,
  toggledLabel,
  value,
  weekStartsOn = 0,
}: DateToggleCalendarProps): void {
  if (typeof label !== 'string' || !label.trim())
    throw new RangeError(`${name} label must be nonempty`);
  if (toggledLabel !== undefined && !toggledLabel.trim())
    throw new RangeError(`${name} toggledLabel must be nonempty when given`);
  if (!isDateOnly(min) || !isDateOnly(max))
    throw new RangeError(`${name} min and max must be YYYY-MM-DD dates`);
  if (min > max) throw new RangeError(`${name} min must not be after max`);
  if (monthsBetween(monthOf(min), monthOf(max)) + 1 > maxToggleMonths)
    throw new RangeError(`${name} draws at most ${maxToggleMonths} months`);
  if (!Array.isArray(value) || !value.every((day) => isDateOnly(day)))
    throw new RangeError(`${name} value must hold YYYY-MM-DD dates`);
  assertWeekStart(weekStartsOn);
}
