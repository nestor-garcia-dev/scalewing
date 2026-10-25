import { forwardRef, type HTMLAttributes } from 'react';

import { cx } from '../class-names.js';
import { ScrollRegion } from './ScrollRegion.js';
import {
  assertTableLayout,
  assertTableStickyHeader,
  assertTableVerticalAlign,
  type TableLayout,
  type TableStickyHeader,
  type TableVerticalAlign,
} from './table/table-layout.js';
import {
  assertTableMaxHeight,
  type TableMaxHeight,
  tableMaxHeightStyle,
} from './table/table-max-height.js';

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
export {
  TableSelectCell,
  type TableSelectCellProps,
} from './table/TableSelectCell.js';
export type { TableCellTone } from '../css/css-table-ledger.js';
export { tableCellTones, tableRowVariants } from '../css/css-table-ledger.js';
export type {
  TableLayout,
  TableMaxHeight,
  TableStickyHeader,
  TableVerticalAlign,
};

export type TableDensity = 'comfortable' | 'compact';

export type TableProps = HTMLAttributes<HTMLTableElement> & {
  density?: TableDensity;
  /**
   * Pins the header row to the top of the table's own scroll region
   * (`true`, default). `'page'` pins it to the page's top while the page
   * scrolls: while the table fits its width its region stops being a
   * scroll box (under any sticky AppHeader, which covers it); a table
   * wider than its region scrolls sideways in it and pins to the region.
   * A table with a sticky `TableFooter` that fits its width pins its
   * header to the page with `true` too. `false` lets it scroll away.
   */
  stickyHeader?: TableStickyHeader;
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
  /**
   * Bounds the table's height, counted in rows (`{ rows: 12 }`): its region
   * is as tall as that many single-line body rows plus the header row (a
   * sorting header as tall as its buttons, the touch target on a coarse
   * pointer) and, when there is one, the footer row, and the rest of the
   * rows scroll inside it. Rows of two lines or with controls, a second
   * header or footer row and a horizontal scrollbar that takes room show
   * fewer rows. The header pins to the region's top and a sticky
   * `TableFooter` total to its bottom, so a total over every row stays in
   * view. The region is a keyboard stop named after the table, its focus
   * ring drawn over the pinned rows too, and an edge with rows scrolled
   * out past it draws a shade (cast from the pinned header's last row or
   * the total when there is one). Printed, every row shows. It keeps its
   * header pinned to the region, so `stickyHeader` `'page'` or `false`
   * throw with it, as do a value that is not `{ rows }` and a row count
   * that is not a whole number from 1. Without it (the default) the table
   * is as tall as its rows.
   */
  maxHeight?: TableMaxHeight;
};

/**
 * A wide table scrolls inside its own `ScrollRegion`, named after the
 * table; a bounded one (`maxHeight`) scrolls its rows in it too.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    children,
    className,
    columnRules = false,
    density = 'comfortable',
    layout = 'auto',
    maxHeight,
    stickyHeader = true,
    verticalAlign = 'middle',
    ...rest
  },
  ref,
) {
  assertTableLayout(layout);
  assertTableStickyHeader(stickyHeader);
  assertTableVerticalAlign(verticalAlign);
  assertTableMaxHeight(maxHeight, stickyHeader);
  const bounded = maxHeight !== undefined;
  return (
    <ScrollRegion
      aria-label={rest['aria-label']}
      aria-labelledby={rest['aria-labelledby']}
      className={cx('sw-table-wrap', bounded && 'sw-table-bounded')}
      markFits={!bounded}
      style={tableMaxHeightStyle(maxHeight)}
    >
      <table
        ref={ref}
        className={cx(
          'sw-table',
          density === 'compact' && 'sw-table-compact',
          layout === 'fixed' && 'sw-table-fixed',
          stickyHeader !== false && 'sw-table-sticky',
          stickyHeader === 'page' && 'sw-table-sticky-page',
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

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement> & {
  /**
   * Pins the footer, such as a total row, to the bottom edge while the rows
   * scroll under it: to the page while the table fits its width (the
   * sticky header then pins to the page's top too, under any sticky
   * AppHeader, which covers it), or to the table's own region while the
   * table scrolls sideways in it or is bounded (`Table maxHeight`), where
   * it stays at the region's bottom. A sticky ActionBar covers a pinned
   * footer, and so does a Dialog's pinned footer, so do not pair them.
   */
  sticky?: boolean;
};

/**
 * The table's footer (`tfoot`): a total row, its cells at weight 600 under
 * a heavier rule. A row header in it (`TableCell as="th" scope="row"`)
 * names the total.
 */
export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(function TableFooter({ className, sticky = false, ...rest }, ref) {
  return (
    <tfoot
      ref={ref}
      className={cx(sticky && 'sw-table-footer-sticky', className)}
      {...rest}
    />
  );
});
