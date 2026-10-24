import { type ReactNode } from 'react';

import { type NavCountTone } from '../NavCount.js';
import { type NavItemCurrent } from '../nav-items.js';

export type AppShellNavItem = {
  id: string;
  label: string;
  href: string;
  /**
   * The destination's glyph (a consumer Lucide icon or mark), hidden from
   * assistive technology. Required: in the rail it is all the item shows.
   */
  icon: ReactNode;
  /**
   * How many things wait there, such as work to do: the shared count pill
   * (danger) after the label, or on the glyph in the rail, read in the
   * link's name. A whole number; 0 (or none) shows no pill.
   */
  count?: number;
  /**
   * What the count means, in the consumer's words ("3 to confirm"): read in
   * the name in place of the bare number, the pill then hidden from
   * assistive technology. Needs `count`.
   */
  countLabel?: string;
  /**
   * The pill's colour, as NavCount's `tone`: `danger` (the default) for
   * work waiting, `warning` (amber) for work that needs the person but is
   * not urgent, `accent` for news. Needs `count`; say what it is in a
   * `countLabel`, never by its colour alone.
   */
  countTone?: NavCountTone;
  /**
   * `page` when the item is this page, `location` (or `true`) when the page
   * is inside the item's area, such as a detail page under its list.
   */
  current?: NavItemCurrent;
};

export type AppShellNavGroup = {
  id: string;
  /**
   * A small muted caption over the group's destinations that names their
   * list. In the rail it is hidden (still naming the list) and the group
   * starts under a hairline.
   */
  label?: string;
  items: readonly AppShellNavItem[];
};

/** The shell's own words: the menu button's name and the drawer's close. */
export type AppShellLabels = {
  openMenu: string;
  closeMenu: string;
};

export type AppShellProps = {
  /** The navigation landmark's name, also the drawer's. */
  navLabel: string;
  groups: readonly AppShellNavGroup[];
  /**
   * Called for a plain press on a destination (the main button, no
   * modifier key), after the browser's own navigation is prevented, so a
   * client router moves instead. A press with a modifier key, or a middle
   * press, keeps the browser's behaviour. Without it the links navigate.
   */
  onNavigate?: (item: AppShellNavItem) => void;
  /**
   * The sidebar's top, such as a workspace switcher; also the drawer's.
   * It may hold an interactive trigger (an `ActionMenu`, a `ContextSwitcher`):
   * its popup opens on the top layer, so the sidebar and the drawer never
   * clip it.
   * While the drawer is open it is mounted twice (the sidebar's copy is
   * hidden), so each copy keeps its own state: put no fixed DOM `id` in it
   * (use `useId`), and keep state that must be shared in the consumer.
   * The same holds for `footer`, `railHeader` and `railFooter`.
   */
  header?: ReactNode;
  /** The sidebar's bottom, such as the account menu; also the drawer's (see `header`). */
  footer?: ReactNode;
  /**
   * A compact `header` for the rail, such as a workspace switcher drawn as
   * its glyph alone (an icon trigger named by its label). Left out, the
   * rail shows none.
   */
  railHeader?: ReactNode;
  /** A compact `footer` for the rail. Left out, the rail shows none. */
  railFooter?: ReactNode;
  /** The compact top bar's title, below `lg`. */
  barTitle: ReactNode;
  /** Controls at the top bar's end, below `lg`. */
  barEnd?: ReactNode;
  /** The consumer's glyph for the menu button (Scalewing has no icon catalog). */
  menuIcon: ReactNode;
  /**
   * How many things wait behind the menu, such as an inbox: the shared
   * count pill on the menu button's top end corner, below `lg`, read in
   * its name after `labels.openMenu` and a comma ("Open menu, 6"). A whole
   * number; 0 (or none) shows no pill.
   */
  menuCount?: number;
  /**
   * What the menu's count means, in the consumer's words ("6 need you"):
   * read in the name in place of the bare number ("Open menu, 6 need you").
   * Needs `menuCount`.
   */
  menuCountLabel?: string;
  /**
   * The menu pill's colour, NavCount's tones: `danger` (the default),
   * `warning` (amber) for work that needs the person but is not urgent,
   * `accent` for news. Needs `menuCount`.
   */
  menuCountTone?: NavCountTone;
  /**
   * A band at the top of `main` on every layout, such as the page's
   * context pickers and search: the solid surface with a hairline under it
   * and the page's inline padding (space-4 below `lg`, space-6 from it),
   * its children laid out in a wrapping row with space between them. It is
   * sticky: under the compact top bar below `lg`, at the window's top
   * from `lg` up. It scrolls with nothing else; keep it to one row.
   */
  pageBar?: ReactNode;
  labels: AppShellLabels;
  /** The page, rendered in `main`. */
  children: ReactNode;
};
