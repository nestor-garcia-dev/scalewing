import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const label = typographyVariants.label;
const caption = typographyVariants.caption;

/** The font declarations of a typography variant, weight included or not. */
function type(
  variant: (typeof typographyVariants)[keyof typeof typographyVariants],
  weight: number = variant.fontWeight,
): string {
  return `font-size: ${variant.fontSize}px;
  font-weight: ${weight};
  letter-spacing: ${variant.letterSpacing}px;
  line-height: ${variant.lineHeight}px;`;
}

/*
 * The footer sits on the inverse band (`Band tone="inverse"`), which
 * re-scopes the theme's words, muted words and hairline, so these rules
 * read the ordinary variables. Group labels are the band's words at label
 * weight; links are its muted words in label size, no underline (a list
 * of links in a named `nav`), the band's words with an underline on hover
 * and focus, and the current page in the band's words at label weight. The
 * link rules match the band's running-text link rule's specificity and
 * win by coming after it (`cssSiteFooterClasses` follows `cssBandClasses`;
 * a test holds the order).
 * Below `md` the brand spans two columns of groups; from `md` the brand
 * and the groups share one wrapping row, spread apart.
 */
export function cssSiteFooterClasses(): string {
  return `.sw-site-footer-top {
  display: grid;
  gap: var(--sw-space-6) var(--sw-space-5);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.sw-site-footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-3);
  grid-column: 1 / -1;
  max-width: 20rem;
}

.sw-site-footer-brand > :first-child {
  align-self: flex-start;
}

.sw-site-footer-tagline {
  color: var(--sw-color-muted);
  margin: 0;
  ${type(label, 400)}
}

.sw-site-footer-group {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-3);
  min-width: 0;
}

.sw-site-footer-label {
  color: var(--sw-color-text);
  margin: 0;
  ${type(caption, 600)}
}

.sw-site-footer-links {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

[data-theme] .sw-band-inverse a.sw-site-footer-link {
  color: var(--sw-color-muted);
  display: inline-flex;
  ${type(label, 400)}
  overflow-wrap: anywhere;
  text-decoration-color: transparent;
}

[data-theme] .sw-band-inverse a.sw-site-footer-link:is(:hover, :focus-visible) {
  color: var(--sw-color-text);
  text-decoration-color: currentColor;
}

[data-theme] .sw-band-inverse a.sw-site-footer-link[aria-current='page'] {
  color: var(--sw-color-text);
  font-weight: ${label.fontWeight};
}

.sw-site-footer-bottom {
  align-items: center;
  border-top: 1px solid var(--sw-color-border);
  color: var(--sw-color-muted);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-3);
  justify-content: space-between;
  margin-top: var(--sw-space-6);
  padding-top: var(--sw-space-4);
  ${type(caption)}
}

.sw-site-footer-end {
  margin-inline-start: auto;
}

@media ${breakpointQuery('from', 'md')} {
  .sw-site-footer-top {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sw-space-6) var(--sw-space-8);
    justify-content: space-between;
  }
}

@media ${coarsePointerQuery} {
  [data-theme] .sw-band-inverse a.sw-site-footer-link {
    align-items: center;
    min-height: ${touchTarget};
  }

  .sw-site-footer-links {
    gap: 0;
  }
}

@media (forced-colors: active) {
  [data-theme] .sw-band-inverse a.sw-site-footer-link {
    color: LinkText;
  }

  .sw-site-footer-bottom {
    border-top-color: CanvasText;
  }
}`;
}

export function siteFooterClassCatalog(): string[] {
  return [
    'sw-site-footer',
    'sw-site-footer-top',
    'sw-site-footer-brand',
    'sw-site-footer-tagline',
    'sw-site-footer-group',
    'sw-site-footer-label',
    'sw-site-footer-links',
    'sw-site-footer-link',
    'sw-site-footer-bottom',
    'sw-site-footer-legal',
    'sw-site-footer-end',
  ];
}
