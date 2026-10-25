import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const body = typographyVariants.body;
const caption = typographyVariants.caption;
const belowMd = breakpointQuery('below', 'md');

/*
 * A box is a text input, so the canvas already draws it as a control
 * (`[data-theme] :is(input[type='text'], …)`: the surface, the hairline,
 * the focus ring and the disabled look). `input.sw-fixture-score-box`
 * matches that rule's specificity and comes later in the sheet, so the
 * box's own size and figures win. It is a square the sm control height
 * (32 px) on a fine pointer, so the row keeps its 44 px height, and the
 * 44 px touch target on a coarse one; two tabular digits at weight 700
 * fit it centred.
 */
const box = '[data-theme] input.sw-fixture-score-box';

function boxRules(): string {
  return `.sw-fixture-score {
  align-items: center;
  display: inline-flex;
  gap: var(--sw-space-1);
}

${box} {
  block-size: var(--sw-control-sm-min-height);
  font-size: ${body.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  inline-size: var(--sw-control-sm-min-height);
  line-height: ${body.lineHeight}px;
  min-height: 0;
  padding: 0;
  text-align: center;
}

@media ${coarsePointerQuery} {
  ${box} {
    block-size: ${touchTarget};
    inline-size: ${touchTarget};
  }
}

/* A phone's run is narrow: the boxes keep a space-2 margin, not the centre's space-3, so the names keep room. */
@media ${belowMd} {
  .sw-fixture-score { margin-inline: var(--sw-space-2); }
}

[data-theme] input.sw-fixture-score-box[aria-invalid='true'] {
  border-color: var(--sw-color-danger);
}

.sw-fixture-score-dash {
  color: var(--sw-color-muted);
}`;
}

/*
 * The score's message, under the row in the run's columns from the home
 * side's start to the action's end, in caption type and the danger ink.
 * Empty, it takes no room, but stays in place as the live region.
 */
function errorRules(): string {
  return `.sw-fixture-score-error {
  color: var(--sw-color-danger);
  display: block;
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  grid-column: 2 / -1;
  grid-row: 2;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  padding-inline: var(--sw-space-2);
}

.sw-fixture-score-error:not(:empty) {
  padding-block-end: var(--sw-space-2);
}

@media (forced-colors: active) {
  [data-theme] input.sw-fixture-score-box[aria-invalid='true'] { border-color: Mark; }
  .sw-fixture-score-dash { color: CanvasText; }
}`;
}

/* FixtureRow's score (see components/fixture/FixtureScoreBoxes.tsx); after the row rules. */
export function cssFixtureScoreClasses(): string {
  return `${boxRules()}

${errorRules()}`;
}

export function fixtureScoreClassCatalog(): string[] {
  return [
    'sw-fixture-score',
    'sw-fixture-score-box',
    'sw-fixture-score-dash',
    'sw-fixture-score-error',
  ];
}
