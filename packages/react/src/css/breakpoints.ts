/** The layout breakpoint: a phone below it, a wider screen from it. */
export const breakpointScale = {
  md: 48,
} as const;

export type Breakpoint = keyof typeof breakpointScale;

export const breakpoints = Object.keys(breakpointScale) as Breakpoint[];

/**
 * The breakpoints `hideBelow` and `hideFrom` take: `md`, and `lg` (64rem)
 * for content that fits only from a laptop up, such as a row of labelled
 * destinations a tablet shows as glyphs. The layout props (`columnsBelow`,
 * `stickyBelow`, `verticalFrom`, …) keep the one layout breakpoint.
 */
export const visibilityBreakpointScale = {
  ...breakpointScale,
  lg: 64,
} as const;

export type VisibilityBreakpoint = keyof typeof visibilityBreakpointScale;

export const visibilityBreakpoints = Object.keys(
  visibilityBreakpointScale,
) as VisibilityBreakpoint[];

/** Which side of a breakpoint: `from` it and wider, or `below` it. */
export type BreakpointDirection = 'from' | 'below';

export const breakpointDirections: readonly BreakpointDirection[] = [
  'from',
  'below',
];

export function hideClass(
  direction: BreakpointDirection,
  breakpoint: VisibilityBreakpoint,
): string {
  return `sw-hide-${direction}-${breakpoint}`;
}

/**
 * The media query `hideBelow` (`'below'`) or `hideFrom` (`'from'`) uses at a
 * breakpoint, such as `not all and (min-width: 64rem)` below `lg`, for an app
 * that must follow the same width in script (a tooltip that names a glyph
 * only while its label is hidden).
 */
export function breakpointQuery(
  direction: BreakpointDirection,
  breakpoint: VisibilityBreakpoint,
): string {
  if (!breakpointDirections.includes(direction))
    throw new RangeError(
      `direction must be one of ${breakpointDirections.join(', ')}`,
    );
  if (!visibilityBreakpoints.includes(breakpoint))
    throw new RangeError(
      `breakpoint must be one of ${visibilityBreakpoints.join(', ')}`,
    );
  const minWidth = `(min-width: ${visibilityBreakpointScale[breakpoint]}rem)`;

  return direction === 'from' ? minWidth : `not all and ${minWidth}`;
}
