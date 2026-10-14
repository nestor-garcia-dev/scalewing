import {
  monthInRange,
  shiftMonth,
  type CalendarMonth,
} from '../../calendar-month.js';
import { tabStop } from '../../tab-stop.js';
import { DateFieldGlyph } from '../date-field/DateFieldGlyph.js';

export type MonthStepProps = {
  /** The month the step leaves from: the first or the last month shown. */
  month: CalendarMonth;
  delta: 1 | -1;
  label: string;
  min?: string;
  max?: string;
  onMonthChange: (month: CalendarMonth) => void;
};

/**
 * A calendar's previous or next month step. Past the four-digit years or
 * outside `[min, max]` it is `aria-disabled`, so it keeps focus and its
 * press does nothing.
 */
export function MonthStep({
  delta,
  label,
  max,
  min,
  month,
  onMonthChange,
}: MonthStepProps) {
  const target = shiftMonth(month, delta);
  const unavailable =
    target.year < 1 || target.year > 9999 || !monthInRange(target, min, max);
  return (
    <button
      aria-disabled={unavailable || undefined}
      aria-label={label}
      className="sw-date-field-step"
      onClick={() => {
        if (!unavailable) onMonthChange(target);
      }}
      tabIndex={tabStop}
      type="button"
    >
      <DateFieldGlyph name={delta < 0 ? 'previous' : 'next'} />
    </button>
  );
}
