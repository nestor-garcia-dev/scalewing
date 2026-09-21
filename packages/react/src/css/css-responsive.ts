import {
  type HideDirection,
  breakpointQuery,
  breakpoints,
  hideClass,
} from './breakpoints.js';

const directions: HideDirection[] = ['from', 'below'];

export function cssResponsiveClasses(): string {
  return breakpoints
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
  return breakpoints.flatMap((breakpoint) =>
    directions.map((direction) => hideClass(direction, breakpoint)),
  );
}
