import {
  breakpointQuery,
  breakpoints,
  type Breakpoint,
} from './breakpoints.js';

export const gridColumnCounts = [1, 2, 3, 4] as const;

export type GridColumns = (typeof gridColumnCounts)[number];

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

  return [base, ...columns, ...below].join('\n');
}

export function gridClassCatalog(): string[] {
  return [
    'sw-grid',
    ...gridColumnCounts.map((count) => gridColumnsClass(count)),
    ...breakpoints.flatMap((breakpoint) =>
      gridColumnCounts.map((count) => gridColumnsBelowClass(breakpoint, count)),
    ),
  ];
}
