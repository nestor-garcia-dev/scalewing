'use client';

import { cx } from '../../class-names.js';
import { ScoreBox } from './ScoreBox.js';
import { type FixtureScore } from './types.js';

/**
 * The row's middle when it takes a score: the home box, an en dash and
 * the away box, in a group named by `label`.
 */
export function FixtureScoreBoxes({
  errorId,
  score,
}: {
  errorId: string;
  score: FixtureScore;
}) {
  return (
    <span
      aria-label={score.label}
      className={cx('sw-fixture-center', 'sw-fixture-score')}
      role="group"
    >
      <ScoreBox errorId={errorId} score={score} side="home" />
      <span aria-hidden="true" className="sw-fixture-score-dash">
        –
      </span>
      <ScoreBox errorId={errorId} score={score} side="away" />
    </span>
  );
}

/**
 * The score's message: a polite live region, present (and empty, taking no
 * room) while there is no error, so a new one is said. `className` is where
 * it is drawn: under a FixtureRow by default.
 */
export function FixtureScoreError({
  className = 'sw-fixture-score-error',
  error,
  id,
}: {
  className?: string;
  error: string | undefined;
  id: string;
}) {
  return (
    <span aria-live="polite" className={className} id={id}>
      {error || null}
    </span>
  );
}
