import { typographyVariants } from '@scalewing/tokens';

import { pinnedStartShadeRules } from './css-scroll-region.js';
import { zIndex } from './stacking.js';

const body = typographyVariants.body;
const data = typographyVariants.data;
const label = typographyVariants.label;

/** A grid whose entry counts keep room for `--sw-denomination-count-digits` digits. */
export const denominationCountDigitsClass = 'sw-denomination-count-digits';

const transposed = '.sw-denomination-transposed';

/*
 * A transposed strip, for a phone: a row per denomination under a
 * hairline, each grid row's head on one line (the region scrolls rather
 * than break a head word by word), the denomination column pinned with the
 * strip's start shade,
 * its label in the text colour at label size, then each grid row's counts
 * (end-aligned, centred over steppers as in the strip) and its value line on
 * the subtle fill, centred; the totals in a last row in each row's tone. A
 * quiet grid row's heads and cells take the subtle fill; a disabled one's
 * heads, read-only counts (toned ones too), values and total fade, its
 * steppers disabled by the Stepper.
 */
function transposedRules(): string {
  return `${transposed} {
  border-collapse: collapse;
  width: 100%;
}

${transposed} th,
${transposed} td {
  padding: var(--sw-space-1) var(--sw-space-2);
  vertical-align: middle;
}

${transposed} tbody tr,
${transposed} tfoot tr {
  border-top: 1px solid var(--sw-color-border);
}

${transposed} .sw-denomination-transposed-head {
  vertical-align: bottom;
  white-space: nowrap;
}

${transposed} .sw-denomination-label-line {
  justify-content: flex-end;
}

.sw-denomination-transposed-label {
  color: var(--sw-color-text);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  text-align: start;
  white-space: nowrap;
}

${transposed} td.sw-denomination-entry {
  padding: var(--sw-space-1);
}

.sw-denomination-transposed-entry .sw-denomination-transposed-head,
.sw-denomination-transposed-entry .sw-denomination-cell {
  text-align: center;
}

.sw-denomination-transposed-entry .sw-denomination-label-line {
  justify-content: center;
}

.sw-denomination-transposed-value {
  background: var(--sw-color-subtle);
  font-size: ${label.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: ${data.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  text-align: center;
  white-space: nowrap;
}

.sw-denomination-transposed-total {
  color: var(--sw-denomination-tone);
  font-size: ${data.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  letter-spacing: ${data.letterSpacing}px;
  line-height: ${data.lineHeight}px;
  text-align: end;
  white-space: nowrap;
}

.sw-denomination-transposed-entry .sw-denomination-transposed-total {
  text-align: center;
}

/* The denomination column and its corner stay in view, as the strip's labels do. */
${transposed} .sw-denomination-transposed-label,
${transposed} :is(thead, tfoot) .sw-denomination-corner:first-child {
  background: var(--sw-glass-fill);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  inset-inline-start: 0;
  position: sticky;
  ${zIndex('stickyCell')}
}

${pinnedStartShadeRules('.sw-denomination-scroll-transposed', [
  '.sw-denomination-transposed-label',
])}

.sw-denomination-transposed-quiet {
  background: var(--sw-color-subtle);
}

/* Over a toned count's full strength (three classes, emitted later). */
.sw-denomination-grid${transposed} .sw-denomination-transposed-disabled:is(.sw-denomination-cell, .sw-denomination-transposed-value, .sw-denomination-transposed-total, .sw-denomination-transposed-head) {
  opacity: var(--sw-disabled-opacity);
}

@media (forced-colors: active) {
  .sw-denomination-transposed-value,
  .sw-denomination-transposed-quiet { background: Canvas; }
  .sw-denomination-transposed-label,
  .sw-denomination-transposed-value,
  .sw-denomination-transposed-total { color: CanvasText; }
}`;
}

/*
 * The count's last options. A signed count's success colour reads from the
 * cell too, so a transposed column (no row element) keeps it; a plain
 * negative count is the text colour (cash out by design, never red). An
 * entry count with room for more digits sets its track in the input's own
 * type, so a digit's width (1ch) there is the input's, and keeps that many
 * digits, its padding and its two hairlines before the strip scrolls.
 */
function countRules(): string {
  return `.sw-denomination-cell-signed.sw-denomination-cell-positive {
  color: var(--sw-color-success);
}

.sw-denomination-cell-negative.sw-denomination-cell-plain {
  color: var(--sw-color-text);
}

.${denominationCountDigitsClass} .sw-denomination-entry .sw-stepper-full .sw-stepper-track {
  font-size: ${body.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: ${label.fontWeight};
  grid-template-columns: var(--sw-space-6) minmax(calc(var(--sw-denomination-count-digits) * 1ch + 2 * var(--sw-space-1) + 2px), 1fr) var(--sw-space-6);
}

@media (forced-colors: active) {
  .sw-denomination-cell-signed.sw-denomination-cell-positive,
  .sw-denomination-cell-negative.sw-denomination-cell-plain { color: CanvasText; }
}`;
}

export function cssDenominationTransposedClasses(): string {
  return `${transposedRules()}

${countRules()}`;
}

export function denominationTransposedClassCatalog(): string[] {
  return [
    'sw-denomination-transposed',
    'sw-denomination-transposed-entry',
    'sw-denomination-scroll-transposed',
    'sw-denomination-transposed-head',
    'sw-denomination-transposed-label',
    'sw-denomination-transposed-value',
    'sw-denomination-transposed-total',
    'sw-denomination-transposed-quiet',
    'sw-denomination-transposed-disabled',
    'sw-denomination-cell-signed',
    'sw-denomination-cell-plain',
    denominationCountDigitsClass,
  ];
}
