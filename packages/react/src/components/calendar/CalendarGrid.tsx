import { type KeyboardEvent } from 'react';

import { cx } from '../../class-names.js';
import { calendarKeyTarget } from '../../calendar-keys.js';
import { formatDateLabel, weekdayLabels } from '../../calendar-labels.js';
import {
  monthGrid,
  type CalendarMonth,
  type WeekStart,
} from '../../calendar-month.js';
import {
  dayInRange,
  isOutsideDateRange,
  type DateOnlyRange,
} from '../../date-only.js';

export type CalendarGridProps = {
  focusDate: string;
  locale: string;
  max?: string;
  min?: string;
  month: CalendarMonth;
  /** A cell took focus: follow it without moving focus. */
  onFocusDate: (value: string) => void;
  /** A grid key chose a day: focus it. */
  onMoveFocus: (value: string) => void;
  onSelect: (value: string) => void;
  /** Days to tint as a span, such as the period a page shows. */
  range?: DateOnlyRange;
  /**
   * The selected day; `''` for none. A range instead selects every day in
   * it (the grid is then multiselectable) and tints it as `range` does.
   */
  selected: string | DateOnlyRange;
  /**
   * The last day a press may pick when it is earlier than `max`, such as a
   * range's longest end. Later days are `aria-disabled`; keys still reach
   * them up to `max`, for orientation.
   */
  latest?: string;
  /**
   * Leave the neighbouring months' days blank, so months shown side by
   * side hold each day once. By default they are shown, muted.
   */
  blankOutside?: boolean;
  titleId: string;
  today: string;
  weekStartsOn: WeekStart;
};

/** A day's range classes: in the span, and its start or end. */
function rangeClassNames(
  place: ReturnType<typeof dayInRange>,
): (string | false)[] {
  return [
    place !== null && 'sw-date-field-day-in-range',
    (place === 'start' || place === 'only') && 'sw-date-field-day-range-start',
    (place === 'end' || place === 'only') && 'sw-date-field-day-range-end',
  ];
}

function isSelectedDay(value: string, selected: string | DateOnlyRange) {
  return typeof selected === 'string'
    ? value === selected
    : dayInRange(value, selected) !== null;
}

/**
 * The month as a WAI-ARIA grid with one roving tab stop. Days outside
 * `[min, max]` stay focusable for orientation but are `aria-disabled`;
 * padding past the four-digit years is blank and inert.
 */
export function CalendarGrid({
  focusDate,
  locale,
  max,
  min,
  month,
  onFocusDate,
  onMoveFocus,
  onSelect,
  range,
  selected,
  latest,
  blankOutside = false,
  titleId,
  today,
  weekStartsOn,
}: CalendarGridProps) {
  const pickMax =
    latest !== undefined && (max === undefined || latest < max) ? latest : max;
  const tint = typeof selected === 'string' ? range : selected;
  const unavailable = (value: string) =>
    isOutsideDateRange(value, min, pickMax);

  function choose(value: string) {
    if (!unavailable(value)) onSelect(value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTableElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(focusDate);
      return;
    }
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const target = calendarKeyTarget(
      { key: event.key, shiftKey: event.shiftKey },
      focusDate,
      { weekStartsOn, min, max, rtl },
    );
    if (target === null) return;
    event.preventDefault();
    onMoveFocus(target);
  }

  return (
    <table
      aria-labelledby={titleId}
      aria-multiselectable={typeof selected === 'string' ? undefined : true}
      className="sw-date-field-grid"
      onKeyDown={onKeyDown}
      role="grid"
    >
      <thead>
        <tr>
          {weekdayLabels(locale, weekStartsOn).map((weekday) => (
            <th abbr={weekday.long} key={weekday.long} scope="col">
              {weekday.short}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {monthGrid(month, weekStartsOn).map((row, rowIndex) => (
          // Rows are positions in a fixed six-row grid.
          <tr key={rowIndex}>
            {row.map((cell, column) =>
              cell === null || (blankOutside && !cell.inMonth) ? (
                // No four-digit date exists here, or a neighbouring month's
                // day is left out: a blank, inert cell.
                <td
                  aria-disabled="true"
                  className="sw-date-field-day sw-date-field-day-outside"
                  key={`blank-${column}`}
                  role="gridcell"
                />
              ) : (
                <td
                  aria-current={cell.value === today ? 'date' : undefined}
                  aria-disabled={unavailable(cell.value) || undefined}
                  aria-label={formatDateLabel(cell.value, locale)}
                  aria-selected={isSelectedDay(cell.value, selected)}
                  className={cx(
                    'sw-date-field-day',
                    !cell.inMonth && 'sw-date-field-day-outside',
                    ...rangeClassNames(dayInRange(cell.value, tint)),
                  )}
                  data-date={cell.value}
                  key={cell.value}
                  onClick={() => choose(cell.value)}
                  onFocus={() => {
                    // A press on a neighboring month's day selects it; moving
                    // the grid first would pull the day out from under it.
                    if (cell.inMonth && cell.value !== focusDate)
                      onFocusDate(cell.value);
                  }}
                  role="gridcell"
                  tabIndex={cell.value === focusDate ? 0 : -1}
                >
                  {cell.day}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
