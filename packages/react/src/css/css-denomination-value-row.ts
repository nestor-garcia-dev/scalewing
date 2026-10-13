import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';

const data = typographyVariants.data;
const label = typographyVariants.label;

export const denominationValueRowClass = 'sw-denomination-value-row';

const valueRow = `.sw-denomination-strip .${denominationValueRowClass}`;

/*
 * A value line under a strip row: the subtle fill across the row (its
 * pinned label too), each value at label size in data weight and tabular
 * figures (the framed counts' size), centred
 * under its count in the text colour, never wrapped, padded a space-2 step
 * down (space-1 below md): shorter than framed counts above it. A disabled
 * row's line fades its values with the row. Emitted after
 * the frame's rules and one class more specific, so it wins at every width.
 */
export function cssDenominationValueRowClasses(): string {
  return `${valueRow},
${valueRow} .sw-denomination-label {
  background: var(--sw-color-subtle);
}

${valueRow} :is(th, td) {
  padding-block: var(--sw-space-2);
}

${valueRow} .sw-denomination-value {
  color: var(--sw-color-text);
  font-size: ${label.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: ${data.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  text-align: center;
  white-space: nowrap;
}

${valueRow}.sw-denomination-row-disabled .sw-denomination-value {
  opacity: var(--sw-disabled-opacity);
}

@media ${breakpointQuery('below', 'md')} {
  ${valueRow} :is(th, td) { padding-block: var(--sw-space-1); }
  ${valueRow} .sw-denomination-total { padding: 0; }
}

@media (forced-colors: active) {
  ${valueRow},
  ${valueRow} .sw-denomination-label { background: Canvas; }
  ${valueRow} .sw-denomination-value { color: CanvasText; }
}`;
}

export function denominationValueRowClassCatalog(): string[] {
  return [denominationValueRowClass, 'sw-denomination-value'];
}
