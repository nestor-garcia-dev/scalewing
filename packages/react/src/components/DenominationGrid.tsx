import { denominationLabelWidths } from '../css/css-denomination-aligned.js';
import {
  denominationLabelAppearances,
  denominationLabelsPlainClass,
} from '../css/css-denomination-label.js';
import { DenominationStrip } from './denomination-grid/DenominationStrip.js';
import { DenominationTiles } from './denomination-grid/DenominationTiles.js';
import { type DenominationGridProps } from './denomination-grid/types.js';
import { assertDenominationGrid } from './denomination-grid/validate.js';
import {
  assertDenominationEntries,
  assertDenominationExtras,
} from './denomination-grid/validate-entry.js';

export type {
  DenominationGridColumn,
  DenominationGridEntry,
  DenominationGridLayout,
  DenominationGridProps,
  DenominationGridRow,
  DenominationGridRowEmphasis,
  DenominationGridRowRole,
  DenominationGridTone,
  DenominationLabelWidth,
} from './denomination-grid/types.js';
export type { DenominationLabelAppearance } from '../css/css-denomination-label.js';
export { denominationLabelAppearances };

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
  labelAppearance = 'tone',
}: DenominationGridProps) {
  assertDenominationGrid(label, columns, rows);
  assertDenominationExtras(layout, columns, rows);
  assertDenominationEntries(layout, columns, rows);
  if (!zeroLabel) throw new RangeError('zeroLabel must not be empty');
  if (totalLabel !== undefined && !totalLabel.trim())
    throw new RangeError('totalLabel must not be empty');
  if (rowRole !== 'region' && rowRole !== 'group')
    throw new RangeError("rowRole must be 'region' or 'group'");
  if (labelWidth !== undefined && !denominationLabelWidths.includes(labelWidth))
    throw new RangeError(`Unknown labelWidth: ${String(labelWidth)}`);
  if (!denominationLabelAppearances.includes(labelAppearance))
    throw new RangeError(`Unknown labelAppearance: ${String(labelAppearance)}`);
  const labelClass =
    labelAppearance === 'plain' ? denominationLabelsPlainClass : undefined;

  if (layout === 'tiles')
    return (
      <DenominationTiles
        className={labelClass}
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
      className={labelClass}
      columns={columns}
      label={label}
      labelWidth={labelWidth}
      rows={rows}
      totalLabel={totalLabel}
      zeroLabel={zeroLabel}
    />
  );
}
