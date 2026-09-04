import { type SpacingStep, type CardVariant } from '@scalewing/tokens';

import { cx } from '../class-names.js';
import { Box, type BoxProps } from './Box.js';

export type { CardVariant };

export type CardProps = Omit<BoxProps, 'as'> & {
  padding?: SpacingStep;
  variant?: CardVariant;
};

export function Card({
  className,
  padding = 4,
  variant = 'glass',
  ...rest
}: CardProps) {
  return (
    <Box
      as="section"
      className={cx('sw-card', `sw-card-${variant}`, className)}
      padding={padding}
      {...rest}
    />
  );
}
