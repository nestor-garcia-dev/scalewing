'use client';

import { useId } from 'react';

import { cx } from '../class-names.js';

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
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterChipOption[];
};

export function FilterChips({
  label,
  value,
  onChange,
  options,
}: FilterChipsProps) {
  const name = useId();
  const values = options.map((option) => option.value);
  if (!label.trim()) throw new RangeError('label must not be empty');
  if (
    options.length === 0 ||
    options.some((option) => !option.value.trim() || !option.label.trim())
  )
    throw new RangeError('options must have nonempty values and labels');
  if (new Set(values).size !== values.length)
    throw new RangeError('options must have unique values');
  if (!values.includes(value))
    throw new RangeError('value must match an option');
  if (options.some((option) => !isCount(option.count)))
    throw new RangeError('count must be a non-negative integer');

  return (
    <fieldset className="sw-filter-chips">
      <legend className="sw-filter-chips-legend">{label}</legend>
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
    </fieldset>
  );
}
