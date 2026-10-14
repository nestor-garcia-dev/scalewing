import { monthNames, monthTitle } from '../../calendar-labels.js';
import { monthsInRange, type CalendarMonth } from '../../calendar-month.js';
import { calendarYearRange, yearsIn } from '../../calendar-years.js';
import { type DateFieldLabels } from '../../date-field-labels.js';
import { Select } from '../Select.js';
import { MonthStep } from '../calendar/MonthStep.js';

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

/**
 * Month stepping plus month and year selectors for jumping far, both cut to
 * `min` and `max`, over a visually hidden title that announces the shown
 * month when it changes.
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
  const names = monthNames(locale);
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
          // Only months with a day inside the bounds; the shown one always is.
          options={monthsInRange(month.year, min, max).map((number) => ({
            value: String(number),
            label: names[number - 1] ?? String(number),
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
