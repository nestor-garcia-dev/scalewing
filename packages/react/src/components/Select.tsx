'use client';

import { useId, useRef } from 'react';

import { cx } from '../class-names.js';
import { selectedSelectIndex, type SelectOption } from '../select-list.js';
import { type FieldSize } from './Field.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import {
  assertRequiredMark,
  FieldLabelText,
  type RequiredMark,
} from './FieldLabelText.js';
import {
  assertSelectNaming,
  type SelectNaming,
} from './select/select-naming.js';
import { SelectListbox } from './select/SelectListbox.js';
import { SelectValue } from './select/SelectValue.js';
import { useSelectList } from './select/use-select-list.js';
import { Stack } from './Stack.js';
import { tabStop } from '../tab-stop.js';

export type { SelectOption };

/**
 * `content` (the default) sizes the field to its longest option, as a native
 * select is; `full` fills the container's inline size (in an Inline row, the
 * space its siblings leave).
 */
export type SelectWidth = 'content' | 'full';

export type SelectAction = {
  label: string;
  onPress: () => void;
};

export type { SelectNaming };

export type SelectProps = SelectNaming & {
  action?: SelectAction;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  size?: FieldSize;
  value: string;
  /**
   * Shown in the closed trigger, muted, while `value` matches no option
   * (such as ''). It is not an option and never becomes the value.
   */
  placeholder?: string;
  /**
   * Marks the label as Field does and sets `aria-required` (named by
   * `aria-labelledby`, only `aria-required`: the page draws the words).
   */
  required?: boolean;
  /**
   * `hidden` leaves out the label's " *" while the control stays required
   * (and announced so); `visible` (default) draws it.
   * When hidden, say in visible text which fields must be filled; a
   * placeholder alone is not enough.
   */
  requiredMark?: RequiredMark;
  /** A validation message under the control, wired as Field's error is. */
  error?: string;
  /**
   * Turns the control off, as `Button`'s `disabled`: the trigger is a
   * native disabled button (out of the Tab order, read as dimmed, faded),
   * its list cannot open (an open one closes) and `onChange` is never
   * called. Say why it is off in the page's words. Default `false`.
   */
  disabled?: boolean;
  /**
   * `full` makes the field, its trigger and its open list fill the
   * container's inline size; the chosen label still ellipsizes past it.
   * Default `content`.
   */
  width?: SelectWidth;
};

export function Select({
  action,
  label,
  labelVisuallyHidden,
  'aria-labelledby': labelledBy,
  disabled = false,
  onChange,
  options,
  size = 'md',
  value,
  placeholder,
  required = false,
  requiredMark,
  error,
  width = 'content',
}: SelectProps) {
  assertSelectNaming({ label, labelVisuallyHidden, labelledBy, requiredMark });
  assertRequiredMark(requiredMark ?? 'visible');
  if (placeholder !== undefined && !placeholder.trim())
    throw new RangeError('placeholder must not be empty');
  const ownLabelId = useId();
  const labelId = labelledBy ?? ownLabelId;
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
  // A control turned off while its list is open closes it.
  if (disabled && open) setOpen(false);

  return (
    <div
      ref={rootRef}
      className={cx(
        'sw-select',
        size === 'xs' && 'sw-select-xs',
        width === 'full' && 'sw-select-full',
        error && 'sw-select-invalid',
      )}
    >
      <Stack gap={label === undefined || labelVisuallyHidden ? 0 : 1}>
        {/* Named by the page's words (aria-labelledby): no label at all. */}
        {/* Field's label words and mark inside a label that keeps the
            canvas type, so the label row and its gap to the trigger match a
            Field beside it (the label row was 5 px shorter). */}
        {label === undefined ? null : (
          <label htmlFor={triggerId} id={labelId}>
            <FieldLabelText
              label={label}
              required={required}
              requiredMark={requiredMark ?? 'visible'}
              size={size}
              visuallyHidden={labelVisuallyHidden ?? false}
            />
          </label>
        )}
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
            disabled={disabled}
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
            tabIndex={tabStop}
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
