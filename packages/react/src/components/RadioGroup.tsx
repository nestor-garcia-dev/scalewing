'use client';

import { useId } from 'react';

export type RadioGroupOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type RadioGroupProps = {
  legend: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly RadioGroupOption[];
  required?: boolean;
  disabled?: boolean;
  description?: string;
  error?: string;
};

export function RadioGroup({
  legend,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  description,
  error,
}: RadioGroupProps) {
  const name = useId();
  const descriptionId = useId();
  const errorId = useId();
  const describedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter((id) => id !== null)
    .join(' ');
  const values = options.map((option) => option.value);

  if (options.length === 0 || values.some((option) => option === ''))
    throw new RangeError('options must have nonempty values');
  if (new Set(values).size !== values.length)
    throw new RangeError('options must have unique values');
  if (value !== '' && !values.includes(value))
    throw new RangeError('value must match an option or be empty');

  return (
    <fieldset
      aria-describedby={describedBy || undefined}
      aria-invalid={Boolean(error)}
      className="sw-radio-group"
      disabled={disabled}
    >
      <legend className="sw-radio-group-legend">{legend}</legend>
      {description ? (
        <span className="sw-radio-group-description" id={descriptionId}>
          {description}
        </span>
      ) : null}
      <span className="sw-radio-group-options">
        {options.map((option) => (
          <label className="sw-radio-group-option" key={option.value}>
            <span className="sw-radio-group-control">
              <input
                checked={value === option.value}
                className="sw-radio-group-input"
                disabled={option.disabled}
                name={name}
                onChange={(event) => {
                  if (
                    !disabled &&
                    !option.disabled &&
                    event.currentTarget.checked
                  )
                    onChange(option.value);
                }}
                required={required}
                type="radio"
                value={option.value}
              />
              <span aria-hidden="true" className="sw-radio-group-mark" />
            </span>
            <span className="sw-radio-group-text">{option.label}</span>
          </label>
        ))}
      </span>
      {error ? (
        <span className="sw-radio-group-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </fieldset>
  );
}
