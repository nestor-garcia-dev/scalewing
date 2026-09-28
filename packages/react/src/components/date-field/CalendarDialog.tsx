import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react';

import {
  monthOf,
  type CalendarMonth,
  type WeekStart,
} from '../../calendar-month.js';
import { type DateFieldLabels } from '../../date-field-labels.js';
import {
  clampDateOnly,
  daysInMonth,
  formatDateOnly,
  isOutsideDateRange,
  parseDateOnly,
} from '../../date-only.js';
import { Button } from '../Button.js';
import { CalendarGrid } from './CalendarGrid.js';
import { CalendarHeader } from './CalendarHeader.js';
import { useAnchoredPopover } from './use-anchored-popover.js';

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
  required: boolean;
  today: string;
  value: string;
  weekStartsOn: WeekStart;
};

/** The dialog's tab stops: enabled buttons and the grid's roving day. */
function isTabStop(node: HTMLElement): boolean {
  if (node instanceof HTMLButtonElement) return !node.disabled;
  return node.getAttribute('tabindex') === '0';
}

/** Keeps Tab and Shift+Tab inside the dialog, as a modal dialog does. */
function wrapTab(event: KeyboardEvent<HTMLElement>) {
  // One universal selector keeps document order in every DOM implementation.
  const items = [
    ...event.currentTarget.querySelectorAll<HTMLElement>('*'),
  ].filter(isTabStop);
  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function sameDayIn(month: CalendarMonth, focused: string): string {
  const day = parseDateOnly(focused)?.day ?? 1;
  return formatDateOnly({
    ...month,
    day: Math.min(day, daysInMonth(month.year, month.month)),
  });
}

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
  required,
  today,
  value,
  weekStartsOn,
}: CalendarDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [focusDate, setFocusDate] = useState(() =>
    clampDateOnly(value || today, min, max),
  );
  const month = monthOf(focusDate);
  // Opening and grid keys move DOM focus to the focus date; header controls
  // and presses change the date without taking focus from where it is.
  const focusGrid = useRef(true);

  useAnchoredPopover(dialogRef, anchorRef, buttonRef, () => onClose(false));

  useLayoutEffect(() => {
    if (!focusGrid.current) return;
    focusGrid.current = false;
    dialogRef.current
      ?.querySelector<HTMLElement>(`[role="grid"] [data-date="${focusDate}"]`)
      ?.focus({ preventScroll: true });
  }, [focusDate]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onClose(true);
    } else if (event.key === 'Tab') wrapTab(event);
  }

  const todayUnavailable = isOutsideDateRange(today, min, max);
  return (
    <div
      aria-labelledby={labelId}
      aria-modal="true"
      className="sw-date-field-calendar"
      id={id}
      onKeyDown={onKeyDown}
      ref={dialogRef}
      role="dialog"
    >
      <CalendarHeader
        labels={labels}
        locale={locale}
        max={max}
        min={min}
        month={month}
        onMonthChange={(next) =>
          setFocusDate(clampDateOnly(sameDayIn(next, focusDate), min, max))
        }
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
          focusGrid.current = true;
          setFocusDate(next);
        }}
        onSelect={onSelect}
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
    </div>
  );
}
