import { type SpacingStep } from '@scalewing/tokens';

import { cx } from '../class-names.js';
import { type Breakpoint, breakpoints } from '../css/breakpoints.js';
import {
  type GridColumns,
  gridColumnsBelowClass,
  gridColumnsClass,
  type GridFit,
  gridFitClass,
  gridFits,
} from '../css/css-grid.js';
import { spacingClass } from '../css/spacing-classes.js';
import { assertGridCount } from '../grid-counts.js';
import { isOneOf } from '../is-one-of.js';
import { Box, type BoxProps } from './Box.js';
import { type Align } from './Stack.js';

export { gridFits, type GridColumns, type GridFit };

export type GridProps = BoxProps & {
  /** Where each child sits in the height of its row; unset, children stretch. */
  align?: Align;
  columns?: GridColumns;
  columnsBelow?: Partial<Record<Breakpoint, GridColumns>>;
  /**
   * Fits the columns to the grid's width instead of a fixed count: as many
   * as fit at the named minimum (`narrow` 15rem, `medium` 16.25rem, `wide`
   * 18.75rem), sharing the row, one column when narrower. Not with
   * `columns` or `columnsBelow`; a child's `columnSpan` is ignored in a
   * fitted grid, where every child takes one column.
   */
  fit?: GridFit;
  gap?: SpacingStep;
};

export function Grid({
  align,
  className,
  columns,
  columnsBelow,
  fit,
  gap = 0,
  ...rest
}: GridProps) {
  if (fit !== undefined) {
    if (!isOneOf(gridFits, fit))
      throw new RangeError(`Unknown Grid fit: ${String(fit)}`);
    if (columns !== undefined || columnsBelow !== undefined)
      throw new RangeError(
        'A fitted Grid takes no columns or columnsBelow; fit sets them',
      );
  }
  const fixedColumns = columns ?? 1;
  assertGridCount('columns', fixedColumns);
  const belowClasses = breakpoints.flatMap((breakpoint) => {
    const count = columnsBelow?.[breakpoint];
    if (count === undefined) return [];
    assertGridCount('columnsBelow', count);
    return [gridColumnsBelowClass(breakpoint, count)];
  });

  return (
    <Box
      className={cx(
        'sw-grid',
        fit ? gridFitClass(fit) : gridColumnsClass(fixedColumns),
        ...belowClasses,
        spacingClass('gap', 'all', gap),
        align && `sw-align-${align}`,
        className,
      )}
      {...rest}
    />
  );
}
