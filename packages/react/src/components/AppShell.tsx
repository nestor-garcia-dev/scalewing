'use client';

import { useEffect, useRef, useState } from 'react';

import { breakpointQuery } from '../css/breakpoints.js';
import { appShellWideQuery } from '../css/css-app-shell.js';
import { AppHeader } from './AppHeader.js';
import { AppShellDrawer } from './app-shell/AppShellDrawer.js';
import { AppShellSidebar } from './app-shell/AppShellSidebar.js';
import { type AppShellProps } from './app-shell/types.js';
import { assertAppShellProps } from './app-shell/validate.js';
import { Button } from './Button.js';
import { useMediaQuery } from './use-media-query.js';

export type {
  AppShellLabels,
  AppShellNavGroup,
  AppShellNavItem,
  AppShellProps,
} from './app-shell/types.js';

const fromLg = breakpointQuery('from', 'lg');

/**
 * A web workspace's frame: a pinned side navigation of grouped
 * destinations beside the page (`main`), which scrolls with the document.
 * From 75rem the sidebar is full (glyphs, labels, counts and group
 * captions); from `lg` to 75rem it is a rail of glyphs with tooltips; below
 * `lg` a sticky top bar's menu button opens the same navigation in a modal
 * drawer from the inline start. Invalid groups, items or words throw a
 * `RangeError`.
 */
export function AppShell({
  barEnd,
  barTitle,
  children,
  footer,
  groups,
  header,
  labels,
  menuIcon,
  navLabel,
  onNavigate,
  railFooter,
  railHeader,
}: AppShellProps) {
  assertAppShellProps({ groups, labels, navLabel });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  // Set by a dismissal (Escape, a press outside, the close button): only
  // that hands focus back to the menu button.
  const refocusRef = useRef(false);
  const sidebarShown = useMediaQuery(fromLg, false);
  const wide = useMediaQuery(appShellWideQuery, false);

  // The drawer belongs to the bar, which is gone from `lg` up: a window
  // widened while it is open closes it.
  if (sidebarShown && menuOpen) setMenuOpen(false);

  // After a dismissal (the drawer's own effect closes it first), focus
  // returns to the menu button. A chosen destination leaves focus to the
  // page it moves to, and a widened window has no menu button to focus.
  useEffect(() => {
    if (menuOpen || !refocusRef.current) return;
    refocusRef.current = false;
    menuRef.current?.focus();
  }, [menuOpen]);

  return (
    <div className="sw-app-shell">
      <AppHeader appearance="bar" className="sw-app-shell-bar" padding={2}>
        <Button
          ref={menuRef}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          aria-label={labels.openMenu}
          className="sw-app-shell-menu"
          onPress={() => setMenuOpen(true)}
          size="sm"
          variant="ghost"
        >
          <span aria-hidden="true" className="sw-app-shell-icon">
            {menuIcon}
          </span>
        </Button>
        <div className="sw-app-shell-bar-title">{barTitle}</div>
        {barEnd ? <div className="sw-app-shell-bar-end">{barEnd}</div> : null}
      </AppHeader>
      <AppShellSidebar
        footer={footer}
        groups={groups}
        header={header}
        navLabel={navLabel}
        onNavigate={onNavigate}
        rail={sidebarShown && !wide}
        railFooter={railFooter}
        railHeader={railHeader}
      />
      <main className="sw-app-shell-main">{children}</main>
      <AppShellDrawer
        closeLabel={labels.closeMenu}
        footer={footer}
        groups={groups}
        header={header}
        navLabel={navLabel}
        onChoose={() => setMenuOpen(false)}
        onClose={() => {
          refocusRef.current = true;
          setMenuOpen(false);
        }}
        onNavigate={onNavigate}
        open={menuOpen}
      />
    </div>
  );
}
