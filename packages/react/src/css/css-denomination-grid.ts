import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { badgeTones } from './css-data.js';
import {
  cssDenominationAlignedClasses,
  denominationAlignedClassCatalog,
} from './css-denomination-aligned.js';
import {
  cssDenominationCellToneClasses,
  denominationCellToneClassCatalog,
} from './css-denomination-cell-tones.js';
import {
  pinnedStartShadeRules,
  scrollRegionRules,
} from './css-scroll-region.js';
import { visuallyHiddenDeclarations } from './css-utilities.js';
import { zIndex } from './stacking.js';

const caption = typographyVariants.caption;
const data = typographyVariants.data;
const label = typographyVariants.label;
const title = typographyVariants.title;

function toneRules(): string {
  return badgeTones
    .map(
      (tone) =>
        `.sw-denomination-row-${tone} { --sw-denomination-tone: var(--sw-color-${tone === 'neutral' ? 'muted' : tone}); }`,
    )
    .join('\n');
}

export function cssDenominationGridClasses(): string {
  return `.sw-denomination-grid {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  max-width: 100%;
  min-width: 0;
}

${toneRules()}

${scrollRegionRules('.sw-denomination-scroll')}

${pinnedStartShadeRules('.sw-denomination-scroll', [
  '.sw-denomination-strip .sw-denomination-label',
  '.sw-denomination-strip thead .sw-denomination-corner:first-child',
])}

.sw-denomination-strip {
  border-collapse: collapse;
  width: 100%;
}

.sw-denomination-strip th,
.sw-denomination-strip td {
  padding: var(--sw-space-1) var(--sw-space-2);
  vertical-align: middle;
}

.sw-denomination-strip tbody tr {
  border-top: 1px solid var(--sw-color-border);
}

.sw-denomination-head {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  text-align: end;
}

.sw-denomination-corner {
  padding: 0;
}

.sw-denomination-label {
  border-inline-start: var(--sw-space-1) solid var(--sw-denomination-tone);
  color: var(--sw-denomination-tone);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-width: 0;
  text-align: start;
}

.sw-denomination-tiles .sw-denomination-label,
.sw-denomination-label-body {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2);
}

/*
 * A row label's glyph and words are one line: the line does not wrap, so its
 * narrowest width is the glyph, the gap and the longest word, and a long
 * label wraps its words beside the glyph instead of dropping them under it.
 */
.sw-denomination-label-line {
  align-items: center;
  display: flex;
  gap: var(--sw-space-2);
}

/*
 * The row labels and the header corner above them stay in view while a wide
 * strip scrolls under them, so each column head stays over its counts.
 */
.sw-denomination-strip .sw-denomination-label,
.sw-denomination-strip thead .sw-denomination-corner:first-child {
  background: var(--sw-glass-fill);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  inset-inline-start: 0;
  position: sticky;
  ${zIndex('stickyCell')}
}

/*
 * A collapsed-table border does not travel with a sticky cell in every
 * browser, so the pinned label draws its tone stripe as its own box.
 */
.sw-denomination-strip .sw-denomination-label {
  border-inline-start: 0;
  padding-inline-start: calc(var(--sw-space-2) + var(--sw-space-1));
}

.sw-denomination-strip .sw-denomination-label::before {
  background: var(--sw-denomination-tone);
  content: '';
  inset-block: 0;
  inset-inline-start: 0;
  position: absolute;
  width: var(--sw-space-1);
}

.sw-denomination-icon {
  display: inline-flex;
  flex: none;
}

.sw-denomination-cell {
  color: var(--sw-color-text);
  font-size: ${data.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  letter-spacing: ${data.letterSpacing}px;
  line-height: ${data.lineHeight}px;
  text-align: end;
}

.sw-denomination-cell-zero {
  color: var(--sw-color-muted);
  font-weight: ${data.fontWeight};
  opacity: var(--sw-quiet-opacity);
}

.sw-denomination-row-signed .sw-denomination-cell-positive {
  color: var(--sw-color-success);
}

.sw-denomination-cell-negative {
  color: var(--sw-color-danger);
}

.sw-denomination-total {
  color: var(--sw-denomination-tone);
  font-size: ${data.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  letter-spacing: ${data.letterSpacing}px;
  line-height: ${data.lineHeight}px;
  text-align: end;
  white-space: nowrap;
}

.sw-denomination-total-inline {
  display: none;
  flex-basis: 100%;
  font-size: ${caption.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  line-height: ${caption.lineHeight}px;
}

.sw-denomination-tiles {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-3);
}

.sw-denomination-tiles .sw-denomination-label {
  border-inline-start: 0;
}

.sw-denomination-tiles .sw-denomination-row {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-2);
}

.sw-denomination-tile-list {
  display: grid;
  gap: var(--sw-space-2);
  grid-template-columns: repeat(auto-fit, minmax(var(--sw-space-8), 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}

.sw-denomination-tile {
  align-items: center;
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
  min-width: 0;
  padding: var(--sw-space-3) var(--sw-space-2);
}

.sw-denomination-tile .sw-denomination-head,
.sw-denomination-tile .sw-denomination-cell {
  text-align: center;
}

.sw-denomination-tile .sw-denomination-cell {
  font-size: ${title.fontSize}px;
  letter-spacing: ${title.letterSpacing}px;
  line-height: ${title.lineHeight}px;
}

.sw-denomination-subtotal {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  font-variant-numeric: tabular-nums;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  text-align: center;
}

/*
 * Below md the aria-hidden copy under each row label is what shows; the
 * total cell stays in the table, visually hidden, so a screen reader still
 * reads each total in its row and under its column header.
 */
@media ${breakpointQuery('below', 'md')} {
  .sw-denomination-strip .sw-denomination-total,
  .sw-denomination-strip .sw-denomination-total-head { padding: 0; position: relative; }
  .sw-denomination-total-value,
  .sw-denomination-total-label { ${visuallyHiddenDeclarations} }
  .sw-denomination-total-inline { display: block; }
  .sw-denomination-label-body { flex-direction: column; align-items: flex-start; gap: var(--sw-space-1); }
  .sw-denomination-strip .sw-denomination-label-line { gap: var(--sw-space-1); }
  .sw-denomination-strip th,
  .sw-denomination-strip td { padding: var(--sw-space-1); }
  .sw-denomination-strip .sw-denomination-label { padding-inline-start: calc(var(--sw-space-1) * 2); }
  .sw-denomination-tile-list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

${cssDenominationCellToneClasses()}

${cssDenominationAlignedClasses()}

@media (forced-colors: active) {
  .sw-denomination-label { border-inline-start-color: CanvasText; color: CanvasText; }
  .sw-denomination-strip .sw-denomination-label::before { background: CanvasText; forced-color-adjust: none; }
  .sw-denomination-cell-zero { color: GrayText; opacity: 1; }
  .sw-denomination-cell-negative,
  .sw-denomination-row-signed .sw-denomination-cell-positive,
  .sw-denomination-total { color: CanvasText; }
  .sw-denomination-tile { border-color: CanvasText; }
}`;
}

export function denominationGridClassCatalog(): string[] {
  return [
    'sw-denomination-grid',
    'sw-denomination-scroll',
    ...badgeTones.map((tone) => `sw-denomination-row-${tone}`),
    'sw-denomination-strip',
    'sw-denomination-head',
    'sw-denomination-corner',
    'sw-denomination-row',
    'sw-denomination-row-signed',
    'sw-denomination-label',
    'sw-denomination-label-body',
    'sw-denomination-label-line',
    'sw-denomination-label-text',
    'sw-denomination-icon',
    'sw-denomination-cell',
    'sw-denomination-cell-zero',
    'sw-denomination-cell-positive',
    'sw-denomination-cell-negative',
    'sw-denomination-total',
    'sw-denomination-total-inline',
    'sw-denomination-total-head',
    'sw-denomination-total-label',
    'sw-denomination-total-value',
    'sw-denomination-tiles',
    'sw-denomination-tile-list',
    'sw-denomination-tile',
    'sw-denomination-subtotal',
    ...denominationCellToneClassCatalog(),
    ...denominationAlignedClassCatalog(),
  ];
}
