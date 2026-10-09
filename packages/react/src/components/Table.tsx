import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';

import { cx } from '../class-names.js';
import { ScrollRegion } from './ScrollRegion.js';

export type TableDensity = 'comfortable' | 'compact';

export type TableProps = HTMLAttributes<HTMLTableElement> & {
  density?: TableDensity;
  stickyHeader?: boolean;
};

/** A wide table scrolls inside its own `ScrollRegion`, named after the table. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    children,
    className,
    density = 'comfortable',
    stickyHeader = true,
    ...rest
  },
  ref,
) {
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
          stickyHeader && 'sw-table-sticky',
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

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  selected?: boolean;
};

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ className, selected = false, ...rest }, ref) {
    return (
      <tr
        ref={ref}
        aria-selected={selected || undefined}
        className={cx(selected && 'sw-table-row-selected', className)}
        {...rest}
      />
    );
  },
);

type TableCellAlign = 'start' | 'end';

/**
 * A sortable column's state: sorted `ascending` or `descending`, or `none`
 * (sortable, not the column the table is sorted by).
 */
export type TableSort = 'ascending' | 'descending' | 'none';

type TableHeaderSort = {
  /**
   * Makes a header cell (`as="th"`) a sort control: its children become a
   * button in the header's own text style, with a sort glyph after them (an
   * up chevron when `ascending`, a down chevron when `descending`, a muted
   * pair when `none`), and the cell carries `aria-sort` while it is the
   * sorted column. Pass it with `onSort`, on `th` cells only.
   */
  sort?: TableSort;
  /** Called when the header's sort button is pressed; the consumer sorts. */
  onSort?: () => void;
};

export type TableCellProps = (
  | (TdHTMLAttributes<HTMLTableCellElement> & {
      as?: 'td';
      sort?: never;
      onSort?: never;
    })
  | (ThHTMLAttributes<HTMLTableCellElement> & { as: 'th' } & TableHeaderSort)
) & {
  align?: TableCellAlign;
  numeric?: boolean;
  truncate?: boolean;
};

const tableSorts: readonly TableSort[] = ['ascending', 'descending', 'none'];

/** `sort` and `onSort` come together, on a header cell, with a known value. */
function assertSort(
  as: 'td' | 'th',
  sort: TableSort | undefined,
  onSort: (() => void) | undefined,
) {
  if (sort === undefined && onSort === undefined) return;
  if (as !== 'th')
    throw new TypeError('TableCell sort is for a header cell (as="th")');
  if (sort === undefined || typeof onSort !== 'function')
    throw new TypeError('TableCell sort and onSort are passed together');
  if (!tableSorts.includes(sort))
    throw new RangeError(`Unknown TableCell sort: ${String(sort)}`);
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(
    {
      align = 'start',
      as = 'td',
      children,
      className,
      numeric = false,
      onSort,
      sort,
      truncate = false,
      ...rest
    },
    ref,
  ) {
    assertSort(as, sort, onSort);
    const Component = as;
    const alignmentClass = numeric
      ? 'sw-table-numeric'
      : align === 'end'
        ? 'sw-table-end'
        : undefined;

    return (
      <Component
        ref={ref}
        aria-sort={sort === undefined || sort === 'none' ? undefined : sort}
        className={cx(alignmentClass, truncate && 'sw-table-clip', className)}
        {...rest}
      >
        {sort !== undefined && onSort ? (
          <button className="sw-table-sort" onClick={onSort} type="button">
            {children}
            <span
              aria-hidden="true"
              className={cx('sw-table-sort-glyph', `sw-table-sort-${sort}`)}
            />
          </button>
        ) : (
          children
        )}
      </Component>
    );
  },
);
