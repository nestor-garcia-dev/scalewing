import { cx } from '../../class-names.js';
import { StripTotalCell, StripTotalInline } from './StripTotal.js';
import { denominationValueRowClass } from '../../css/css-denomination-value-row.js';
import {
  type DenominationGridColumn,
  type DenominationGridRow,
  type DenominationGridValueRow,
} from './types.js';

/**
 * The id of a value cell, which the count above it is described by: the
 * grid's prefix and the cell's place, never consumer text, so it is always
 * one valid token of an id list.
 */
export function valueCellId(
  idPrefix: string,
  rowIndex: number,
  columnIndex: number,
) {
  return `${idPrefix}value-${rowIndex}-${columnIndex}`;
}

/** Whether a value cell shows something: not `null` and not blank. */
export function hasValue(cell: string | null | undefined): cell is string {
  return typeof cell === 'string' && cell.trim() !== '';
}

type StripValueRowProps = {
  row: DenominationGridRow;
  valueRow: DenominationGridValueRow;
  columns: readonly DenominationGridColumn[];
  hasTotals: boolean;
  /** A per-grid prefix that keeps the value cells' ids unique on the page. */
  idPrefix: string;
  rowIndex: number;
};

/**
 * The value line under a strip row: its name in the label column (with the
 * row's total under it on a phone), a centred value per column, and the
 * row's total. It keeps the row's tone, so a toned total stays toned.
 */
export function StripValueRow({
  row,
  valueRow,
  columns,
  hasTotals,
  idPrefix,
  rowIndex,
}: StripValueRowProps) {
  return (
    <tr
      aria-disabled={row.disabled || undefined}
      className={cx(
        'sw-denomination-row',
        denominationValueRowClass,
        `sw-denomination-row-${row.tone ?? 'neutral'}`,
        row.disabled && 'sw-denomination-row-disabled',
      )}
    >
      {/* Named with its row, so table navigation tells one line from another
          ("Counted Value"); the visible name stays inside it. */}
      <th
        aria-label={`${row.label} ${valueRow.label}`}
        className="sw-denomination-label"
        scope="row"
      >
        <span className="sw-denomination-label-body">
          <span className="sw-denomination-label-line">
            <span className="sw-denomination-label-text">{valueRow.label}</span>
          </span>
          <StripTotalInline total={row.total} />
        </span>
      </th>
      {columns.map((column, index) => {
        const cell = valueRow.cells[index];
        return (
          <td
            className="sw-denomination-value"
            id={valueCellId(idPrefix, rowIndex, index)}
            key={column.key}
          >
            {hasValue(cell) ? cell : ''}
          </td>
        );
      })}
      {hasTotals ? <StripTotalCell total={row.total} /> : null}
    </tr>
  );
}
