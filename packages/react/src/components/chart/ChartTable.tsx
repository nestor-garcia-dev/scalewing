import { type ChartTableRow } from '../../chart-table-rows.js';

export type ChartTableProps = {
  caption: string;
  /** The columns' headers, after the rows' own header column. */
  columns: readonly string[];
  rows: readonly ChartTableRow[];
};

/**
 * Every figure a chart draws, as a table kept for assistive technology and
 * not drawn (`sw-sr-only`): its caption is the chart's name, a header per
 * column and per row, and the boxed period's row marked current. The
 * drawing itself is hidden, so this is what a screen reader reads.
 */
export function ChartTable({ caption, columns, rows }: ChartTableProps) {
  return (
    <table className="sw-sr-only">
      <caption>{caption}</caption>
      {columns.length > 0 ? (
        <thead>
          <tr>
            <td />
            {columns.map((column, index) => (
              <th key={`${column}-${index}`} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
      ) : null}
      <tbody>
        {rows.map((row) => (
          <tr aria-current={row.current ? 'true' : undefined} key={row.key}>
            <th scope="row">{row.header}</th>
            {row.cells.map((cell, index) => (
              <td key={index}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
