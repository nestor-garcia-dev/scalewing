import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';

const label = typographyVariants.label;

export const denominationGridFrames = ['none', 'table'] as const;

/**
 * How a strip sits on the page: `none` (the default) is open rows on the
 * page's own surface; `table` is a framed table: the surface inside a
 * hairline with rounded corners, the heading row on the subtle fill, a
 * rule between columns, and the counts at label size, centred under
 * their heads.
 */
export type DenominationGridFrame = (typeof denominationGridFrames)[number];

export const denominationTotalEmphases = ['default', 'strong'] as const;

/**
 * How the row totals read: `default` is data type in the row's tone (a
 * neutral row's muted); `strong` is label type in bold, a neutral row's in
 * the text color and a toned row's in its tone.
 */
export type DenominationTotalEmphasis =
  (typeof denominationTotalEmphases)[number];

export const denominationFramedClass = 'sw-denomination-framed';
export const denominationScrollFramedClass = 'sw-denomination-scroll-framed';
export const denominationTotalsStrongClass = 'sw-denomination-totals-strong';

const framed = `.sw-denomination-strip.${denominationFramedClass}`;
const strong = `.${denominationTotalsStrongClass}`;

/*
 * A framed strip. The frame is the scroll region's border, so it stays put
 * while a wide strip scrolls inside it and its shades still draw on the
 * region's own shadow. The cells pad a space-3 step across (space-2 below
 * md) and the body cells a space-4 step down, so a read-only row is about
 * as tall as an entry row; the cell padding is zero-specificity past the
 * frame class, so an entry cell keeps its own space-1 padding and, below
 * md, the collapsed total column is collapsed again. The row labels pad
 * the same step whatever their appearance. The pinned label sits on the
 * surface at the same low specificity, so a quiet row's label keeps the
 * subtle fill; the pinned corner takes the heading row's fill. The column
 * rule is a border on every cell after a row's first, so forced colours
 * keep it and RTL mirrors it; the collapsed total column draws none.
 * Emitted after the grid's own rules, its label appearances and its
 * narrow-screen padding, so it wins at every width.
 */
function frameRules(): string {
  return `.${denominationScrollFramedClass} {
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
}

${framed} :where(th, td) {
  padding: var(--sw-space-4) var(--sw-space-3);
}

${framed} thead :where(th, td),
${framed} thead .sw-denomination-corner:first-child {
  background: var(--sw-color-subtle);
  padding-block: var(--sw-space-2);
}

${framed} :is(th, td) + :is(th, td) {
  border-inline-start: 1px solid var(--sw-color-border);
}

${framed} :where(.sw-denomination-label) {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background: var(--sw-color-surface);
}

${framed} .sw-denomination-label {
  padding-inline: var(--sw-space-3);
}

${framed} .sw-denomination-head:not(.sw-denomination-total-head),
${framed} .sw-denomination-cell {
  text-align: center;
}

${framed} .sw-denomination-cell {
  font-size: ${label.fontSize}px;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
}

@media ${breakpointQuery('below', 'md')} {
  ${framed} :where(th, td),
  ${framed} .sw-denomination-label { padding-inline: var(--sw-space-2); }
  ${framed} .sw-denomination-total,
  ${framed} .sw-denomination-total-head { border-inline-start: 0; padding: 0; }
}

@media (forced-colors: active) {
  .${denominationScrollFramedClass},
  ${framed} :is(th, td) + :is(th, td) { border-color: CanvasText; }
}`;
}

/*
 * Strong totals: label type in bold, a neutral row's in the text color
 * (its tone is the muted color) and a toned row's left in its tone, under
 * the label on a phone too. One class more specific than the plain
 * labels' inline total, so a neutral row's total is the text color there.
 */
function totalRules(): string {
  return `${strong} .sw-denomination-total {
  font-size: ${label.fontSize}px;
  font-weight: 700;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
}

${strong} .sw-denomination-total-inline { font-weight: 700; }

${strong} .sw-denomination-row-neutral .sw-denomination-total,
${strong} .sw-denomination-row-neutral .sw-denomination-total-inline {
  color: var(--sw-color-text);
}`;
}

export function cssDenominationAppearanceClasses(): string {
  return `${frameRules()}

${totalRules()}`;
}

export function denominationAppearanceClassCatalog(): string[] {
  return [
    denominationScrollFramedClass,
    denominationFramedClass,
    denominationTotalsStrongClass,
  ];
}
