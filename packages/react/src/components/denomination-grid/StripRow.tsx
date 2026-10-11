import { cx } from '../../class-names.js';
import { denominationCellToneClassNames } from '../../css/css-denomination-cell-tones.js';
import { denominationCellView } from '../../denomination-cells.js';
import { EntryCell } from './EntryCell.js';
import { RowLabelLine } from './RowLabelLine.js';
import {
  type DenominationGridColumn,
  type DenominationGridRow,
} from './types.js';

type StripRowProps = {
  row: DenominationGridRow;
  columns: readonly DenominationGridColumn[];
  zeroLabel: string;
  hasTotals: boolean;
};

/** One count, read-only: the zero label, a signed delta, and the cell's tone. */
function CountCell({
  row,
  index,
  zeroLabel,
}: Pick<StripRowProps, 'row' | 'zeroLabel'> & { index: number }) {
  const view = denominationCellView(
    row.cells[index] ?? null,
    row.signed ?? false,
    zeroLabel,
  );
  return (
    <td
      className={cx(
        'sw-denomination-cell',
        `sw-denomination-cell-${view.state}`,
        ...denominationCellToneClassNames(row.cellTones?.[index]),
      )}
    >
      {view.text}
    </td>
  );
}

/**
 * One strip row: its pinned label (with the phone total under it), a count
 * per column, read-only or entered, and its total.
 */
export function StripRow({
  row,
  columns,
  zeroLabel,
  hasTotals,
}: StripRowProps) {
  const { entry } = row;
  return (
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
          {row.total !== undefined ? (
            <span aria-hidden="true" className="sw-denomination-total-inline">
              {row.total}
            </span>
          ) : null}
        </span>
      </th>
      {columns.map((column, index) =>
        entry ? (
          <EntryCell
            column={column}
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
      {hasTotals ? (
        <td className="sw-denomination-total">
          <span className="sw-denomination-total-value">{row.total ?? ''}</span>
        </td>
      ) : null}
    </tr>
  );
}
