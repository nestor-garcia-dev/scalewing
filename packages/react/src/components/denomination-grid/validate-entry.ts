import { columnName } from './ColumnHeadText.js';
import {
  type DenominationGridColumn,
  type DenominationGridEntry,
  type DenominationGridLayout,
  type DenominationGridRow,
} from './types.js';

const emphases: readonly unknown[] = ['default', 'quiet'];

/**
 * The parts of a row and column that only label or set a row apart: a
 * caption is never blank, an emphasis is a known one, `disabled` is a
 * boolean, and a quiet or disabled row is a strip row (tiles have no row
 * fill to set apart).
 */
export function assertDenominationExtras(
  layout: DenominationGridLayout,
  columns: readonly DenominationGridColumn[],
  rows: readonly DenominationGridRow[],
): void {
  if (columns.some((column) => isBlank(column.caption)))
    throw new RangeError('a column caption must not be empty');
  if (rows.some((row) => isBlank(row.caption)))
    throw new RangeError('a row caption must not be empty');
  if (
    rows.some(
      (row) => row.emphasis !== undefined && !emphases.includes(row.emphasis),
    )
  )
    throw new RangeError("emphasis must be 'default' or 'quiet'");
  if (
    rows.some(
      (row) => row.disabled !== undefined && typeof row.disabled !== 'boolean',
    )
  )
    throw new RangeError('disabled must be a boolean');
  if (
    layout !== 'strip' &&
    rows.some((row) => row.emphasis === 'quiet' || row.disabled)
  )
    throw new RangeError('quiet and disabled rows need the strip layout');
}

/**
 * Entry rows: the strip layout only, named buttons, counts of zero or more,
 * no signed deltas, one cap and one message (or null) per column with caps
 * that are whole counts of zero or more, and one name per count: every
 * entry row label and every column name (label and caption) is its own.
 */
export function assertDenominationEntries(
  layout: DenominationGridLayout,
  columns: readonly DenominationGridColumn[],
  rows: readonly DenominationGridRow[],
): void {
  const entryRows = rows.filter((row) => row.entry);
  if (entryRows.length === 0) return;
  if (layout !== 'strip')
    throw new RangeError('entry rows need the strip layout');
  if (!allDistinct(entryRows.map((row) => row.label)))
    throw new RangeError('entry rows need distinct labels');
  if (!allDistinct(columns.map(columnName)))
    throw new RangeError(
      'entry rows need columns with distinct labels and captions',
    );
  for (const row of entryRows) {
    if (row.signed) throw new RangeError('an entry row cannot be signed');
    if (row.cells.some((cell) => cell !== null && cell < 0))
      throw new RangeError('an entry row counts zero or more');
    assertEntry(row.entry!, columns.length);
  }
}

function assertEntry(entry: DenominationGridEntry, columnCount: number): void {
  if (typeof entry.onChange !== 'function')
    throw new RangeError('entry needs an onChange');
  if (!entry.decrementLabel.trim() || !entry.incrementLabel.trim())
    throw new RangeError('entry needs decrementLabel and incrementLabel');
  if (!fitsColumns(entry.max, columnCount, isCap))
    throw new RangeError(
      'entry.max needs one whole count of zero or more, or null, per column',
    );
  if (!fitsColumns(entry.errors, columnCount, isMessage))
    throw new RangeError('entry.errors needs one message or null per column');
}

function allDistinct(names: readonly string[]): boolean {
  return new Set(names).size === names.length;
}

function isBlank(text: string | undefined): boolean {
  return text !== undefined && !text.trim();
}

function isCap(cap: unknown): boolean {
  return cap === null || (Number.isSafeInteger(cap) && (cap as number) >= 0);
}

function isMessage(message: unknown): boolean {
  return message === null || typeof message === 'string';
}

function fitsColumns(
  values: readonly unknown[] | undefined,
  columnCount: number,
  fits: (value: unknown) => boolean,
): boolean {
  if (values === undefined) return true;
  if (!Array.isArray(values) || values.length !== columnCount) return false;
  // An index loop, not every(): every() skips the holes of a sparse array.
  for (let index = 0; index < columnCount; index += 1)
    if (!fits(values[index])) return false;
  return true;
}
