import { useId, useRef, useState } from 'react';

import { monthTitle } from '../../calendar-labels.js';
import {
  firstOfMonth,
  lastOfMonth,
  monthsBetween,
  sameDayIn,
  shiftMonth,
  type CalendarMonth,
  type WeekStart,
} from '../../calendar-month.js';
import { type RangeDraft } from '../../date-range-draft.js';
import {
  firstShownMonth,
  shownMonths,
  type RangeMonthCount,
} from '../../date-range-view.js';
import { clampDateOnly } from '../../date-only.js';
import { CalendarGrid } from '../calendar/CalendarGrid.js';
import { MonthStep } from '../calendar/MonthStep.js';
import { useGridFocus } from '../calendar/use-grid-focus.js';

export type RangeMonthsProps = {
  count: RangeMonthCount;
  draft: RangeDraft;
  onPress: (day: string) => void;
  /** The last day a press may pick (`max`, or `maxDays` from the start). */
  latest: string | undefined;
  min?: string;
  max?: string;
  locale: string;
  today: string;
  weekStartsOn: WeekStart;
  labels: { previousMonth: string; nextMonth: string };
  /** Take DOM focus on the focus day when shown, as a popover does. */
  focusOnMount: boolean;
};

/** `focusDate` moved into the shown months, after a month step. */
function keepInView(
  focusDate: string,
  first: CalendarMonth,
  count: RangeMonthCount,
): string {
  const months = shownMonths(first, count);
  const last = months[months.length - 1] ?? first;
  if (focusDate < firstOfMonth(first)) return sameDayIn(first, focusDate);
  if (focusDate > lastOfMonth(last)) return sameDayIn(last, focusDate);
  return focusDate;
}

/**
 * One month, or two side by side, of the range being picked: each a
 * labelled grid with one roving day across them, the previous step before
 * the first month and the next step after the last. It opens on the
 * range's end, and the months follow the focus day.
 */
export function RangeMonths({
  count,
  draft,
  onPress,
  latest,
  min,
  max,
  locale,
  today,
  weekStartsOn,
  labels,
  focusOnMount,
}: RangeMonthsProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [rawFocusDate, setFocusDate] = useState(draft.range.end);
  // Clamped on every render, so new bounds while open move it inside.
  const focusDate = clampDateOnly(rawFocusDate, min, max);
  const [first, setFirst] = useState<CalendarMonth>(() =>
    firstShownMonth(focusDate, count, undefined, min),
  );
  const shown = firstShownMonth(focusDate, count, first, min);
  if (monthsBetween(first, shown) !== 0) setFirst(shown);
  const { requestFocus, focusHandlers } = useGridFocus(
    containerRef,
    focusDate,
    focusOnMount,
  );

  function stepBy(delta: 1 | -1) {
    const nextFirst = shiftMonth(shown, delta);
    setFirst(nextFirst);
    setFocusDate(
      clampDateOnly(keepInView(focusDate, nextFirst, count), min, max),
    );
  }

  const months = shownMonths(shown, count);
  return (
    <div className="sw-date-range-months" ref={containerRef} {...focusHandlers}>
      {/* One polite region says the months shown when they change, as
          DateField's hidden title does; the visible titles name the grids. */}
      <div aria-live="polite" className="sw-sr-only">
        {months.map((month) => (
          <div key={`${month.year}-${month.month}`}>
            {monthTitle(month, locale)}
          </div>
        ))}
      </div>
      {months.map((month, index) => {
        const titleId = `${id}-${index}`;
        return (
          <div className="sw-date-range-month" key={titleId}>
            <div className="sw-date-range-month-header">
              {index === 0 ? (
                <MonthStep
                  delta={-1}
                  label={labels.previousMonth}
                  max={max}
                  min={min}
                  month={month}
                  onMonthChange={() => stepBy(-1)}
                />
              ) : null}
              <div className="sw-date-range-month-title" id={titleId}>
                {monthTitle(month, locale)}
              </div>
              {index === months.length - 1 ? (
                <MonthStep
                  delta={1}
                  label={labels.nextMonth}
                  max={max}
                  min={min}
                  month={month}
                  onMonthChange={() => stepBy(1)}
                />
              ) : null}
            </div>
            <CalendarGrid
              blankOutside
              focusDate={focusDate}
              latest={latest}
              locale={locale}
              max={max}
              min={min}
              month={month}
              onFocusDate={setFocusDate}
              onMoveFocus={(next) => {
                requestFocus();
                setFocusDate(next);
              }}
              onSelect={onPress}
              selected={draft.range}
              titleId={titleId}
              today={today}
              weekStartsOn={weekStartsOn}
            />
          </div>
        );
      })}
    </div>
  );
}
