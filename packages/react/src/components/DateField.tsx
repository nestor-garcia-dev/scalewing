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
import { FieldErrorRegion } from './FieldErrorRegion.js';
import { CalendarDialog } from './date-field/CalendarDialog.js';
import { DateFieldGlyph } from './date-field/DateFieldGlyph.js';
import { useCalendarPopup } from './date-field/use-calendar-popup.js';
import { useDateEntry } from './date-field/use-date-entry.js';
import { useLangLocale } from './date-field/use-lang-locale.js';

export type { DateFieldLabels, WeekStart };

export type DateFieldProps = {
  label: string;
  /** Calendar date `YYYY-MM-DD`, or '' for no date. */
  value: string;
  /** Receives `YYYY-MM-DD` or '', never converted through UTC. */
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
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
};

export function DateField({
  label,
  value,
  onChange,
  min,
  max,
  disabled = false,
  required = false,
  description,
  error,
  locale,
  weekStartsOn = 0,
  labels,
}: DateFieldProps) {
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
    beforeSelect: entry.reset,
  });

  const inputId = useId();
  const labelId = useId();
  const descriptionId = useId();
  const entryErrorId = useId();
  const errorId = useId();
  const describedBy = [
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
      <label className="sw-date-field-label" htmlFor={inputId} id={labelId}>
        {label}
      </label>
      <div className="sw-date-field-control" ref={controlRef}>
        <input
          aria-describedby={describedBy || undefined}
          aria-invalid={invalid}
          autoComplete="off"
          className="sw-date-field-input"
          disabled={disabled}
          id={inputId}
          onBlur={entry.check}
          onChange={(event) => entry.change(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') entry.check();
          }}
          placeholder={dateEntryPlaceholder(pattern, {
            day: words.dayPlaceholder,
            month: words.monthPlaceholder,
            year: words.yearPlaceholder,
          })}
          ref={inputRef}
          required={required}
          spellCheck={false}
          type="text"
          value={entry.text}
        />
        <button
          {...trigger}
          aria-describedby={labelId}
          className="sw-date-field-button"
          disabled={disabled}
          onClick={toggle}
          ref={buttonRef}
          type="button"
        >
          <span className="sw-sr-only">{words.chooseDate}</span>
          <DateFieldGlyph name="calendar" />
        </button>
      </div>
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
