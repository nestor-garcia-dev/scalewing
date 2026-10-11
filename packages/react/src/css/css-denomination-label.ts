import { breakpointQuery } from './breakpoints.js';

export const denominationLabelAppearances = ['tone', 'plain'] as const;

/**
 * How a grid's row labels look: `tone` (the default) marks each label with
 * its row's tone, a stripe at its start and the words in the tone; `plain`
 * sets the words in the text color at label weight, with no stripe.
 */
export type DenominationLabelAppearance =
  (typeof denominationLabelAppearances)[number];

export const denominationLabelsPlainClass = 'sw-denomination-labels-plain';

const plain = `.${denominationLabelsPlainClass}`;

/*
 * Plain row labels: the text color, no stripe, and the strip's label cell
 * back to its column's own padding. The row's tone still colors its total.
 * Emitted after the grid's rules (and its narrow-screen padding), and one
 * class more specific, so it wins at every width.
 */
export function cssDenominationLabelClasses(): string {
  return `${plain} .sw-denomination-label {
  border-inline-start: 0;
  color: var(--sw-color-text);
}

/* The total under a phone's label keeps its row's tone. */
${plain} .sw-denomination-total-inline { color: var(--sw-denomination-tone); }

.sw-denomination-strip${plain} .sw-denomination-label {
  padding-inline-start: var(--sw-space-2);
}

.sw-denomination-strip${plain} .sw-denomination-label::before { content: none; }

@media ${breakpointQuery('below', 'md')} {
  .sw-denomination-strip${plain} .sw-denomination-label { padding-inline-start: var(--sw-space-1); }
}

@media (forced-colors: active) {
  ${plain} .sw-denomination-label { color: CanvasText; }
}`;
}

export function denominationLabelClassCatalog(): string[] {
  return [denominationLabelsPlainClass];
}
