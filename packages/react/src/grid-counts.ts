import { type GridColumns, gridColumnCounts } from './css/css-grid.js';

/** Fails closed on a column count or span outside the bounded catalog. */
export function assertGridCount(
  prop: string,
  value: number,
): asserts value is GridColumns {
  if (!gridColumnCounts.includes(value as GridColumns))
    throw new RangeError(
      `${prop} must be one of ${gridColumnCounts.join(', ')}`,
    );
}
