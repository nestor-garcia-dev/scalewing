import { type ReactNode } from 'react';

import { type NavItemCurrent } from '../nav-items.js';

/** One page in the docs navigation. */
export type DocsLayoutItem = {
  id: string;
  label: string;
  href: string;
  /**
   * `page` (or `true`) for the page shown, `location` for a page inside the
   * item's part of the docs: `aria-current`, as SectionNav marks it.
   */
  current?: NavItemCurrent;
  /** The language of the link's words, when they differ from the page's. */
  lang?: string;
  /** The language of the page it opens. */
  hrefLang?: string;
};

/** A group of pages under a small muted caption, such as "Start here". */
export type DocsLayoutGroup = {
  id: string;
  label: string;
  items: readonly DocsLayoutItem[];
};

/** The layout's words, in the consumer's language. */
export type DocsLayoutLabels = {
  /** The disclosure's words below `lg`, such as "Browse the docs". */
  openNav: string;
};

export type DocsLayoutProps = {
  /** The docs navigation's name, such as "Docs". */
  navLabel: string;
  /** One or more groups of pages; item ids are unique across groups. */
  groups: readonly DocsLayoutGroup[];
  labels: DocsLayoutLabels;
  /**
   * The column at the end on a wide window, such as an "On this page"
   * SectionNav. Not shown below that width, so keep the same links in the
   * article.
   */
  aside?: ReactNode;
  /** The article, in the content column at the reading width. */
  children: ReactNode;
};
