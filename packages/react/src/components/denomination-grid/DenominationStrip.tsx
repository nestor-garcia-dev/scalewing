import { cx } from '../../class-names.js';
import { denominationCellView } from '../../denomination-cells.js';
import { type DenominationGridProps } from './types.js';

type StripProps = Required<
  Pick<DenominationGridProps, 'label' | 'columns' | 'rows' | 'zeroLabel'>
>;

export function DenominationStrip({
  label,
  columns,
  rows,
  zeroLabel,
}: StripProps) {
  const hasTotals = rows.some((row) => row.total !== undefined);

  return (
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
          {hasTotals ? <td className="sw-denomination-corner" /> : null}
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
              {row.icon ? (
                <span aria-hidden="true" className="sw-denomination-icon">
                  {row.icon}
                </span>
              ) : null}
              <span className="sw-denomination-label-text">{row.label}</span>
              {row.total !== undefined ? (
                <span
                  aria-hidden="true"
                  className="sw-denomination-total-inline"
                >
                  {row.total}
                </span>
              ) : null}
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
              <td className="sw-denomination-total">{row.total ?? ''}</td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
