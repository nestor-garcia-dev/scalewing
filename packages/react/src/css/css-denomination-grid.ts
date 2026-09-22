import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { badgeTones } from './css-data.js';

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
  align-items: center;
  border-inline-start: var(--sw-space-1) solid var(--sw-denomination-tone);
  color: var(--sw-denomination-tone);
  display: flex;
  flex-wrap: wrap;
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  gap: var(--sw-space-2);
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-width: 0;
  text-align: start;
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

@media ${breakpointQuery('below', 'md')} {
  .sw-denomination-strip .sw-denomination-total { display: none; }
  .sw-denomination-total-inline { display: block; }
  .sw-denomination-strip .sw-denomination-label { flex-direction: column; align-items: flex-start; gap: var(--sw-space-1); }
  .sw-denomination-strip th,
  .sw-denomination-strip td { padding: var(--sw-space-1); }
  .sw-denomination-tile-list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (forced-colors: active) {
  .sw-denomination-label { border-inline-start-color: CanvasText; color: CanvasText; }
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
    ...badgeTones.map((tone) => `sw-denomination-row-${tone}`),
    'sw-denomination-strip',
    'sw-denomination-head',
    'sw-denomination-corner',
    'sw-denomination-row',
    'sw-denomination-row-signed',
    'sw-denomination-label',
    'sw-denomination-label-text',
    'sw-denomination-icon',
    'sw-denomination-cell',
    'sw-denomination-cell-zero',
    'sw-denomination-cell-positive',
    'sw-denomination-cell-negative',
    'sw-denomination-total',
    'sw-denomination-total-inline',
    'sw-denomination-tiles',
    'sw-denomination-tile-list',
    'sw-denomination-tile',
    'sw-denomination-subtotal',
  ];
}
