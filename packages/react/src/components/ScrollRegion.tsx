import { type ReactNode } from 'react';

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
 * keyboard and is announced as one group.
 */
export function ScrollRegion({
  children,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: ScrollRegionProps) {
  return (
    <div
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={className}
      role="group"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
