import {
  forwardRef,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';

import { cx } from '../../class-names.js';
import {
  assertTableColumnWidth,
  tableColumnWidthClass,
  type TableColumnWidth,
} from './table-layout.js';

export type { TableColumnWidth };

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
  | (Omit<TdHTMLAttributes<HTMLTableCellElement>, 'width'> & {
      as?: 'td';
      sort?: never;
      onSort?: never;
    })
  | (Omit<ThHTMLAttributes<HTMLTableCellElement>, 'width'> & {
      as: 'th';
    } & TableHeaderSort)
) & {
  align?: TableCellAlign;
  numeric?: boolean;
  truncate?: boolean;
  /**
   * The column's width, on its header cell: `xs` to `xl` are widths in rem
   * (4, 6, 8, 12 and 16), which a `fixed` table keeps whatever the rows
   * hold. `min` gives an `auto` table's column the least room its content
   * allows and keeps this cell's text on one line, so set it on every cell
   * of that column; a `fixed` table, which never measures content, treats
   * it as no width.
   */
  width?: TableColumnWidth;
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
      width,
      ...rest
    },
    ref,
  ) {
    assertSort(as, sort, onSort);
    assertTableColumnWidth(width);
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
        className={cx(
          alignmentClass,
          truncate && 'sw-table-clip',
          width && tableColumnWidthClass(width),
          className,
        )}
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
