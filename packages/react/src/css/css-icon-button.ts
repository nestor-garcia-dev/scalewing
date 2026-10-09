import { buttonSizes } from '@scalewing/tokens';

import { coarsePointerQuery, touchTarget } from './touch-target.js';

/*
 * An icon-only Button drawn by `className` (CalendarButton, InfoTip): square
 * at every Button size, as wide as the size's control height, and the full
 * touch target on a coarse pointer at the smaller sizes too. The coarse
 * pointer's rule follows the squares, which it outranks only by order.
 */
export function iconButtonRules(className: string): string {
  const squares = buttonSizes
    .map(
      (size) =>
        `.sw-button-${size}.${className} { min-width: var(--sw-control-${size}-min-height); }`,
    )
    .join('\n');
  return `.sw-button.${className} {
  flex: none;
  padding-inline: 0;
}

${squares}

@media ${coarsePointerQuery} {
  .sw-button.${className} {
    min-height: ${touchTarget};
    min-width: ${touchTarget};
  }
}`;
}
