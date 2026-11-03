import { type FixtureCardProps } from './types.js';
import { assertFixtureScore, isBlank } from './validate-score.js';

/** Fails closed on a card it cannot name: a side without a name, or a score `assertFixtureScore` refuses. */
export function assertFixtureCard({
  away,
  home,
  score,
}: FixtureCardProps): void {
  const name = 'FixtureCard';
  if (isBlank(home?.name) || isBlank(away?.name))
    throw new RangeError(`${name} home and away need nonempty names`);
  assertFixtureScore(name, score);
}
