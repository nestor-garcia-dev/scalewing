import { monthNames, monthTitle } from '../../calendar-labels.js';
import {
  monthInRange,
  shiftMonth,
  type CalendarMonth,
} from '../../calendar-month.js';
import { calendarYearRange, yearsIn } from '../../calendar-years.js';
import { type DateFieldLabels } from '../../date-field-labels.js';
import { Select } from '../Select.js';
import { DateFieldGlyph } from './DateFieldGlyph.js';

export type CalendarHeaderProps = {
  labels: DateFieldLabels;
  locale: string;
  max?: string;
  min?: string;
  month: CalendarMonth;
  onMonthChange: (month: CalendarMonth) => void;
  titleId: string;
  todayYear: number;
};

function MonthStep({
  delta,
  label,
  max,
  min,
  month,
  onMonthChange,
}: Pick<CalendarHeaderProps, 'max' | 'min' | 'month' | 'onMonthChange'> & {
  delta: 1 | -1;
  label: string;
}) {
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
      type="button"
    >
      <DateFieldGlyph name={delta < 0 ? 'previous' : 'next'} />
    </button>
  );
}

/**
 * Month stepping plus month and year selectors for jumping far, over a
 * visually hidden title that announces the shown month when it changes.
 */
export function CalendarHeader({
  labels,
  locale,
  max,
  min,
  month,
  onMonthChange,
  titleId,
  todayYear,
}: CalendarHeaderProps) {
  const range = calendarYearRange(month.year, todayYear, min, max);
  const stepProps = { max, min, month, onMonthChange };
  return (
    <div className="sw-date-field-header">
      <h2 aria-live="polite" className="sw-sr-only" id={titleId}>
        {monthTitle(month, locale)}
      </h2>
      <MonthStep {...stepProps} delta={-1} label={labels.previousMonth} />
      <div className="sw-date-field-jump">
        <Select
          label={labels.month}
          labelVisuallyHidden
          onChange={(next) => onMonthChange({ ...month, month: Number(next) })}
          options={monthNames(locale).map((name, index) => ({
            value: String(index + 1),
            label: name,
          }))}
          size="xs"
          value={String(month.month)}
        />
        <Select
          label={labels.year}
          labelVisuallyHidden
          onChange={(next) => onMonthChange({ ...month, year: Number(next) })}
          options={yearsIn(range).map((year) => ({
            value: String(year),
            label: String(year),
          }))}
          size="xs"
          value={String(month.year)}
        />
      </div>
      <MonthStep {...stepProps} delta={1} label={labels.nextMonth} />
    </div>
  );
}
