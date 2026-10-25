'use client';

import { type MouseEvent, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { hideClass } from '../css/breakpoints.js';
import { tabStop } from '../tab-stop.js';
import { Badge } from './Badge.js';
import { Checkbox } from './Checkbox.js';
import { useFixtureList } from './fixture/fixture-list-context.js';
import {
  type FixtureFlag,
  type FixtureRowProps,
  type FixtureSelect,
  type FixtureSide,
} from './fixture/types.js';
import { assertFixtureRow } from './fixture/validate.js';
import { plainPress } from './link-press.js';
import { hasSlot } from './slot.js';

export type {
  FixtureFlag,
  FixtureRowProps,
  FixtureSelect,
  FixtureSide,
  FixtureStatus,
} from './fixture/types.js';

/**
 * The issue marker at the row's start: a drawn mark (its tooltip the
 * label) and the label in hidden words, read first in the row's name.
 */
function Flag({ flag }: { flag: FixtureFlag }) {
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
function Select({ select }: { select: FixtureSelect }) {
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
 * `flag` marks an issue at the row's start; `select` is a checkbox before
 * the row and `action` a control after it, both outside its press area.
 * Invalid words or props throw a `RangeError`.
 */
export function FixtureRow(props: FixtureRowProps) {
  useFixtureList();
  assertFixtureRow(props);
  const {
    action,
    away,
    center,
    centerKind = 'time',
    flag,
    home,
    href,
    meta,
    metaHideBelow,
    onPress,
    select,
    status,
    'aria-label': ariaLabel,
  } = props;
  const hasMeta = hasSlot(meta);
  const pressable = href !== undefined || onPress !== undefined;
  const hasAction = hasSlot(action);
  // Below md the end is a second line; with nothing on it (no status, and
  // meta absent or hidden below md) the flag stays on the first line.
  const endShownNarrow =
    status !== undefined || (hasMeta && metaHideBelow === undefined);
  const rowClass = cx(
    'sw-fixture-row',
    pressable && 'sw-fixture-row-pressable',
    flag && 'sw-fixture-row-flagged',
    flag && !endShownNarrow && 'sw-fixture-row-flag-inline',
  );
  const name =
    ariaLabel !== undefined && flag ? `${flag.label}, ${ariaLabel}` : ariaLabel;

  // Spaces as their own text nodes keep the parts apart in the name.
  const parts: ReactNode = (
    <>
      {flag ? (
        <>
          <Flag flag={flag} />{' '}
        </>
      ) : null}
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
        aria-label={name}
        className={rowClass}
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
        aria-label={name}
        className={rowClass}
        onClick={onPress}
        tabIndex={tabStop}
        type="button"
      >
        {parts}
      </button>
    );
  else row = <div className={rowClass}>{parts}</div>;

  return (
    <li
      className={cx(
        'sw-fixture-item',
        select && 'sw-fixture-item-select',
        hasAction && 'sw-fixture-item-action',
      )}
    >
      {select ? <Select select={select} /> : null}
      {row}
      {hasAction ? <span className="sw-fixture-action">{action}</span> : null}
    </li>
  );
}
