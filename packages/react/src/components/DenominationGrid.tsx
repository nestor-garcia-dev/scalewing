import { DenominationStrip } from './denomination-grid/DenominationStrip.js';
import { DenominationTiles } from './denomination-grid/DenominationTiles.js';
import { type DenominationGridProps } from './denomination-grid/types.js';
import { assertDenominationGrid } from './denomination-grid/validate.js';

export type {
  DenominationGridColumn,
  DenominationGridLayout,
  DenominationGridProps,
  DenominationGridRow,
  DenominationGridTone,
} from './denomination-grid/types.js';

/** The widest row-label column, in ch: a label longer than this wraps. */
const maxLabelWidth = 40;

export function DenominationGrid({
  label,
  columns,
  rows,
  layout = 'strip',
  subtotal,
  zeroLabel = '—',
  totalLabel,
  labelWidth,
}: DenominationGridProps) {
  assertDenominationGrid(label, columns, rows);
  if (!zeroLabel) throw new RangeError('zeroLabel must not be empty');
  if (totalLabel !== undefined && !totalLabel.trim())
    throw new RangeError('totalLabel must not be empty');
  if (
    labelWidth !== undefined &&
    !(
      Number.isInteger(labelWidth) &&
      labelWidth > 0 &&
      labelWidth <= maxLabelWidth
    )
  )
    throw new RangeError(
      `labelWidth must be an integer from 1 to ${maxLabelWidth}`,
    );

  if (layout === 'tiles')
    return (
      <DenominationTiles
        columns={columns}
        label={label}
        rows={rows}
        subtotal={subtotal}
        zeroLabel={zeroLabel}
      />
    );

  return (
    <DenominationStrip
      columns={columns}
      label={label}
      labelWidth={labelWidth}
      rows={rows}
      totalLabel={totalLabel}
      zeroLabel={zeroLabel}
    />
  );
}
