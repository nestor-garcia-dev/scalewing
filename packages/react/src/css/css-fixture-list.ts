import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';

const caption = typographyVariants.caption;

/**
 * How a FixtureGroup's sides take the row: `fluid` (the default) share all
 * of it, so the centre sits in the middle of whatever is left; `fixed` are
 * at most 16rem each, the end column taking the rest, so the centre sits at
 * the same place in every run on a page.
 */
export const fixtureGroupSides = ['fluid', 'fixed'] as const;
export type FixtureGroupSides = (typeof fixtureGroupSides)[number];

const fixedSide = 'minmax(0, 16rem)';

/*
 * The centre's least width in a `fixed` run: an `auto` column alone is as
 * wide as its widest centre, which differs between a run of scores and a run
 * of kickoff times and would move the centres apart. This holds either, and
 * two score boxes, with its margins.
 */
const fixedCentre = 'minmax(7rem, auto)';

/*
 * From \`md\` only: below it the narrow rules' columns stand, the end on a
 * second line. Without subgrid each row is its own grid of the same fixed
 * columns, which line up on their own.
 */
function fixedSidesRules(): string {
  return `@media ${breakpointQuery('from', 'md')} {
  .sw-fixture-list-sides-fixed {
    grid-template-columns: auto ${fixedSide} ${fixedCentre} ${fixedSide} 1fr auto auto;
  }

  @supports not (grid-template-columns: subgrid) {
    .sw-fixture-list-sides-fixed .sw-fixture-row {
      grid-template-columns: ${fixedSide} ${fixedCentre} ${fixedSide} 1fr auto;
    }
  }
}`;
}

/*
 * The run: one grid whose columns are the select, the home side, the
 * centre, the away side, the end (details and status), the chevron and the
 * action. Each item is a subgrid of it, and its row a subgrid of every
 * column but the select's and the action's, so every row's centre, end and
 * action line up down the run. The space between the columns is the
 * centre's, the end's, the chevron's, the select's and the action's own
 * margin, so a run with none of them keeps no gap.
 */
export function cssFixtureListRules(): string {
  return `.sw-fixture-group {
  display: flex;
  flex-direction: column;
}

.sw-fixture-group-title {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  padding-block: var(--sw-space-2) var(--sw-space-1);
}

.sw-fixture-list {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto minmax(0, 1fr) auto auto auto;
  list-style: none;
  margin: 0;
  padding: 0;
}

.sw-fixture-item,
.sw-fixture-row {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}

.sw-fixture-row {
  grid-column: 2 / -2;
}

.sw-fixture-item {
  border-top: 1px solid var(--sw-color-border);
}`;
}

/** After the row's narrow and fallback rules, which `fixed` outranks only from md. */
export function cssFixtureListSidesRules(): string {
  return fixedSidesRules();
}
