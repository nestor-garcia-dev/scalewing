'use client';

import { type ReactNode, type Ref } from 'react';

import { cx } from '../../class-names.js';
import { countToneClass } from '../../css/css-count-pill.js';
import { AppHeader } from '../AppHeader.js';
import { Button } from '../Button.js';
import { type AppShellProps } from './types.js';

export type AppShellBarProps = Pick<
  AppShellProps,
  'barEnd' | 'barTitle' | 'menuCount' | 'menuCountLabel' | 'menuCountTone'
> & {
  /** The bar itself, measured so a page bar can stick under it. */
  barRef: Ref<HTMLElement>;
  menuRef: Ref<HTMLButtonElement>;
  menuIcon: ReactNode;
  openMenuLabel: string;
  menuOpen: boolean;
  onOpenMenu: () => void;
};

/**
 * The menu button's name: its label, then the count's words (or the bare
 * number) after a comma while there is a count to read.
 */
export function menuButtonName(
  openMenu: string,
  menuCount: number | undefined,
  menuCountLabel: string | undefined,
): string {
  if (!menuCount) return openMenu;
  return `${openMenu}, ${menuCountLabel ?? String(menuCount)}`;
}

/**
 * The compact top bar below `lg` (an AppHeader `bar`): the icon-only menu
 * button, which may carry the shared count pill on its top end corner, the
 * title and the end controls. The pill is hidden from assistive technology
 * because the button's name already reads it.
 */
export function AppShellBar({
  barEnd,
  barRef,
  barTitle,
  menuCount,
  menuCountLabel,
  menuCountTone = 'danger',
  menuIcon,
  menuOpen,
  menuRef,
  onOpenMenu,
  openMenuLabel,
}: AppShellBarProps) {
  return (
    <AppHeader
      ref={barRef}
      appearance="bar"
      className="sw-app-shell-bar"
      padding={2}
    >
      <Button
        ref={menuRef}
        aria-expanded={menuOpen}
        aria-haspopup="dialog"
        aria-label={menuButtonName(openMenuLabel, menuCount, menuCountLabel)}
        className="sw-app-shell-menu"
        onPress={onOpenMenu}
        size="sm"
        variant="ghost"
      >
        <span aria-hidden="true" className="sw-app-shell-icon">
          {menuIcon}
        </span>
        {menuCount ? (
          <span
            aria-hidden="true"
            className={cx(
              'sw-app-shell-count',
              menuCountTone !== 'danger' &&
                countToneClass('sw-app-shell-count', menuCountTone),
            )}
          >
            {menuCount}
          </span>
        ) : null}
      </Button>
      <div className="sw-app-shell-bar-title">{barTitle}</div>
      {barEnd ? <div className="sw-app-shell-bar-end">{barEnd}</div> : null}
    </AppHeader>
  );
}
