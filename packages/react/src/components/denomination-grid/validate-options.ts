import {
  type DenominationGridLayout,
  type DenominationGridRow,
  denominationNegativeAppearances,
  denominationTransposeBreakpoints,
} from './types.js';

/** The digits an entry count can be given room for. */
const countDigitsRange = { min: 3, max: 6 } as const;

/**
 * The grid's later options: a known negative appearance per row, a known
 * transpose breakpoint on a strip only, and a whole count of digits (3 to
 * 6) for a grid with entry rows.
 */
export function assertDenominationOptions(
  layout: DenominationGridLayout,
  rows: readonly DenominationGridRow[],
  transposeBelow: unknown,
  countDigits: unknown,
): void {
  if (
    rows.some(
      (row) =>
        row.negativeAppearance !== undefined &&
        !(denominationNegativeAppearances as readonly unknown[]).includes(
          row.negativeAppearance,
        ),
    )
  )
    throw new RangeError("negativeAppearance must be 'danger' or 'plain'");
  if (transposeBelow !== undefined) {
    if (
      !(denominationTransposeBreakpoints as readonly unknown[]).includes(
        transposeBelow,
      )
    )
      throw new RangeError("transposeBelow must be 'md' or 'lg'");
    if (layout !== 'strip')
      throw new RangeError('transposeBelow needs the strip layout');
  }
  if (countDigits !== undefined) {
    if (
      !Number.isInteger(countDigits) ||
      (countDigits as number) < countDigitsRange.min ||
      (countDigits as number) > countDigitsRange.max
    )
      throw new RangeError('countDigits must be a whole number from 3 to 6');
    if (!rows.some((row) => row.entry))
      throw new RangeError('countDigits needs entry rows');
  }
}
