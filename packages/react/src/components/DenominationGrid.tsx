import { denominationLabelWidths } from '../css/css-denomination-aligned.js';
import { DenominationStrip } from './denomination-grid/DenominationStrip.js';
import { DenominationTiles } from './denomination-grid/DenominationTiles.js';
import { type DenominationGridProps } from './denomination-grid/types.js';
import { assertDenominationGrid } from './denomination-grid/validate.js';

export type {
  DenominationGridColumn,
  DenominationGridLayout,
  DenominationGridProps,
  DenominationGridRow,
  DenominationGridRowRole,
  DenominationGridTone,
  DenominationLabelWidth,
} from './denomination-grid/types.js';

export function DenominationGrid({
  label,
  columns,
  rows,
  layout = 'strip',
  subtotal,
  zeroLabel = '—',
  totalLabel,
  rowRole = 'region',
  labelWidth,
}: DenominationGridProps) {
  assertDenominationGrid(label, columns, rows);
  if (!zeroLabel) throw new RangeError('zeroLabel must not be empty');
  if (totalLabel !== undefined && !totalLabel.trim())
    throw new RangeError('totalLabel must not be empty');
  if (rowRole !== 'region' && rowRole !== 'group')
    throw new RangeError("rowRole must be 'region' or 'group'");
  if (labelWidth !== undefined && !denominationLabelWidths.includes(labelWidth))
    throw new RangeError(`Unknown labelWidth: ${String(labelWidth)}`);

  if (layout === 'tiles')
    return (
      <DenominationTiles
        columns={columns}
        label={label}
        rowRole={rowRole}
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
