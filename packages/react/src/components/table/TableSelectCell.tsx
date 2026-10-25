import { forwardRef } from 'react';

import { tableSelectCellClass } from '../../css/css-table-select.js';
import { Checkbox } from '../Checkbox.js';

export type TableSelectCellProps = {
  /**
   * The checkbox's name, not drawn: "Select Mallard" in a row, "Select
   * all" in the header. Name the row by the words the row shows.
   */
  label: string;
  checked: boolean;
  /** The mixed state, for a header's "Select all" while some rows are chosen. */
  indeterminate?: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  /**
   * `th` in a `TableHeader` row (the column's header cell, `scope="col"`),
   * `td` (the default) in a body row. A fixed table sizes its columns from
   * the header row, so put one in the header too.
   */
  as?: 'td' | 'th';
};

/**
 * A table's select column: a cell holding one `Checkbox` whose label is
 * visually hidden. The column is as narrow as the box, which is its own
 * target, at least 44 × 44 px on a coarse pointer. Pair a chosen row with
 * `TableRow selected`; a press on the box is left alone by a
 * `TableRow pressable`.
 */
export const TableSelectCell = forwardRef<
  HTMLTableCellElement,
  TableSelectCellProps
>(function TableSelectCell(
  {
    as = 'td',
    checked,
    disabled = false,
    indeterminate = false,
    label,
    onCheckedChange,
  },
  ref,
) {
  if (typeof label !== 'string' || !label.trim())
    throw new RangeError('TableSelectCell label must not be empty');
  if (as !== 'td' && as !== 'th')
    throw new RangeError(`Unknown TableSelectCell as: ${String(as)}`);
  const Component = as;
  return (
    <Component
      ref={ref}
      className={tableSelectCellClass}
      scope={as === 'th' ? 'col' : undefined}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        indeterminate={indeterminate}
        label={label}
        labelVisuallyHidden
        onCheckedChange={onCheckedChange}
      />
    </Component>
  );
});
