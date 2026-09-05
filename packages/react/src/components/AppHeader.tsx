'use client';

import { cx } from '../class-names.js';
import { Box, type BoxProps } from './Box.js';

export type AppHeaderProps = Omit<BoxProps, 'as'> & {
  sticky?: boolean;
};

export function AppHeader({
  className,
  padding = 4,
  sticky = true,
  ...rest
}: AppHeaderProps) {
  return (
    <Box
      as="header"
      className={cx(
        'sw-app-header',
        sticky && 'sw-app-header-sticky',
        className,
      )}
      padding={padding}
      {...rest}
    />
  );
}
