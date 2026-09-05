import {
  type BadgeSize,
  type BadgeTone,
  badgeClassNames,
} from '@scalewing/tokens';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';

export type { BadgeSize, BadgeTone };

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  size?: BadgeSize;
  tone?: BadgeTone;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, className, size = 'md', tone = 'neutral', ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx(...badgeClassNames(tone, size), className)}
      {...rest}
    >
      {children}
    </span>
  );
});
