import { badgeTones } from '../../css/css-data.js';
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
  if (rows.some((row) => !hasValidCellTones(row, columns.length)))
    throw new RangeError(
      'cellTones needs one tone or null per column, from the Badge tones',
    );
}

function hasValidCellTones(
  row: DenominationGridRow,
  columnCount: number,
): boolean {
  const tones: unknown = row.cellTones;
  if (tones === undefined) return true;
  if (!Array.isArray(tones) || tones.length !== columnCount) return false;
  // An index loop, not every(): every() skips the holes of a sparse array.
  for (let index = 0; index < columnCount; index += 1) {
    const tone: unknown = tones[index];
    if (tone !== null && !(badgeTones as readonly unknown[]).includes(tone))
      return false;
  }
  return true;
}
