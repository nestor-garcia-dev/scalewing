import { cx } from '../../class-names.js';
import { CountCell } from './CountCell.js';
import { EntryCell } from './EntryCell.js';
import { RowLabelLine } from './RowLabelLine.js';
import { StripTotalCell, StripTotalInline } from './StripTotal.js';
import { hasValue, StripValueRow, valueCellId } from './StripValueRow.js';
import {
  type DenominationGridColumn,
  type DenominationGridRow,
} from './types.js';

type StripRowProps = {
  row: DenominationGridRow;
  columns: readonly DenominationGridColumn[];
  zeroLabel: string;
  hasTotals: boolean;
  /** A per-grid prefix that keeps the value cells' ids unique on the page. */
  idPrefix: string;
  /** The row's place in the grid, for its value cells' ids. */
  rowIndex: number;
};

/**
 * One strip row: its pinned label (with the phone total under it), a count
 * per column, read-only or entered, and its total. With a `valueRow`, the
 * value line follows it and takes the total; each entry count is described
 * by the value under it.
 */
export function StripRow({
  row,
  columns,
  zeroLabel,
  hasTotals,
  idPrefix,
  rowIndex,
}: StripRowProps) {
  const { entry, valueRow } = row;
  // With a value line, the total is on it, not on the counts.
  const total = valueRow ? undefined : row.total;
  const describedBy = (index: number) =>
    hasValue(valueRow?.cells[index])
      ? valueCellId(idPrefix, rowIndex, index)
      : undefined;
  return (
    <>
      <tr
        aria-disabled={row.disabled || undefined}
        className={cx(
          'sw-denomination-row',
          `sw-denomination-row-${row.tone ?? 'neutral'}`,
          row.signed && 'sw-denomination-row-signed',
          row.emphasis === 'quiet' && 'sw-denomination-row-quiet',
          row.disabled && 'sw-denomination-row-disabled',
        )}
      >
        <th className="sw-denomination-label" scope="row">
          <span className="sw-denomination-label-body">
            <RowLabelLine row={row} />
            <StripTotalInline total={total} />
          </span>
        </th>
        {columns.map((column, index) =>
          entry ? (
            <EntryCell
              column={column}
              describedBy={describedBy(index)}
              entry={entry}
              index={index}
              key={column.key}
              row={row}
            />
          ) : (
            <CountCell
              index={index}
              key={column.key}
              row={row}
              zeroLabel={zeroLabel}
            />
          ),
        )}
        {hasTotals ? <StripTotalCell total={total} /> : null}
      </tr>
      {valueRow ? (
        <StripValueRow
          columns={columns}
          hasTotals={hasTotals}
          idPrefix={idPrefix}
          row={row}
          rowIndex={rowIndex}
          valueRow={valueRow}
        />
      ) : null}
    </>
  );
}
