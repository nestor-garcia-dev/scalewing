import { useId } from 'react';

import { cx } from '../../class-names.js';
import {
  formatDateLabel,
  monthTitle,
  weekdayLabels,
} from '../../calendar-labels.js';
import {
  monthGrid,
  type CalendarMonth,
  type WeekStart,
} from '../../calendar-month.js';
import { tabStop } from '../../tab-stop.js';
import { type DateEnabled } from './toggle-dates.js';

export type ToggleMonthProps = {
  month: CalendarMonth;
  locale: string;
  weekStartsOn: WeekStart;
  isEnabled: DateEnabled;
  toggled: ReadonlySet<string>;
  focusDate: string | null;
  toggledLabel?: string;
  disabled: boolean;
  onToggle: (date: string) => void;
  onFocusDate: (date: string) => void;
};

/**
 * One month as a grid named by its title: each day that can be toggled is
 * a toggle button (`aria-pressed`) named by its full date, the grid's one
 * Tab stop on the focus date; a day that cannot is its number, muted and
 * `aria-disabled`; neighbouring months' days are blank.
 */
export function ToggleMonth({
  disabled,
  focusDate,
  isEnabled,
  locale,
  month,
  onFocusDate,
  onToggle,
  toggled,
  toggledLabel,
  weekStartsOn,
}: ToggleMonthProps) {
  const titleId = useId();
  return (
    <div className="sw-date-toggle-month">
      <div className="sw-date-toggle-title" id={titleId}>
        {monthTitle(month, locale)}
      </div>
      <table
        aria-labelledby={titleId}
        className="sw-date-toggle-grid"
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
              {row.map((cell, column) => {
                if (cell === null || !cell.inMonth)
                  return <td key={`blank-${column}`} role="gridcell" />;
                const name = formatDateLabel(cell.value, locale);
                if (!isEnabled(cell.value))
                  return (
                    <td
                      aria-disabled="true"
                      aria-label={name}
                      key={cell.value}
                      role="gridcell"
                    >
                      <span className="sw-date-toggle-day sw-date-toggle-day-disabled">
                        {cell.day}
                      </span>
                    </td>
                  );
                const on = toggled.has(cell.value);
                return (
                  <td key={cell.value} role="gridcell">
                    <button
                      aria-disabled={disabled || undefined}
                      aria-label={
                        on && toggledLabel ? `${name}, ${toggledLabel}` : name
                      }
                      aria-pressed={on}
                      className={cx(
                        'sw-date-toggle-day',
                        on && 'sw-date-toggle-day-on',
                      )}
                      data-date={cell.value}
                      onClick={() => {
                        onFocusDate(cell.value);
                        if (!disabled) onToggle(cell.value);
                      }}
                      onFocus={() => onFocusDate(cell.value)}
                      tabIndex={cell.value === focusDate ? tabStop : -1}
                      type="button"
                    >
                      {cell.day}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
