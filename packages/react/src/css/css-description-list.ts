import { breakpointQuery } from './breakpoints.js';

/*
 * A spread list sets each row on its own two columns, at every width: the
 * term fits its words up to half the row at the start, and the detail
 * takes the rest, its lines end-aligned at the row's end, a space-4 apart
 * (the list's column gap, which a row's own grid does not inherit). The
 * rows still share the hairlines, the padding and the top alignment.
 */
function spreadRules(): string {
  return `.sw-description-list-spread { grid-template-columns: minmax(0, 1fr); }

.sw-description-list-spread > .sw-description-item {
  column-gap: var(--sw-space-4);
  grid-template-columns: fit-content(50%) minmax(0, 1fr);
}

.sw-description-list-spread .sw-description-detail {
  align-items: flex-end;
  text-align: end;
}`;
}

/**
 * The description list: a two-column grid whose items share its columns
 * (`subgrid`), so every term starts the same column and every detail the
 * next. The term column fits the widest term up to 40% of the list. A
 * hairline divides the rows, the list sits flush with no space above the
 * first row or below the last, and each row aligns to its top. Below `md`
 * a term sits over its detail. A term and a detail are columns of lines:
 * each child is its own line with its own line height, so a caption term
 * starts level with a caption detail instead of on the list's taller line.
 * `spread` puts each detail at its row's end, beside its term at every width.
 */
export function cssDescriptionListClasses(): string {
  return `.sw-description-list {
  column-gap: var(--sw-space-4);
  display: grid;
  grid-template-columns: fit-content(40%) minmax(0, 1fr);
  margin: 0;
  min-width: 0;
}

.sw-description-item {
  align-items: start;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  padding-block: var(--sw-space-2);
  row-gap: var(--sw-space-1);
}

.sw-description-item:first-child { padding-top: 0; }

.sw-description-item:last-child { padding-bottom: 0; }

.sw-description-item + .sw-description-item {
  border-top: 1px solid var(--sw-color-border);
}

.sw-description-term,
.sw-description-detail {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
}

@media ${breakpointQuery('below', 'md')} {
  .sw-description-list { grid-template-columns: minmax(0, 1fr); }
}

${spreadRules()}

@media (forced-colors: active) {
  .sw-description-item + .sw-description-item { border-top-color: CanvasText; }
}`;
}

export function descriptionListClassCatalog(): string[] {
  return [
    'sw-description-list',
    'sw-description-list-spread',
    'sw-description-item',
    'sw-description-term',
    'sw-description-detail',
  ];
}
