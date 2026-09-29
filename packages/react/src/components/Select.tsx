'use client';

import { useId, useRef } from 'react';

import { cx } from '../class-names.js';
import { selectedSelectIndex, type SelectOption } from '../select-list.js';
import { type FieldSize } from './Field.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import { FieldLabelText } from './FieldLabelText.js';
import { SelectListbox } from './select/SelectListbox.js';
import { SelectValue } from './select/SelectValue.js';
import { useSelectList } from './select/use-select-list.js';
import { Stack } from './Stack.js';

export type { SelectOption };

export type SelectAction = {
  label: string;
  onPress: () => void;
};

export type SelectProps = {
  action?: SelectAction;
  label: string;
  labelVisuallyHidden?: boolean;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  size?: FieldSize;
  value: string;
  /**
   * Shown in the closed trigger, muted, while `value` matches no option
   * (such as ''). It is not an option and never becomes the value.
   */
  placeholder?: string;
  /** Marks the label as Field does and sets `aria-required`. */
  required?: boolean;
  /** A validation message under the control, wired as Field's error is. */
  error?: string;
};

export function Select({
  action,
  label,
  labelVisuallyHidden = false,
  onChange,
  options,
  size = 'md',
  value,
  placeholder,
  required = false,
  error,
}: SelectProps) {
  if (placeholder !== undefined && !placeholder.trim())
    throw new RangeError('placeholder must not be empty');
  const labelId = useId();
  const triggerId = useId();
  const listId = useId();
  const optionIdPrefix = useId();
  const errorId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options[selectedSelectIndex(options, value)];
  const showsPlaceholder =
    placeholder !== undefined &&
    !options.some((option) => option.value === value);
  const {
    commit,
    highlight,
    onTriggerKeyDown,
    open,
    openList,
    setHighlight,
    setOpen,
  } = useSelectList({ action, onChange, options, rootRef, value });

  return (
    <div
      ref={rootRef}
      className={cx(
        'sw-select',
        size === 'xs' && 'sw-select-xs',
        error && 'sw-select-invalid',
      )}
    >
      <Stack gap={labelVisuallyHidden ? 0 : 1}>
        {/* Field's label words and mark inside a label that keeps the
            canvas type, so the label row and its gap to the trigger match a
            Field beside it (the label row was 5 px shorter). */}
        <label htmlFor={triggerId} id={labelId}>
          <FieldLabelText
            label={label}
            required={required}
            size={size}
            visuallyHidden={labelVisuallyHidden}
          />
        </label>
        <div className="sw-select-control">
          <button
            aria-activedescendant={
              open ? `${optionIdPrefix}-${highlight}` : undefined
            }
            aria-controls={open ? listId : undefined}
            aria-describedby={error ? errorId : undefined}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-invalid={error ? true : undefined}
            aria-labelledby={labelId}
            aria-required={required || undefined}
            className="sw-select-trigger"
            id={triggerId}
            onBlur={(event) => {
              const next = event.relatedTarget;
              if (next instanceof Node && rootRef.current?.contains(next)) {
                return;
              }
              setOpen(false);
            }}
            onClick={() => {
              if (open) {
                setOpen(false);
                return;
              }
              openList();
            }}
            onKeyDown={onTriggerKeyDown}
            role="combobox"
            type="button"
          >
            <SelectValue
              options={options}
              placeholder={placeholder}
              text={showsPlaceholder ? placeholder : (selected?.label ?? '')}
              textIsPlaceholder={showsPlaceholder}
            />
          </button>
          {open ? (
            <SelectListbox
              actionLabel={action?.label}
              highlight={highlight}
              id={listId}
              labelId={labelId}
              onCommit={commit}
              onHighlight={setHighlight}
              optionIdPrefix={optionIdPrefix}
              options={options}
              value={value}
            />
          ) : null}
        </div>
        {/* A polite live region described on the trigger, as Field's is. */}
        <FieldErrorRegion
          className="sw-field-error"
          id={errorId}
          message={error}
        />
      </Stack>
    </div>
  );
}
