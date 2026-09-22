import { cx } from '../../class-names.js';
import { denominationCellView } from '../../denomination-cells.js';
import { type DenominationGridProps } from './types.js';

type TilesProps = Required<
  Pick<DenominationGridProps, 'label' | 'columns' | 'rows' | 'zeroLabel'>
> &
  Pick<DenominationGridProps, 'subtotal'>;

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
          {rows.length > 1 || row.icon ? (
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
