'use client';

import { forwardRef, useCallback, useId, type ForwardedRef } from 'react';

import {
  resolveCalendarButtonLabels,
  type CalendarButtonLabels,
} from '../calendar-button-labels.js';
import { calendarTriggerName } from '../calendar-labels.js';
import { assertWeekStart, type WeekStart } from '../calendar-month.js';
import {
  assertDateBounds,
  assertDateOnly,
  assertDateRange,
  type DateOnlyRange,
} from '../date-only.js';
import { Button, type ButtonSize, type ButtonVariant } from './Button.js';
import { CalendarDialog } from './date-field/CalendarDialog.js';
import { DateFieldGlyph } from './date-field/DateFieldGlyph.js';
import { useCalendarPopup } from './date-field/use-calendar-popup.js';
import { useLangLocale } from './date-field/use-lang-locale.js';

export type { CalendarButtonLabels };

/** A span of calendar days `YYYY-MM-DD`, both ends included. */
export type CalendarButtonRange = DateOnlyRange;

export type CalendarButtonProps = {
  /**
   * What pressing it does, such as "Choose survey day". The button's name
   * is this label, `labels.nameSeparator`, then `value` spoken in full; the
   * calendar is named by the label.
   */
  label: string;
  /**
   * Calendar date `YYYY-MM-DD`. The button always holds a date. A value
   * outside `min`/`max` stays the value, as on DateField; the calendar then
   * opens on the nearest allowed day.
   */
  value: string;
  /** Receives the chosen `YYYY-MM-DD`, never converted through UTC. */
  onChange: (value: string) => void;
  /**
   * The span the page shows around `value`, such as a week or a month:
   * the open calendar tints its days, from `start` to `end`, so a picker
   * for a period shows the whole period. `value` stays the selected day.
   * The tint is not announced; the page's own label names the period.
   */
  range?: CalendarButtonRange;
  min?: string;
  max?: string;
  /**
   * The calendar's today `YYYY-MM-DD`: the day it marks as today and picks
   * with **Today**. Defaults to the device's local date; pass the business's
   * day when it keeps its own time zone.
   */
  today?: string;
  disabled?: boolean;
  /** The `<button>` element's id. */
  id?: string;
  /**
   * BCP 47 tag for the spoken date and the calendar's month and weekday
   * names. Defaults to the nearest `lang` attribute, then en-US.
   */
  locale?: string;
  /** First column of the calendar: 0 Sunday (default) or 1 Monday. */
  weekStartsOn?: WeekStart;
  /** The calendar's words and the name separator; English by default. */
  labels?: Partial<CalendarButtonLabels>;
  /** A Button size; a coarse pointer always gets a 44 px target. */
  size?: ButtonSize;
  variant?: ButtonVariant;
};

function assertLabel(label: string) {
  if (typeof label !== 'string' || label.trim() === '')
    throw new RangeError('label must be non-empty text');
}

/** Sets a forwarded ref, callback or object, to the same node. */
function setForwardedRef<T>(ref: ForwardedRef<T>, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

/**
 * An icon-only button that opens DateField's calendar dialog to pick a
 * date for something the page already shows, such as a day heading. It has
 * no text entry and no empty value. The ref reaches the `<button>`.
 */
export const CalendarButton = forwardRef<
  HTMLButtonElement,
  CalendarButtonProps
>(function CalendarButton(
  {
    label,
    value,
    onChange,
    range,
    min,
    max,
    today,
    disabled = false,
    id,
    locale,
    weekStartsOn = 0,
    labels,
    size = 'md',
    variant = 'ghost',
  },
  ref,
) {
  assertLabel(label);
  assertDateOnly('value', value);
  assertDateBounds(value, min, max);
  assertDateRange(range);
  assertWeekStart(weekStartsOn);
  const words = resolveCalendarButtonLabels(labels);

  const { buttonRef, shown, toggle, trigger, dialog } = useCalendarPopup({
    value,
    disabled,
    onChange,
    today,
  });
  const resolvedLocale = useLangLocale(locale, buttonRef);
  const labelId = useId();
  const setButton = useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      setForwardedRef(ref, node);
    },
    [buttonRef, ref],
  );

  return (
    <>
      <Button
        {...trigger}
        className="sw-calendar-button"
        disabled={disabled}
        id={id}
        onPress={toggle}
        ref={setButton}
        size={size}
        variant={variant}
      >
        <span className="sw-sr-only">
          {calendarTriggerName(
            label,
            value,
            resolvedLocale,
            words.nameSeparator,
          )}
        </span>
        <DateFieldGlyph name="calendar" />
      </Button>
      {shown ? (
        <>
          <span hidden id={labelId}>
            {label}
          </span>
          <CalendarDialog
            {...dialog}
            anchorRef={buttonRef}
            buttonRef={buttonRef}
            labelId={labelId}
            labels={words.calendar}
            locale={resolvedLocale}
            max={max}
            min={min}
            range={range}
            required
            value={value}
            weekStartsOn={weekStartsOn}
          />
        </>
      ) : null}
    </>
  );
});
