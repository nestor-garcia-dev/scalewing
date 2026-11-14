'use client';

import { useId, useLayoutEffect, useRef } from 'react';

import { cx } from '../class-names.js';
import {
  assertCheckboxAppearance,
  type CheckboxAppearance,
} from './checkbox/checkbox-appearance.js';
import { CheckboxControl } from './checkbox/CheckboxControl.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';

export {
  checkboxAppearances,
  type CheckboxAppearance,
} from './checkbox/checkbox-appearance.js';

export type CheckboxProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  error?: string;
  /**
   * Keeps `label` as the checkbox's name but does not draw it, so the box
   * stands alone, as in a table's select column ("Select Mallard"). The
   * box is then its own target: its size on a fine pointer, at least
   * 44 × 44 px on a coarse one. Say what the box picks in words the page
   * draws nearby (the row's name), not by position alone.
   */
  labelVisuallyHidden?: boolean;
  /**
   * The mixed state, such as "Select all" while only some rows are
   * chosen: a dash in place of the check, the native `indeterminate`
   * property and `aria-checked="mixed"`. It wins over `checked` in the
   * drawing and the state read out. A press reports `!checked` (so with
   * `checked` false, `true`: choose all) and the consumer decides what
   * stays mixed.
   */
  indeterminate?: boolean;
  /**
   * `plain` (default) draws the box beside its words. `tile` draws the box,
   * the label and the description inside a bordered tile as wide as its
   * column, the whole tile one press target, so a set of tiles in a `Grid`
   * reads as a set of choices (a store's services, say). A chosen (or
   * mixed) tile takes the accent edge, an invalid one the danger edge. A
   * tile needs its label drawn: with `labelVisuallyHidden`, or with an
   * unknown appearance, it throws a `RangeError`.
   */
  appearance?: CheckboxAppearance;
};

export function Checkbox({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  required = false,
  description,
  error,
  labelVisuallyHidden = false,
  indeterminate = false,
  appearance = 'plain',
}: CheckboxProps) {
  assertCheckboxAppearance(appearance, labelVisuallyHidden);
  const tile = appearance === 'tile';
  const descriptionId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const describedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter((id) => id !== null)
    .join(' ');

  // A press clears the native property, so set it again after every render.
  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  return (
    <div
      className={cx(
        'sw-checkbox',
        tile && 'sw-checkbox-tile',
        tile && (checked || indeterminate) && 'sw-checkbox-tile-checked',
        tile && Boolean(error) && 'sw-checkbox-tile-invalid',
      )}
    >
      <label
        className={cx(
          'sw-checkbox-label',
          labelVisuallyHidden && 'sw-checkbox-label-hidden',
        )}
      >
        <CheckboxControl
          ref={inputRef}
          aria-checked={indeterminate ? 'mixed' : undefined}
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error)}
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            const input = event.currentTarget;
            // The press cleared the mixed state; keep it until the props say.
            input.indeterminate = indeterminate;
            if (!disabled) onCheckedChange(input.checked);
          }}
          required={required}
        />
        <span
          className={labelVisuallyHidden ? 'sw-sr-only' : 'sw-checkbox-text'}
        >
          {label}
        </span>
      </label>
      {description ? (
        <span className="sw-checkbox-description" id={descriptionId}>
          {description}
        </span>
      ) : null}
      <FieldErrorRegion
        className="sw-checkbox-error"
        id={errorId}
        message={error}
      />
    </div>
  );
}
