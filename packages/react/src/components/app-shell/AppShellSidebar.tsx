import { type ReactNode } from 'react';

import { AppShellNav } from './AppShellNav.js';
import { type AppShellNavGroup, type AppShellNavItem } from './types.js';

export type AppShellSidebarProps = {
  navLabel: string;
  groups: readonly AppShellNavGroup[];
  onNavigate?: (item: AppShellNavItem) => void;
  header?: ReactNode;
  footer?: ReactNode;
  railHeader?: ReactNode;
  railFooter?: ReactNode;
  /** Whether the window is in the rail's range, where tooltips show. */
  rail: boolean;
};

/*
 * A slot drawn in the full sidebar (`sw-app-shell-slot`) or only in the
 * rail (`sw-app-shell-rail-slot`); the generated media queries pick one.
 */
function Slot({
  children,
  part,
  rail,
}: {
  children: ReactNode;
  part: 'header' | 'footer';
  rail: boolean;
}) {
  if (!children) return null;
  return (
    <div
      className={`sw-app-shell-${part} ${rail ? 'sw-app-shell-rail-slot' : 'sw-app-shell-slot'}`}
    >
      {children}
    </div>
  );
}

/**
 * The pinned column from `lg` up: a rail to 75rem, the full sidebar from
 * there. Hidden below `lg`, where the drawer holds the same parts.
 */
export function AppShellSidebar({
  footer,
  groups,
  header,
  navLabel,
  onNavigate,
  rail,
  railFooter,
  railHeader,
}: AppShellSidebarProps) {
  return (
    <div className="sw-app-shell-sidebar">
      <Slot part="header" rail={false}>
        {header}
      </Slot>
      <Slot part="header" rail>
        {railHeader}
      </Slot>
      <AppShellNav
        groups={groups}
        navLabel={navLabel}
        onNavigate={onNavigate}
        tooltip={rail}
      />
      <Slot part="footer" rail={false}>
        {footer}
      </Slot>
      <Slot part="footer" rail>
        {railFooter}
      </Slot>
    </div>
  );
}
