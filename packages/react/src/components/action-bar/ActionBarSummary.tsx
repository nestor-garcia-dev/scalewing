import { cx } from '../../class-names.js';

export const actionBarSummaryTones = ['default', 'danger', 'success'] as const;

/** The value's color: the text color, or danger (short) or success (matched). */
export type ActionBarSummaryTone = (typeof actionBarSummaryTones)[number];

/** A labelled figure for the bar, such as "Counted $33,790.00 short $4,000.00". */
export type ActionBarSummary = {
  /** What the figure is, such as "Counted". */
  label: string;
  /** The figure, formatted by the consumer, such as "$33,790.00". */
  value: string;
  /** A short line after the figure, such as "short $4,000.00". */
  detail?: string;
  /** Colors the value only; the words say why. Defaults to `default`. */
  tone?: ActionBarSummaryTone;
};

function isBlank(text: unknown): boolean {
  return typeof text !== 'string' || !text.trim();
}

export function assertActionBarSummary(summary: ActionBarSummary): void {
  if (isBlank(summary.label) || isBlank(summary.value))
    throw new RangeError('ActionBar summary needs a label and a value');
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
 */
export function ActionBarSummaryLine({
  summary,
}: {
  summary: ActionBarSummary;
}) {
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
