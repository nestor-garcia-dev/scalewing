import { type CategoricalColor, isCategoricalColor } from '@scalewing/tokens';
import { type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { type GlyphTileSize, glyphTileSizes } from '../css/css-glyph-tile.js';

export { glyphTileSizes };
export type { GlyphTileSize };

/** A categorical hue (`green`, `blue`, `orange`, `purple`, `teal`, `rose`) or `neutral`. */
export type GlyphTileHue = CategoricalColor;

export type GlyphTileProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'aria-hidden'
> & {
  /** The categorical fill: a hue that tells a kind apart, or `neutral`. */
  hue: GlyphTileHue;
  /** `sm` 24, `md` 28 (default), `lg` 32. */
  size?: GlyphTileSize;
  /** The consumer's glyph (Lucide), drawn in white at spacing step 4. */
  children: ReactNode;
};

/**
 * A small rounded square in a categorical colour holding a white glyph: a
 * kind's mark beside its name, such as a service in a list. Decorative
 * (`aria-hidden`): the visible label beside it carries the meaning.
 */
export function GlyphTile({
  children,
  className,
  hue,
  size = 'md',
  ...rest
}: GlyphTileProps) {
  if (!isCategoricalColor(hue))
    throw new RangeError(`Unknown GlyphTile hue: ${String(hue)}`);
  if (!(glyphTileSizes as readonly unknown[]).includes(size))
    throw new RangeError(`Unknown GlyphTile size: ${String(size)}`);

  return (
    <span
      {...rest}
      aria-hidden="true"
      className={cx(
        'sw-glyph-tile',
        `sw-glyph-tile-${hue}`,
        `sw-glyph-tile-${size}`,
        className,
      )}
    >
      {children}
    </span>
  );
}
