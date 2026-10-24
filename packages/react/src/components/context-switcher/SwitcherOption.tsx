import { type PointerEvent } from 'react';

import { cx } from '../../class-names.js';
import { countToneClass } from '../../css/css-count-pill.js';
import { Badge } from '../Badge.js';
import { type SwitcherEntry } from './options.js';

type SwitcherOptionProps = {
  entry: SwitcherEntry;
  active: boolean;
  current: boolean;
  /** A pointer moved over the row; the popup decides whether it really moved. */
  onActivate: (event: PointerEvent) => void;
  onChoose: () => void;
};

/**
 * One option: its mark (hidden), its label over its detail, its badge and
 * count (both read in its name, a `countLabel` in place of the number) and
 * the current one's check (hidden; `aria-selected` says it).
 */
export function SwitcherOption({
  active,
  current,
  entry,
  onActivate,
  onChoose,
}: SwitcherOptionProps) {
  const { option } = entry;
  const tone = option.countTone ?? 'danger';
  return (
    <div
      aria-selected={current}
      className="sw-context-switcher-option"
      data-active={active ? 'true' : undefined}
      id={entry.domId}
      onClick={onChoose}
      // The pointer moves the active row, as the arrow keys do.
      onPointerMove={(event) => {
        if (!active) onActivate(event);
      }}
      role="option"
    >
      {option.icon ? (
        <span aria-hidden="true" className="sw-context-switcher-icon">
          {option.icon}
        </span>
      ) : null}
      <span className="sw-context-switcher-words">
        <span className="sw-context-switcher-label">{option.label}</span>
        {option.detail ? (
          <span className="sw-context-switcher-detail"> {option.detail}</span>
        ) : null}
      </span>
      {option.badge ? (
        <Badge size="sm" tone={option.badge.tone}>
          {option.badge.label}
        </Badge>
      ) : null}
      {option.count ? (
        <>
          {option.countLabel ? (
            <span className="sw-sr-only">{` ${option.countLabel}`}</span>
          ) : null}
          <span
            aria-hidden={option.countLabel ? true : undefined}
            className={cx(
              'sw-context-switcher-count',
              tone !== 'danger' &&
                countToneClass('sw-context-switcher-count', tone),
            )}
          >
            {option.count}
          </span>
        </>
      ) : null}
      {current ? (
        <span aria-hidden="true" className="sw-context-switcher-check" />
      ) : null}
    </div>
  );
}
