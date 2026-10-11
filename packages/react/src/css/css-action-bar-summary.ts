import { typographyVariants } from '@scalewing/tokens';

const label = typographyVariants.label;

/*
 * The bar's figure: label, value and detail on one baseline, a small gap
 * apart, wrapping as one phrase. The value takes the heading variant and
 * tabular figures from the text classes it carries (so it steps down below
 * md with every heading); the label and detail are muted label-size words
 * at regular weight. A tone colors the value only. Forced colors keep the
 * system text color.
 */
export function cssActionBarSummaryClasses(): string {
  return `.sw-action-bar-summary {
  align-items: baseline;
  column-gap: var(--sw-space-2);
  display: inline-flex;
  flex-wrap: wrap;
  min-width: 0;
}

.sw-action-bar-summary-label,
.sw-action-bar-summary-detail {
  color: var(--sw-color-muted);
  font-size: ${label.fontSize}px;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
}

.sw-action-bar-summary-value {
  color: var(--sw-color-text);
}

.sw-action-bar-summary-danger .sw-action-bar-summary-value { color: var(--sw-color-danger); }
.sw-action-bar-summary-success .sw-action-bar-summary-value { color: var(--sw-color-success); }

@media (forced-colors: active) {
  .sw-action-bar-summary-value { color: CanvasText; }
}`;
}

export function actionBarSummaryClassCatalog(): string[] {
  return [
    'sw-action-bar-summary',
    'sw-action-bar-summary-label',
    'sw-action-bar-summary-value',
    'sw-action-bar-summary-detail',
    'sw-action-bar-summary-danger',
    'sw-action-bar-summary-success',
  ];
}
