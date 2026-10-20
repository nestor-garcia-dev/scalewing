'use client';

import { useId } from 'react';

import { cx } from '../class-names.js';
import { radioTabStopValue } from '../tab-stop.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import { showsRequiredMark } from './FieldLabelText.js';
import { FilterChip } from './filter-chips/FilterChip.js';
import { type FilterChipsProps } from './filter-chips/options.js';
import { assertFilterChips } from './filter-chips/validate.js';

export {
  filterChipCountAppearances,
  filterChipsOverflows,
  filterChipTones,
  type FilterChipCountAppearance,
  type FilterChipOption,
  type FilterChipsOverflow,
  type FilterChipsProps,
  type FilterChipTone,
} from './filter-chips/options.js';

/** The values a change leaves on, in the options' order. */
function toggled(
  options: FilterChipsProps['options'],
  chosen: readonly string[],
  value: string,
  checked: boolean,
): string[] {
  return options
    .map((option) => option.value)
    .filter((each) => (each === value ? checked : chosen.includes(each)));
}

/**
 * A labelled row of chips: one choice (radios), or several at once
 * (`multiple`, checkboxes), each chip optionally counted.
 */
export function FilterChips(props: FilterChipsProps) {
  const {
    label,
    options,
    labelVisuallyHidden = false,
    requiredMark = 'visible',
    countAppearance = 'figure',
    overflow = 'wrap',
    error,
    'aria-describedby': describedByProp,
  } = props;
  const name = useId();
  const errorId = useId();
  assertFilterChips(props);
  const required = props.multiple ? false : (props.required ?? false);
  const describedBy = [describedByProp?.trim() || null, error ? errorId : null]
    .filter((id) => id !== null)
    .join(' ');
  const entry = props.multiple
    ? undefined
    : radioTabStopValue(options, props.value);

  function isChecked(value: string): boolean {
    return props.multiple ? props.value.includes(value) : props.value === value;
  }

  function change(value: string, checked: boolean): void {
    if (props.multiple)
      props.onChange(toggled(options, props.value, value, checked));
    else if (checked) props.onChange(value);
  }

  return (
    <fieldset
      aria-describedby={describedBy || undefined}
      aria-invalid={error ? true : undefined}
      className={cx(
        'sw-filter-chips',
        overflow === 'scroll' && 'sw-filter-chips-scroll',
      )}
    >
      <legend
        className={cx(
          'sw-filter-chips-legend',
          labelVisuallyHidden && 'sw-sr-only',
        )}
      >
        {label}
        {showsRequiredMark(required, requiredMark) ? (
          <span aria-hidden="true" className="sw-field-required">
            {' '}
            *
          </span>
        ) : null}
      </legend>
      <span className="sw-filter-chips-options">
        {options.map((option) => (
          <FilterChip
            checked={isChecked(option.value)}
            countAppearance={countAppearance}
            key={option.value}
            name={name}
            onCheckedChange={(checked) => change(option.value, checked)}
            option={option}
            required={required}
            tabStopHere={props.multiple ? true : option.value === entry}
            type={props.multiple ? 'checkbox' : 'radio'}
          />
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
