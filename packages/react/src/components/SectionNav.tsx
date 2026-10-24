import { type ReactNode } from 'react';

import { type AccessibleName } from '../accessible-name.js';
import { cx } from '../class-names.js';
import { type Breakpoint, breakpoints } from '../css/breakpoints.js';
import { sectionNavVerticalClass } from '../css/css-section-nav.js';
import {
  assertSectionNavAppearance,
  type SectionNavAppearance,
} from '../css/css-section-nav-filled.js';
import { tabStop } from '../tab-stop.js';
import { plainPress } from './link-press.js';
import {
  assertNavItems,
  navItemAriaCurrent,
  type NavItemCurrent,
} from './nav-items.js';

export type { SectionNavAppearance };
export { sectionNavAppearances } from '../css/css-section-nav-filled.js';

export type SectionNavItem = {
  id: string;
  label: string;
  href: string;
  /**
   * `page` when the item is this page, `location` (or `true`) when the page
   * is inside the item's section, such as a detail page under its list.
   */
  current?: NavItemCurrent;
  /** A decorative glyph before the label. */
  icon?: ReactNode;
  /**
   * How many things wait in the section, such as tasks to do: a filled pill
   * after the label, read as part of the link's name ("Tasks 3"). A whole
   * number; 0 (or none) shows no pill. There is no cap: a long number
   * widens the link.
   */
  count?: number;
  /**
   * What the count means, in the consumer's words ("3 tasks to do"): read
   * in the link's name in place of the bare number ("Tasks 3 tasks to
   * do"; "Tasks 3 waiting" with "3 waiting"), the pill then hidden from
   * assistive technology. Needs `count`.
   */
  countLabel?: string;
};

export type SectionNavProps = AccessibleName & {
  items: readonly SectionNavItem[];
  /**
   * Called for a plain press on an item (the main button, no modifier key),
   * after the browser's own navigation is prevented, so a client router
   * moves instead. A press with a modifier key, or a middle press, keeps the
   * browser's behavior (a new tab or window). Without it the links navigate.
   */
  onNavigate?: (item: SectionNavItem) => void;
  /**
   * From this breakpoint up the items stack as a side list (the current one
   * marked by a bar at its start) instead of a row (marked by an underline).
   */
  verticalFrom?: Breakpoint;
  /**
   * How the current item is marked: `underline` (default) under a hairline
   * row, or a bar at its start in a side list; `filled`, a quiet row of
   * page buttons whose current one takes a soft fill, for an area's
   * sub-navigation beside its name.
   */
  appearance?: SectionNavAppearance;
};

function assertBreakpoint(verticalFrom: Breakpoint | undefined) {
  if (verticalFrom !== undefined && !breakpoints.includes(verticalFrom))
    throw new RangeError(
      `SectionNav verticalFrom must be one of ${breakpoints.join(', ')}`,
    );
}

/**
 * A page's secondary navigation between the sections of one area, such as
 * an admin portal's pages: a labelled `nav` of links, quieter than the
 * workspace's own navigation, in a row that wraps or, from `verticalFrom`,
 * a side list. The current item carries `aria-current`.
 */
export function SectionNav({
  appearance = 'underline',
  items,
  onNavigate,
  verticalFrom,
  ...label
}: SectionNavProps) {
  assertNavItems('SectionNav', items);
  assertBreakpoint(verticalFrom);
  assertSectionNavAppearance(appearance);
  return (
    <nav
      className={cx(
        'sw-section-nav',
        verticalFrom && sectionNavVerticalClass(verticalFrom),
        appearance === 'filled' && 'sw-section-nav-filled',
      )}
      {...label}
    >
      <ul className="sw-section-nav-list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              aria-current={navItemAriaCurrent(item.current)}
              className="sw-section-nav-link"
              href={item.href}
              tabIndex={tabStop}
              // Only a given onNavigate attaches a handler, so the links
              // render from a server component without one.
              onClick={
                onNavigate
                  ? (event) => {
                      if (!plainPress(event)) return;
                      event.preventDefault();
                      onNavigate(item);
                    }
                  : undefined
              }
            >
              {item.icon ? (
                <span aria-hidden="true" className="sw-section-nav-icon">
                  {item.icon}
                </span>
              ) : null}
              {item.label}
              {item.count ? (
                <>
                  {item.countLabel ? (
                    <span className="sw-sr-only">{` ${item.countLabel}`}</span>
                  ) : (
                    ' '
                  )}
                  <span
                    aria-hidden={item.countLabel ? true : undefined}
                    className="sw-section-nav-count"
                  >
                    {item.count}
                  </span>
                </>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
