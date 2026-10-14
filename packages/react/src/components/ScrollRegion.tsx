'use client';

import { type CSSProperties, type ReactNode, useRef } from 'react';

import { cx } from '../class-names.js';
import { useScrollOverflow } from './use-scroll-overflow.js';

type ScrollRegionProps = {
  children: ReactNode;
  className: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** Adds `sw-scroll-fits` once measured with content that fits its width. */
  markFits?: boolean;
  /** Generated custom properties only, such as a bounded table's row count. */
  style?: CSSProperties;
};

/**
 * Private wrapper that scrolls wide content inside its own box (see
 * `scrollRegionRules`). It is a keyboard stop named after its content, so a
 * wide table with no focusable cell can still be scrolled sideways from the
 * keyboard and is announced as one group. While content is scrolled out past
 * an inline edge, that edge draws a shade (`sw-scroll-more-start`,
 * `sw-scroll-more-end`), so a phone, whose scrollbars hide, still shows that
 * the table goes on. A region of bounded height that scrolls its rows marks
 * its top and bottom the same way (`sw-scroll-more-top`,
 * `sw-scroll-more-bottom`). With `markFits`, a measured region whose content
 * fits its width carries `sw-scroll-fits`, so a table with a sticky footer
 * can stop being a scroll box and pin its header and footer to the page.
 */
export function ScrollRegion({
  children,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  markFits = false,
  style,
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
        overflow.top && 'sw-scroll-more-top',
        overflow.bottom && 'sw-scroll-more-bottom',
        markFits &&
          overflow.measured &&
          !overflow.start &&
          !overflow.end &&
          'sw-scroll-fits',
      )}
      role="group"
      style={style}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
