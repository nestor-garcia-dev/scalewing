'use client';

import {
  type ChangeEvent,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  useId,
  useState,
} from 'react';

import { cx } from '../class-names.js';
import {
  assertStepperBounds,
  assertStepperUnit,
  readStepperEntry,
  stepperMoves,
  stepperText,
  stepperValueText,
} from '../stepper-count.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import { FieldLabelText } from './FieldLabelText.js';
import { StepperCountFrame } from './stepper/StepperCountFrame.js';
import {
  stepperLimitAppearances,
  type StepperProps,
} from './stepper/stepper-props.js';
import {
  assertStepperCommitDelay,
  defaultStepperCommitDelay,
  useStepperCommit,
} from './stepper/use-stepper-commit.js';

export {
  stepperLimitAppearances,
  type StepperLimitAppearance,
  type StepperProps,
  type StepperWidth,
} from './stepper/stepper-props.js';

/** Keeps focus where it was (the count, or nowhere) when a button is pressed. */
function keepFocus(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}

/**
 * A whole-number count between − and + buttons that can also be typed: one
 * tab stop (the count, a spin button that ArrowUp and ArrowDown step), with
 * the buttons as pointer targets beside it. − stops at `min`, + at `max`.
 */
export const Stepper = forwardRef<HTMLInputElement, StepperProps>(
  function Stepper(
    {
      label,
      labelVisuallyHidden = false,
      value,
      onChange,
      onCommit,
      commitDelay = defaultStepperCommitDelay,
      min = 0,
      max = Number.POSITIVE_INFINITY,
      step = 1,
      decrementLabel,
      incrementLabel,
      error,
      changed = false,
      disabled = false,
      readOnly = false,
      valueText,
      unit,
      'aria-describedby': describedBy,
      placeholder,
      name,
      width = 'fixed',
      limitAppearance = 'faded',
    },
    ref,
  ) {
    const bounds = { min, max, step };
    assertStepperBounds(bounds);
    assertStepperUnit(unit);
    assertStepperCommitDelay(commitDelay);
    if (!stepperLimitAppearances.includes(limitAppearance))
      throw new RangeError(
        `Unknown Stepper limitAppearance: ${String(limitAppearance)}`,
      );
    if (value !== null && !Number.isSafeInteger(value))
      throw new RangeError('Stepper value must be a whole number or null');

    const inputId = useId();
    const labelId = useId();
    const errorId = useId();
    const [draft, setDraft] = useState<string | null>(null);
    const commit = useStepperCommit(value, onCommit, commitDelay);
    const allowsNegative = min < 0;
    const moves = stepperMoves(value, bounds, disabled || readOnly);

    // The typed text stays while it means the count the consumer holds, so
    // "007" or a lone minus survives a render; otherwise the count's text.
    const draftEntry =
      draft === null ? null : readStepperEntry(draft, allowsNegative);
    const draftShowsValue =
      draftEntry !== null &&
      (draftEntry.kind === 'empty'
        ? value === null
        : draftEntry.kind === 'count' && draftEntry.value === value);
    const text = draft !== null && draftShowsValue ? draft : stepperText(value);

    function move(next: number | null) {
      if (next === null) return;
      setDraft(null);
      commit.stepped();
      onChange(next);
    }

    function onType(event: ChangeEvent<HTMLInputElement>) {
      const next = event.target.value;
      const entry = readStepperEntry(next, allowsNegative);
      // A refused keystroke changes nothing: the controlled box keeps its text.
      if (entry.kind === 'refused') return;
      setDraft(next);
      const count = entry.kind === 'count' ? entry.value : null;
      if (count === value) return;
      commit.edited();
      onChange(count);
    }

    /** ArrowUp and ArrowDown step; Home and End go to min and a finite max. */
    function keyTarget(key: string): number | null | undefined {
      if (key === 'ArrowUp') return moves.up;
      if (key === 'ArrowDown') return moves.down;
      if (key === 'Home') return moves.down === null ? null : min;
      if (key === 'End' && Number.isFinite(max))
        return moves.up === null ? null : max;
      return undefined;
    }

    function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      // Enter finishes the entry; a form round the count still submits.
      if (event.key === 'Enter') commit.finish();
      const target = keyTarget(event.key);
      if (target === undefined) return;
      event.preventDefault();
      move(target);
    }

    const invalid = Boolean(error);
    return (
      <div
        className={cx(
          'sw-stepper',
          width === 'full' && 'sw-stepper-full',
          invalid && 'sw-stepper-invalid',
          changed && !invalid && 'sw-stepper-changed',
          readOnly && 'sw-stepper-readonly',
          limitAppearance === 'plain' &&
            !disabled &&
            !readOnly &&
            'sw-stepper-limit-plain',
        )}
      >
        {/* A hidden label leaves the flow itself, so it adds no gap. */}
        <label
          className={labelVisuallyHidden ? 'sw-sr-only' : undefined}
          htmlFor={inputId}
          id={labelId}
        >
          <FieldLabelText label={label} />
        </label>
        <div
          aria-labelledby={labelId}
          className="sw-stepper-track"
          role="group"
        >
          <button
            aria-controls={inputId}
            aria-label={decrementLabel}
            className="sw-stepper-button"
            disabled={moves.down === null}
            onClick={() => move(moves.down)}
            onMouseDown={keepFocus}
            tabIndex={-1}
            type="button"
          >
            <span aria-hidden="true">{'−'}</span>
          </button>
          <StepperCountFrame unit={unit}>
            <input
              ref={ref}
              aria-describedby={
                [describedBy?.trim() || null, invalid ? errorId : null]
                  .filter((id) => id !== null)
                  .join(' ') || undefined
              }
              aria-invalid={invalid || undefined}
              aria-valuemax={Number.isFinite(max) ? max : undefined}
              aria-valuemin={min}
              aria-valuenow={value ?? undefined}
              aria-valuetext={stepperValueText(value, unit, valueText)}
              autoComplete="off"
              className="sw-stepper-input"
              disabled={disabled}
              id={inputId}
              // iOS's numeric pad has no minus key, so a range below zero takes
              // the text keyboard.
              inputMode={allowsNegative ? 'text' : 'numeric'}
              name={name}
              onBlur={() => {
                setDraft(null);
                commit.finish();
              }}
              onChange={onType}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              readOnly={readOnly}
              role="spinbutton"
              type="text"
              value={text}
            />
          </StepperCountFrame>
          <button
            aria-controls={inputId}
            aria-label={incrementLabel}
            className="sw-stepper-button"
            disabled={moves.up === null}
            onClick={() => move(moves.up)}
            onMouseDown={keepFocus}
            tabIndex={-1}
            type="button"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
        <FieldErrorRegion
          className="sw-field-error"
          id={errorId}
          message={error}
        />
      </div>
    );
  },
);
