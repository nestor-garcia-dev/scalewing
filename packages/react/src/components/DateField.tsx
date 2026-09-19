'use client';

import { useId } from 'react';

import {
  assertDateOnly,
  isDateOnly,
  isOutsideDateRange,
} from '../date-only.js';

export type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  error?: string;
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
}: DateFieldProps) {
  assertDateOnly('value', value, true);
  if (min !== undefined) assertDateOnly('min', min);
  if (max !== undefined) assertDateOnly('max', max);
  if (min !== undefined && max !== undefined && min > max)
    throw new RangeError('min must not be after max');

  const inputId = useId();
  const descriptionId = useId();
  const errorId = useId();
  const describedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter((id) => id !== null)
    .join(' ');
  const invalid = Boolean(error) || isOutsideDateRange(value, min, max);

  return (
    <div className="sw-date-field">
      <label className="sw-date-field-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-describedby={describedBy || undefined}
        aria-invalid={invalid}
        className="sw-date-field-input"
        disabled={disabled}
        id={inputId}
        max={max}
        min={min}
        onChange={(event) => {
          const next = event.currentTarget.value;
          if (
            !disabled &&
            !event.currentTarget.validity.badInput &&
            (next === '' || isDateOnly(next))
          )
            onChange(next);
        }}
        required={required}
        type="date"
        value={value}
      />
      {description ? (
        <span className="sw-date-field-description" id={descriptionId}>
          {description}
        </span>
      ) : null}
      {error ? (
        <span className="sw-date-field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
