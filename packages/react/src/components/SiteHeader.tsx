'use client';

import { useRef } from 'react';

import { cx } from '../class-names.js';
import { SiteHeaderLinks } from './site-header/SiteHeaderLinks.js';
import { type SiteHeaderProps } from './site-header/types.js';
import { useMenuDismiss } from './site-header/use-menu-dismiss.js';
import { assertSiteHeaderProps } from './site-header/validate.js';

export type {
  SiteHeaderItem,
  SiteHeaderLabels,
  SiteHeaderProps,
} from './site-header/types.js';

/**
 * A public site's header: the brand at the start; from `lg` the main
 * destinations as a row of links (the current one marked by weight and a
 * bar under it) and the bar's actions at the end; below `lg` the compact
 * actions and a menu button that opens the destinations and the menu's
 * actions over the page under the bar. The menu is a native `details`, so
 * it opens and closes by touch, click and keyboard with no script, as a
 * page rendered on the server needs; script adds Escape (focus back on the
 * button) and closes it when a link is chosen or focus leaves it. It traps
 * no focus. Invalid items or words throw a `RangeError`.
 */
export function SiteHeader({
  actions,
  brand,
  closeIcon,
  compactActions,
  items,
  labels,
  menuActions,
  menuIcon,
  navLabel,
  sticky = true,
}: SiteHeaderProps) {
  assertSiteHeaderProps({ items, labels, navLabel });
  const menuRef = useRef<HTMLDetailsElement>(null);
  useMenuDismiss(menuRef);
  return (
    <header className={cx('sw-site-header', sticky && 'sw-site-header-sticky')}>
      <div className="sw-site-header-bar">
        <div className="sw-site-header-brand">{brand}</div>
        <SiteHeaderLinks
          className="sw-site-header-nav"
          items={items}
          navLabel={navLabel}
        />
        {actions ? (
          <div className="sw-site-header-actions">{actions}</div>
        ) : null}
        <div className="sw-site-header-compact">
          {compactActions}
          <details className="sw-site-header-menu" ref={menuRef}>
            <summary className="sw-site-header-menu-button">
              <span className="sw-site-header-menu-open">
                <span aria-hidden="true" className="sw-site-header-glyph">
                  {menuIcon}
                </span>
                <span className="sw-sr-only">{labels.openMenu}</span>
              </span>
              <span className="sw-site-header-menu-close">
                <span aria-hidden="true" className="sw-site-header-glyph">
                  {closeIcon}
                </span>
                <span className="sw-sr-only">{labels.closeMenu}</span>
              </span>
            </summary>
            <div className="sw-site-header-panel">
              <SiteHeaderLinks
                className="sw-site-header-menu-nav"
                items={items}
                navLabel={navLabel}
              />
              {menuActions ? (
                <div className="sw-site-header-menu-actions">{menuActions}</div>
              ) : null}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
