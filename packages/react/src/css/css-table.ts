import { typographyVariants } from '@scalewing/tokens';

import { scrollRegionRules } from './css-scroll-region.js';
import {
  cssTableLayoutClasses,
  tableLayoutClassCatalog,
} from './css-table-layout.js';
import {
  cssTableSortClasses,
  tableSortClassCatalog,
} from './css-table-sort.js';
import { zIndex } from './stacking.js';

const caption = typographyVariants.caption;

/*
 * A selected row is marked by an accent bar at its inline start and nothing
 * else: no fill, so text, muted text and accent text (ghost buttons, links)
 * keep the contrast they have on the table's own surface. (A subtle tint
 * dropped accent text under 4.5:1 in several palettes.) The bar is the first
 * cell's ::before, absolutely placed in the cell's own padding, so it takes
 * no layout space and no column moves when a row is picked. It is a border,
 * not a fill, so forced colors keep it, drawn in the system highlight.
 */
function selectedRowRules(): string {
  return `.sw-table-row-selected > :first-child {
  position: relative;
}

.sw-table-row-selected > :first-child::before {
  border-inline-start: var(--sw-space-1) solid var(--sw-color-accent);
  content: '';
  inset-block: 0;
  inset-inline-start: 0;
  pointer-events: none;
  position: absolute;
}

@media (forced-colors: active) {
  .sw-table-row-selected > :first-child::before { border-color: Highlight; }
}`;
}

export function cssTableClasses(): string {
  return `${scrollRegionRules('.sw-table-wrap')}

.sw-table {
  border-collapse: collapse;
  width: 100%;
}

.sw-table th,
.sw-table td {
  border-bottom: 1px solid var(--sw-color-border);
  padding: var(--sw-space-2) var(--sw-space-3);
  text-align: start;
  vertical-align: middle;
}

.sw-table th {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

/* Descendant form outranks .sw-table th / .sw-table td, which set text-align: start. */
.sw-table .sw-table-end {
  text-align: end;
}

.sw-table .sw-table-numeric {
  font-variant-numeric: tabular-nums;
  text-align: end;
}

.sw-table-clip {
  max-width: 0;
  overflow: hidden;
}

.sw-table-sticky thead th {
  background: var(--sw-glass-fill);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  position: sticky;
  top: 0;
  ${zIndex('stickyCell')}
}

.sw-table-compact th,
.sw-table-compact td {
  padding: var(--sw-space-1) var(--sw-space-2);
}

${cssTableLayoutClasses()}

${cssTableSortClasses()}

${selectedRowRules()}`;
}

export function tableClassCatalog(): string[] {
  return [
    'sw-table-wrap',
    'sw-table',
    'sw-table-end',
    'sw-table-numeric',
    'sw-table-clip',
    'sw-table-sticky',
    'sw-table-compact',
    'sw-table-row-selected',
    ...tableLayoutClassCatalog(),
    ...tableSortClassCatalog(),
  ];
}
