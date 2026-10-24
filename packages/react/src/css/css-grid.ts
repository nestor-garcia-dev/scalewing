import {
  breakpointQuery,
  breakpoints,
  type Breakpoint,
} from './breakpoints.js';

export const gridColumnCounts = [1, 2, 3, 4, 6] as const;

export type GridColumns = (typeof gridColumnCounts)[number];

/**
 * A fitted grid's narrowest column: as many columns as fit the grid's width
 * at this minimum, each stretched to share the row, and one column when
 * the grid is narrower than the minimum.
 */
export const gridFitWidths = {
  narrow: '15rem',
  medium: '16.25rem',
  wide: '18.75rem',
} as const;

export type GridFit = keyof typeof gridFitWidths;

export const gridFits = Object.keys(gridFitWidths) as GridFit[];

export function gridFitClass(fit: GridFit): string {
  return `sw-grid-fit-${fit}`;
}

export function gridColumnsClass(columns: GridColumns): string {
  return `sw-grid-cols-${columns}`;
}

export function gridColumnsBelowClass(
  breakpoint: Breakpoint,
  columns: GridColumns,
): string {
  return `sw-grid-cols-below-${breakpoint}-${columns}`;
}

function columnsRule(className: string, columns: GridColumns): string {
  return `.${className} { grid-template-columns: repeat(${columns}, minmax(0, 1fr)); }`;
}

export function cssGridClasses(): string {
  const base = `.sw-grid {
  display: grid;
  min-width: 0;
}`;
  const columns = gridColumnCounts.map((count) =>
    columnsRule(gridColumnsClass(count), count),
  );
  const below = breakpoints.map(
    (breakpoint) => `@media ${breakpointQuery('below', breakpoint)} {
${gridColumnCounts
  .map((count) => columnsRule(gridColumnsBelowClass(breakpoint, count), count))
  .join('\n')}
}`,
  );

  const fitted = gridFits.map(
    (fit) =>
      `.${gridFitClass(fit)} { grid-template-columns: repeat(auto-fit, minmax(min(100%, ${gridFitWidths[fit]}), 1fr)); }`,
  );

  return [base, ...columns, ...below, ...fitted].join('\n');
}

export function gridClassCatalog(): string[] {
  return [
    'sw-grid',
    ...gridColumnCounts.map((count) => gridColumnsClass(count)),
    ...breakpoints.flatMap((breakpoint) =>
      gridColumnCounts.map((count) => gridColumnsBelowClass(breakpoint, count)),
    ),
    ...gridFits.map(gridFitClass),
  ];
}
