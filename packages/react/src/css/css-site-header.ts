import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { quietFill } from './quiet-fill.js';
import { zIndex } from './stacking.js';

const label = typographyVariants.label;
const title = typographyVariants.title;

/** The bar's height: 56 px on a phone, 72 px from `lg`. */
const compactHeight =
  'calc(var(--sw-control-md-min-height) + var(--sw-space-3))';
const wideHeight =
  'calc(var(--sw-control-md-min-height) + var(--sw-space-5) + var(--sw-space-1))';

const wide = breakpointQuery('from', 'lg');

/*
 * The bar: the solid surface with a hairline under it, its content in the
 * page container with the page gutter. Below `lg` it holds the brand, the
 * compact actions and the menu button; from `lg` the brand, the
 * destinations (the current one at label weight over a bar in the words'
 * colour, as tall as the bar) and the actions, spread apart.
 */
function barRules(): string {
  return `.sw-site-header {
  --sw-site-header-height: ${compactHeight};
  background: var(--sw-color-surface);
  border-bottom: 1px solid var(--sw-color-border);
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  position: relative;
}

.sw-site-header-sticky {
  position: sticky;
  top: 0;
  ${zIndex('topChrome')}
}

.sw-site-header-bar {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  gap: var(--sw-space-5);
  justify-content: space-between;
  margin-inline: auto;
  max-width: calc(var(--sw-container-max) + 2 * var(--sw-space-5));
  min-height: var(--sw-site-header-height);
  padding-inline: var(--sw-space-4);
}

.sw-site-header-brand {
  align-items: center;
  display: flex;
  flex: none;
}

.sw-site-header-nav,
.sw-site-header-actions {
  display: none;
}

.sw-site-header-compact {
  align-items: center;
  display: flex;
  gap: var(--sw-space-1);
}

.sw-site-header-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sw-site-header-nav .sw-site-header-list {
  display: flex;
  gap: var(--sw-space-5);
}

[data-theme] .sw-site-header-nav .sw-site-header-link {
  align-items: center;
  color: var(--sw-color-text);
  display: inline-flex;
  font-size: ${label.fontSize}px;
  font-weight: 400;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-height: var(--sw-site-header-height);
  text-decoration: none;
}

[data-theme] .sw-site-header-nav .sw-site-header-link:hover {
  box-shadow: inset 0 -2px 0 var(--sw-color-border);
}

[data-theme] .sw-site-header-nav .sw-site-header-link[aria-current] {
  box-shadow: inset 0 -2px 0 currentColor;
  font-weight: ${label.fontWeight};
}

[data-theme] .sw-site-header-nav .sw-site-header-link:focus-visible {
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-site-header-actions {
  align-items: center;
  gap: var(--sw-space-4);
}

@media ${breakpointQuery('from', 'md')} {
  .sw-site-header-bar { padding-inline: var(--sw-space-5); }
}

@media ${wide} {
  .sw-site-header { --sw-site-header-height: ${wideHeight}; }
  .sw-site-header-nav { display: block; }
  .sw-site-header-actions { display: flex; }
  .sw-site-header-compact { display: none; }
}`;
}

/*
 * The menu is a native \`details\`: its \`summary\` is the button (the menu
 * glyph and its name while closed, the close glyph and its name while
 * open, the other pair hidden so only one is read), and its panel lies
 * under the bar over the rest of the window, the destinations as large
 * rows with hairlines and the menu's actions at the panel's foot. It
 * scrolls on its own when the window is short.
 */
function menuRules(): string {
  return `.sw-site-header-menu > summary {
  list-style: none;
}

.sw-site-header-menu > summary::-webkit-details-marker {
  display: none;
}

.sw-site-header-menu-button {
  align-items: center;
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  color: var(--sw-color-text);
  cursor: pointer;
  display: inline-flex;
  height: var(--sw-control-md-min-height);
  justify-content: center;
  width: var(--sw-control-md-min-height);
}

.sw-site-header-menu-button:hover {
  background: ${quietFill};
}

.sw-site-header-menu-button:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-site-header-menu-open,
.sw-site-header-menu-close,
.sw-site-header-glyph {
  align-items: center;
  display: inline-flex;
}

.sw-site-header-menu[open] .sw-site-header-menu-open,
.sw-site-header-menu:not([open]) .sw-site-header-menu-close {
  display: none;
}

.sw-site-header-panel {
  background: var(--sw-color-surface);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: calc(100dvh - var(--sw-site-header-height) - 1px);
  inset-inline: 0;
  overflow-y: auto;
  padding: var(--sw-space-2) var(--sw-space-4) var(--sw-space-6);
  position: absolute;
  top: calc(100% + 1px);
}

.sw-site-header-menu-nav .sw-site-header-list {
  display: flex;
  flex-direction: column;
}

[data-theme] .sw-site-header-menu-nav .sw-site-header-link {
  align-items: center;
  border-bottom: 1px solid var(--sw-color-border);
  color: var(--sw-color-text);
  display: flex;
  font-size: ${title.fontSize}px;
  font-weight: ${title.fontWeight};
  letter-spacing: ${title.letterSpacing}px;
  line-height: ${title.lineHeight}px;
  min-height: ${compactHeight};
  text-decoration: none;
}

[data-theme] .sw-site-header-menu-nav .sw-site-header-link[aria-current] {
  color: var(--sw-color-accent);
}

[data-theme] .sw-site-header-menu-nav .sw-site-header-link:focus-visible {
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-site-header-menu-actions {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-3);
  margin-top: auto;
  padding-top: var(--sw-space-5);
}`;
}

export function cssSiteHeaderClasses(): string {
  return `${barRules()}

${menuRules()}

/*
 * Forced colours drop box shadows, so the current destination's bar is a
 * thick underline there.
 */
@media (forced-colors: active) {
  .sw-site-header,
  [data-theme] .sw-site-header-menu-nav .sw-site-header-link {
    border-color: CanvasText;
  }

  [data-theme] .sw-site-header-link[aria-current] {
    color: Highlight;
  }

  [data-theme] .sw-site-header-nav .sw-site-header-link[aria-current] {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: var(--sw-space-2);
  }

  .sw-site-header-menu-button {
    border: 1px solid ButtonText;
  }
}`;
}

export function siteHeaderClassCatalog(): string[] {
  return [
    'sw-site-header',
    'sw-site-header-sticky',
    'sw-site-header-bar',
    'sw-site-header-brand',
    'sw-site-header-nav',
    'sw-site-header-actions',
    'sw-site-header-compact',
    'sw-site-header-list',
    'sw-site-header-link',
    'sw-site-header-menu',
    'sw-site-header-menu-button',
    'sw-site-header-menu-open',
    'sw-site-header-menu-close',
    'sw-site-header-glyph',
    'sw-site-header-panel',
    'sw-site-header-menu-nav',
    'sw-site-header-menu-actions',
  ];
}
