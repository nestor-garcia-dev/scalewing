import { chevronStroke } from './chevron.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

/*
 * A sortable header's button keeps the header's own text style (caption,
 * semibold, muted): it is the column's name that can be pressed, not a link
 * or a ghost button. The sorted column's name is the text color. The glyph
 * is the stroked chevron Accordion and Select draw: up for ascending, down
 * for descending, and a quieter up-and-down pair on a column that can be
 * sorted but is not. In an end-aligned (numeric) column the glyph goes
 * before the name, so the name's end lines up with the figures under it.
 */
function glyphRules(): string {
  const chevron = `content: '';
  ${chevronStroke.replaceAll('\n', '\n  ')}
  border-color: currentColor;
  display: block;`;
  return `.sw-table-sort-glyph {
  align-items: center;
  display: inline-flex;
  flex: none;
  flex-direction: column;
  justify-content: center;
  min-height: var(--sw-space-4);
  width: var(--sw-space-2);
}

.sw-table-sort-ascending::before,
.sw-table-sort-none::before {
  ${chevron}
  margin-top: calc(var(--sw-space-1) / 2);
  transform: rotate(-135deg);
}

.sw-table-sort-descending::after,
.sw-table-sort-none::after {
  ${chevron}
  margin-bottom: calc(var(--sw-space-1) / 2);
  transform: rotate(45deg);
}

.sw-table-sort-none {
  opacity: var(--sw-quiet-opacity);
}

.sw-table-sort-none::before,
.sw-table-sort-none::after {
  height: calc(var(--sw-space-2) * 0.75);
  width: calc(var(--sw-space-2) * 0.75);
}`;
}

export function cssTableSortClasses(): string {
  return `.sw-table-sort {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--sw-radius-sm);
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  gap: var(--sw-space-1);
  letter-spacing: inherit;
  /* A step of room for the focus ring, taken back so the name stays on the cell's edge. */
  margin-inline: calc(-1 * var(--sw-space-1));
  min-height: var(--sw-control-xs-min-height);
  padding: 0 var(--sw-space-1);
  text-align: inherit;
}

.sw-table .sw-table-numeric .sw-table-sort,
.sw-table .sw-table-end .sw-table-sort {
  flex-direction: row-reverse;
}

.sw-table-sort:hover,
.sw-table th[aria-sort] .sw-table-sort {
  color: var(--sw-color-text);
}

.sw-table-sort:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

${glyphRules()}

@media ${coarsePointerQuery} {
  .sw-table-sort { min-height: ${touchTarget}; }
}

@media (forced-colors: active) {
  .sw-table-sort { color: ButtonText; }
  .sw-table-sort-none { opacity: 1; }
}`;
}

export function tableSortClassCatalog(): string[] {
  return [
    'sw-table-sort',
    'sw-table-sort-glyph',
    'sw-table-sort-ascending',
    'sw-table-sort-descending',
    'sw-table-sort-none',
  ];
}
