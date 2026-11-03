'use client';

import { useId } from 'react';

import { FixtureScoreError } from './fixture/FixtureScoreBoxes.js';
import { ScoreBox } from './fixture/ScoreBox.js';
import {
  type FixtureCardProps,
  type FixtureCardSide,
  type FixtureScore,
  type FixtureScoreSide,
} from './fixture/types.js';
import { assertFixtureCard } from './fixture/validate-card.js';
import { hasSlot } from './slot.js';

export type { FixtureCardProps, FixtureCardSide } from './fixture/types.js';

/** One side's row: its name and note, then its score box at the end. */
function CardSide({
  errorId,
  place,
  score,
  side,
}: {
  errorId: string;
  place: FixtureScoreSide;
  score: FixtureScore;
  side: FixtureCardSide;
}) {
  return (
    <div className="sw-fixture-card-side">
      <div className="sw-fixture-card-team">
        <div className="sw-fixture-card-name">{side.name}</div>
        {hasSlot(side.note) ? (
          <div className="sw-fixture-card-note">{side.note}</div>
        ) : null}
      </div>
      <ScoreBox errorId={errorId} score={score} side={place} />
    </div>
  );
}

/**
 * One fixture as a small vertical scorecard, for inside a `Card`: an
 * optional top line, the two sides each with its score box at the end (the
 * boxes in one column), the score's message, then `actions` and `detail`.
 * It draws no edge or fill of its own, and the consumer separates several
 * with its own divider. The boxes are FixtureRow's. The root is a group
 * named by `score.label`. Invalid words or props throw a `RangeError`.
 */
export function FixtureCard(props: FixtureCardProps) {
  assertFixtureCard(props);
  const errorId = useId();
  const { actions, away, detail, home, menu, meta, score } = props;
  const hasMeta = hasSlot(meta);
  const hasMenu = hasSlot(menu);
  return (
    <div aria-label={score.label} className="sw-fixture-card" role="group">
      {hasMeta || hasMenu ? (
        <div className="sw-fixture-card-top">
          {hasMeta ? <div className="sw-fixture-card-meta">{meta}</div> : null}
          {hasMenu ? <div className="sw-fixture-card-menu">{menu}</div> : null}
        </div>
      ) : null}
      <CardSide errorId={errorId} place="home" score={score} side={home} />
      <CardSide errorId={errorId} place="away" score={score} side={away} />
      <FixtureScoreError
        className="sw-fixture-card-error"
        error={score.error}
        id={errorId}
      />
      {hasSlot(actions) ? (
        <div className="sw-fixture-card-actions">{actions}</div>
      ) : null}
      {hasSlot(detail) ? (
        <div className="sw-fixture-card-detail">{detail}</div>
      ) : null}
    </div>
  );
}
