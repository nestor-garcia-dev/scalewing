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
