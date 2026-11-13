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

/**
 * A "skip to content" link, the header's first focusable element: hidden
 * until it has focus, then shown at the bar's start.
 */
export type SiteHeaderSkipLink = {
  /** The link's words, such as "Skip to content". */
  label: string;
  /** The main content's fragment, such as `#main`. */
  href: string;
};

/**
 * The header's search form: a field in the bar from `lg`, a search button
 * opening a full-window search below it. Submitting goes to `action` (the
 * site's results page) with the query as `name`.
 */
export type SiteHeaderSearchOptions = {
  /** The results page the form submits to with GET, such as `/docs/search/`. */
  action: string;
  /** The query's parameter name (default `q`). */
  name?: string;
  /** The field's accessible name, such as "Search the docs". */
  label: string;
  /** The empty field's hint, such as "Search the docs". */
  placeholder: string;
  /** The button names: `open` below `lg` ("Search"), `close` in the open search ("Close search"). */
  labels: { open: string; close: string };
  /** The magnifier glyph, decorative, in the button and the field. */
  icon: ReactNode;
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
  /**
   * Beside the menu button below `lg`, such as the language switch. They
   * step aside while the menu is open, which holds its own `menuActions`.
   */
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
  /** A "skip to content" link before everything else in the header. */
  skipLink?: SiteHeaderSkipLink;
  /** A search field in the bar from `lg`; a search button below it. */
  search?: SiteHeaderSearchOptions;
};
