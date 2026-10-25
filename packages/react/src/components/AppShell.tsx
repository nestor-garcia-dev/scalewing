'use client';

import { type CSSProperties, useEffect, useId, useRef, useState } from 'react';

import { breakpointQuery } from '../css/breakpoints.js';
import { appShellWideQuery } from '../css/css-app-shell.js';
import { appShellBarHeightVariable } from '../css/css-app-shell-page-bar.js';
import { AppShellBar } from './app-shell/AppShellBar.js';
import { AppShellDrawer } from './app-shell/AppShellDrawer.js';
import { AppShellSidebar } from './app-shell/AppShellSidebar.js';
import { SkipToMain } from './app-shell/SkipToMain.js';
import { type AppShellProps } from './app-shell/types.js';
import { assertAppShellProps } from './app-shell/validate.js';
import { useElementHeight } from './use-element-height.js';
import { useMediaQuery } from './use-media-query.js';

export type {
  AppShellLabels,
  AppShellNavGroup,
  AppShellNavItem,
  AppShellProps,
  AppShellSkipLink,
} from './app-shell/types.js';

const fromLg = breakpointQuery('from', 'lg');

/**
 * A web workspace's frame: a pinned side navigation of grouped
 * destinations beside the page (`main`), which scrolls with the document.
 * From 75rem the sidebar is full (glyphs, labels, counts and group
 * captions); from `lg` to 75rem it is a rail of glyphs with tooltips; below
 * `lg` a sticky top bar's menu button opens the same navigation in a modal
 * drawer from the inline start, its button optionally carrying a count.
 * `pageBar` is a sticky band at the top of `main` on every layout, and
 * `skipLink` a first link that moves focus to `main`. Invalid groups,
 * items, counts or words throw a `RangeError`.
 */
export function AppShell({
  barEnd,
  barTitle,
  children,
  footer,
  groups,
  header,
  labels,
  menuCount,
  menuCountLabel,
  menuCountTone,
  menuIcon,
  navLabel,
  onNavigate,
  pageBar,
  railFooter,
  railHeader,
  skipLink,
}: AppShellProps) {
  assertAppShellProps({
    groups,
    labels,
    menuCount,
    menuCountLabel,
    menuCountTone,
    navLabel,
    skipLink,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const mainId = useId();
  // Set by a dismissal (Escape, a press outside, the close button): only
  // that hands focus back to the menu button.
  const refocusRef = useRef(false);
  const sidebarShown = useMediaQuery(fromLg, false);
  const wide = useMediaQuery(appShellWideQuery, false);
  // A page bar sticks under the compact bar, however tall its end controls
  // make it; the generated CSS falls back to the bar's usual height.
  const hasPageBar =
    pageBar !== undefined && pageBar !== null && pageBar !== false;
  const barHeight = useElementHeight(barRef, hasPageBar);
  const shellStyle =
    barHeight === null
      ? undefined
      : ({ [appShellBarHeightVariable]: `${barHeight}px` } as CSSProperties);

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
    <div className="sw-app-shell" style={shellStyle}>
      {skipLink ? (
        <SkipToMain label={skipLink.label} mainId={mainId} mainRef={mainRef} />
      ) : null}
      <AppShellBar
        barEnd={barEnd}
        barRef={barRef}
        barTitle={barTitle}
        menuCount={menuCount}
        menuCountLabel={menuCountLabel}
        menuCountTone={menuCountTone}
        menuIcon={menuIcon}
        menuOpen={menuOpen}
        menuRef={menuRef}
        onOpenMenu={() => setMenuOpen(true)}
        openMenuLabel={labels.openMenu}
      />
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
      {/* A skip link's target: named and focusable only with one. */}
      <main
        ref={mainRef}
        className="sw-app-shell-main"
        id={skipLink ? mainId : undefined}
        tabIndex={skipLink ? -1 : undefined}
      >
        {hasPageBar ? (
          <div className="sw-app-shell-page-bar">{pageBar}</div>
        ) : null}
        {children}
      </main>
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
