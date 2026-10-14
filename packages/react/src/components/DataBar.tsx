import { type CSSProperties, forwardRef, type HTMLAttributes } from 'react';

import { cx } from '../class-names.js';
import { type DataBarTone, dataBarTones } from '../css/css-data-bar.js';
import { dataBarGeometry } from '../data-bar-geometry.js';

export type { DataBarTone };
export { dataBarTones };

export type DataBarProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'aria-hidden'
> & {
  /** One end of the range, in the domain's units. */
  from: number;
  /** The other end; the bar runs between the two whichever is larger. */
  to: number;
  /** The domain's least value, at the track's inline start. */
  min: number;
  /** The domain's greatest value, at the track's inline end. */
  max: number;
  /**
   * What the bar means (default `neutral`): `success` for money in,
   * `muted` for money out (an outflow is not an error, so it is never
   * danger), `strong` for a subtotal, `accent` for a counted or recorded
   * figure and `danger` for a shortage, never for cash leaving.
   */
  tone?: DataBarTone;
};

/**
 * A horizontal range bar for a table cell or a list row: a bar from `from`
 * to `to` on a track whose domain runs from `min` to `max`, such as where a
 * statement's line leaves the running total, or a day's difference on a
 * domain from below zero to above it, which draws a zero line. It is
 * decorative (`aria-hidden`): the figure is the cell's own text, so keep
 * the value beside it. Values past the domain are clamped to it;
 * non-finite numbers, a `min` not under `max` or an unknown tone throw a
 * `RangeError`.
 */
export const DataBar = forwardRef<HTMLSpanElement, DataBarProps>(
  function DataBar(
    { className, from, max, min, style, to, tone = 'neutral', ...rest },
    ref,
  ) {
    if (!dataBarTones.includes(tone))
      throw new RangeError(
        `DataBar tone must be one of ${dataBarTones.join(', ')}; received ${String(tone)}`,
      );
    const { start, size, zero, zeroEnd } = dataBarGeometry(from, to, min, max);
    return (
      <span
        ref={ref}
        className={cx(
          'sw-data-bar',
          `sw-data-bar-${tone}`,
          zero !== null && 'sw-data-bar-diverging',
          zeroEnd !== null && `sw-data-bar-zero-${zeroEnd}`,
          className,
        )}
        style={
          {
            ...style,
            ...(zero === null ? {} : { '--sw-data-bar-zero': zero }),
          } as CSSProperties
        }
        {...rest}
        // After the spread: the bar is always decorative.
        aria-hidden="true"
      >
        <span
          className="sw-data-bar-fill"
          style={
            {
              '--sw-data-bar-start': start,
              '--sw-data-bar-size': size,
            } as CSSProperties
          }
        />
      </span>
    );
  },
);
