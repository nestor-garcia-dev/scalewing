'use client';

import { useMemo, useRef, useState, type KeyboardEvent } from 'react';

import { monthOf, monthsBetween, shiftMonth } from '../calendar-month.js';
import { useGridFocus } from './calendar/use-grid-focus.js';
import { useLangLocale } from './date-field/use-lang-locale.js';
import { ToggleMonth } from './date-toggle/ToggleMonth.js';
import {
  enabledDates,
  initialFocusDate,
  toggleDate,
  toggleKeyTarget,
} from './date-toggle/toggle-dates.js';
import { type DateToggleCalendarProps } from './date-toggle/types.js';
import { assertDateToggleCalendar } from './date-toggle/validate.js';

export type { DateToggleCalendarProps } from './date-toggle/types.js';

/**
 * Month grids from `min`'s month to `max`'s, where each day that can be
 * toggled is a toggle button, such as days off in a season. One Tab stop;
 * the arrow keys move between days that can be toggled, skipping the rest.
 * `onChange` hands back only days that can be toggled: `value` entries
 * outside `min`–`max` or on a disabled day are dropped. Invalid props throw
 * a `RangeError`.
 */
export function DateToggleCalendar(props: DateToggleCalendarProps) {
  assertDateToggleCalendar(props);
  const {
    disabled = false,
    isDateDisabled,
    label,
    locale: localeProp,
    max,
    min,
    onChange,
    toggledLabel,
    value,
    weekStartsOn = 0,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLangLocale(localeProp, containerRef);
  const isEnabled = useMemo(
    () => enabledDates(min, max, isDateDisabled),
    [isDateDisabled, max, min],
  );
  const toggled = useMemo(() => new Set(value), [value]);
  const [chosenFocus, setChosenFocus] = useState<string | null>(null);
  const focusDate =
    chosenFocus !== null && isEnabled(chosenFocus)
      ? chosenFocus
      : initialFocusDate(value, isEnabled, min, max);
  const { focusHandlers, requestFocus } = useGridFocus(
    containerRef,
    focusDate ?? '',
    false,
  );
  const first = monthOf(min);
  const months = Array.from(
    { length: monthsBetween(first, monthOf(max)) + 1 },
    (_, index) => shiftMonth(first, index),
  );

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (focusDate === null || event.altKey || event.ctrlKey || event.metaKey)
      return;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const target = toggleKeyTarget(event.key, focusDate, {
      isEnabled,
      min,
      max,
      rtl,
    });
    if (target === null) {
      // A key the grid owns keeps the page still even at an edge.
      if (event.key.startsWith('Arrow') || event.key.startsWith('Page'))
        event.preventDefault();
      return;
    }
    event.preventDefault();
    requestFocus();
    setChosenFocus(target);
  }

  return (
    <div
      aria-label={label}
      className="sw-date-toggle"
      onKeyDown={onKeyDown}
      ref={containerRef}
      role="group"
      {...focusHandlers}
    >
      {months.map((month) => (
        <ToggleMonth
          disabled={disabled}
          focusDate={focusDate}
          isEnabled={isEnabled}
          key={`${month.year}-${month.month}`}
          locale={locale}
          month={month}
          onFocusDate={setChosenFocus}
          onToggle={(date) =>
            onChange(toggleDate(value, date).filter(isEnabled))
          }
          toggled={toggled}
          toggledLabel={toggledLabel}
          weekStartsOn={weekStartsOn}
        />
      ))}
    </div>
  );
}
