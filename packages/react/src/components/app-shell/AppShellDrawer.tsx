'use client';

import { type ReactNode } from 'react';

import { Button } from '../Button.js';
import { useDialogCloseRequests } from '../dialog-close-requests.js';
import { AppShellNav } from './AppShellNav.js';
import { type AppShellNavGroup, type AppShellNavItem } from './types.js';

export type AppShellDrawerProps = {
  open: boolean;
  /** Asked on every close request: Escape, a press outside, the close button. */
  onClose: () => void;
  /** Asked after a plain press on a destination, which also closes it. */
  onChoose: () => void;
  closeLabel: string;
  navLabel: string;
  groups: readonly AppShellNavGroup[];
  onNavigate?: (item: AppShellNavItem) => void;
  header?: ReactNode;
  footer?: ReactNode;
};

/**
 * The menu below `lg`: a modal `dialog` on the top layer, full height at
 * the inline start, named by the navigation's label. Dialog's close-request
 * mechanics make Escape, a backdrop press and a platform close request one
 * `onClose`, after which focus returns to the menu button. Its close button
 * sits where the menu button was, so it is the first control. The content
 * is drawn only while open, so the page holds one navigation at a time.
 */
export function AppShellDrawer({
  closeLabel,
  footer,
  groups,
  header,
  navLabel,
  onChoose,
  onClose,
  onNavigate,
  open,
}: AppShellDrawerProps) {
  const { nodeRef, handlers } = useDialogCloseRequests({ open, onClose });

  return (
    <dialog
      ref={nodeRef}
      aria-label={navLabel}
      className="sw-app-shell-drawer"
      {...handlers}
    >
      {open ? (
        <>
          <div className="sw-app-shell-drawer-top">
            <Button
              className="sw-app-shell-close"
              onPress={onClose}
              size="sm"
              variant="ghost"
            >
              <span className="sw-sr-only">{closeLabel}</span>
              <span aria-hidden="true" className="sw-dialog-close-glyph" />
            </Button>
            {header ? (
              <div className="sw-app-shell-header">{header}</div>
            ) : null}
          </div>
          <AppShellNav
            groups={groups}
            navLabel={navLabel}
            onChoose={onChoose}
            onNavigate={onNavigate}
          />
          {footer ? <div className="sw-app-shell-footer">{footer}</div> : null}
        </>
      ) : null}
    </dialog>
  );
}
