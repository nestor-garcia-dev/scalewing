import { type MouseEvent, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { type Breakpoint, breakpoints } from '../css/breakpoints.js';
import { sectionNavVerticalClass } from '../css/css-section-nav.js';

export type SectionNavItem = {
  id: string;
  label: string;
  href: string;
  /**
   * `page` when the item is this page, `location` (or `true`) when the page
   * is inside the item's section, such as a detail page under its list.
   */
  current?: 'page' | 'location' | boolean;
  /** A decorative glyph before the label. */
  icon?: ReactNode;
};

type SectionNavLabel =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type SectionNavProps = SectionNavLabel & {
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
};

function plainPress(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

function ariaCurrent(
  current: SectionNavItem['current'],
): 'page' | 'location' | 'true' | undefined {
  if (current === true) return 'true';
  return current || undefined;
}

function assertItems(items: readonly SectionNavItem[]) {
  if (items.some((item) => !item.id.trim() || !item.label.trim()))
    throw new RangeError('SectionNav items need nonempty ids and labels');
  if (new Set(items.map((item) => item.id)).size !== items.length)
    throw new RangeError('SectionNav items need unique ids');
}

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
  items,
  onNavigate,
  verticalFrom,
  ...label
}: SectionNavProps) {
  assertItems(items);
  assertBreakpoint(verticalFrom);
  return (
    <nav
      className={cx(
        'sw-section-nav',
        verticalFrom && sectionNavVerticalClass(verticalFrom),
      )}
      {...label}
    >
      <ul className="sw-section-nav-list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              aria-current={ariaCurrent(item.current)}
              className="sw-section-nav-link"
              href={item.href}
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
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
