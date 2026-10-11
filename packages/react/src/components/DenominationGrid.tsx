import { cx } from '../class-names.js';
import { denominationLabelWidths } from '../css/css-denomination-aligned.js';
import {
  denominationGridFrames,
  denominationTotalEmphases,
  denominationTotalsStrongClass,
} from '../css/css-denomination-appearance.js';
import {
  denominationCellToneAppearances,
  denominationCellTonesPillClass,
} from '../css/css-denomination-cell-tones.js';
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
  DenominationCellToneAppearance,
  DenominationGridColumn,
  DenominationGridEntry,
  DenominationGridFrame,
  DenominationGridLayout,
  DenominationGridProps,
  DenominationGridRow,
  DenominationGridRowEmphasis,
  DenominationGridRowRole,
  DenominationGridTone,
  DenominationLabelWidth,
  DenominationTotalEmphasis,
} from './denomination-grid/types.js';
export type { DenominationLabelAppearance } from '../css/css-denomination-label.js';
export {
  denominationCellToneAppearances,
  denominationGridFrames,
  denominationLabelAppearances,
  denominationTotalEmphases,
};

/** Fails closed on a value outside a closed set, naming the prop. */
function assertOneOf(
  values: readonly string[],
  value: unknown,
  prop: string,
): void {
  if (!values.includes(value as string))
    throw new RangeError(`Unknown ${prop}: ${String(value)}`);
}

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
  frame = 'none',
  totalEmphasis = 'default',
  cellToneAppearance = 'text',
}: DenominationGridProps) {
  assertDenominationGrid(label, columns, rows);
  assertDenominationExtras(layout, columns, rows);
  assertDenominationEntries(layout, columns, rows);
  if (typeof zeroLabel !== 'string')
    throw new RangeError('zeroLabel must be a string');
  if (totalLabel !== undefined && !totalLabel.trim())
    throw new RangeError('totalLabel must not be empty');
  if (rowRole !== 'region' && rowRole !== 'group')
    throw new RangeError("rowRole must be 'region' or 'group'");
  if (labelWidth !== undefined)
    assertOneOf(denominationLabelWidths, labelWidth, 'labelWidth');
  assertOneOf(denominationLabelAppearances, labelAppearance, 'labelAppearance');
  assertOneOf(denominationGridFrames, frame, 'frame');
  assertOneOf(denominationTotalEmphases, totalEmphasis, 'totalEmphasis');
  assertOneOf(
    denominationCellToneAppearances,
    cellToneAppearance,
    'cellToneAppearance',
  );
  const appearanceClass = cx(
    labelAppearance === 'plain' && denominationLabelsPlainClass,
    totalEmphasis === 'strong' && denominationTotalsStrongClass,
    cellToneAppearance === 'pill' && denominationCellTonesPillClass,
  );

  if (layout === 'tiles')
    return (
      <DenominationTiles
        className={appearanceClass || undefined}
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
      className={appearanceClass || undefined}
      columns={columns}
      framed={frame === 'table'}
      label={label}
      labelWidth={labelWidth}
      rows={rows}
      totalLabel={totalLabel}
      zeroLabel={zeroLabel}
    />
  );
}
