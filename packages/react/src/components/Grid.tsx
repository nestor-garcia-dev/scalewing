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
  type GridRail,
  gridRailClass,
  gridRails,
} from '../css/css-grid.js';
import { spacingClass } from '../css/spacing-classes.js';
import { assertGridCount } from '../grid-counts.js';
import { isOneOf } from '../is-one-of.js';
import { Box, type BoxProps } from './Box.js';
import { type Align } from './Stack.js';

export { gridFits, gridRails, type GridColumns, type GridFit, type GridRail };

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
  /**
   * A main column beside a fixed 20rem side rail, the main column taking the
   * free space: the first child is the main column, the second the rail.
   * The value is the breakpoint from which they sit side by side (`md`
   * 48rem, `lg` 64rem); below it they stack, the main column first. Not with
   * `columns`, `columnsBelow` or `fit`; a child's `columnSpan` is ignored.
   */
  rail?: GridRail;
};

/** Fails closed on a layout that asks for two ways to set the columns. */
function assertGridRail({
  columns,
  columnsBelow,
  fit,
  rail,
}: Pick<GridProps, 'columns' | 'columnsBelow' | 'fit' | 'rail'>): void {
  if (rail === undefined) return;
  if (!isOneOf(gridRails, rail))
    throw new RangeError(`Unknown Grid rail: ${String(rail)}`);
  if (columns !== undefined || columnsBelow !== undefined || fit !== undefined)
    throw new RangeError(
      'A rail Grid takes no columns, columnsBelow or fit; rail sets them',
    );
}

/** The classes that set a grid's columns, from the one way it was asked for. */
function columnClasses({
  columns,
  fit,
  rail,
}: Pick<GridProps, 'columns' | 'fit' | 'rail'>): string {
  if (rail) return gridRailClass(rail);
  if (fit) return gridFitClass(fit);
  const fixedColumns = columns ?? 1;
  assertGridCount('columns', fixedColumns);
  return gridColumnsClass(fixedColumns);
}

export function Grid({
  align,
  className,
  columns,
  columnsBelow,
  fit,
  gap = 0,
  rail,
  ...rest
}: GridProps) {
  assertGridRail({ columns, columnsBelow, fit, rail });
  if (fit !== undefined) {
    if (!isOneOf(gridFits, fit))
      throw new RangeError(`Unknown Grid fit: ${String(fit)}`);
    if (columns !== undefined || columnsBelow !== undefined)
      throw new RangeError(
        'A fitted Grid takes no columns or columnsBelow; fit sets them',
      );
  }
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
        columnClasses({ columns, fit, rail }),
        ...belowClasses,
        spacingClass('gap', 'all', gap),
        align && `sw-align-${align}`,
        className,
      )}
      {...rest}
    />
  );
}
