import { type ReactNode } from 'react';

/** One link in a footer group. */
export type SiteFooterLink = {
  id: string;
  label: string;
  href: string;
  /** `true` when the link is the page shown: `aria-current="page"`. */
  current?: boolean;
  /** The language of the link's words, when they differ from the page's. */
  lang?: string;
  /** The language of the page it opens. */
  hrefLang?: string;
};

/** A labelled group of links, drawn as a `nav` named by its label. */
export type SiteFooterGroup = {
  id: string;
  label: string;
  links: readonly SiteFooterLink[];
};

export type SiteFooterProps = {
  /** The site's mark at the top, such as a logo for a dark background. */
  brand: ReactNode;
  /** A line under the brand. */
  tagline?: ReactNode;
  /** One or more groups of links, each a `nav` named by its label. */
  groups: readonly SiteFooterGroup[];
  /** The bottom row's start, such as the copyright. */
  legal?: ReactNode;
  /** The bottom row's end, such as a language switch. */
  end?: ReactNode;
};
