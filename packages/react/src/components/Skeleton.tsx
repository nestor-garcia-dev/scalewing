import { useId } from 'react';

import { cx } from '../class-names.js';
import {
  skeletonLineRange,
  skeletonVariants,
  type SkeletonVariant,
} from '../css/css-skeleton.js';
import { isOneOf } from '../is-one-of.js';

export { skeletonVariants, type SkeletonVariant };

export type SkeletonProps = {
  /**
   * What is loading, in the consumer's words ("Loading this week's
   * games"): the status's words, read once politely; the bars are hidden.
   */
  label: string;
  /** How many bars (`lines`) or rows (`rows`), 1 to 6; 3 by default. */
  lines?: number;
  /**
   * `lines` (default) is bars of text in a column, the last one shorter;
   * `rows` is list rows (a mark and a bar) with hairlines between them.
   */
  variant?: SkeletonVariant;
};

/** Fails closed on blank words, a count outside 1–6 or an unknown variant. */
function assertSkeleton({ label, lines, variant }: Required<SkeletonProps>) {
  if (typeof label !== 'string' || !label.trim())
    throw new RangeError('Skeleton label must be nonempty');
  if (
    !Number.isInteger(lines) ||
    lines < skeletonLineRange.min ||
    lines > skeletonLineRange.max
  )
    throw new RangeError(
      `Skeleton lines must be a whole number from ${skeletonLineRange.min} to ${skeletonLineRange.max}: ${String(lines)}`,
    );
  if (!isOneOf(skeletonVariants, variant))
    throw new RangeError(
      `Skeleton variant must be one of ${skeletonVariants.join(', ')}`,
    );
}

/**
 * Grey placeholder bars where content is loading, in place of a spinner:
 * a polite status named by `label`, the bars decorative. They pulse
 * gently, and stay still when reduced motion is asked for.
 */
export function Skeleton({
  label,
  lines = 3,
  variant = 'lines',
}: SkeletonProps) {
  assertSkeleton({ label, lines, variant });
  const labelId = useId();
  // The bars and rows are divs and the words a span, so the generated
  // :nth-of-type widths count bars only.
  const places = Array.from({ length: lines }, (_, index) => index);
  return (
    // Named by its own words, which are also what it says.
    <div
      aria-labelledby={labelId}
      className={cx('sw-skeleton', `sw-skeleton-${variant}`)}
      role="status"
    >
      <span className="sw-sr-only" id={labelId}>
        {label}
      </span>
      {places.map((place) =>
        variant === 'rows' ? (
          <div aria-hidden="true" className="sw-skeleton-row" key={place}>
            <div className="sw-skeleton-mark" />
            <div className="sw-skeleton-bar" />
          </div>
        ) : (
          <div aria-hidden="true" className="sw-skeleton-bar" key={place} />
        ),
      )}
    </div>
  );
}
