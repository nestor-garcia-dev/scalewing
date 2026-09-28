import { type KeyboardEvent } from 'react';

import { cx } from '../../class-names.js';
import { calendarKeyTarget } from '../../calendar-keys.js';
import { formatDateLabel, weekdayLabels } from '../../calendar-labels.js';
import {
  monthGrid,
  type CalendarMonth,
  type WeekStart,
} from '../../calendar-month.js';
import { isOutsideDateRange } from '../../date-only.js';

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
  selected: string;
  titleId: string;
  today: string;
  weekStartsOn: WeekStart;
};

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
  selected,
  titleId,
  today,
  weekStartsOn,
}: CalendarGridProps) {
  function choose(value: string) {
    if (!isOutsideDateRange(value, min, max)) onSelect(value);
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
              cell === null ? (
                // No four-digit date exists here: a blank, inert cell.
                <td
                  aria-disabled="true"
                  className="sw-date-field-day sw-date-field-day-outside"
                  key={`blank-${column}`}
                  role="gridcell"
                />
              ) : (
                <td
                  aria-current={cell.value === today ? 'date' : undefined}
                  aria-disabled={
                    isOutsideDateRange(cell.value, min, max) || undefined
                  }
                  aria-label={formatDateLabel(cell.value, locale)}
                  aria-selected={cell.value === selected}
                  className={cx(
                    'sw-date-field-day',
                    !cell.inMonth && 'sw-date-field-day-outside',
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
