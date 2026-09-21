import { type SpacingStep } from '@scalewing/tokens';
import { spacingClass } from '../css/spacing-classes.js';

import { cx } from '../class-names.js';
import { Box, type BoxProps } from './Box.js';
import { type Align, type Justify } from './Stack.js';

export type InlineProps = BoxProps & {
  align?: Align;
  gap?: SpacingStep;
  justify?: Justify;
  wrap?: boolean;
};

export function Inline({
  align = 'center',
  className,
  gap = 0,
  justify = 'start',
  wrap = false,
  ...rest
}: InlineProps) {
  return (
    <Box
      className={cx(
        'sw-inline',
        spacingClass('gap', 'all', gap),
        `sw-align-${align}`,
        `sw-justify-${justify}`,
        wrap && 'sw-wrap',
        className,
      )}
      {...rest}
    />
  );
}
