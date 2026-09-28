import { type SpacingStep } from '@scalewing/tokens';

import { cx } from '../class-names.js';
import { type Breakpoint, breakpoints } from '../css/breakpoints.js';
import {
  type GridColumns,
  gridColumnsBelowClass,
  gridColumnsClass,
} from '../css/css-grid.js';
import { spacingClass } from '../css/spacing-classes.js';
import { assertGridCount } from '../grid-counts.js';
import { Box, type BoxProps } from './Box.js';
import { type Align } from './Stack.js';

export type { GridColumns };

export type GridProps = BoxProps & {
  /** Where each child sits in the height of its row; unset, children stretch. */
  align?: Align;
  columns?: GridColumns;
  columnsBelow?: Partial<Record<Breakpoint, GridColumns>>;
  gap?: SpacingStep;
};

export function Grid({
  align,
  className,
  columns = 1,
  columnsBelow,
  gap = 0,
  ...rest
}: GridProps) {
  assertGridCount('columns', columns);
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
        gridColumnsClass(columns),
        ...belowClasses,
        spacingClass('gap', 'all', gap),
        align && `sw-align-${align}`,
        className,
      )}
      {...rest}
    />
  );
}
