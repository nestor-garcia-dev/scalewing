import { cx } from '../../class-names.js';
import { denominationCellToneClassNames } from '../../css/css-denomination-cell-tones.js';
import { denominationCellView } from '../../denomination-cells.js';
import { type DenominationGridRow } from './types.js';

type CountCellProps = {
  row: DenominationGridRow;
  index: number;
  zeroLabel: string;
  /** More classes for the cell, such as the transposed layout's row look. */
  className?: string;
};

/**
 * One count, read-only: the zero label, a signed delta, and the cell's tone.
 * A signed row's positive count is success; a negative count is danger
 * unless its row's `negativeAppearance` is `plain`. The value has its own
 * box, which the `pill` tone appearance fills.
 */
export function CountCell({
  row,
  index,
  zeroLabel,
  className,
}: CountCellProps) {
  const view = denominationCellView(
    row.cells[index] ?? null,
    row.signed ?? false,
    zeroLabel,
  );
  return (
    <td
      className={cx(
        'sw-denomination-cell',
        `sw-denomination-cell-${view.state}`,
        row.signed && 'sw-denomination-cell-signed',
        row.negativeAppearance === 'plain' && 'sw-denomination-cell-plain',
        ...denominationCellToneClassNames(row.cellTones?.[index]),
        className,
      )}
    >
      <span className="sw-denomination-cell-value">{view.text}</span>
    </td>
  );
}
