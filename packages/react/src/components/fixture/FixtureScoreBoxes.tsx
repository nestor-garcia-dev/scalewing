'use client';

import { type ChangeEvent, type KeyboardEvent, type Ref } from 'react';

import { cx } from '../../class-names.js';
import { scoreBoxMaxDigits, scoreDigits } from './score-digits.js';
import {
  type FixtureScore,
  type FixtureScoreBox,
  type FixtureScoreSide,
} from './types.js';

/** Whether a box is marked: its own `invalid`, else any error. */
function boxInvalid(
  invalid: FixtureScoreBox['invalid'],
  hasError: boolean,
): boolean {
  return invalid ?? hasError;
}

/**
 * Enter records and Escape puts the boxes back. A key that ends an IME
 * composition is the composition's, not the row's.
 */
function scoreKeyDown(score: FixtureScore) {
  return (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      score.onSubmit();
    } else if (event.key === 'Escape' && score.onCancel) {
      // Kept from an enclosing dialog, whose Escape would close it.
      event.preventDefault();
      score.onCancel();
    }
  };
}

function ScoreBox({
  describedBy,
  disabled,
  inputRef,
  invalid,
  label,
  onDigits,
  onKeyDown,
  value,
}: {
  describedBy: string | undefined;
  disabled: boolean;
  inputRef: Ref<HTMLInputElement> | undefined;
  invalid: boolean;
  label: string;
  onDigits: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  value: string;
}) {
  return (
    <input
      ref={inputRef}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      aria-label={label}
      autoComplete="off"
      className="sw-fixture-score-box"
      disabled={disabled}
      inputMode="numeric"
      maxLength={scoreBoxMaxDigits}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const digits = scoreDigits(event.currentTarget.value);
        if (digits !== value) onDigits(digits);
      }}
      onFocus={(event) => event.currentTarget.select()}
      onKeyDown={onKeyDown}
      pattern="[0-9]*"
      type="text"
      value={value}
    />
  );
}

/**
 * The row's middle when it takes a score: the home box, an en dash and
 * the away box, in a group named by `label`. Each box is a text input
 * named by its own `label`, digits only (non-digits are dropped before
 * `onChange`), its text selected on focus so a typed score replaces it.
 */
export function FixtureScoreBoxes({
  errorId,
  score,
}: {
  errorId: string;
  score: FixtureScore;
}) {
  const hasError = Boolean(score.error);
  const disabled = score.disabled ?? false;
  const onKeyDown = scoreKeyDown(score);
  const box = (side: FixtureScoreSide) => {
    const { invalid, label, ref, value } = score[side];
    return (
      <ScoreBox
        describedBy={hasError ? errorId : undefined}
        disabled={disabled}
        inputRef={ref}
        invalid={boxInvalid(invalid, hasError)}
        label={label}
        onDigits={(digits) => score.onChange(side, digits)}
        onKeyDown={onKeyDown}
        value={value}
      />
    );
  };
  return (
    <span
      aria-label={score.label}
      className={cx('sw-fixture-center', 'sw-fixture-score')}
      role="group"
    >
      {box('home')}
      <span aria-hidden="true" className="sw-fixture-score-dash">
        –
      </span>
      {box('away')}
    </span>
  );
}

/**
 * The score's message under the row: a polite live region, present (and
 * empty, taking no room) while there is no error, so a new one is said.
 */
export function FixtureScoreError({
  error,
  id,
}: {
  error: string | undefined;
  id: string;
}) {
  return (
    <span aria-live="polite" className="sw-fixture-score-error" id={id}>
      {error || null}
    </span>
  );
}
