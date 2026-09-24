import { breakpointQuery, breakpoints } from './breakpoints.js';
import {
  type GridColumns,
  gridColumnCounts,
  gridColumnsBelowClass,
  gridColumnsClass,
} from './css-grid.js';

/** A child spans one of the same bounded counts a `Grid` can have. */
export type GridColumnSpan = GridColumns;

export const gridColumnSpans = gridColumnCounts;

export function gridSpanClass(span: GridColumnSpan): string {
  return `sw-grid-span-${span}`;
}

function spanRule(selector: string, span: GridColumnSpan): string {
  return `${selector} { grid-column: span ${span}; }`;
}

/**
 * Caps a span at the columns its grid has at the current width, so a wide
 * child never adds an implicit column. `:where()` keeps the cap at one class
 * of specificity; source order lets it override the plain span rule.
 */
function capRule(
  gridClass: string,
  columns: GridColumns,
  span: GridColumnSpan,
): string {
  return spanRule(
    `:where(.${gridClass}) > .${gridSpanClass(span)}`,
    Math.min(span, columns) as GridColumnSpan,
  );
}

function widerSpans(columns: GridColumns): GridColumnSpan[] {
  return gridColumnSpans.filter((span) => span > columns);
}

export function cssGridSpanClasses(): string {
  const spans = gridColumnSpans.map((span) =>
    spanRule(`.${gridSpanClass(span)}`, span),
  );
  const caps = gridColumnCounts.flatMap((columns) =>
    widerSpans(columns).map((span) =>
      capRule(gridColumnsClass(columns), columns, span),
    ),
  );
  // Below a breakpoint every span wider than one is restated for the phone
  // column count, which also undoes a desktop cap when that count is larger.
  const below = breakpoints.map(
    (breakpoint) => `@media ${breakpointQuery('below', breakpoint)} {
${gridColumnCounts
  .flatMap((columns) =>
    widerSpans(1).map(
      (span) =>
        `  ${capRule(gridColumnsBelowClass(breakpoint, columns), columns, span)}`,
    ),
  )
  .join('\n')}
}`,
  );

  return [...spans, ...caps, ...below].join('\n');
}

export function gridSpanClassCatalog(): string[] {
  return gridColumnSpans.map((span) => gridSpanClass(span));
}
