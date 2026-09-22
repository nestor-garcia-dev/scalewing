import { type SpacingStep } from '@scalewing/tokens';

import { cx } from '../class-names.js';
import { type Breakpoint, breakpoints } from '../css/breakpoints.js';
import {
  type GridColumns,
  gridColumnCounts,
  gridColumnsBelowClass,
  gridColumnsClass,
} from '../css/css-grid.js';
import { spacingClass } from '../css/spacing-classes.js';
import { Box, type BoxProps } from './Box.js';

export type { GridColumns };

export type GridProps = BoxProps & {
  columns?: GridColumns;
  columnsBelow?: Partial<Record<Breakpoint, GridColumns>>;
  gap?: SpacingStep;
};

function assertColumns(columns: number): asserts columns is GridColumns {
  if (!gridColumnCounts.includes(columns as GridColumns))
    throw new RangeError(
      `columns must be one of ${gridColumnCounts.join(', ')}`,
    );
}

export function Grid({
  className,
  columns = 1,
  columnsBelow,
  gap = 0,
  ...rest
}: GridProps) {
  assertColumns(columns);
  const belowClasses = breakpoints.flatMap((breakpoint) => {
    const count = columnsBelow?.[breakpoint];
    if (count === undefined) return [];
    assertColumns(count);
    return [gridColumnsBelowClass(breakpoint, count)];
  });

  return (
    <Box
      className={cx(
        'sw-grid',
        gridColumnsClass(columns),
        ...belowClasses,
        spacingClass('gap', 'all', gap),
        className,
      )}
      {...rest}
    />
  );
}
