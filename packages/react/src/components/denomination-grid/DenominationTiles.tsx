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

/**
 * A row is a region named by its label, except a lone row without its label
 * line whose label repeats the grid's: that region would only say the
 * group's name a second time (Teisoro SDAY-31). A lone row with its own
 * words keeps them, since nothing else on screen says them.
 */
function namesRow(
  rowCount: number,
  row: DenominationGridRow,
  gridLabel: string,
): boolean {
  return showsRowLabel(rowCount, row) || row.label !== gridLabel;
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
      {rows.map((row) => {
        const labelled = showsRowLabel(rows.length, row);
        return (
          <section
            aria-label={
              namesRow(rows.length, row, label) ? row.label : undefined
            }
            className={cx(
              'sw-denomination-row',
              `sw-denomination-row-${row.tone ?? 'neutral'}`,
            )}
            key={row.id}
          >
            {labelled ? (
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
        );
      })}
    </div>
  );
}
