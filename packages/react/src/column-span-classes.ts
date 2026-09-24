import { type GridColumnSpan, gridSpanClass } from './css/css-grid-span.js';
import { assertGridCount } from './grid-counts.js';

export type ColumnSpanProps = {
  /**
   * Columns this box spans when it is a direct child of a `Grid`, capped at
   * the grid's column count at the current width.
   */
  columnSpan?: GridColumnSpan;
};

export function columnSpanClassNames({
  columnSpan,
}: ColumnSpanProps): string[] {
  if (columnSpan === undefined) return [];
  assertGridCount('columnSpan', columnSpan);
  return [gridSpanClass(columnSpan)];
}
