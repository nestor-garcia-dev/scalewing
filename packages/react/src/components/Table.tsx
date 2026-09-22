import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';

import { cx } from '../class-names.js';

export type TableDensity = 'comfortable' | 'compact';

export type TableProps = HTMLAttributes<HTMLTableElement> & {
  density?: TableDensity;
  stickyHeader?: boolean;
};

/**
 * The scroll wrapper is a keyboard stop named after the table, so a wide
 * table with no focusable cell can still be scrolled sideways from the
 * keyboard and is announced as one group.
 */
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
    <div
      aria-label={rest['aria-label']}
      aria-labelledby={rest['aria-labelledby']}
      className="sw-table-wrap"
      role="group"
      tabIndex={0}
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
    </div>
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

export type TableCellProps = (
  | (TdHTMLAttributes<HTMLTableCellElement> & { as?: 'td' })
  | (ThHTMLAttributes<HTMLTableCellElement> & { as: 'th' })
) & {
  align?: TableCellAlign;
  numeric?: boolean;
  truncate?: boolean;
};

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(
    {
      align = 'start',
      as = 'td',
      className,
      numeric = false,
      truncate = false,
      ...rest
    },
    ref,
  ) {
    const Component = as;
    const alignmentClass = numeric
      ? 'sw-table-numeric'
      : align === 'end'
        ? 'sw-table-end'
        : undefined;

    return (
      <Component
        ref={ref}
        className={cx(alignmentClass, truncate && 'sw-table-clip', className)}
        {...rest}
      />
    );
  },
);
