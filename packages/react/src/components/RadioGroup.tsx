'use client';

import { useId } from 'react';

import { FieldErrorRegion } from './FieldErrorRegion.js';
import {
  RadioGroupOptionLabel,
  type RadioGroupOption,
} from './radio-group/RadioGroupOptionLabel.js';

export type { RadioGroupOption };

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
          <RadioGroupOptionLabel
            checked={value === option.value}
            key={option.value}
            name={name}
            onSelect={() => {
              if (!disabled && !option.disabled) onChange(option.value);
            }}
            option={option}
            required={required}
          />
        ))}
      </span>
      <FieldErrorRegion
        className="sw-radio-group-error"
        id={errorId}
        message={error}
      />
    </fieldset>
  );
}
