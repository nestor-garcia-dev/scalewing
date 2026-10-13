import {
  type DenominationGridColumn,
  type DenominationGridLayout,
  type DenominationGridRow,
} from './types.js';

/**
 * Value rows: the strip layout only, a name that is not blank, and one
 * formatted value or null per column.
 */
export function assertDenominationValueRows(
  layout: DenominationGridLayout,
  columns: readonly DenominationGridColumn[],
  rows: readonly DenominationGridRow[],
): void {
  const valueRows = rows.flatMap((row) =>
    row.valueRow == null ? [] : [row.valueRow],
  );
  if (valueRows.length === 0) return;
  if (layout !== 'strip')
    throw new RangeError('value rows need the strip layout');
  for (const valueRow of valueRows) {
    if (typeof valueRow !== 'object')
      throw new RangeError('a value row is an object of label and cells');
    if (typeof valueRow.label !== 'string' || !valueRow.label.trim())
      throw new RangeError('a value row needs a label');
    if (!fitsColumns(valueRow.cells, columns.length))
      throw new RangeError('a value row needs one string or null per column');
  }
}

function fitsColumns(cells: unknown, columnCount: number): boolean {
  if (!Array.isArray(cells) || cells.length !== columnCount) return false;
  // An index loop, not every(): every() skips the holes of a sparse array.
  for (let index = 0; index < columnCount; index += 1) {
    const cell: unknown = cells[index];
    if (cell !== null && typeof cell !== 'string') return false;
  }
  return true;
}
