import { mutedReadsAsText, quietFill } from './quiet-fill.js';

/*
 * The action sits after the row in its own column, centred on the row's
 * height, outside the row's press area, keeping the row's end padding
 * after it. Where :has() is supported the hover fill spans the whole item,
 * so the row, its select and its action read as one line; a detail under
 * the row is on that fill too, so its muted words take the text colour.
 */
function actionRules(): string {
  return `.sw-fixture-action {
  align-items: center;
  align-self: center;
  display: inline-flex;
  grid-column: -2 / -1;
  grid-row: 1;
  padding-inline-end: var(--sw-space-2);
}

@supports selector(:has(*)) {
  @media (hover: hover) {
    :is(.sw-fixture-item-action, .sw-fixture-item-select):has(> .sw-fixture-row-pressable:hover) {
      background: ${quietFill};
    }

    :is(.sw-fixture-item-action, .sw-fixture-item-select) > .sw-fixture-row-pressable:hover {
      background: transparent;
    }

    ${mutedReadsAsText([':is(.sw-fixture-item-action, .sw-fixture-item-select):has(> .sw-fixture-row-pressable:hover) > .sw-fixture-detail'])}
  }
}`;
}

/* Without subgrid each item is a flex row: the row grows, the action follows. */
function actionFallbackRules(): string {
  return `@supports not (grid-template-columns: subgrid) {
  .sw-fixture-item-action {
    align-items: center;
    display: flex;
  }

  .sw-fixture-item-action > .sw-fixture-row {
    flex: 1 1 auto;
    min-width: 0;
  }
}`;
}

/* FixtureRow's action (see components/FixtureRow.tsx); after the row rules. */
export function cssFixtureActionClasses(): string {
  return `${actionRules()}

${actionFallbackRules()}`;
}

export function fixtureActionClassCatalog(): string[] {
  return ['sw-fixture-item-action', 'sw-fixture-action'];
}
