import { hasSlot } from '../slot.js';
import { Checkbox } from '../Checkbox.js';
import {
  type FixtureFlag,
  type FixtureSelect,
  type FixtureSide,
} from './types.js';

/**
 * The issue marker at the row's start: a drawn mark (its tooltip the
 * label) and the label in hidden words, read first in the row's name.
 */
export function Flag({ flag }: { flag: FixtureFlag }) {
  return (
    <span
      className={`sw-fixture-flag sw-fixture-flag-${flag.tone ?? 'warning'}`}
    >
      <span
        aria-hidden="true"
        className="sw-fixture-flag-mark"
        title={flag.label}
      />
      <span className="sw-sr-only">{flag.label}</span>
    </span>
  );
}

/** The leading checkbox: a Checkbox with its label visually hidden. */
export function Select({ select }: { select: FixtureSelect }) {
  return (
    <div className="sw-fixture-select">
      <Checkbox
        checked={select.checked}
        disabled={select.disabled ?? false}
        label={select.label}
        labelVisuallyHidden
        onCheckedChange={select.onCheckedChange}
      />
    </div>
  );
}

/** One side: its name, and its mark on the centre's side (hidden). */
export function Side({
  side,
  place,
}: {
  side: FixtureSide;
  place: 'home' | 'away';
}) {
  const mark = hasSlot(side.mark) ? (
    <span aria-hidden="true" className="sw-fixture-mark">
      {side.mark}
    </span>
  ) : null;
  return (
    <span className={`sw-fixture-team sw-fixture-team-${place}`}>
      {place === 'away' ? mark : null}
      <span className="sw-fixture-name">{side.name}</span>
      {place === 'home' ? mark : null}
    </span>
  );
}
