import {
  monthOf,
  monthsBetween,
  shiftMonth,
  type CalendarMonth,
} from './calendar-month.js';

/** How many months a range calendar shows: two side by side, or one. */
export type RangeMonthCount = 1 | 2;

/**
 * The first month a range calendar shows so that `focusDate` is in view.
 * A view that already holds it stays; a focus date before it becomes the
 * first month, and one after it the last. With no view yet, the focus
 * date's month is the last one shown, but never a month before `min`'s.
 */
export function firstShownMonth(
  focusDate: string,
  count: RangeMonthCount,
  shown: CalendarMonth | undefined,
  min: string | undefined,
): CalendarMonth {
  const focus = monthOf(focusDate);
  if (shown !== undefined) {
    const offset = monthsBetween(shown, focus);
    if (offset >= 0 && offset < count) return shown;
    if (offset < 0) return focus;
    return shiftMonth(focus, 1 - count);
  }
  const first = shiftMonth(focus, 1 - count);
  // No month before 0001 exists: the first year's January leads.
  if (first.year < 1) return focus;
  if (min !== undefined && monthsBetween(first, monthOf(min)) > 0)
    return monthOf(min);
  return first;
}

/** The months shown from `first`, in order. */
export function shownMonths(
  first: CalendarMonth,
  count: RangeMonthCount,
): CalendarMonth[] {
  return Array.from({ length: count }, (_, index) => shiftMonth(first, index));
}
