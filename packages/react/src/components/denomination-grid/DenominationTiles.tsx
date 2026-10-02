import { cx } from '../../class-names.js';
import { denominationCellToneClassNames } from '../../css/css-denomination-cell-tones.js';
import { denominationCellView } from '../../denomination-cells.js';
import { RowLabelLine } from './RowLabelLine.js';
import {
  type DenominationGridProps,
  type DenominationGridRow,
} from './types.js';

type TilesProps = Required<
  Pick<
    DenominationGridProps,
    'label' | 'columns' | 'rows' | 'zeroLabel' | 'rowRole'
  >
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
 * A row is named by its label (a region, or a group at `rowRole="group"`),
 * except a lone row without its label line whose label repeats the grid's:
 * that name would only say the group's name a second time (Teisoro
 * SDAY-31). A lone row with its own words keeps them, since nothing else on
 * screen says them.
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
  rowRole,
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
        const named = namesRow(rows.length, row, label);
        // A named section is a region; role="group" keeps the name without
        // the landmark. An unnamed row stays a generic section either way.
        return (
          <section
            aria-label={named ? row.label : undefined}
            className={cx(
              'sw-denomination-row',
              `sw-denomination-row-${row.tone ?? 'neutral'}`,
            )}
            key={row.id}
            role={named && rowRole === 'group' ? 'group' : undefined}
          >
            {labelled ? (
              <span className="sw-denomination-label">
                <RowLabelLine row={row} />
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
                  <li
                    className={cx(
                      'sw-denomination-tile',
                      ...denominationCellToneClassNames(row.cellTones?.[index]),
                    )}
                    key={column.key}
                  >
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
