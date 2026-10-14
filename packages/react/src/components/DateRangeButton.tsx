'use client';

import { forwardRef, useCallback, type ForwardedRef } from 'react';

import { type WeekStart } from '../calendar-month.js';
import { breakpointQuery } from '../css/breakpoints.js';
import { latestPick, rangeDayCount, sameRange } from '../date-range-draft.js';
import {
  assertDateRangeInput,
  type DateRangePreset,
} from '../date-range-input.js';
import {
  resolveDateRangeButtonLabels,
  type DateRangeButtonLabels,
} from '../date-range-labels.js';
import { formatRangeLong, formatRangeShort } from '../date-range-words.js';
import { todayDateOnly, type DateOnlyRange } from '../date-only.js';
import { Button, type ButtonSize, type ButtonVariant } from './Button.js';
import { DateFieldGlyph } from './date-field/DateFieldGlyph.js';
import { useLangLocale } from './date-field/use-lang-locale.js';
import { DateRangePopover } from './date-range/DateRangePopover.js';
import { DateRangeSheet } from './date-range/DateRangeSheet.js';
import { useRangePopup } from './date-range/use-range-popup.js';
import { useMediaQuery } from './use-media-query.js';

export type { DateRangeButtonLabels, DateRangePreset };

/** A span of calendar days `YYYY-MM-DD`, both ends included. */
export type DateRangeButtonValue = DateOnlyRange;

export type DateRangeButtonProps = {
  /**
   * What pressing it does, such as "Choose a period". The button's name is
   * this label, `labels.nameSeparator`, then the range it shows; the
   * popover and the sheet are named by it.
   */
  label: string;
  /**
   * The range shown, `{ start, end }` as `YYYY-MM-DD`, start not after end.
   * A range outside `min`/`max` or longer than `maxDays` stays the value.
   */
  value: DateRangeButtonValue;
  /** Receives a new range on Apply or a preset, never converted through UTC. */
  onChange: (value: DateRangeButtonValue) => void;
  /**
   * Ranges chosen in one press, such as "Last 7 days": a list beside the
   * months (a row above the month on a phone). A press applies its range
   * and closes. Each must lie inside `min`/`max` and `maxDays`.
   */
  presets?: readonly DateRangePreset[];
  min?: string;
  /** The last day that can be picked, such as today. */
  max?: string;
  /**
   * The longest range, in days with both ends counted: once a first day is
   * pressed, the days after this many are disabled.
   */
  maxDays?: number;
  /**
   * The calendar's today `YYYY-MM-DD`, the day it marks. Defaults to the
   * device's local date; pass the business's day when it keeps its own.
   */
  today?: string;
  disabled?: boolean;
  /** The `<button>` element's id. */
  id?: string;
  /**
   * BCP 47 tag for the dates and the calendar's month and weekday names.
   * Defaults to the nearest `lang` attribute, then en-US.
   */
  locale?: string;
  /** First column of the calendar: 0 Sunday (default) or 1 Monday. */
  weekStartsOn?: WeekStart;
  /** The calendar's words; English by default. */
  labels?: Partial<DateRangeButtonLabels>;
  /** A Button size; a coarse pointer gets a 44 px target. */
  size?: ButtonSize;
  /** Default `neutral`, the quiet grey of a page's period controls. */
  variant?: ButtonVariant;
};

/** Sets a forwarded ref, callback or object, to the same node. */
function setForwardedRef<T>(ref: ForwardedRef<T>, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

/**
 * A button showing a range of days that opens a calendar to pick a first
 * and a last day: from `md` up a popover with the presets and two months,
 * below it a bottom sheet with one month. Apply gives the range; Cancel,
 * Escape and a press outside keep the value. The ref reaches the `<button>`.
 */
export const DateRangeButton = forwardRef<
  HTMLButtonElement,
  DateRangeButtonProps
>(function DateRangeButton(
  {
    label,
    value,
    onChange,
    presets = [],
    min,
    max,
    maxDays,
    today,
    disabled = false,
    id,
    locale,
    weekStartsOn = 0,
    labels,
    size = 'md',
    variant = 'neutral',
  },
  ref,
) {
  assertDateRangeInput({
    label,
    value,
    presets,
    min,
    max,
    maxDays,
    today,
    weekStartsOn,
  });
  const words = resolveDateRangeButtonLabels(labels);
  const popup = useRangePopup(value, disabled, onChange);
  const resolvedLocale = useLangLocale(locale, popup.buttonRef);
  const wide = useMediaQuery(breakpointQuery('from', 'md'), true);
  const { buttonRef } = popup;
  const setButton = useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      setForwardedRef(ref, node);
    },
    [buttonRef, ref],
  );

  const { range } = popup.draft;
  const shown = formatRangeShort(value, resolvedLocale);
  const Panel = wide ? DateRangePopover : DateRangeSheet;
  return (
    <>
      <Button
        aria-controls={popup.shown ? popup.id : undefined}
        aria-expanded={popup.shown}
        aria-haspopup="dialog"
        className="sw-date-range-button"
        disabled={disabled}
        id={id}
        onPress={popup.toggle}
        ref={setButton}
        size={size}
        variant={variant}
      >
        {/* One hidden name keeps the separator's space; the shown range
            is in it, so a spoken command naming the range still works. */}
        <span className="sw-sr-only">{`${label}${words.nameSeparator}${shown}`}</span>
        <DateFieldGlyph name="calendar" />
        <span aria-hidden="true">{shown}</span>
      </Button>
      {popup.shown ? (
        <Panel
          buttonRef={buttonRef}
          count={words.dayCount(rangeDayCount(range))}
          draft={popup.draft}
          id={popup.id}
          label={label}
          labels={words}
          latest={latestPick(popup.draft, max, maxDays)}
          line={formatRangeLong(range, resolvedLocale)}
          locale={resolvedLocale}
          max={max}
          min={min}
          onApply={() => popup.apply(range)}
          onCancel={popup.cancel}
          onChoosePreset={(preset) => popup.apply(preset.range)}
          onPress={popup.press}
          presets={presets}
          pressedPresetId={
            presets.find((preset) => sameRange(preset.range, range))?.id
          }
          today={today ?? todayDateOnly()}
          weekStartsOn={weekStartsOn}
        />
      ) : null}
    </>
  );
});
