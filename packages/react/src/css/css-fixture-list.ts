import { typographyVariants } from '@scalewing/tokens';

const caption = typographyVariants.caption;

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
