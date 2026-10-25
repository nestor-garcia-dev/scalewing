import { typographyVariants } from '@scalewing/tokens';

import { scrollRegionRules } from './css-scroll-region.js';
import { tableCellPadding, tableRuleWidth } from './css-table-metrics.js';
import {
  cssTableBoundedClasses,
  tableBoundedClassCatalog,
} from './css-table-bounded.js';
import {
  cssTableLayoutClasses,
  tableLayoutClassCatalog,
} from './css-table-layout.js';
import {
  cssTableLedgerClasses,
  tableLedgerClassCatalog,
} from './css-table-ledger.js';
import {
  cssTableFooterClasses,
  tableFooterClassCatalog,
} from './css-table-footer.js';
import {
  cssTablePagePinClasses,
  tablePagePinClassCatalog,
} from './css-table-page-pin.js';
import {
  cssTableTotalRowClasses,
  tableTotalRowClassCatalog,
} from './css-table-total-row.js';
import {
  cssTableSelectClasses,
  tableSelectClassCatalog,
} from './css-table-select.js';
import {
  cssTablePressClasses,
  tablePressClassCatalog,
} from './css-table-press.js';
import {
  cssTableStickyHeaderClasses,
  tableStickyHeaderClassCatalog,
} from './css-table-sticky-header.js';
import {
  cssTableSortClasses,
  tableSortClassCatalog,
} from './css-table-sort.js';

const caption = typographyVariants.caption;
const comfortable = tableCellPadding.comfortable;
const compact = tableCellPadding.compact;

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
  border-bottom: ${tableRuleWidth} solid var(--sw-color-border);
  padding: ${comfortable.block} ${comfortable.inline};
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

${cssTableStickyHeaderClasses()}

.sw-table-compact th,
.sw-table-compact td {
  padding: ${compact.block} ${compact.inline};
}

${cssTableLayoutClasses()}

${cssTableSortClasses()}

${cssTableLedgerClasses()}

${cssTableTotalRowClasses()}

${cssTableFooterClasses()}

${cssTablePagePinClasses()}

${cssTableBoundedClasses()}

${cssTablePressClasses()}

${cssTableSelectClasses()}

${selectedRowRules()}`;
}

export function tableClassCatalog(): string[] {
  return [
    'sw-table-wrap',
    'sw-table',
    'sw-table-end',
    'sw-table-numeric',
    'sw-table-clip',
    ...tableStickyHeaderClassCatalog(),
    'sw-table-compact',
    'sw-table-row-selected',
    ...tableLayoutClassCatalog(),
    ...tableSortClassCatalog(),
    ...tableLedgerClassCatalog(),
    ...tableTotalRowClassCatalog(),
    ...tableFooterClassCatalog(),
    ...tablePagePinClassCatalog(),
    ...tableBoundedClassCatalog(),
    ...tablePressClassCatalog(),
    ...tableSelectClassCatalog(),
  ];
}
