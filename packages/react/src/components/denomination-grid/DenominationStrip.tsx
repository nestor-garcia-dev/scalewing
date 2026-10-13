import { type CSSProperties, useId } from 'react';

import { cx } from '../../class-names.js';
import { denominationLabelWidthClass } from '../../css/css-denomination-aligned.js';
import {
  denominationFramedClass,
  denominationScrollFramedClass,
} from '../../css/css-denomination-appearance.js';
import { ScrollRegion } from '../ScrollRegion.js';
import { ColumnHeadText } from './ColumnHeadText.js';
import { StripRow } from './StripRow.js';
import { type DenominationGridProps } from './types.js';

type StripProps = Required<
  Pick<DenominationGridProps, 'label' | 'columns' | 'rows' | 'zeroLabel'>
> &
  Pick<DenominationGridProps, 'totalLabel' | 'labelWidth'> & {
    /** The grid's appearance classes (labels, totals, cell tones), if any. */
    className?: string;
    /** The `table` frame: a hairline around the region and a heading-row fill. */
    framed: boolean;
  };

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
  className,
  framed,
  label,
  columns,
  rows,
  zeroLabel,
  totalLabel,
  labelWidth,
}: StripProps) {
  const idPrefix = useId();
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
        framed && denominationScrollFramedClass,
      )}
    >
      <table
        className={cx(
          'sw-denomination-grid sw-denomination-strip',
          labelWidth && 'sw-denomination-strip-aligned',
          rows.some((row) => row.entry) && 'sw-denomination-strip-entry',
          labelWidth && denominationLabelWidthClass(labelWidth),
          framed && denominationFramedClass,
          className,
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
          {rows.map((row, rowIndex) => (
            <StripRow
              columns={columns}
              hasTotals={hasTotals}
              idPrefix={idPrefix}
              key={row.id}
              row={row}
              rowIndex={rowIndex}
              zeroLabel={zeroLabel}
            />
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}
