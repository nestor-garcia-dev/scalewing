'use client';

import { useId, useMemo, useRef, useState } from 'react';

import { type WeekStart } from '../calendar-month.js';
import {
  resolveDateFieldLabels,
  type DateFieldLabels,
} from '../date-field-labels.js';
import { dateEntryPattern, dateEntryPlaceholder } from '../date-entry.js';
import {
  assertDateBounds,
  isOutsideDateRange,
  todayDateOnly,
} from '../date-only.js';
import { CalendarDialog } from './date-field/CalendarDialog.js';
import { DateFieldGlyph } from './date-field/DateFieldGlyph.js';
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
  if (weekStartsOn !== 0 && weekStartsOn !== 1)
    throw new RangeError('weekStartsOn must be 0 or 1');
  const words = resolveDateFieldLabels(labels);

  const rootRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const resolvedLocale = useLangLocale(locale, rootRef);
  const pattern = useMemo(
    () => dateEntryPattern(resolvedLocale),
    [resolvedLocale],
  );
  const entry = useDateEntry(value, pattern, (next) => {
    if (!disabled) onChange(next);
  });
  const [open, setOpen] = useState(false);
  // Disabling the field closes its calendar for good, not just while disabled.
  if (disabled && open) setOpen(false);
  const shown = open && !disabled;

  const inputId = useId();
  const labelId = useId();
  const dialogId = useId();
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

  function close(restoreFocus: boolean) {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }

  function select(next: string) {
    entry.reset();
    close(true);
    if (next !== value) onChange(next);
  }

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
          required={required}
          spellCheck={false}
          type="text"
          value={entry.text}
        />
        <button
          aria-controls={shown ? dialogId : undefined}
          aria-expanded={shown}
          aria-haspopup="dialog"
          aria-describedby={labelId}
          className="sw-date-field-button"
          disabled={disabled}
          onClick={() => (shown ? close(true) : setOpen(true))}
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
      {entry.invalid ? (
        <span className="sw-date-field-error" id={entryErrorId}>
          {words.invalidEntry}
        </span>
      ) : null}
      {error ? (
        <span className="sw-date-field-error" id={errorId}>
          {error}
        </span>
      ) : null}
      {shown ? (
        <CalendarDialog
          anchorRef={controlRef}
          buttonRef={buttonRef}
          id={dialogId}
          labelId={labelId}
          labels={words}
          locale={resolvedLocale}
          max={max}
          min={min}
          onClose={close}
          onSelect={select}
          required={required}
          today={todayDateOnly()}
          value={value}
          weekStartsOn={weekStartsOn}
        />
      ) : null}
    </div>
  );
}
