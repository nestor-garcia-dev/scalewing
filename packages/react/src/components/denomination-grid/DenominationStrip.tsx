import { cx } from '../../class-names.js';
import { denominationCellView } from '../../denomination-cells.js';
import { ScrollRegion } from '../ScrollRegion.js';
import { type DenominationGridProps } from './types.js';

type StripProps = Required<
  Pick<DenominationGridProps, 'label' | 'columns' | 'rows' | 'zeroLabel'>
> &
  Pick<DenominationGridProps, 'totalLabel'>;

/**
 * The total column's header: a visually hidden `th` when the consumer names
 * the column, otherwise the empty corner it has always been. Both carry
 * `sw-denomination-total-head`, so below md the column takes no width.
 */
function TotalHead({ totalLabel }: Pick<StripProps, 'totalLabel'>) {
  if (totalLabel === undefined)
    return <td className="sw-denomination-corner sw-denomination-total-head" />;
  return (
    <th className="sw-denomination-total-head" scope="col">
      <span className="sw-sr-only">{totalLabel}</span>
    </th>
  );
}

export function DenominationStrip({
  label,
  columns,
  rows,
  zeroLabel,
  totalLabel,
}: StripProps) {
  const hasTotals = rows.some((row) => row.total !== undefined);

  return (
    <ScrollRegion aria-label={label} className="sw-denomination-scroll">
      <table className="sw-denomination-grid sw-denomination-strip">
        <caption className="sw-sr-only">{label}</caption>
        <thead>
          <tr>
            <td className="sw-denomination-corner" />
            {columns.map((column) => (
              <th className="sw-denomination-head" key={column.key} scope="col">
                {column.label}
              </th>
            ))}
            {hasTotals ? <TotalHead totalLabel={totalLabel} /> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className={cx(
                'sw-denomination-row',
                `sw-denomination-row-${row.tone ?? 'neutral'}`,
                row.signed && 'sw-denomination-row-signed',
              )}
              key={row.id}
            >
              <th className="sw-denomination-label" scope="row">
                <span className="sw-denomination-label-body">
                  {row.icon ? (
                    <span aria-hidden="true" className="sw-denomination-icon">
                      {row.icon}
                    </span>
                  ) : null}
                  <span className="sw-denomination-label-text">
                    {row.label}
                  </span>
                  {row.total !== undefined ? (
                    <span
                      aria-hidden="true"
                      className="sw-denomination-total-inline"
                    >
                      {row.total}
                    </span>
                  ) : null}
                </span>
              </th>
              {columns.map((column, index) => {
                const view = denominationCellView(
                  row.cells[index] ?? null,
                  row.signed ?? false,
                  zeroLabel,
                );
                return (
                  <td
                    className={`sw-denomination-cell sw-denomination-cell-${view.state}`}
                    key={column.key}
                  >
                    {view.text}
                  </td>
                );
              })}
              {hasTotals ? (
                <td className="sw-denomination-total">
                  <span className="sw-denomination-total-value">
                    {row.total ?? ''}
                  </span>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}
