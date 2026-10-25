import { visibilityBreakpoints } from '../../css/breakpoints.js';
import { badgeTones } from '../../css/css-data.js';
import { fixtureCenterKinds, fixtureFlagTones } from '../../css/css-fixture.js';
import { isOneOf } from '../../is-one-of.js';
import { type FixtureRowProps } from './types.js';

function isBlank(words: unknown): boolean {
  return typeof words !== 'string' || !words.trim();
}

/**
 * Fails closed on a row it cannot name or draw: a side without a name, a
 * blank centre, an unknown centre kind or breakpoint, a status with blank
 * words or an unknown tone, a flag with blank words or an unknown tone, a
 * blank address or `aria-label`, a `select` without a label, a boolean
 * `checked` or an `onCheckedChange`, or an
 * `aria-label` on a row that is neither a link nor a button.
 */
export function assertFixtureRow({
  away,
  center,
  centerKind,
  flag,
  home,
  href,
  metaHideBelow,
  onPress,
  select,
  status,
  'aria-label': ariaLabel,
}: FixtureRowProps): void {
  const name = 'FixtureRow';
  if (isBlank(home?.name) || isBlank(away?.name))
    throw new RangeError(`${name} home and away need nonempty names`);
  if (isBlank(center)) throw new RangeError(`${name} center must be nonempty`);
  if (centerKind !== undefined && !isOneOf(fixtureCenterKinds, centerKind))
    throw new RangeError(
      `${name} centerKind must be one of ${fixtureCenterKinds.join(', ')}`,
    );
  if (
    metaHideBelow !== undefined &&
    !isOneOf(visibilityBreakpoints, metaHideBelow)
  )
    throw new RangeError(
      `${name} metaHideBelow must be one of ${visibilityBreakpoints.join(', ')}`,
    );
  if (
    status !== undefined &&
    (isBlank(status.label) || !isOneOf(badgeTones, status.tone))
  )
    throw new RangeError(
      `${name} status needs a label and one of ${badgeTones.join(', ')}`,
    );
  if (
    flag !== undefined &&
    (isBlank(flag?.label) ||
      (flag.tone !== undefined && !isOneOf(fixtureFlagTones, flag.tone)))
  )
    throw new RangeError(
      `${name} flag needs a label and one of ${fixtureFlagTones.join(', ')}`,
    );
  if (
    select !== undefined &&
    (isBlank(select?.label) ||
      typeof select.checked !== 'boolean' ||
      typeof select.onCheckedChange !== 'function')
  )
    throw new RangeError(
      `${name} select needs a label, checked and onCheckedChange`,
    );
  if (href !== undefined && isBlank(href))
    throw new RangeError(`${name} href must be nonempty when given`);
  if (ariaLabel !== undefined) {
    if (isBlank(ariaLabel))
      throw new RangeError(`${name} aria-label must be nonempty when given`);
    if (href === undefined && onPress === undefined)
      throw new RangeError(
        `${name} aria-label names a link or a button: give it href or onPress`,
      );
  }
}
