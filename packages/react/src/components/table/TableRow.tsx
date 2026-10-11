import { forwardRef, type HTMLAttributes } from 'react';

import { cx } from '../../class-names.js';
import {
  assertTableRowVariant,
  type TableRowVariant,
} from '../../css/css-table-ledger.js';

export type { TableRowVariant };

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  selected?: boolean;
  /**
   * `sub` sets the row under the one above it, as an item of a batch: its
   * row header (`TableCell as="th" scope="row"`) is indented with a guide
   * bar at the indent; a sub row without a row header is not indented.
   * `default` is a row of its own.
   */
  variant?: TableRowVariant;
  /**
   * A voided row kept on the record: the subtle fill and the text muted
   * and struck through, toned cells included. A line-through is not read
   * aloud, so say why in the row, such as a `Badge` "Voided" in the
   * title's line (a Badge in a line of text is not struck; one that is a
   * flex item, a direct child of `Inline`, is). Works with either variant.
   */
  struck?: boolean;
};

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    {
      className,
      selected = false,
      struck = false,
      variant = 'default',
      ...rest
    },
    ref,
  ) {
    assertTableRowVariant(variant);
    return (
      <tr
        ref={ref}
        aria-selected={selected || undefined}
        className={cx(
          selected && 'sw-table-row-selected',
          variant === 'sub' && 'sw-table-row-sub',
          struck && 'sw-table-row-struck',
          className,
        )}
        {...rest}
      />
    );
  },
);
