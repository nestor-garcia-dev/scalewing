'use client';

import { useId, useRef, useState } from 'react';

import { calendarTriggerName } from '../calendar-labels.js';
import { assertWeekStart, type WeekStart } from '../calendar-month.js';
import {
  resolveDateFieldLabels,
  type DateFieldLabels,
} from '../date-field-labels.js';
import {
  assertDateBounds,
  assertDateOnly,
  todayDateOnly,
} from '../date-only.js';
import { Button, type ButtonSize, type ButtonVariant } from './Button.js';
import { CalendarDialog } from './date-field/CalendarDialog.js';
import { DateFieldGlyph } from './date-field/DateFieldGlyph.js';
import { useLangLocale } from './date-field/use-lang-locale.js';

/** The calendar's own words; the rest of DateFieldLabels never shows here. */
export type CalendarButtonLabels = Pick<
  DateFieldLabels,
  'previousMonth' | 'nextMonth' | 'month' | 'year' | 'today'
>;

export type CalendarButtonProps = {
  /**
   * What pressing it does, such as "Choose survey day". The button's name
   * is this label, then `value` spoken in full; the calendar is named by it.
   */
  label: string;
  /** Calendar date `YYYY-MM-DD`. The button always holds a date. */
  value: string;
  /** Receives the chosen `YYYY-MM-DD`, never converted through UTC. */
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  /**
   * BCP 47 tag for the spoken date and the calendar's month and weekday
   * names. Defaults to the nearest `lang` attribute, then en-US.
   */
  locale?: string;
  /** First column of the calendar: 0 Sunday (default) or 1 Monday. */
  weekStartsOn?: WeekStart;
  /** The calendar's own words; English by default. */
  labels?: Partial<CalendarButtonLabels>;
  /** A Button size; a coarse pointer always gets a 44 px target. */
  size?: ButtonSize;
  variant?: ButtonVariant;
};

function assertLabel(label: string) {
  if (typeof label !== 'string' || label.trim() === '')
    throw new RangeError('label must be non-empty text');
}

/**
 * An icon-only button that opens DateField's calendar dialog to pick a
 * date for something the page already shows, such as a day heading. It has
 * no text entry and no empty value.
 */
export function CalendarButton({
  label,
  value,
  onChange,
  min,
  max,
  disabled = false,
  locale,
  weekStartsOn = 0,
  labels,
  size = 'md',
  variant = 'ghost',
}: CalendarButtonProps) {
  assertLabel(label);
  assertDateOnly('value', value);
  assertDateBounds(value, min, max);
  assertWeekStart(weekStartsOn);
  const words = resolveDateFieldLabels(labels);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const resolvedLocale = useLangLocale(locale, buttonRef);
  const [open, setOpen] = useState(false);
  // Disabling the button closes its calendar for good, not just while disabled.
  if (disabled && open) setOpen(false);
  const shown = open && !disabled;

  const dialogId = useId();
  const labelId = useId();

  function close(restoreFocus: boolean) {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }

  function select(next: string) {
    close(true);
    if (next !== value) onChange(next);
  }

  return (
    <>
      <Button
        aria-controls={shown ? dialogId : undefined}
        aria-expanded={shown}
        aria-haspopup="dialog"
        className="sw-calendar-button"
        disabled={disabled}
        onPress={() => (shown ? close(true) : setOpen(true))}
        ref={buttonRef}
        size={size}
        variant={variant}
      >
        <span className="sw-sr-only">
          {calendarTriggerName(label, value, resolvedLocale)}
        </span>
        <DateFieldGlyph name="calendar" />
      </Button>
      {shown ? (
        <>
          <span hidden id={labelId}>
            {label}
          </span>
          <CalendarDialog
            anchorRef={buttonRef}
            buttonRef={buttonRef}
            id={dialogId}
            labelId={labelId}
            labels={words}
            locale={resolvedLocale}
            max={max}
            min={min}
            onClose={close}
            onSelect={select}
            required
            today={todayDateOnly()}
            value={value}
            weekStartsOn={weekStartsOn}
          />
        </>
      ) : null}
    </>
  );
}
