import type { CSSProperties } from 'react';

import type { TableStickyHeader } from './table-layout.js';

/**
 * A table's bounded height, counted in rows: the table's region is as tall
 * as `rows` single-line body rows plus its header row and, when it has one,
 * its footer row, and the rest of the rows scroll inside the region. Rows
 * taller than one line show fewer at a time.
 */
export type TableMaxHeight = { rows: number };

/**
 * A bounded table pins its header to its own region (`stickyHeader` true,
 * the default); `'page'` and `false` contradict that and throw, as do a
 * value that is not `{ rows }` and a row count that is not a whole number
 * from 1.
 */
export function assertTableMaxHeight(
  maxHeight: TableMaxHeight | undefined,
  stickyHeader: TableStickyHeader,
): void {
  if (maxHeight === undefined) return;
  if (typeof maxHeight !== 'object' || maxHeight === null)
    throw new RangeError(
      `Table maxHeight must be a row count, { rows }: ${String(maxHeight)}`,
    );
  const rows: unknown = maxHeight.rows;
  if (typeof rows !== 'number' || !Number.isInteger(rows) || rows < 1)
    throw new RangeError(
      `Table maxHeight rows must be a whole number from 1: ${String(rows)}`,
    );
  if (stickyHeader !== true)
    throw new RangeError(
      `Table maxHeight pins the header to the table's own region; stickyHeader ${String(stickyHeader)} cannot be used with it`,
    );
}

/** The row count the generated `sw-table-bounded` height reads. */
export function tableMaxHeightStyle(
  maxHeight: TableMaxHeight | undefined,
): CSSProperties | undefined {
  if (maxHeight === undefined) return undefined;
  return { '--sw-table-max-rows': maxHeight.rows } as CSSProperties;
}
