import { forwardRef, type HTMLAttributes } from 'react';

import { cx } from '../class-names.js';
import { ScrollRegion } from './ScrollRegion.js';
import {
  assertTableLayout,
  assertTableVerticalAlign,
  type TableLayout,
  type TableVerticalAlign,
} from './table/table-layout.js';

export {
  TableCell,
  type TableCellProps,
  type TableColumnWidth,
  type TableSort,
} from './table/TableCell.js';
export {
  TableRow,
  type TableRowProps,
  type TableRowVariant,
} from './table/TableRow.js';
export type { TableCellTone } from '../css/css-table-ledger.js';
export { tableCellTones, tableRowVariants } from '../css/css-table-ledger.js';
export type { TableLayout, TableVerticalAlign };

export type TableDensity = 'comfortable' | 'compact';

export type TableProps = HTMLAttributes<HTMLTableElement> & {
  density?: TableDensity;
  stickyHeader?: boolean;
  /**
   * `auto` (default) sizes each column by its content. `fixed` sizes the
   * columns from the header row's `width`s alone (`table-layout: fixed`),
   * so no column moves when the rows change, such as when a filter hides
   * one. Columns without a width share what is left equally; when every
   * column has one, spare width is shared in proportion to them. When the
   * widths add up to more than the container, the table scrolls in its
   * region and a column without a width gets no room at all, so on a table
   * that can be narrower than its widths give every column one.
   */
  layout?: TableLayout;
  /**
   * Where a cell's content sits in a row taller than it: `middle` (default)
   * or `top`, for rows where one cell runs to several lines and the others
   * should start on its first line.
   */
  verticalAlign?: TableVerticalAlign;
  /**
   * Draws a hairline between columns, at the inline start of every cell
   * after a row's first, for a ledger read across as well as down.
   */
  columnRules?: boolean;
};

/** A wide table scrolls inside its own `ScrollRegion`, named after the table. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    children,
    className,
    columnRules = false,
    density = 'comfortable',
    layout = 'auto',
    stickyHeader = true,
    verticalAlign = 'middle',
    ...rest
  },
  ref,
) {
  assertTableLayout(layout);
  assertTableVerticalAlign(verticalAlign);
  return (
    <ScrollRegion
      aria-label={rest['aria-label']}
      aria-labelledby={rest['aria-labelledby']}
      className="sw-table-wrap"
    >
      <table
        ref={ref}
        className={cx(
          'sw-table',
          density === 'compact' && 'sw-table-compact',
          layout === 'fixed' && 'sw-table-fixed',
          stickyHeader && 'sw-table-sticky',
          verticalAlign === 'top' && 'sw-table-top',
          columnRules && 'sw-table-column-rules',
          className,
        )}
        {...rest}
      >
        {children}
      </table>
    </ScrollRegion>
  );
});

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(function TableHeader({ className, ...rest }, ref) {
  return <thead ref={ref} className={className} {...rest} />;
});

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ className, ...rest }, ref) {
    return <tbody ref={ref} className={className} {...rest} />;
  },
);
