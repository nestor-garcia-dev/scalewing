import {
  addDays,
  addMonths,
  weekdayOf,
  type WeekStart,
} from './calendar-month.js';
import { clampDateOnly } from './date-only.js';

export type CalendarKey = {
  key: string;
  shiftKey: boolean;
};

export type CalendarKeyContext = {
  weekStartsOn: WeekStart;
  min?: string;
  max?: string;
  /** Right-to-left grids swap the meaning of the horizontal arrows. */
  rtl?: boolean;
};

function unclampedTarget(
  { key, shiftKey }: CalendarKey,
  focused: string,
  { weekStartsOn, rtl = false }: CalendarKeyContext,
): string | null {
  const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
  const back = rtl ? 'ArrowRight' : 'ArrowLeft';
  const column = (weekdayOf(focused) - weekStartsOn + 7) % 7;
  switch (key) {
    case forward:
      return addDays(focused, 1);
    case back:
      return addDays(focused, -1);
    case 'ArrowDown':
      return addDays(focused, 7);
    case 'ArrowUp':
      return addDays(focused, -7);
    case 'Home':
      return addDays(focused, -column);
    case 'End':
      return addDays(focused, 6 - column);
    case 'PageUp':
      return addMonths(focused, shiftKey ? -12 : -1);
    case 'PageDown':
      return addMonths(focused, shiftKey ? 12 : 1);
    default:
      return null;
  }
}

/**
 * The day a calendar grid key moves focus to, following the WAI-ARIA date
 * picker dialog pattern: arrows by day and week, Home and End to the week's
 * edges, PageUp and PageDown by month, and with Shift by year. The result
 * stays inside `[min, max]`. Keys the grid does not own return null.
 */
export function calendarKeyTarget(
  key: CalendarKey,
  focused: string,
  context: CalendarKeyContext,
): string | null {
  const target = unclampedTarget(key, focused, context);
  return target === null
    ? null
    : clampDateOnly(target, context.min, context.max);
}
