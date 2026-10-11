import { type DenominationGridColumn } from './types.js';

/** A column's name as its header reads: the label, then its caption ("$1 × 100"). */
export function columnName(column: DenominationGridColumn): string {
  return column.caption === undefined
    ? column.label
    : `${column.label} ${column.caption}`;
}

/** A column's label and, after it, its muted caption ("$1 × 100"). */
export function ColumnHeadText({ column }: { column: DenominationGridColumn }) {
  if (column.caption === undefined) return <>{column.label}</>;
  return (
    <>
      {column.label}{' '}
      <span className="sw-denomination-head-caption">{column.caption}</span>
    </>
  );
}
