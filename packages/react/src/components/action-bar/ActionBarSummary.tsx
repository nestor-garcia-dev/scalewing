import { cx } from '../../class-names.js';

export const actionBarSummaryTones = ['default', 'danger', 'success'] as const;

/** The value's color: the text color, or danger (short) or success (matched). */
export type ActionBarSummaryTone = (typeof actionBarSummaryTones)[number];

/** A labelled figure for the bar, such as "Counted $33,790.00 short $4,000.00". */
export type ActionBarSummary = {
  /** What the figure is, such as "Counted". */
  label: string;
  /**
   * The figure, formatted by the consumer, such as "$33,790.00". An empty
   * string (or only spaces) means there is no figure yet, such as before
   * anything is counted: the summary line is left out and the live region
   * stays, so the first figure is announced when it arrives.
   */
  value: string;
  /** A short line after the figure, such as "short $4,000.00". */
  detail?: string;
  /** Colors the value only; the words say why. Defaults to `default`. */
  tone?: ActionBarSummaryTone;
};

function isBlank(text: unknown): boolean {
  return typeof text !== 'string' || !text.trim();
}

/** Whether the summary has a figure to show; an empty value has none yet. */
export function hasActionBarSummaryFigure(summary: ActionBarSummary): boolean {
  return !isBlank(summary.value);
}

export function assertActionBarSummary(summary: ActionBarSummary): void {
  if (isBlank(summary.label))
    throw new RangeError('ActionBar summary needs a label');
  if (typeof summary.value !== 'string')
    throw new RangeError('ActionBar summary value must be a string');
  if (summary.detail !== undefined && isBlank(summary.detail))
    throw new RangeError('ActionBar summary detail must not be empty');
  if (
    summary.tone !== undefined &&
    !(actionBarSummaryTones as readonly unknown[]).includes(summary.tone)
  )
    throw new RangeError(
      `Unknown ActionBar summary tone: ${String(summary.tone)}`,
    );
}

/**
 * The bar's figure: its label, the value in the heading variant at tabular
 * figures, and its detail, on one baseline, wrapping as one phrase.
 * Nothing while the value is empty.
 */
export function ActionBarSummaryLine({
  summary,
}: {
  summary: ActionBarSummary;
}) {
  if (!hasActionBarSummaryFigure(summary)) return null;
  const tone = summary.tone ?? 'default';
  return (
    <span
      className={cx(
        'sw-action-bar-summary',
        tone !== 'default' && `sw-action-bar-summary-${tone}`,
      )}
    >
      <span className="sw-action-bar-summary-label">{summary.label}</span>{' '}
      <span className="sw-action-bar-summary-value sw-text-heading sw-tabular">
        {summary.value}
      </span>
      {summary.detail ? (
        <>
          {' '}
          <span className="sw-action-bar-summary-detail">{summary.detail}</span>
        </>
      ) : null}
    </span>
  );
}
