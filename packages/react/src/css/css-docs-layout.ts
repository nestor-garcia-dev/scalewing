import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { chevronStroke } from './chevron.js';
import { cssDocsLayoutNavRules } from './css-docs-layout-nav.js';
import { quietFill } from './quiet-fill.js';
import {
  siteHeaderBarMaxWidth,
  siteHeaderGutter,
  siteHeaderGutterQuery,
  siteHeaderWideHeight,
} from './site-header-geometry.js';

const label = typographyVariants.label;

/** From `lg` the navigation is a side column. */
const fromLg = breakpointQuery('from', 'lg');

/*
 * The width from which the `aside` column shows: an internal media query
 * of the component (as AppShell's 75rem), not a public breakpoint.
 */
const docsLayoutWideQuery = '(min-width: 80rem)';

/* The side column's and the aside column's widths, geometry of this frame. */
const sideWidth = '15rem';
const asideWidth = '13rem';

/*
 * The frame: centred at the site header bar's width with its gutters, so
 * the navigation's start lines up with the brand. Below \`lg\` one column;
 * from \`lg\` the side navigation and the content (its article at most the
 * reading width); from 80rem, when an aside is given, a third column at
 * the end. The side and aside columns stick below the window's top, below a
 * sticky SiteHeader's wide bar and hairline when one is on the page
 * (\`html:has(.sw-site-header-sticky)\`, as its scroll padding does), and
 * scroll themselves only when taller than the window.
 */
function frameRules(): string {
  return `.sw-docs-layout {
  --sw-docs-layout-top: var(--sw-space-5);
  box-sizing: border-box;
  margin-inline: auto;
  max-width: ${siteHeaderBarMaxWidth};
  padding-block: var(--sw-space-5);
  padding-inline: ${siteHeaderGutter.compact};
  width: 100%;
}

html:has(.sw-site-header-sticky) .sw-docs-layout {
  --sw-docs-layout-top: calc(${siteHeaderWideHeight} + 1px + var(--sw-space-5));
}

.sw-docs-layout-content {
  min-width: 0;
}

.sw-docs-layout-body {
  max-width: var(--sw-reading-max);
}

.sw-docs-layout-side,
.sw-docs-layout-aside {
  display: none;
}

@media ${siteHeaderGutterQuery} {
  .sw-docs-layout { padding-inline: ${siteHeaderGutter.wide}; }
}

@media ${fromLg} {
  .sw-docs-layout {
    align-items: start;
    column-gap: var(--sw-space-8);
    display: grid;
    grid-template-columns: ${sideWidth} minmax(0, 1fr);
    padding-block: var(--sw-space-6);
  }

  .sw-docs-layout-side {
    display: block;
  }

  .sw-docs-layout-side,
  .sw-docs-layout-aside {
    box-sizing: border-box;
    max-height: calc(100dvh - var(--sw-docs-layout-top) - var(--sw-space-5));
    overflow-y: auto;
    overscroll-behavior: contain;
    position: sticky;
    top: var(--sw-docs-layout-top);
  }

  .sw-docs-layout-disclosure {
    display: none;
  }
}

@media ${docsLayoutWideQuery} {
  .sw-docs-layout-with-aside {
    column-gap: var(--sw-space-6);
    grid-template-columns: ${sideWidth} minmax(0, 1fr) ${asideWidth};
  }

  .sw-docs-layout-aside {
    display: block;
  }
}`;
}

/*
 * Below \`lg\` the navigation is a native \`details\` at the top of the
 * content: its \`summary\` a full-width row on the surface with a hairline,
 * the consumer's words at the start and a chevron at the end (down while
 * closed, up while open), at least the md control tall. Opening it shows
 * the navigation's large rows under it in the page flow.
 */
function disclosureRules(): string {
  return `.sw-docs-layout-disclosure {
  margin-bottom: var(--sw-space-5);
}

.sw-docs-layout-summary {
  align-items: center;
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-md);
  box-sizing: border-box;
  color: var(--sw-color-text);
  cursor: pointer;
  display: flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  gap: var(--sw-space-3);
  justify-content: space-between;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  list-style: none;
  min-height: var(--sw-control-md-min-height);
  padding: var(--sw-space-2) var(--sw-space-4);
}

.sw-docs-layout-summary::-webkit-details-marker {
  display: none;
}

.sw-docs-layout-summary:hover {
  background: ${quietFill};
}

.sw-docs-layout-summary:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-docs-layout-marker {
  ${chevronStroke}
  flex: none;
  margin-block-end: var(--sw-space-1);
  transform: rotate(45deg);
  transition: transform var(--sw-motion-default) var(--sw-motion-easing);
}

.sw-docs-layout-disclosure[open] .sw-docs-layout-marker {
  margin-block: var(--sw-space-1) 0;
  transform: rotate(-135deg);
}

@media (prefers-reduced-motion: reduce) {
  .sw-docs-layout-marker { transition: none; }
}

@media (forced-colors: active) {
  .sw-docs-layout-summary { border-color: ButtonText; }
  .sw-docs-layout-marker { border-color: CanvasText; }
}`;
}

export function cssDocsLayoutClasses(): string {
  return `${frameRules()}

${disclosureRules()}

${cssDocsLayoutNavRules()}`;
}

export function docsLayoutClassCatalog(): string[] {
  return [
    'sw-docs-layout',
    'sw-docs-layout-with-aside',
    'sw-docs-layout-side',
    'sw-docs-layout-content',
    'sw-docs-layout-body',
    'sw-docs-layout-aside',
    'sw-docs-layout-disclosure',
    'sw-docs-layout-summary',
    'sw-docs-layout-summary-label',
    'sw-docs-layout-marker',
    'sw-docs-layout-nav',
    'sw-docs-layout-nav-compact',
    'sw-docs-layout-group',
    'sw-docs-layout-group-label',
    'sw-docs-layout-list',
    'sw-docs-layout-link',
  ];
}
