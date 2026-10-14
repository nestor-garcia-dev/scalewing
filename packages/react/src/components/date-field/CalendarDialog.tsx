import { useId, useRef, useState, type RefObject } from 'react';

import { monthOf, sameDayIn, type WeekStart } from '../../calendar-month.js';
import { type DateFieldLabels } from '../../date-field-labels.js';
import {
  clampDateOnly,
  type DateOnlyRange,
  isOutsideDateRange,
} from '../../date-only.js';
import { Button } from '../Button.js';
import { CalendarGrid } from '../calendar/CalendarGrid.js';
import { CalendarHeader } from './CalendarHeader.js';
import { CalendarPopover } from '../calendar/CalendarPopover.js';
import { useGridFocus } from '../calendar/use-grid-focus.js';

export type CalendarDialogProps = {
  anchorRef: RefObject<HTMLElement | null>;
  buttonRef: RefObject<HTMLElement | null>;
  id: string;
  labelId: string;
  labels: DateFieldLabels;
  locale: string;
  max?: string;
  min?: string;
  /** `true` returns focus to the calendar button. */
  onClose: (restoreFocus: boolean) => void;
  onSelect: (value: string) => void;
  /** Days to tint as a span; the selection stays `value`. */
  range?: DateOnlyRange;
  required: boolean;
  today: string;
  value: string;
  weekStartsOn: WeekStart;
};

/**
 * The calendar popover: a labelled modal dialog anchored under the field,
 * following the WAI-ARIA date picker dialog pattern. It opens on the
 * selected day, or today, kept inside `[min, max]`.
 */
export function CalendarDialog({
  anchorRef,
  buttonRef,
  id,
  labelId,
  labels,
  locale,
  max,
  min,
  onClose,
  onSelect,
  range,
  required,
  today,
  value,
  weekStartsOn,
}: CalendarDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [rawFocusDate, setFocusDate] = useState(value || today);
  // A new value while open moves the calendar to it.
  const [shownValue, setShownValue] = useState(value);
  if (value !== shownValue) {
    setShownValue(value);
    if (value !== '') setFocusDate(value);
  }
  // Clamped on every render, so new bounds while open move it inside.
  const focusDate = clampDateOnly(rawFocusDate, min, max);
  const month = monthOf(focusDate);
  const { requestFocus, focusHandlers } = useGridFocus(
    dialogRef,
    focusDate,
    true,
  );

  const todayUnavailable = isOutsideDateRange(today, min, max);
  return (
    <CalendarPopover
      anchorRef={anchorRef}
      aria-labelledby={labelId}
      buttonRef={buttonRef}
      focusHandlers={focusHandlers}
      id={id}
      onClose={onClose}
      popoverRef={dialogRef}
    >
      <CalendarHeader
        labels={labels}
        locale={locale}
        max={max}
        min={min}
        month={month}
        onMonthChange={(next) => setFocusDate(sameDayIn(next, focusDate))}
        titleId={titleId}
        todayYear={monthOf(today).year}
      />
      <CalendarGrid
        focusDate={focusDate}
        locale={locale}
        max={max}
        min={min}
        month={month}
        onFocusDate={setFocusDate}
        onMoveFocus={(next) => {
          requestFocus();
          setFocusDate(next);
        }}
        onSelect={onSelect}
        range={range}
        selected={value}
        titleId={titleId}
        today={today}
        weekStartsOn={weekStartsOn}
      />
      <div className="sw-date-field-footer">
        {required ? null : (
          <Button
            disabled={value === ''}
            onPress={() => onSelect('')}
            size="sm"
            variant="ghost"
          >
            {labels.clear}
          </Button>
        )}
        <Button
          disabled={todayUnavailable}
          onPress={() => onSelect(today)}
          size="sm"
          variant="ghost"
        >
          {labels.today}
        </Button>
      </div>
    </CalendarPopover>
  );
}
