import {
  breakpointDirections,
  breakpointQuery,
  hideClass,
  visibilityBreakpoints,
} from './breakpoints.js';

export function cssResponsiveClasses(): string {
  return visibilityBreakpoints
    .flatMap((breakpoint) =>
      breakpointDirections.map(
        (direction) =>
          `@media ${breakpointQuery(direction, breakpoint)} {
  .${hideClass(direction, breakpoint)} { display: none; }
}`,
      ),
    )
    .join('\n\n');
}

export function responsiveClassCatalog(): string[] {
  return visibilityBreakpoints.flatMap((breakpoint) =>
    breakpointDirections.map((direction) => hideClass(direction, breakpoint)),
  );
}
