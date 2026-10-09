/**
 * The sized column widths, in rem so a header in caption type and a cell in
 * body type agree: `xs` holds a count or a short code, `sm` a short date or
 * an amount, `md` a date with its year, `lg` a date and a time, `xl` a name
 * or a short phrase. A cell's padding is outside the width.
 */
export const tableColumnSizes = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export type TableColumnSize = keyof typeof tableColumnSizes;

/** A column's width: shrink to its content on one line, or a size. */
export type TableColumnWidth = 'min' | TableColumnSize;

export const tableColumnWidths: readonly TableColumnWidth[] = [
  'min',
  ...(Object.keys(tableColumnSizes) as TableColumnSize[]),
];

export function tableColumnWidthClass(width: TableColumnWidth): string {
  return `sw-table-col-${width}`;
}

/*
 * A fixed table sizes its columns from the header row only, so a filter
 * that hides a row moves no column. `min` is the one-percent idiom: an auto
 * table gives the column the least room its content allows, on one line; a
 * fixed table never measures content, so there `min` is no width at all
 * and the column shares what is left. `top` starts every cell of a tall row
 * on its first line.
 */
export function cssTableLayoutClasses(): string {
  const sizes = Object.entries(tableColumnSizes)
    .map(
      ([size, rem]) =>
        `.sw-table .${tableColumnWidthClass(size as TableColumnSize)} { width: ${rem}rem; }`,
    )
    .join('\n');
  return `.sw-table-fixed {
  table-layout: fixed;
}

.sw-table .sw-table-col-min {
  white-space: nowrap;
  width: 1%;
}

.sw-table-fixed .sw-table-col-min {
  width: auto;
}

${sizes}

.sw-table.sw-table-top th,
.sw-table.sw-table-top td {
  vertical-align: top;
}`;
}

export function tableLayoutClassCatalog(): string[] {
  return [
    'sw-table-fixed',
    'sw-table-top',
    ...tableColumnWidths.map(tableColumnWidthClass),
  ];
}
