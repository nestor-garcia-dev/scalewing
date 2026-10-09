import { breakpointQuery } from './breakpoints.js';
import { type TableColumnSize, tableColumnSizes } from './css-table-layout.js';

/** The row-label widths a strip lines up at: the Table column sizes. */
export type DenominationLabelWidth = TableColumnSize;

export const denominationLabelWidths = Object.keys(
  tableColumnSizes,
) as DenominationLabelWidth[];

export function denominationLabelWidthClass(
  width: DenominationLabelWidth,
): string {
  return `sw-denomination-label-${width}`;
}

/*
 * A strip with a label width lines its columns up with every other strip
 * of the same columns in a container of the same width, such as the cards
 * of a feed: the label column is that width, and the count columns (and the
 * total column from md up, where it is drawn) share the rest of the scroll
 * region's width equally, measured from the region itself (a container, so
 * 100cqi is its width) rather than from the cells' content. Every column is
 * sized, so the browser has no spare width to share by content. A count
 * wider than its share widens its column, and the strip then scrolls as a
 * plain one does. The component sets the column count and whether there is
 * a total column (`--sw-denomination-columns`, `--sw-denomination-total`);
 * below md the total column collapses, so it takes no share.
 */
export function cssDenominationAlignedClasses(): string {
  const widths = Object.entries(tableColumnSizes)
    .map(
      ([size, rem]) =>
        `.${denominationLabelWidthClass(size as DenominationLabelWidth)} { --sw-denomination-label-width: ${rem}rem; }`,
    )
    .join('\n');
  const strip = '.sw-denomination-strip-aligned';
  return `.sw-denomination-scroll-aligned {
  container-type: inline-size;
}

${widths}

${strip} {
  --sw-denomination-total-shown: 1;
  --sw-denomination-share: calc(
    (100cqi - var(--sw-denomination-label-width)) /
      (var(--sw-denomination-columns) + var(--sw-denomination-total) * var(--sw-denomination-total-shown))
  );
}

${strip} th,
${strip} td {
  box-sizing: border-box;
}

${strip} .sw-denomination-label,
${strip} thead .sw-denomination-corner:first-child {
  width: var(--sw-denomination-label-width);
}

${strip} .sw-denomination-cell,
${strip} .sw-denomination-head:not(.sw-denomination-total-head),
${strip} .sw-denomination-total,
${strip} .sw-denomination-total-head {
  width: var(--sw-denomination-share);
}

@media ${breakpointQuery('below', 'md')} {
  ${strip} { --sw-denomination-total-shown: 0; }
  ${strip} .sw-denomination-total,
  ${strip} .sw-denomination-total-head { width: 0; }
}`;
}

export function denominationAlignedClassCatalog(): string[] {
  return [
    'sw-denomination-scroll-aligned',
    'sw-denomination-strip-aligned',
    ...denominationLabelWidths.map(denominationLabelWidthClass),
  ];
}
