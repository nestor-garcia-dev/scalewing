'use client';

import { useEffect, useId, useMemo, useRef } from 'react';

import { assertWeekStart, type WeekStart } from '../calendar-month.js';
import {
  resolveDateFieldLabels,
  type DateFieldLabels,
} from '../date-field-labels.js';
import { dateEntryPattern, dateEntryPlaceholder } from '../date-entry.js';
import { dateEntryValidity } from '../date-entry-validity.js';
import { assertDateBounds, isOutsideDateRange } from '../date-only.js';
import {
  assertDateFieldEntry,
  type DateFieldEntry,
} from '../css/css-date-field-calendar-entry.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import {
  assertRequiredMark,
  FieldLabelText,
  type RequiredMark,
} from './FieldLabelText.js';
import { CalendarDialog } from './date-field/CalendarDialog.js';
import { CalendarEntryButton } from './date-field/CalendarEntryButton.js';
import { TypedEntry } from './date-field/TypedEntry.js';
import { useCalendarPopup } from './date-field/use-calendar-popup.js';
import { useDateEntry } from './date-field/use-date-entry.js';
import { useLangLocale } from './date-field/use-lang-locale.js';

export type { DateFieldEntry, DateFieldLabels, WeekStart };
export { dateFieldEntries } from '../css/css-date-field-calendar-entry.js';

export type DateFieldProps = {
  label: string;
  /** Calendar date `YYYY-MM-DD`, or '' for no date. */
  value: string;
  /** Receives `YYYY-MM-DD` or '', never converted through UTC. */
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  /**
   * The calendar's today `YYYY-MM-DD`: the day it marks as today, opens on
   * when the field is empty, and picks with **Today**. Defaults to the
   * device's local date; pass the business's day when it keeps its own
   * time zone.
   */
  today?: string;
  disabled?: boolean;
  required?: boolean;
  /**
   * `hidden` leaves out the label's " *" while the control stays required
   * (and announced so); `visible` (default) draws it.
   * When hidden, say in visible text which fields must be filled; a
   * placeholder alone is not enough.
   */
  requiredMark?: RequiredMark;
  description?: string;
  error?: string;
  /**
   * BCP 47 tag for month and weekday names, spoken dates, and the typed
   * field order. Defaults to the nearest `lang` attribute, then en-US.
   */
  locale?: string;
  /** First column of the calendar: 0 Sunday (default) or 1 Monday. */
  weekStartsOn?: WeekStart;
  /** The control's own words; English by default. */
  labels?: Partial<DateFieldLabels>;
  /**
   * `typed` (the default) is a text entry in the locale's order with a
   * calendar button. `calendar` is one button showing the chosen day (or
   * `labels.chooseDate`, such as "Choose a day", while empty) that opens
   * the same calendar, for a form where a day is picked, never typed. It
   * has no text to check, so validation and a required day stay with the
   * consumer's `error`; while `required`, `labels.required` is said after
   * its name.
   */
  entry?: DateFieldEntry;
};

export function DateField({
  label,
  value,
  onChange,
  min,
  max,
  today,
  disabled = false,
  required = false,
  requiredMark = 'visible',
  description,
  error,
  locale,
  weekStartsOn = 0,
  labels,
  entry: entryKind = 'typed',
}: DateFieldProps) {
  assertRequiredMark(requiredMark);
  assertDateFieldEntry(entryKind);
  assertDateBounds(value, min, max);
  assertWeekStart(weekStartsOn);
  const words = resolveDateFieldLabels(labels);

  const rootRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resolvedLocale = useLangLocale(locale, rootRef);
  const pattern = useMemo(
    () => dateEntryPattern(resolvedLocale),
    [resolvedLocale],
  );
  const entry = useDateEntry(value, pattern, (next) => {
    if (!disabled) onChange(next);
  });
  const validity = dateEntryValidity(entry.parsed, words, min, max);
  // Blocks form submission as the native date input's validity did.
  useEffect(() => {
    inputRef.current?.setCustomValidity(validity);
  }, [validity]);
  const { buttonRef, shown, toggle, trigger, dialog } = useCalendarPopup({
    value,
    disabled,
    onChange,
    today,
    beforeSelect: entry.reset,
  });

  const inputId = useId();
  const labelId = useId();
  const descriptionId = useId();
  const entryErrorId = useId();
  const errorId = useId();
  const requiredId = useId();
  const calendarEntry = entryKind === 'calendar';
  const describedBy = [
    calendarEntry && required ? requiredId : null,
    description ? descriptionId : null,
    entry.invalid ? entryErrorId : null,
    error ? errorId : null,
  ]
    .filter((id) => id !== null)
    .join(' ');
  const invalid =
    Boolean(error) || entry.invalid || isOutsideDateRange(value, min, max);

  return (
    <div className="sw-date-field" ref={rootRef}>
      {/* Field's label words and mark, so the label row and its gap to the
          entry match a Field beside it (Teisoro NSF-35). */}
      <label className="sw-date-field-label" htmlFor={inputId} id={labelId}>
        <FieldLabelText
          label={label}
          required={required}
          requiredMark={requiredMark}
        />
      </label>
      {calendarEntry ? (
        <div className="sw-date-field-control" ref={controlRef}>
          <CalendarEntryButton
            buttonRef={buttonRef}
            describedBy={describedBy || undefined}
            disabled={disabled}
            emptyText={words.chooseDate}
            id={inputId}
            invalid={invalid}
            labelId={labelId}
            locale={resolvedLocale}
            onPress={toggle}
            trigger={trigger}
            value={value}
          />
          {required ? (
            <span hidden id={requiredId}>
              {words.required}
            </span>
          ) : null}
        </div>
      ) : (
        <TypedEntry
          buttonRef={buttonRef}
          controlRef={controlRef}
          describedBy={describedBy || undefined}
          disabled={disabled}
          entry={entry}
          id={inputId}
          inputRef={inputRef}
          invalid={invalid}
          labelId={labelId}
          onToggle={toggle}
          placeholder={dateEntryPlaceholder(pattern, {
            day: words.dayPlaceholder,
            month: words.monthPlaceholder,
            year: words.yearPlaceholder,
          })}
          required={required}
          toggleName={words.chooseDate}
          trigger={trigger}
        />
      )}
      {description ? (
        <span className="sw-date-field-description" id={descriptionId}>
          {description}
        </span>
      ) : null}
      <FieldErrorRegion
        className="sw-date-field-error"
        id={entryErrorId}
        message={entry.invalid ? words.invalidEntry : undefined}
      />
      <FieldErrorRegion
        className="sw-date-field-error"
        id={errorId}
        message={error}
      />
      {shown ? (
        <CalendarDialog
          {...dialog}
          buttonRef={buttonRef}
          anchorRef={controlRef}
          labelId={labelId}
          labels={words}
          locale={resolvedLocale}
          max={max}
          min={min}
          required={required}
          value={value}
          weekStartsOn={weekStartsOn}
        />
      ) : null}
    </div>
  );
}
