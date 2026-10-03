import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { type Breakpoint } from '../css/breakpoints.js';
import { actionBarStickyClass } from '../css/css-action-bar.js';

export type ActionBarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  /** The actions, usually two or three `Button`s. */
  children: ReactNode;
  /**
   * One short line about the work, such as when it was last saved, or a
   * `Badge` and then a short line ("Ready" and what is ready). It is a
   * polite live region, so a new status is announced without moving focus;
   * nothing (`undefined`, `null`, `false`) leaves it empty and taking no
   * room. Its direct children sit on one row a small gap apart and wrap
   * under one another when the row is full, so put a phrase that mixes text
   * and elements in one `span` to keep it wrapping as a sentence.
   */
  status?: ReactNode;
  /** Sticky only below this breakpoint; from it up the bar sits in page flow. */
  stickyBelow?: Breakpoint;
};

/**
 * The actions for a long page on a glass bar that sticks to the bottom of
 * the viewport while the content it follows scrolls by. Place it last in
 * that content: it stays stuck while its parent is on screen and then rests
 * in its own place at the end.
 */
export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  function ActionBar(
    { children, className, status, stickyBelow, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx(
          'sw-action-bar',
          actionBarStickyClass(stickyBelow),
          className,
        )}
        {...rest}
      >
        {/* Always rendered, empty or not: a live region must already be in
            the page when its text changes for that change to be announced. */}
        <div className="sw-action-bar-status" role="status">
          {status}
        </div>
        <div className="sw-action-bar-actions">{children}</div>
      </div>
    );
  },
);
