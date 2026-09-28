import { cx } from '../../class-names.js';
import { denominationCellView } from '../../denomination-cells.js';
import {
  type DenominationGridProps,
  type DenominationGridRow,
} from './types.js';

type TilesProps = Required<
  Pick<DenominationGridProps, 'label' | 'columns' | 'rows' | 'zeroLabel'>
> &
  Pick<DenominationGridProps, 'subtotal'>;

/**
 * A lone row is named by the grid's own label, so its label line shows only
 * when it adds something: an icon or a total. Several rows always show it.
 */
function showsRowLabel(rowCount: number, row: DenominationGridRow): boolean {
  return rowCount > 1 || Boolean(row.icon) || row.total !== undefined;
}

export function DenominationTiles({
  label,
  columns,
  rows,
  subtotal,
  zeroLabel,
}: TilesProps) {
  return (
    <div
      aria-label={label}
      className="sw-denomination-grid sw-denomination-tiles"
      role="group"
    >
      {rows.map((row) => (
        <section
          aria-label={row.label}
          className={cx(
            'sw-denomination-row',
            `sw-denomination-row-${row.tone ?? 'neutral'}`,
          )}
          key={row.id}
        >
          {showsRowLabel(rows.length, row) ? (
            <span className="sw-denomination-label">
              {row.icon ? (
                <span aria-hidden="true" className="sw-denomination-icon">
                  {row.icon}
                </span>
              ) : null}
              <span className="sw-denomination-label-text">{row.label}</span>
              {row.total !== undefined ? (
                <span className="sw-denomination-total">{row.total}</span>
              ) : null}
            </span>
          ) : null}
          <ul className="sw-denomination-tile-list">
            {columns.map((column, index) => {
              const cell = row.cells[index] ?? null;
              const view = denominationCellView(
                cell,
                row.signed ?? false,
                zeroLabel,
              );
              const amount =
                subtotal && cell !== null && cell !== 0
                  ? subtotal(cell, column)
                  : null;
              return (
                <li className="sw-denomination-tile" key={column.key}>
                  <span className="sw-denomination-head">{column.label}</span>
                  <span
                    className={`sw-denomination-cell sw-denomination-cell-${view.state}`}
                  >
                    {view.text}
                  </span>
                  {subtotal ? (
                    <span className="sw-denomination-subtotal">
                      {amount ?? zeroLabel}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
