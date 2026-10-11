'use client';

import { useId } from 'react';

import { cx } from '../class-names.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';

export type FilterChipOption = {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
};

function isCount(count: number | undefined): boolean {
  return count === undefined || (Number.isInteger(count) && count >= 0);
}

export type FilterChipsProps = {
  label: string;
  /** The chosen option's value, or `''` while nothing is chosen yet. */
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterChipOption[];
  /**
   * A choice must be made, such as a reason: each radio is `required` and
   * the label shows the required mark (hidden from assistive technology,
   * which reads the radios' own state).
   */
  required?: boolean;
  /**
   * A message under the chips, such as "Pick a reason": a polite live
   * region linked to the group by `aria-describedby`; the group is marked
   * invalid and every chip takes the danger edge. An empty string is no
   * error.
   */
  error?: string;
  /** More ids that describe the group, such as a hint beside it. */
  'aria-describedby'?: string;
};

export function FilterChips({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  'aria-describedby': describedByProp,
}: FilterChipsProps) {
  const name = useId();
  const errorId = useId();
  const describedBy = [describedByProp?.trim() || null, error ? errorId : null]
    .filter((id) => id !== null)
    .join(' ');
  const values = options.map((option) => option.value);
  if (!label.trim()) throw new RangeError('label must not be empty');
  if (
    options.length === 0 ||
    options.some((option) => !option.value.trim() || !option.label.trim())
  )
    throw new RangeError('options must have nonempty values and labels');
  if (new Set(values).size !== values.length)
    throw new RangeError('options must have unique values');
  if (value !== '' && !values.includes(value))
    throw new RangeError('value must match an option or be empty');
  if (options.some((option) => !isCount(option.count)))
    throw new RangeError('count must be a non-negative integer');

  return (
    <fieldset
      aria-describedby={describedBy || undefined}
      aria-invalid={error ? true : undefined}
      className="sw-filter-chips"
    >
      <legend className="sw-filter-chips-legend">
        {label}
        {required ? (
          <span aria-hidden="true" className="sw-field-required">
            {' '}
            *
          </span>
        ) : null}
      </legend>
      <span className="sw-filter-chips-options">
        {options.map((option) => (
          <label
            className={cx(
              'sw-filter-chip',
              option.count === 0 && 'sw-filter-chip-quiet',
            )}
            key={option.value}
          >
            <input
              checked={option.value === value}
              className="sw-filter-chip-input"
              disabled={option.disabled}
              name={name}
              onChange={(event) => {
                if (event.currentTarget.checked && !option.disabled)
                  onChange(option.value);
              }}
              required={required}
              type="radio"
              value={option.value}
            />
            <span className="sw-filter-chip-face">
              {option.label}
              {option.count === undefined ? null : (
                <>
                  {' '}
                  <span className="sw-filter-chip-count">{option.count}</span>
                </>
              )}
            </span>
          </label>
        ))}
      </span>
      <FieldErrorRegion
        className="sw-filter-chips-error"
        id={errorId}
        message={error}
      />
    </fieldset>
  );
}
