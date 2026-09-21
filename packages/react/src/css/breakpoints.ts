export const breakpointScale = {
  md: 48,
} as const;

export type Breakpoint = keyof typeof breakpointScale;

export const breakpoints = Object.keys(breakpointScale) as Breakpoint[];

export type HideDirection = 'from' | 'below';

export function hideClass(
  direction: HideDirection,
  breakpoint: Breakpoint,
): string {
  return `sw-hide-${direction}-${breakpoint}`;
}

export function breakpointQuery(
  direction: HideDirection,
  breakpoint: Breakpoint,
): string {
  const minWidth = `(min-width: ${breakpointScale[breakpoint]}rem)`;

  return direction === 'from' ? minWidth : `not all and ${minWidth}`;
}
