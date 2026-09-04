import { type SpacingStep, spacingClass } from '@scalewing/tokens';

import { cx } from '../class-names.js';
import { Box, type BoxProps } from './Box.js';

export type Align = 'start' | 'center' | 'end' | 'stretch';
export type Justify = 'start' | 'center' | 'end' | 'between';

export type StackProps = BoxProps & {
  align?: Align;
  gap?: SpacingStep;
  justify?: Justify;
};

export function Stack({
  align = 'stretch',
  className,
  gap = 0,
  justify = 'start',
  ...rest
}: StackProps) {
  return (
    <Box
      className={cx(
        'sw-stack',
        spacingClass('gap', 'all', gap),
        `sw-align-${align}`,
        `sw-justify-${justify}`,
        className,
      )}
      {...rest}
    />
  );
}
