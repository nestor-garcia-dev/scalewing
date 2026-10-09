import {
  type VisibilityBreakpoint,
  hideClass,
  visibilityBreakpoints,
} from './css/breakpoints.js';

export type VisibilityProps = {
  hideBelow?: VisibilityBreakpoint;
  hideFrom?: VisibilityBreakpoint;
};

function assertBreakpoint(
  prop: string,
  breakpoint: VisibilityBreakpoint | undefined,
) {
  if (breakpoint && !visibilityBreakpoints.includes(breakpoint))
    throw new RangeError(
      `${prop} must be one of ${visibilityBreakpoints.join(', ')}`,
    );
}

export function visibilityClassNames({
  hideBelow,
  hideFrom,
}: VisibilityProps): string[] {
  assertBreakpoint('hideBelow', hideBelow);
  assertBreakpoint('hideFrom', hideFrom);
  return [
    ...(hideBelow ? [hideClass('below', hideBelow)] : []),
    ...(hideFrom ? [hideClass('from', hideFrom)] : []),
  ];
}
