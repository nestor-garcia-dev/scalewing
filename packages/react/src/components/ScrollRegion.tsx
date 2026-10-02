'use client';

import { type ReactNode, useRef } from 'react';

import { cx } from '../class-names.js';
import { useScrollOverflow } from './use-scroll-overflow.js';

type ScrollRegionProps = {
  children: ReactNode;
  className: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

/**
 * Private wrapper that scrolls wide content inside its own box (see
 * `scrollRegionRules`). It is a keyboard stop named after its content, so a
 * wide table with no focusable cell can still be scrolled sideways from the
 * keyboard and is announced as one group. While content is scrolled out past
 * an inline edge, that edge draws a shade (`sw-scroll-more-start`,
 * `sw-scroll-more-end`), so a phone, whose scrollbars hide, still shows that
 * the table goes on.
 */
export function ScrollRegion({
  children,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: ScrollRegionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const overflow = useScrollOverflow(ref);

  return (
    <div
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cx(
        className,
        overflow.start && 'sw-scroll-more-start',
        overflow.end && 'sw-scroll-more-end',
      )}
      role="group"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
