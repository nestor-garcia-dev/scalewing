import { type ColorTokens } from './colors.js';

/**
 * The secondary action's outline: the hairline while its fill is the
 * surface (an outlined pill), and its own fill once a palette makes it
 * solid, so a solid secondary shows no ring.
 */
export function secondaryActionBorder(
  colors: Pick<ColorTokens, 'border' | 'secondary' | 'surface'>,
): string {
  return colors.secondary === colors.surface ? colors.border : colors.secondary;
}
