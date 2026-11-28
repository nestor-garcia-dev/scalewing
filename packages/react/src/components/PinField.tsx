'use client';

import { type ChangeEvent, forwardRef, useId, useState } from 'react';

import { cx } from '../class-names.js';
import {
  assertPinLength,
  assertPinValue,
  defaultPinLength,
  pinCountText,
  pinMask,
  readPinEntry,
} from '../pin-entry.js';
import {
  type PinFieldLabels,
  resolvePinFieldLabels,
} from '../pin-field-labels.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import { FieldLabelText } from './FieldLabelText.js';
import { LiveRegion } from './LiveRegion.js';
import { PinPad } from './pin-field/PinPad.js';
import { Stack } from './Stack.js';

export {
  defaultPinFieldLabels,
  type PinFieldLabels,
} from '../pin-field-labels.js';

export type PinFieldProps = {
  /** The field's label, drawn above it as Field's, and the input's name. */
  label: string;
  /** Keeps the label as the name only, where a heading already says it. */
  labelVisuallyHidden?: boolean;
  /**
   * The digits entered so far, held by the consumer: only 0 to 9, at most
   * `length` of them. They are never written to the page.
   */
  value: string;
  /** Called with the digits after a key, a paste or a pad press changed them. */
  onChange: (value: string) => void;
  /**
   * Called once, after `onChange`, by the entry that brings the count to
   * `length`. Not called for a `value` the consumer sets.
   */
  onComplete?: (value: string) => void;
  /** How many digits the code has, 1 to 12. Default 6. */
  length?: number;
  /** A muted hint under the field. */
  description?: string;
  /** Replaces the hint with an error, in a polite live region. */
  error?: string;
  disabled?: boolean;
  /** Focuses the input when the field mounts. */
  autoFocus?: boolean;
  /**
   * Draws on-screen keys under the dots: 1 to 9, 0 and Delete, each a
   * button of at least 64 px. Default false: typed only.
   */
  pad?: boolean;
  /** The field's own words, over English defaults. */
  labels?: Partial<PinFieldLabels>;
  /** The input's id; the ids of the field's parts start with it. */
  id?: string;
  /** Ids of elements that describe the field, read before its own words. */
  'aria-describedby'?: string;
};

/**
 * A code of a fixed number of digits that is never shown: dots for the
 * digits entered, typed in one real input or pressed on an optional pad.
 * The input holds a mask character per digit, never the digits, which live
 * only in the consumer's `value`; the count is read with the field and
 * announced politely after each entry.
 */
export const PinField = forwardRef<HTMLInputElement, PinFieldProps>(
  function PinField(
    {
      label,
      labelVisuallyHidden = false,
      value,
      onChange,
      onComplete,
      length = defaultPinLength,
      description,
      error,
      disabled = false,
      autoFocus = false,
      pad = false,
      labels,
      id,
      'aria-describedby': describedBy,
    },
    ref,
  ) {
    if (label.trim() === '') throw new RangeError('PinField needs a label');
    assertPinLength(length);
    assertPinValue(value, length);
    const words = resolvePinFieldLabels(labels);
    const ownId = useId();
    const inputId = id ?? ownId;
    const ids = {
      count: `${inputId}-count`,
      hint: `${inputId}-hint`,
      error: `${inputId}-error`,
    };
    // Nothing is announced until the person has entered something.
    const [entered, setEntered] = useState(false);
    const count = value.length;
    const countText = pinCountText(words.count, count, length);

    function enter(next: string) {
      if (next === value) return;
      setEntered(true);
      onChange(next);
      if (next.length === length && count < length) onComplete?.(next);
    }

    // No digit stays in the input: after an edit that changes nothing here
    // (a refused key, a full field, a consumer that keeps its value), React
    // restores the controlled value, the mask, over what the browser typed.
    function onEdit(event: ChangeEvent<HTMLInputElement>) {
      enter(readPinEntry(event.currentTarget.value, value, length));
    }

    const invalid = Boolean(error);
    const messages = (
      <>
        {description && !invalid ? (
          <span className="sw-field-description" id={ids.hint}>
            {description}
          </span>
        ) : null}
        <FieldErrorRegion
          className="sw-field-error"
          id={ids.error}
          message={error}
        />
      </>
    );

    return (
      <Stack
        className={cx(
          'sw-field',
          'sw-pin-field',
          pad && 'sw-pin-field-with-pad',
          invalid && 'sw-field-invalid',
        )}
        gap={labelVisuallyHidden ? 0 : 1}
      >
        <label
          className={labelVisuallyHidden ? 'sw-sr-only' : undefined}
          htmlFor={inputId}
        >
          <FieldLabelText label={label} />
        </label>
        <div className="sw-pin-field-entry">
          <input
            ref={ref}
            aria-describedby={[
              describedBy?.trim() || null,
              ids.count,
              description && !invalid ? ids.hint : null,
              invalid ? ids.error : null,
            ]
              .filter((part) => part !== null)
              .join(' ')}
            aria-invalid={invalid || undefined}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            autoFocus={autoFocus}
            className="sw-pin-field-input"
            // Password managers' own "leave this field alone" hints.
            data-1p-ignore=""
            data-bwignore=""
            data-form-type="other"
            data-lpignore="true"
            disabled={disabled}
            id={inputId}
            inputMode="numeric"
            onChange={onEdit}
            spellCheck={false}
            type="text"
            // Never the digits: one mask character for each one entered.
            value={pinMask(count)}
          />
          <span aria-hidden="true" className="sw-pin-field-dots">
            {Array.from({ length }, (_, index) => (
              <span
                className={cx(
                  'sw-pin-field-dot',
                  index < count && 'sw-pin-field-dot-filled',
                )}
                key={index}
              />
            ))}
          </span>
        </div>
        {/* The input's description; the live region below says each change. */}
        <span hidden id={ids.count}>
          {countText}
        </span>
        <LiveRegion visuallyHidden>{entered ? countText : ''}</LiveRegion>
        {pad ? (
          <PinPad
            canDelete={count > 0}
            deleteLabel={words.delete}
            disabled={disabled}
            label={words.pad}
            onDelete={() => enter(value.slice(0, -1))}
            onDigit={(digit) => enter((value + digit).slice(0, length))}
          />
        ) : null}
        {messages}
      </Stack>
    );
  },
);
