import { type MouseEvent, type ReactNode } from 'react';

import { cx } from '../../class-names.js';
import { countToneClass } from '../../css/css-count-pill.js';
import { tabStop } from '../../tab-stop.js';
import { navItemAriaCurrent } from '../nav-items.js';
import { Tooltip } from '../Tooltip.js';
import { type TooltipTriggerAria } from '../tooltip-trigger-aria.js';
import { type AppShellNavItem } from './types.js';

type AnchorProps = TooltipTriggerAria & {
  item: AppShellNavItem;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
};

/*
 * The destination's link. A Tooltip around it passes its references in;
 * only `aria-labelledby` is kept. Its `aria-describedby` is left out on
 * purpose: the tooltip's words are the label the link is already named by,
 * so they would be read twice.
 */
function AppShellAnchor({
  'aria-labelledby': labelledBy,
  children,
  item,
  onClick,
}: AnchorProps) {
  return (
    <a
      aria-current={navItemAriaCurrent(item.current)}
      aria-labelledby={labelledBy}
      className="sw-app-shell-link"
      href={item.href}
      onClick={onClick}
      tabIndex={tabStop}
    >
      {children}
    </a>
  );
}

/** The count after the label, read in the link's name as SectionNav's is. */
function AppShellCount({
  count,
  countLabel,
  countTone = 'danger',
}: Pick<AppShellNavItem, 'count' | 'countLabel' | 'countTone'>) {
  if (!count) return null;
  return (
    <>
      {countLabel ? (
        <span className="sw-sr-only">{` ${countLabel}`}</span>
      ) : (
        ' '
      )}
      <span
        aria-hidden={countLabel ? true : undefined}
        className={cx(
          'sw-app-shell-count',
          countTone !== 'danger' &&
            countToneClass('sw-app-shell-count', countTone),
        )}
      >
        {count}
      </span>
    </>
  );
}

export type AppShellLinkProps = {
  item: AppShellNavItem;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * The sidebar's links sit in a Tooltip with their label, shown only while
   * `tooltip` is true (the rail, where the label is hidden). Left out (the
   * drawer) there is no Tooltip at all.
   */
  tooltip?: boolean;
};

/** One destination in its list item: the glyph, the label and the count. */
export function AppShellLink({ item, onClick, tooltip }: AppShellLinkProps) {
  const content = (
    <>
      <span aria-hidden="true" className="sw-app-shell-icon">
        {item.icon}
      </span>
      <span className="sw-app-shell-label">{item.label}</span>
      <AppShellCount
        count={item.count}
        countLabel={item.countLabel}
        countTone={item.countTone}
      />
    </>
  );
  return (
    <li className="sw-app-shell-item">
      {tooltip === undefined ? (
        <AppShellAnchor item={item} onClick={onClick}>
          {content}
        </AppShellAnchor>
      ) : (
        <Tooltip
          content={item.label}
          disabled={!tooltip}
          trigger={
            <AppShellAnchor item={item} onClick={onClick}>
              {content}
            </AppShellAnchor>
          }
        />
      )}
    </li>
  );
}
