/**
 * A strip row's total cell: the consumer's total, or empty. Below md it is
 * visually hidden, and `StripTotalInline` shows it under the row's name.
 */
export function StripTotalCell({ total }: { total: string | undefined }) {
  return (
    <td className="sw-denomination-total">
      <span className="sw-denomination-total-value">{total ?? ''}</span>
    </td>
  );
}

/** The total under a row's name on a phone; the cell reads it to everyone. */
export function StripTotalInline({ total }: { total: string | undefined }) {
  return total !== undefined ? (
    <span aria-hidden="true" className="sw-denomination-total-inline">
      {total}
    </span>
  ) : null;
}
