import { cx } from '../../class-names.js';
import { denominationCellToneClassNames } from '../../css/css-denomination-cell-tones.js';
import { Stepper } from '../Stepper.js';
import { columnName } from './ColumnHeadText.js';
import {
  type DenominationGridColumn,
  type DenominationGridEntry,
  type DenominationGridRow,
} from './types.js';

type EntryCellProps = {
  row: DenominationGridRow;
  entry: DenominationGridEntry;
  column: DenominationGridColumn;
  index: number;
  /** The value cell under this count, which describes it, if any. */
  describedBy?: string;
};

/**
 * One editable count of a strip row: a full-width `Stepper` named by the
 * row and the column as its header reads ("Counted $1 × 100"), its cap and
 * message from the entry, and the cell's tone on its border (an accent one
 * is the Stepper's changed look).
 */
export function EntryCell({
  row,
  entry,
  column,
  index,
  describedBy,
}: EntryCellProps) {
  const max = entry.max?.[index] ?? undefined;
  const tone = row.cellTones?.[index];
  return (
    <td
      className={cx(
        'sw-denomination-entry',
        ...denominationCellToneClassNames(tone),
      )}
    >
      {/* An accent count is a suggestion or a change: the Stepper's own
          changed look (border and tint), as anywhere else. */}
      <Stepper
        aria-describedby={describedBy}
        changed={tone === 'accent'}
        decrementLabel={entry.decrementLabel}
        disabled={row.disabled}
        error={entry.errors?.[index] ?? undefined}
        incrementLabel={entry.incrementLabel}
        label={`${row.label} ${columnName(column)}`}
        labelVisuallyHidden
        limitAppearance={entry.limitAppearance}
        max={max}
        onChange={(value) => entry.onChange(column.key, value)}
        placeholder={entry.placeholder}
        value={row.cells[index] ?? null}
        width="full"
      />
    </td>
  );
}
