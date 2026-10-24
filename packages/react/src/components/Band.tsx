import { type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import {
  type BandTone,
  bandToneClass,
  bandTones,
  type BandWidth,
  bandWidthClass,
  bandWidths,
} from '../css/css-band.js';
import { isOneOf } from '../is-one-of.js';
import { spacingClassNames, type SpacingProps } from '../spacing-classes.js';

export { bandTones, bandWidths, type BandTone, type BandWidth };

export const bandElements = ['section', 'div', 'aside', 'footer'] as const;

export type BandElement = (typeof bandElements)[number];

export type BandProps = Omit<HTMLAttributes<HTMLElement>, 'style'> &
  Pick<SpacingProps, 'paddingY' | 'paddingTop' | 'paddingBottom'> & {
    /**
     * The fill: `surface`, `subtle` (the quiet grey), or `inverse`, the dark
     * band (`--sw-color-inverse`), inside which words, muted words,
     * hairlines, links, the accent and a primary button read in
     * `onInverse`, so its content needs no band-aware variant.
     */
    tone: BandTone;
    /** The element: `section` (default), `div`, `aside` or `footer`. */
    as?: BandElement;
    /**
     * The content column: `container` (default) is the page's width,
     * `reading` the narrower reading width; either keeps the page gutter.
     */
    width?: BandWidth;
    children: ReactNode;
  };

/**
 * A full-width stretch of the page in one fill, its content in a centred
 * column with the page gutter: a site's footer, one dark closing section,
 * a grey strip between white ones. Vertical padding is a spacing step
 * (default 8). An unknown tone, width or element throws a `RangeError`.
 */
export function Band({
  as = 'section',
  children,
  className,
  paddingBottom,
  paddingTop,
  paddingY = 8,
  tone,
  width = 'container',
  ...rest
}: BandProps) {
  if (!isOneOf(bandTones, tone))
    throw new RangeError(`Unknown Band tone: ${String(tone)}`);
  if (!isOneOf(bandWidths, width))
    throw new RangeError(`Unknown Band width: ${String(width)}`);
  if (!isOneOf(bandElements, as))
    throw new RangeError(`Unknown Band element: ${String(as)}`);
  const Element = as;
  return (
    <Element
      className={cx(
        'sw-band',
        bandToneClass(tone),
        ...spacingClassNames({ paddingY, paddingTop, paddingBottom }),
        className,
      )}
      {...rest}
    >
      <div className={cx('sw-band-inner', bandWidthClass(width))}>
        {children}
      </div>
    </Element>
  );
}
