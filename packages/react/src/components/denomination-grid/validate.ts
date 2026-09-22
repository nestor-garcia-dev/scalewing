import { isDenominationCount } from '../../denomination-cells.js';
import {
  type DenominationGridColumn,
  type DenominationGridRow,
} from './types.js';

export function assertDenominationGrid(
  label: string,
  columns: readonly DenominationGridColumn[],
  rows: readonly DenominationGridRow[],
): void {
  if (!label.trim()) throw new RangeError('label must not be empty');
  if (
    columns.length === 0 ||
    columns.some((column) => !column.key.trim() || !column.label.trim())
  )
    throw new RangeError('columns must have nonempty keys and labels');
  if (new Set(columns.map((column) => column.key)).size !== columns.length)
    throw new RangeError('columns must have unique keys');
  if (rows.some((row) => !row.id.trim() || !row.label.trim()))
    throw new RangeError('rows must have nonempty ids and labels');
  if (new Set(rows.map((row) => row.id)).size !== rows.length)
    throw new RangeError('rows must have unique ids');
  if (rows.some((row) => row.cells.length !== columns.length))
    throw new RangeError('each row needs one cell per column');
  if (rows.some((row) => row.cells.some((cell) => !isDenominationCount(cell))))
    throw new RangeError('cells must be integers or null');
}
