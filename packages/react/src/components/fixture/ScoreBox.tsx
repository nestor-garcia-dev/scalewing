'use client';

import { type ChangeEvent, type KeyboardEvent } from 'react';

import { scoreBoxMaxDigits, scoreDigits } from './score-digits.js';
import { type FixtureScore, type FixtureScoreSide } from './types.js';

/**
 * Enter records and Escape puts the boxes back. A key that ends an IME
 * composition is the composition's, not the row's.
 */
export function scoreKeyDown(score: FixtureScore) {
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

/**
 * One side's score box, wherever a fixture draws it: a text input named by
 * the box's `label`, digits only (non-digits are dropped before `onChange`),
 * its text selected on focus so a typed score replaces it. It is described
 * by the score's error while there is one, and marked by its own `invalid`,
 * else by any error.
 */
export function ScoreBox({
  errorId,
  score,
  side,
}: {
  errorId: string;
  score: FixtureScore;
  side: FixtureScoreSide;
}) {
  const { invalid, label, ref, value } = score[side];
  const hasError = Boolean(score.error);
  const marked = invalid ?? hasError;
  return (
    <input
      ref={ref}
      aria-describedby={hasError ? errorId : undefined}
      aria-invalid={marked || undefined}
      aria-label={label}
      autoComplete="off"
      className="sw-fixture-score-box"
      disabled={score.disabled ?? false}
      inputMode="numeric"
      maxLength={scoreBoxMaxDigits}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const digits = scoreDigits(event.currentTarget.value);
        if (digits !== value) score.onChange(side, digits);
      }}
      onFocus={(event) => event.currentTarget.select()}
      onKeyDown={scoreKeyDown(score)}
      pattern="[0-9]*"
      type="text"
      value={value}
    />
  );
}
