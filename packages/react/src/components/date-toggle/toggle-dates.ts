import {
  addDays,
  addMonths,
  firstOfMonth,
  lastOfMonth,
  monthOf,
  type CalendarMonth,
} from '../../calendar-month.js';
import { isOutsideDateRange } from '../../date-only.js';

/** Whether a day can be toggled: inside `[min, max]` and not disabled. */
export type DateEnabled = (date: string) => boolean;

export function enabledDates(
  min: string,
  max: string,
  isDateDisabled?: (date: string) => boolean,
): DateEnabled {
  return (date) =>
    !isOutsideDateRange(date, min, max) && !(isDateDisabled?.(date) ?? false);
}

/** `value` with `date` toggled, sorted and without repeats. */
export function toggleDate(value: readonly string[], date: string): string[] {
  const days = new Set(value);
  if (days.has(date)) days.delete(date);
  else days.add(date);
  return [...days].sort();
}

/** The first enabled day from `from` (included) stepping by `step` days, inside `[min, max]`. */
export function nearestEnabled(
  from: string,
  step: number,
  isEnabled: DateEnabled,
  min: string,
  max: string,
): string | null {
  for (let day = from; day >= min && day <= max; day = addDays(day, step))
    if (isEnabled(day)) return day;
  return null;
}

/** Where the one Tab stop starts: the first day toggled on, else the first enabled day. */
export function initialFocusDate(
  value: readonly string[],
  isEnabled: DateEnabled,
  min: string,
  max: string,
): string | null {
  const first = [...value].sort().find(isEnabled);
  return first ?? nearestEnabled(min, 1, isEnabled, min, max);
}

type KeyContext = {
  isEnabled: DateEnabled;
  min: string;
  max: string;
  rtl: boolean;
};

/**
 * The day a key moves focus to, skipping days that cannot be toggled:
 * left and right to the previous or next enabled day (swapped in
 * right-to-left), up and down by weeks to the nearest enabled day on the
 * same weekday, Home and End to the month's first and last enabled day,
 * PageUp and PageDown to the first enabled day of the nearest earlier or
 * later month that has one.
 * Null for other keys, or when no enabled day lies that way.
 */
export function toggleKeyTarget(
  key: string,
  focused: string,
  { isEnabled, min, max, rtl }: KeyContext,
): string | null {
  const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
  const back = rtl ? 'ArrowRight' : 'ArrowLeft';
  const month = monthOf(focused);
  const within = (day: string, step: number) =>
    nearestEnabled(day, step, isEnabled, min, max);
  switch (key) {
    case forward:
      return within(addDays(focused, 1), 1);
    case back:
      return within(addDays(focused, -1), -1);
    case 'ArrowDown':
      return within(addDays(focused, 7), 7);
    case 'ArrowUp':
      return within(addDays(focused, -7), -7);
    case 'Home': {
      const day = within(maxOf(firstOfMonth(month), min), 1);
      return day !== null && inMonth(day, month) ? day : null;
    }
    case 'End': {
      const day = within(minOf(lastOfMonth(month), max), -1);
      return day !== null && inMonth(day, month) ? day : null;
    }
    case 'PageUp': {
      // Back month by month to the first with a day to toggle, never
      // scanning forward past the month it starts from.
      for (
        let start = firstOfMonth(monthOf(addMonths(focused, -1)));
        lastOfMonth(monthOf(start)) >= min;
        start = firstOfMonth(monthOf(addMonths(start, -1)))
      ) {
        const day = within(maxOf(start, min), 1);
        if (day !== null && inMonth(day, monthOf(start))) return day;
      }
      return null;
    }
    case 'PageDown': {
      const start = firstOfMonth(monthOf(addMonths(focused, 1)));
      return start > max ? null : within(start, 1);
    }
    default:
      return null;
  }
}

function inMonth(day: string, month: CalendarMonth): boolean {
  const of = monthOf(day);
  return of.year === month.year && of.month === month.month;
}

function maxOf(a: string, b: string): string {
  return a > b ? a : b;
}

function minOf(a: string, b: string): string {
  return a < b ? a : b;
}
