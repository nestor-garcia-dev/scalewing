import { type ReactNode } from 'react';

import { type NavItemCurrent } from '../nav-items.js';

/** One destination in the site's main navigation. */
export type SiteHeaderItem = {
  id: string;
  label: string;
  href: string;
  /** `page` (or `true`) for the page shown, `location` for a page inside the item's section. */
  current?: NavItemCurrent;
};

/** The menu button's names, in the consumer's words. */
export type SiteHeaderLabels = {
  /** The closed menu button's name, such as "Open the menu". */
  openMenu: string;
  /** The open menu button's name, such as "Close the menu". */
  closeMenu: string;
};

export type SiteHeaderProps = {
  /** The site's mark at the start, such as a logo linked to the home page. */
  brand: ReactNode;
  /** The main navigation's name, such as "Main". */
  navLabel: string;
  /** The main destinations: a row of links from `lg`, the menu's list below it. */
  items: readonly SiteHeaderItem[];
  /** The bar's end from `lg`, such as a language switch, Sign in and a ButtonLink. */
  actions?: ReactNode;
  /** Beside the menu button below `lg`, such as the language switch. */
  compactActions?: ReactNode;
  /** In the open menu under its links, such as full-width ButtonLinks. */
  menuActions?: ReactNode;
  labels: SiteHeaderLabels;
  /** The closed menu button's glyph (☰), decorative. */
  menuIcon: ReactNode;
  /** The open menu button's glyph (✕), decorative. */
  closeIcon: ReactNode;
  /** Whether the bar sticks to the window's top as the page scrolls (default `true`). */
  sticky?: boolean;
};
