import { type CategoricalColor, isCategoricalColor } from '@scalewing/tokens';
import { type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import {
  glyphTileLetterLimit,
  type GlyphTileSize,
  glyphTileSizes,
} from '../css/css-glyph-tile.js';

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
  /**
   * The consumer's glyph (Lucide), drawn in white at spacing step 4; or, as
   * a single string or number child, up to three letters, such as a team's
   * initials ("NSL"), sized from the tile (smaller for more letters) so
   * they fit every size.
   */
  children: ReactNode;
};

/** The letters of a single string or number child, or null for a glyph. */
function tileLetters(children: ReactNode): string[] | null {
  if (typeof children !== 'string' && typeof children !== 'number') return null;
  return [...String(children).trim()];
}

/**
 * A small rounded square in a categorical colour holding a white glyph (or
 * up to three letters): a kind's mark beside its name, such as a service in
 * a list. Decorative
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
  const letters = tileLetters(children);
  if (
    letters &&
    (letters.length === 0 || letters.length > glyphTileLetterLimit)
  )
    throw new RangeError(
      `GlyphTile letters are 1 to ${glyphTileLetterLimit} characters: ${String(children)}`,
    );

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
      {letters ? (
        <span
          className={`sw-glyph-tile-text sw-glyph-tile-text-${letters.length}`}
        >
          {letters.join('')}
        </span>
      ) : (
        children
      )}
    </span>
  );
}
