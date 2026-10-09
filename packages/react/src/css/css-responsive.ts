import {
  type HideDirection,
  breakpointQuery,
  hideClass,
  visibilityBreakpoints,
} from './breakpoints.js';

const directions: HideDirection[] = ['from', 'below'];

export function cssResponsiveClasses(): string {
  return visibilityBreakpoints
    .flatMap((breakpoint) =>
      directions.map(
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
    directions.map((direction) => hideClass(direction, breakpoint)),
  );
}
