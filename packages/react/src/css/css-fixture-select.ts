import { coarsePointerQuery } from './touch-target.js';

/*
 * The select sits before the row in the run's first column, centred on
 * the row's height, outside the row's press area, with the row's start
 * padding before it (none on a coarse pointer, where the 44 px target
 * already pads the box). The box is Checkbox's, its label visually hidden, so
 * it is its own size on a fine pointer and 44 × 44 px on a coarse one
 * (`.sw-checkbox-label-hidden`). The run's first column is `auto`, so a
 * run without a select keeps no space for it.
 */
function selectRules(): string {
  return `.sw-fixture-select {
  align-items: center;
  align-self: center;
  display: inline-flex;
  grid-column: 1;
  grid-row: 1;
  padding-inline-start: var(--sw-space-2);
}

@media ${coarsePointerQuery} {
  .sw-fixture-select { padding-inline-start: 0; }
}`;
}

/* Without subgrid each item is a flex row: the select, the row, the action. */
function selectFallbackRules(): string {
  return `@supports not (grid-template-columns: subgrid) {
  .sw-fixture-item-select {
    align-items: center;
    display: flex;
  }

  .sw-fixture-item-select > .sw-fixture-row {
    flex: 1 1 auto;
    min-width: 0;
  }
}`;
}

/* FixtureRow's select (see components/FixtureRow.tsx); after the row rules. */
export function cssFixtureSelectClasses(): string {
  return `${selectRules()}

${selectFallbackRules()}`;
}

export function fixtureSelectClassCatalog(): string[] {
  return ['sw-fixture-item-select', 'sw-fixture-select'];
}
