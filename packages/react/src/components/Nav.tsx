'use client';

import { cx } from '../class-names.js';
import { Box, type BoxProps } from './Box.js';

export type NavProps = Omit<BoxProps, 'as'>;

export function Nav({ className, ...rest }: NavProps) {
  return <Box as="nav" className={cx('sw-nav', className)} {...rest} />;
}
