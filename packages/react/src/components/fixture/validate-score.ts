import { type FixtureRowProps, type FixtureScoreBox } from './types.js';

function isBlank(words: unknown): boolean {
  return typeof words !== 'string' || !words.trim();
}

function isBox(box: FixtureScoreBox | undefined): boolean {
  return (
    box !== undefined &&
    typeof box.value === 'string' &&
    !isBlank(box.label) &&
    (box.invalid === undefined || typeof box.invalid === 'boolean')
  );
}

/**
 * Fails closed on a middle the row cannot draw: neither a `center` nor a
 * `score`, or both; a `centerKind` with a `score` (it styles `center`); a
 * score on a link or button row (its boxes would sit inside the press
 * target); a score without a group label, two boxes with string values
 * and labels, an `onChange` and an `onSubmit`, or with an `onCancel` or
 * `error` of the wrong type.
 */
export function assertFixtureMiddle({
  center,
  centerKind,
  href,
  onPress,
  score,
}: FixtureRowProps): void {
  const name = 'FixtureRow';
  if (score === undefined) {
    if (isBlank(center))
      throw new RangeError(`${name} center must be nonempty`);
    return;
  }
  if (center !== undefined)
    throw new RangeError(`${name} takes a center or a score, not both`);
  if (centerKind !== undefined)
    throw new RangeError(
      `${name} centerKind styles center: leave it out with score`,
    );
  if (href !== undefined || onPress !== undefined)
    throw new RangeError(
      `${name} score boxes are their own controls: leave out href and onPress`,
    );
  if (
    isBlank(score.label) ||
    !isBox(score.home) ||
    !isBox(score.away) ||
    typeof score.onChange !== 'function' ||
    typeof score.onSubmit !== 'function' ||
    (score.onCancel !== undefined && typeof score.onCancel !== 'function') ||
    (score.error !== undefined && typeof score.error !== 'string')
  )
    throw new RangeError(
      `${name} score needs a label, home and away boxes (value and label), onChange and onSubmit`,
    );
}
