/*
 * Parts under the row (a score's message, then `detail`) sit in the
 * item's next grid rows, spanning the run's columns from the home side's
 * start (after a select's box) to the action's end, outside the row's
 * press area. Their inline padding is the row's, so they line up with
 * the home side's start; `detail` keeps the row's padding below it.
 */
function detailRules(): string {
  return `.sw-fixture-item-below > .sw-fixture-row {
  grid-row: 1;
}

.sw-fixture-detail {
  grid-column: 2 / -1;
  grid-row: 3;
  min-width: 0;
  padding: 0 var(--sw-space-2) var(--sw-space-2);
}`;
}

/*
 * Without subgrid each item is a block (or a flex row with a select or an
 * action): the parts under the row wrap onto lines of their own.
 */
function detailFallbackRules(): string {
  return `@supports not (grid-template-columns: subgrid) {
  .sw-fixture-item-below {
    flex-wrap: wrap;
  }

  .sw-fixture-item-below > :is(.sw-fixture-score-error, .sw-fixture-detail) {
    flex: 1 0 100%;
    order: 1;
  }
}`;
}

/* The parts under a FixtureRow (see components/FixtureRow.tsx); after the row rules. */
export function cssFixtureDetailClasses(): string {
  return `${detailRules()}

${detailFallbackRules()}`;
}

export function fixtureDetailClassCatalog(): string[] {
  return ['sw-fixture-item-below', 'sw-fixture-detail'];
}
