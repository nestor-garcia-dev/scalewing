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

export function DenominationGrid({
  label,
  columns,
  rows,
  layout = 'strip',
  subtotal,
  zeroLabel = '—',
}: DenominationGridProps) {
  assertDenominationGrid(label, columns, rows);
  if (!zeroLabel) throw new RangeError('zeroLabel must not be empty');

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
      rows={rows}
      zeroLabel={zeroLabel}
    />
  );
}
