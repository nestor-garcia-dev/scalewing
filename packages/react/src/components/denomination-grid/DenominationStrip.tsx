import { type CSSProperties } from 'react';

import { cx } from '../../class-names.js';
import { denominationLabelWidthClass } from '../../css/css-denomination-aligned.js';
import { ScrollRegion } from '../ScrollRegion.js';
import { ColumnHeadText } from './ColumnHeadText.js';
import { StripRow } from './StripRow.js';
import { type DenominationGridProps } from './types.js';

type StripProps = Required<
  Pick<DenominationGridProps, 'label' | 'columns' | 'rows' | 'zeroLabel'>
> &
  Pick<DenominationGridProps, 'totalLabel' | 'labelWidth'>;

/**
 * The total column's header: the consumer's name for the column, shown over
 * the totals from md up in the column heads' style, and visually hidden
 * below md, where each total sits under its row's label and the column
 * takes no width. Without a name it is the empty corner it has always been.
 * Both carry `sw-denomination-total-head`.
 */
function TotalHead({ totalLabel }: Pick<StripProps, 'totalLabel'>) {
  if (totalLabel === undefined)
    return <td className="sw-denomination-corner sw-denomination-total-head" />;
  return (
    <th className="sw-denomination-head sw-denomination-total-head" scope="col">
      <span className="sw-denomination-total-label">{totalLabel}</span>
    </th>
  );
}

export function DenominationStrip({
  label,
  columns,
  rows,
  zeroLabel,
  totalLabel,
  labelWidth,
}: StripProps) {
  const hasTotals = rows.some((row) => row.total !== undefined);
  // An aligned strip sizes its columns from the region's width; it needs
  // the column count and whether a total column takes a share.
  const aligned =
    labelWidth === undefined
      ? undefined
      : ({
          '--sw-denomination-columns': columns.length,
          '--sw-denomination-total': hasTotals ? 1 : 0,
        } as CSSProperties);

  return (
    <ScrollRegion
      aria-label={label}
      className={cx(
        'sw-denomination-scroll',
        aligned && 'sw-denomination-scroll-aligned',
      )}
    >
      <table
        className={cx(
          'sw-denomination-grid sw-denomination-strip',
          labelWidth && 'sw-denomination-strip-aligned',
          rows.some((row) => row.entry) && 'sw-denomination-strip-entry',
          labelWidth && denominationLabelWidthClass(labelWidth),
        )}
        style={aligned}
      >
        <caption className="sw-sr-only">{label}</caption>
        <thead>
          <tr>
            <td className="sw-denomination-corner" />
            {columns.map((column) => (
              <th className="sw-denomination-head" key={column.key} scope="col">
                <ColumnHeadText column={column} />
              </th>
            ))}
            {hasTotals ? <TotalHead totalLabel={totalLabel} /> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <StripRow
              columns={columns}
              hasTotals={hasTotals}
              key={row.id}
              row={row}
              zeroLabel={zeroLabel}
            />
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}
