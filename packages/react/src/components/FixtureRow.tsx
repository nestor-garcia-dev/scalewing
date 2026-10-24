'use client';

import { type MouseEvent, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { hideClass } from '../css/breakpoints.js';
import { tabStop } from '../tab-stop.js';
import { Badge } from './Badge.js';
import { useFixtureList } from './fixture/fixture-list-context.js';
import { type FixtureRowProps, type FixtureSide } from './fixture/types.js';
import { assertFixtureRow } from './fixture/validate.js';
import { plainPress } from './link-press.js';
import { hasSlot } from './slot.js';

export type {
  FixtureRowProps,
  FixtureSide,
  FixtureStatus,
} from './fixture/types.js';

/** One side: its name, and its mark on the centre's side (hidden). */
function Side({ side, place }: { side: FixtureSide; place: 'home' | 'away' }) {
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

/**
 * One fixture in a FixtureGroup: the home side ending at the centre, the
 * kickoff time or score in the middle, the away side starting from it, then
 * the details and a status at the end (under the sides below `md`). With
 * `href` or `onPress` the whole row is a link or a button with a chevron.
 * Invalid words or props throw a `RangeError`.
 */
export function FixtureRow(props: FixtureRowProps) {
  useFixtureList();
  assertFixtureRow(props);
  const {
    away,
    center,
    centerKind = 'time',
    home,
    href,
    meta,
    metaHideBelow,
    onPress,
    status,
    'aria-label': ariaLabel,
  } = props;
  const hasMeta = hasSlot(meta);
  const pressable = href !== undefined || onPress !== undefined;

  // Spaces as their own text nodes keep the parts apart in the name.
  const parts: ReactNode = (
    <>
      <Side place="home" side={home} />{' '}
      <span className={`sw-fixture-center sw-fixture-center-${centerKind}`}>
        {center}
      </span>{' '}
      <Side place="away" side={away} />
      {hasMeta || status ? (
        <>
          {' '}
          <span className="sw-fixture-end">
            {hasMeta ? (
              <span
                className={cx(
                  'sw-fixture-meta',
                  metaHideBelow && hideClass('below', metaHideBelow),
                )}
              >
                {meta}
              </span>
            ) : null}
            {hasMeta && status ? ' ' : null}
            {status ? (
              <Badge size="sm" tone={status.tone}>
                {status.label}
              </Badge>
            ) : null}
          </span>
        </>
      ) : null}
      {pressable ? (
        <span aria-hidden="true" className="sw-fixture-chevron" />
      ) : null}
    </>
  );

  let row: ReactNode;
  if (href !== undefined)
    row = (
      <a
        aria-label={ariaLabel}
        className="sw-fixture-row sw-fixture-row-pressable"
        href={href}
        onClick={
          onPress
            ? (event: MouseEvent<HTMLAnchorElement>) => {
                if (!plainPress(event)) return;
                event.preventDefault();
                onPress(event);
              }
            : undefined
        }
        tabIndex={tabStop}
      >
        {parts}
      </a>
    );
  else if (onPress !== undefined)
    row = (
      <button
        aria-label={ariaLabel}
        className="sw-fixture-row sw-fixture-row-pressable"
        onClick={onPress}
        tabIndex={tabStop}
        type="button"
      >
        {parts}
      </button>
    );
  else row = <div className="sw-fixture-row">{parts}</div>;

  return <li className="sw-fixture-item">{row}</li>;
}
