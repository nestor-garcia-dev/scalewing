import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { rangeBand, rangeBandHover } from './range-band.js';
import {
  cssDateRangePresetsClasses,
  dateRangePresetsClassCatalog,
} from './css-date-range-presets.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const label = typographyVariants.label;
const caption = typographyVariants.caption;

/* The steps and days are one square control wide, as in DateField's calendar. */
const square = 'var(--sw-control-md-min-height)';

/* A day between a picked range's ends: selected, but drawn as the band. */
const between =
  ".sw-date-range-months .sw-date-field-day-in-range[aria-selected='true']:not(.sw-date-field-day-range-start, .sw-date-field-day-range-end)";

function buttonRules(): string {
  return `.sw-date-range-button {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.sw-date-range-button:not(.sw-button-md) .sw-date-field-glyph {
  height: var(--sw-space-4);
  width: var(--sw-space-4);
}

@media ${coarsePointerQuery} {
  .sw-button.sw-date-range-button,
  .sw-date-range-actions > .sw-button { min-height: ${touchTarget}; }
}`;
}

/*
 * The popover is DateField's calendar surface with no padding of its own:
 * the presets, then the months, then a footer under a hairline. Below
 * `lg` the presets sit above the months; from `lg` beside them.
 */
function popoverRules(): string {
  return `.sw-date-field-calendar.sw-date-range-popover {
  gap: 0;
  padding: 0;
}

.sw-date-range-body {
  display: flex;
  flex-direction: column;
}

@media ${breakpointQuery('from', 'lg')} {
  .sw-date-range-body { flex-direction: row; }
}

.sw-date-range-footer {
  align-items: center;
  border-top: 1px solid var(--sw-color-border);
  contain: inline-size;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2) var(--sw-space-4);
  padding: var(--sw-space-3);
}

.sw-date-range-summary {
  color: var(--sw-color-muted);
  flex: 1 1 auto;
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
  min-width: 0;
}

.sw-date-range-status { display: inline; }

.sw-date-range-line {
  color: var(--sw-color-text);
  display: block;
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  line-height: ${label.lineHeight}px;
}

.sw-date-range-actions {
  display: flex;
  gap: var(--sw-space-2);
  margin-inline-start: auto;
}`;
}

function monthRules(): string {
  return `.sw-date-range-months {
  display: flex;
  gap: var(--sw-space-5);
  justify-content: center;
  padding: var(--sw-space-3);
}

.sw-date-range-month {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
}

.sw-date-range-month-header {
  align-items: center;
  display: grid;
  grid-template-columns: ${square} 1fr ${square};
  min-height: ${square};
}

.sw-date-range-month-title {
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  grid-column: 2;
  line-height: ${label.lineHeight}px;
  text-align: center;
}

${between} {
  background: ${rangeBand};
  border-color: transparent;
  border-radius: 0;
  color: var(--sw-color-text);
  font-weight: inherit;
}

${between}:hover:not([aria-disabled='true']) { background: ${rangeBandHover}; }

${between}[aria-current='date'] { border-color: var(--sw-color-accent); }`;
}

/*
 * Below \`md\` the range is a Dialog bottom sheet: the presets in a
 * scrolling row, one month, and a footer with the hint over Cancel and
 * Apply, the primary twice as wide.
 */
function sheetRules(): string {
  return `.sw-date-range-sheet .sw-date-range-months { padding: 0; }

.sw-date-range-sheet .sw-dialog-footer-actions {
  flex: 1 1 100%;
  margin-inline-start: 0;
}

.sw-date-range-sheet-footer {
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  gap: var(--sw-space-2);
}

.sw-date-range-sheet-footer .sw-date-range-hint {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

.sw-date-range-sheet-footer .sw-date-range-actions {
  display: grid;
  grid-template-columns: 1fr 2fr;
  margin-inline-start: 0;
}`;
}

function forcedColorRules(): string {
  return `@media (forced-colors: active) {
  .sw-date-range-footer { border-top-color: CanvasText; }
  ${between},
  ${between}:hover:not([aria-disabled='true']) {
    background: Mark;
    color: MarkText;
    forced-color-adjust: none;
  }
}`;
}

export function cssDateRangeClasses(): string {
  return [
    buttonRules(),
    popoverRules(),
    monthRules(),
    sheetRules(),
    cssDateRangePresetsClasses(),
    forcedColorRules(),
  ].join('\n\n');
}

export function dateRangeClassCatalog(): string[] {
  return [
    'sw-date-range-button',
    'sw-date-range-popover',
    'sw-date-range-body',
    'sw-date-range-months',
    'sw-date-range-month',
    'sw-date-range-month-header',
    'sw-date-range-month-title',
    'sw-date-range-footer',
    'sw-date-range-summary',
    'sw-date-range-status',
    'sw-date-range-line',
    'sw-date-range-count',
    'sw-date-range-separator',
    'sw-date-range-hint',
    'sw-date-range-actions',
    'sw-date-range-sheet',
    'sw-date-range-sheet-footer',
    ...dateRangePresetsClassCatalog(),
  ];
}
