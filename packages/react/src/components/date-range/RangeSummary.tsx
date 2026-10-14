export type RangeSummaryProps = {
  /** The range being picked, with its weekdays. */
  line: string;
  /** Its length, such as "7 days". */
  count: string;
  /** How to pick, after the length; left out where the page shows it elsewhere. */
  hint?: string;
  /** Keep the words for assistive technology only, where the page shows them elsewhere. */
  visuallyHidden?: boolean;
};

/**
 * The range being picked, in a polite live region so each press is heard:
 * the range on its own line, then its length and the hint.
 */
export function RangeSummary({
  line,
  count,
  hint,
  visuallyHidden = false,
}: RangeSummaryProps) {
  const status = (
    <div aria-atomic="true" className="sw-date-range-status" role="status">
      <span className="sw-date-range-line">{line}</span>{' '}
      <span className="sw-date-range-count">{count}</span>
    </div>
  );
  if (visuallyHidden) return <div className="sw-sr-only">{status}</div>;
  return (
    <div className="sw-date-range-summary">
      {status}
      {hint === undefined ? null : (
        <>
          <span aria-hidden="true" className="sw-date-range-separator">
            {' · '}
          </span>
          <span className="sw-date-range-hint">{hint}</span>
        </>
      )}
    </div>
  );
}
