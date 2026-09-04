import { type SpacingStep } from '@scalewing/tokens';

import { cx } from '../class-names.js';
import { Box, type BoxProps } from './Box.js';

export type CardVariant = 'outlined' | 'elevated';

export type CardProps = Omit<BoxProps, 'as'> & {
  padding?: SpacingStep;
  variant?: CardVariant;
};

export function Card({
  className,
  padding = 4,
  variant = 'outlined',
  ...rest
}: CardProps) {
  return (
    <Box
      as="section"
      className={cx(
        'sw-card',
        variant === 'elevated' && 'sw-card-elevated',
        className,
      )}
      padding={padding}
      {...rest}
    />
  );
}
