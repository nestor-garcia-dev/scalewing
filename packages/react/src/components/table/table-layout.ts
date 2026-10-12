import {
  tableColumnWidths,
  type TableColumnWidth,
} from '../../css/css-table-layout.js';

export { tableColumnWidthClass } from '../../css/css-table-layout.js';
export type { TableColumnWidth };

/** How a table sizes its columns: by content, or from the header row only. */
export type TableLayout = 'auto' | 'fixed';

/** Where a cell's content sits in a row taller than it. */
export type TableVerticalAlign = 'middle' | 'top';

/**
 * Whether the header row pins: `true` to the top of the table's own scroll
 * region, `'page'` to the page's top while the table fits its width.
 */
export type TableStickyHeader = boolean | 'page';

export function assertTableStickyHeader(sticky: TableStickyHeader) {
  if (typeof sticky !== 'boolean' && sticky !== 'page')
    throw new RangeError(`Unknown Table stickyHeader: ${String(sticky)}`);
}

export function assertTableLayout(layout: TableLayout) {
  if (layout !== 'auto' && layout !== 'fixed')
    throw new RangeError(`Unknown Table layout: ${String(layout)}`);
}

export function assertTableVerticalAlign(align: TableVerticalAlign) {
  if (align !== 'middle' && align !== 'top')
    throw new RangeError(`Unknown Table verticalAlign: ${String(align)}`);
}

export function assertTableColumnWidth(width: TableColumnWidth | undefined) {
  if (width !== undefined && !tableColumnWidths.includes(width))
    throw new RangeError(`Unknown TableCell width: ${String(width)}`);
}
