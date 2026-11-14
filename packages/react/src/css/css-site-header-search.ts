import { typographyVariants } from '@scalewing/tokens';

import { quietFill } from './quiet-fill.js';
import {
  siteHeaderCompactHeight as compactHeight,
  siteHeaderGutter,
  siteHeaderWideQuery as wide,
} from './site-header-geometry.js';
import { zIndex } from './stacking.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const body = typographyVariants.body;
const caption = typographyVariants.caption;
const label = typographyVariants.label;

const search = '.sw-site-header-search';
const results = '.sw-site-header-search-results';
const result = '[data-theme] .sw-site-header-search-result';

/*
 * The field's width in the bar from `lg`: it starts at its 10rem floor and
 * grows into the bar's spare room up to 16rem, so the destinations and the
 * actions keep their words on one line. While the bar has less room than
 * they need beside a 16rem field the field gives it up first; only once it
 * is at its floor (the bar is then short of room in any case) do the
 * destinations and the actions shrink and their words wrap. A field that
 * shrank by `flex-shrink` alone would still take a sliver from them, enough
 * to wrap a label.
 */
function wideSearchSize(indent: string): string {
  return ['flex: 1 1 10rem;', 'max-width: 16rem;', 'min-width: 10rem;'].join(
    `\n${indent}`,
  );
}

/*
 * Below `lg`: a round quiet search button in the bar, before the compact
 * actions, and the search itself a native popover over the whole window
 * (the browser's top layer): a bar the compact header's height holding the
 * filled field and a close button, the results under it scrolling on their
 * own, each a row with a hairline. The field's words are the body size, so
 * an iPhone does not zoom into it.
 */
function compactRules(): string {
  return `.sw-site-header-search-button,
.sw-site-header-search-close {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  color: var(--sw-color-text);
  cursor: pointer;
  display: inline-flex;
  flex: none;
  height: var(--sw-control-md-min-height);
  justify-content: center;
  margin: 0;
  padding: 0;
  width: var(--sw-control-md-min-height);
}

.sw-site-header-search-button {
  margin-inline-start: auto;
  margin-inline-end: calc(-1 * var(--sw-space-4));
}

.sw-site-header-search-button:hover,
.sw-site-header-search-close:hover {
  background: ${quietFill};
}

/*
 * The Cancel word in place of the close glyph: the accent's words, as
 * clickable words read, at label size on the same 44 px height, as wide as
 * the word (never narrower than the glyph's button). It follows the
 * close button's rule so its width, padding and colour win over it.
 */
.sw-site-header-search-cancel {
  color: var(--sw-color-accent);
  font-family: inherit;
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  padding-inline: var(--sw-space-2);
  min-width: var(--sw-control-md-min-height);
  white-space: nowrap;
  width: auto;
}

.sw-site-header-search-button:focus-visible,
.sw-site-header-search-close:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-site-header-bar:has(.sw-site-header-menu[open]) > .sw-site-header-search-button {
  display: none;
}

/*
 * With no popover support the closed search would show in the bar below
 * \`lg\`, so only the field from \`lg\` is drawn there.
 */
@supports not selector(:popover-open) {
  .sw-site-header-search-button,
  ${search} {
    display: none;
  }

  @media ${wide} {
    ${search} {
      display: block;
      ${wideSearchSize('      ')}
      margin-inline: auto 0;
      position: relative;
    }
  }
}

${search}:popover-open {
  background: var(--sw-color-surface);
  border: 0;
  box-sizing: border-box;
  color: var(--sw-color-text);
  display: flex;
  flex-direction: column;
  font-family: var(--sw-font-sans);
  height: 100dvh;
  inset: 0;
  margin: 0;
  max-height: none;
  max-width: none;
  overflow: hidden;
  padding: env(safe-area-inset-top, 0px) 0 0;
  width: 100%;
}

.sw-site-header-search-form {
  align-items: center;
  border-bottom: 1px solid var(--sw-color-border);
  box-sizing: border-box;
  display: flex;
  flex: none;
  gap: var(--sw-space-2);
  margin: 0;
  min-height: ${compactHeight};
  padding-inline: ${siteHeaderGutter.compact} var(--sw-space-2);
}

.sw-site-header-search-field {
  align-items: center;
  background: ${quietFill};
  border: 1px solid transparent;
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  color: var(--sw-color-muted);
  display: flex;
  flex: 1 1 auto;
  gap: var(--sw-space-2);
  min-height: var(--sw-control-md-min-height);
  min-width: 0;
  padding-inline: var(--sw-space-3);
}

.sw-site-header-search-field:focus-within {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-site-header-search-icon {
  display: inline-flex;
  flex: none;
}

[data-theme] input.sw-site-header-search-input {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--sw-color-text);
  flex: 1 1 auto;
  font-family: inherit;
  font-size: ${body.fontSize}px;
  line-height: ${body.lineHeight}px;
  margin: 0;
  min-width: 0;
  outline: none;
  padding: 0;
}

[data-theme] input.sw-site-header-search-input:focus-visible {
  outline: none;
}

[data-theme] input.sw-site-header-search-input::placeholder {
  color: var(--sw-color-muted);
  opacity: 1;
}

${results}:not([hidden]) {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  padding: var(--sw-space-2) ${siteHeaderGutter.compact} var(--sw-space-6);
}

.sw-site-header-search-status {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
  margin: 0;
  padding-block: var(--sw-space-2);
}

.sw-site-header-search-status:empty {
  padding: 0;
}

.sw-site-header-search-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

${result} {
  border-bottom: 1px solid var(--sw-color-border);
  color: var(--sw-color-text);
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
  min-height: ${touchTarget};
  padding-block: var(--sw-space-3);
  text-decoration: none;
}

${result}:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-site-header-search-result-title {
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
}

.sw-site-header-search-result-text {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}`;
}

/*
 * From \`lg\`: the popover is laid out in the bar as a plain box, after the
 * destinations and before the actions, pushed to the end with them; the
 * buttons are gone, and the field is an sm pill with a hairline. The
 * results drop down under the field's end as a raised panel over the page,
 * each a row that takes the quiet fill on hover.
 */
function wideRules(): string {
  return `@media ${wide} {
  .sw-site-header-search-button,
  .sw-site-header-search-close {
    display: none;
  }

  ${search}[popover]:not(:popover-open) {
    background: transparent;
    border: 0;
    color: inherit;
    display: block;
    ${wideSearchSize('    ')}
    height: auto;
    inset: auto;
    margin-inline: auto 0;
    max-height: none;
    overflow: visible;
    padding: 0;
    position: relative;
    width: auto;
  }

  .sw-site-header-search-form {
    border: 0;
    min-height: 0;
    padding: 0;
  }

  .sw-site-header-search-field {
    background: var(--sw-color-surface);
    border-color: var(--sw-color-border);
    min-height: var(--sw-control-sm-min-height);
  }

  [data-theme] input.sw-site-header-search-input {
    font-size: ${label.fontSize}px;
    line-height: ${label.lineHeight}px;
  }

  ${results}:not([hidden]) {
    background: var(--sw-color-surface);
    border: 1px solid var(--sw-color-border);
    border-radius: var(--sw-radius-lg);
    box-shadow: var(--sw-elevation-md);
    inset-inline-end: 0;
    max-height: min(70vh, 32rem);
    padding: var(--sw-space-2);
    position: absolute;
    top: calc(100% + var(--sw-space-2));
    width: min(28rem, calc(100vw - 2 * ${siteHeaderGutter.wide}));
    ${zIndex('popup')}
  }

  .sw-site-header-search-status {
    padding-inline: var(--sw-space-3);
  }

  ${result} {
    border: 0;
    border-radius: var(--sw-radius-md);
    min-height: 0;
    padding: var(--sw-space-2) var(--sw-space-3);
  }

  ${result}:hover {
    background: ${quietFill};
  }
}

@media ${wide} and ${coarsePointerQuery} {
  .sw-site-header-search-field { min-height: ${touchTarget}; }
}`;
}

export function cssSiteHeaderSearchRules(): string {
  return `${compactRules()}

${wideRules()}

@media (forced-colors: active) {
  .sw-site-header-search-field,
  ${results}:not([hidden]) {
    border: 1px solid CanvasText;
  }

  .sw-site-header-search-button,
  .sw-site-header-search-close {
    border: 1px solid ButtonText;
  }

  .sw-site-header-search-cancel { color: ButtonText; }

  ${result} { color: LinkText; }
}`;
}

export function siteHeaderSearchClassCatalog(): string[] {
  return [
    'sw-site-header-search-button',
    'sw-site-header-search',
    'sw-site-header-search-form',
    'sw-site-header-search-field',
    'sw-site-header-search-icon',
    'sw-site-header-search-input',
    'sw-site-header-search-close',
    'sw-site-header-search-cancel',
    'sw-site-header-search-results',
    'sw-site-header-search-status',
    'sw-site-header-search-list',
    'sw-site-header-search-row',
    'sw-site-header-search-result',
    'sw-site-header-search-result-title',
    'sw-site-header-search-result-text',
  ];
}
