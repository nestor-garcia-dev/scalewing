'use client';

import { type MouseEvent, type ReactNode, useId } from 'react';

import { cx } from '../class-names.js';
import { hideClass } from '../css/breakpoints.js';
import { tabStop } from '../tab-stop.js';
import { Badge } from './Badge.js';
import { useFixtureList } from './fixture/fixture-list-context.js';
import {
  FixtureScoreBoxes,
  FixtureScoreError,
} from './fixture/FixtureScoreBoxes.js';
import { Flag, Select, Side } from './fixture/row-parts.js';
import { type FixtureRowProps } from './fixture/types.js';
import { assertFixtureRow } from './fixture/validate.js';
import { plainPress } from './link-press.js';
import { hasSlot } from './slot.js';

export type {
  FixtureFlag,
  FixtureRowProps,
  FixtureScore,
  FixtureScoreBox,
  FixtureScoreSide,
  FixtureSelect,
  FixtureSide,
  FixtureStatus,
} from './fixture/types.js';

/**
 * One fixture in a FixtureGroup: the home side ending at the centre, the
 * kickoff time or score in the middle, the away side starting from it, then
 * the details and a status at the end (under the sides below `md`). With
 * `href` or `onPress` the whole row is a link or a button with a chevron.
 * `flag` marks an issue at the row's start; `select` is a checkbox before
 * the row and `action` a control after it, both outside its press area.
 * `score` puts two score boxes in the middle in place of `center`, and
 * `detail` is a part under the row. Invalid words or props throw a
 * `RangeError`.
 */
export function FixtureRow(props: FixtureRowProps) {
  useFixtureList();
  assertFixtureRow(props);
  const errorId = useId();
  const {
    action,
    away,
    center,
    centerKind = 'time',
    detail,
    flag,
    home,
    href,
    meta,
    metaHideBelow,
    onPress,
    score,
    select,
    status,
    'aria-label': ariaLabel,
  } = props;
  const hasMeta = hasSlot(meta);
  const pressable = href !== undefined || onPress !== undefined;
  const hasAction = hasSlot(action);
  const hasDetail = hasSlot(detail);
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
      {score ? (
        <FixtureScoreBoxes errorId={errorId} score={score} />
      ) : (
        <span className={`sw-fixture-center sw-fixture-center-${centerKind}`}>
          {center}
        </span>
      )}{' '}
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
        (score || hasDetail) && 'sw-fixture-item-below',
      )}
    >
      {select ? <Select select={select} /> : null}
      {row}
      {score ? <FixtureScoreError error={score.error} id={errorId} /> : null}
      {hasDetail ? <div className="sw-fixture-detail">{detail}</div> : null}
      {hasAction ? <span className="sw-fixture-action">{action}</span> : null}
    </li>
  );
}
