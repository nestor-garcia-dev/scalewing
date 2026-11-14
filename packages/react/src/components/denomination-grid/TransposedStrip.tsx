import { type CSSProperties, Fragment, useId } from 'react';

import { cx } from '../../class-names.js';
import { ScrollRegion } from '../ScrollRegion.js';
import { ColumnHeadText } from './ColumnHeadText.js';
import { CountCell } from './CountCell.js';
import { EntryCell } from './EntryCell.js';
import { RowLabelLine } from './RowLabelLine.js';
import { hasValue, valueCellId } from './StripValueRow.js';
import {
  type DenominationGridProps,
  type DenominationGridRow,
} from './types.js';

type TransposedProps = Required<
  Pick<DenominationGridProps, 'label' | 'columns' | 'rows' | 'zeroLabel'>
> &
  Pick<DenominationGridProps, 'totalLabel' | 'pinEnd'> & {
    /** The grid's appearance classes (cell tones), if any. */
    className?: string;
    /** The entry counts' room, as the strip's. */
    style?: CSSProperties;
  };

/** The class of the cells of the column pinned at the inline end. */
const endClass = 'sw-denomination-transposed-end';

/** The look a grid row lends each of its cells in a column. */
function columnClass(row: DenominationGridRow): string | undefined {
  return (
    cx(
      row.emphasis === 'quiet' && 'sw-denomination-transposed-quiet',
      row.disabled && 'sw-denomination-transposed-disabled',
    ) || undefined
  );
}

/**
 * A grid row's heads: its label (glyph, words, caption), then its value
 * line's. A disabled row says so on its heads (a column header may be
 * `aria-disabled`), as the strip's row does, since a column has no element
 * of its own.
 */
function RowHeads({
  row,
  pinned,
}: {
  row: DenominationGridRow;
  /** The row's last column is the grid's pinned end column. */
  pinned: boolean;
}) {
  return (
    <>
      <th
        aria-disabled={row.disabled || undefined}
        className={cx(
          'sw-denomination-head sw-denomination-transposed-head',
          columnClass(row),
          pinned && !row.valueRow && endClass,
        )}
        scope="col"
      >
        <RowLabelLine row={row} />
      </th>
      {row.valueRow ? (
        <th
          aria-disabled={row.disabled || undefined}
          aria-label={`${row.label} ${row.valueRow.label}`}
          className={cx(
            'sw-denomination-head sw-denomination-transposed-head',
            columnClass(row),
            pinned && endClass,
          )}
          scope="col"
        >
          {row.valueRow.label}
        </th>
      ) : null}
    </>
  );
}

/** A grid row's total: under its value line when it has one, else under its counts. */
function RowTotal({
  row,
  pinned,
}: {
  row: DenominationGridRow;
  pinned: boolean;
}) {
  const total = (
    <td
      className={cx(
        'sw-denomination-transposed-total',
        `sw-denomination-row-${row.tone ?? 'neutral'}`,
        columnClass(row),
        pinned && endClass,
      )}
    >
      {row.total ?? ''}
    </td>
  );
  return row.valueRow ? (
    <>
      <td className={columnClass(row)} />
      {total}
    </>
  ) : (
    total
  );
}

/**
 * A strip drawn for a phone: a row per denomination (its label and
 * caption), a column per grid row (its counts, read-only or entered, then
 * its value line's values), and the totals in a last row named by
 * `totalLabel`. Names, entry, tones and the zero label are the strip's;
 * the denomination column stays in view while the columns scroll under it,
 * and with `pinEnd` the last column (the last grid row's value line, which
 * holds its total, else its counts and total) stays in view at the end.
 */
export function TransposedStrip({
  className,
  style,
  label,
  columns,
  rows,
  zeroLabel,
  totalLabel,
  pinEnd = false,
}: TransposedProps) {
  const idPrefix = useId();
  const last = rows.length - 1;
  const pinned = (rowIndex: number) => pinEnd && rowIndex === last;
  /** A count cell is the pinned one when its row has no value line after it. */
  const countEnd = (row: DenominationGridRow, rowIndex: number) =>
    pinned(rowIndex) && !row.valueRow && endClass;
  const hasTotals = rows.some((row) => row.total !== undefined);
  return (
    <ScrollRegion
      aria-label={label}
      className={cx(
        'sw-denomination-scroll sw-denomination-scroll-transposed',
        pinEnd && 'sw-denomination-scroll-pin-end',
      )}
    >
      <table
        className={cx(
          'sw-denomination-grid sw-denomination-transposed',
          rows.some((row) => row.entry) && 'sw-denomination-transposed-entry',
          className,
        )}
        style={style}
      >
        <caption className="sw-sr-only">{label}</caption>
        <thead>
          <tr>
            <td className="sw-denomination-corner" />
            {rows.map((row, rowIndex) => (
              <RowHeads key={row.id} pinned={pinned(rowIndex)} row={row} />
            ))}
          </tr>
        </thead>
        <tbody>
          {columns.map((column, index) => (
            <tr className="sw-denomination-row" key={column.key}>
              <th className="sw-denomination-transposed-label" scope="row">
                <ColumnHeadText column={column} />
              </th>
              {rows.map((row, rowIndex) => {
                const value = row.valueRow?.cells[index];
                const valueId = valueCellId(idPrefix, rowIndex, index);
                return (
                  <Fragment key={row.id}>
                    {row.entry ? (
                      <EntryCell
                        className={cx(
                          columnClass(row),
                          countEnd(row, rowIndex),
                        )}
                        column={column}
                        describedBy={hasValue(value) ? valueId : undefined}
                        entry={row.entry}
                        index={index}
                        row={row}
                      />
                    ) : (
                      <CountCell
                        className={cx(
                          columnClass(row),
                          countEnd(row, rowIndex),
                        )}
                        index={index}
                        row={row}
                        zeroLabel={zeroLabel}
                      />
                    )}
                    {row.valueRow ? (
                      <td
                        className={cx(
                          'sw-denomination-transposed-value',
                          columnClass(row),
                          pinned(rowIndex) && endClass,
                        )}
                        id={valueId}
                      >
                        {hasValue(value) ? value : ''}
                      </td>
                    ) : null}
                  </Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
        {hasTotals ? (
          <tfoot>
            <tr className="sw-denomination-row">
              {totalLabel === undefined ? (
                <td className="sw-denomination-corner" />
              ) : (
                <th className="sw-denomination-transposed-label" scope="row">
                  {totalLabel}
                </th>
              )}
              {rows.map((row, rowIndex) => (
                <RowTotal key={row.id} pinned={pinned(rowIndex)} row={row} />
              ))}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </ScrollRegion>
  );
}
