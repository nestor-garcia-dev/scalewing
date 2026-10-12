import { zIndex } from './stacking.js';

/*
 * A sticky header pins the table's whole head group, not cell by cell: the
 * `thead` itself is sticky at the top edge, so every row in it (the column
 * headings and any row under them, such as a running total) and every cell
 * in those rows, `th` and `td` alike, stays in view together, each row at
 * its own offset under the one above. A cell-by-cell pin would leave a
 * second row's `td` cells to scroll away and stack every row's `th` at the
 * same edge. Where the group pins (the page or the table's own region) is
 * `css-table-page-pin.ts`.
 *
 * Each pinned cell is on the glass (solid surface under Reduce
 * Transparency, the system canvas in forced colours), so the rows that
 * scroll under the group never show through, and positioned, so its rules
 * can draw on it. A collapsed border stays where the cell was as the cell
 * moves and leaves a gap the rows under it show through, so a pinned
 * cell has none at its bottom and draws its row rule as a border on its
 * own ::before (forced colours keep it), as its column rule is on its
 * ::after (`css-table-ledger.ts`). The group is on the `stickyCell`
 * layer, over the body cells and under a pinned footer.
 */
export function cssTableStickyHeaderClasses(): string {
  return `.sw-table-sticky thead {
  position: sticky;
  top: 0;
  ${zIndex('stickyCell')}
}

.sw-table-sticky thead :is(th, td) {
  background: var(--sw-glass-fill);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  border-bottom: 0;
  position: relative;
}

.sw-table-sticky thead :is(th, td)::before {
  border-bottom: 1px solid var(--sw-color-border);
  content: '';
  inset-block-end: 0;
  inset-inline: 0;
  pointer-events: none;
  position: absolute;
}

@media (forced-colors: active) {
  .sw-table-sticky thead :is(th, td)::before { border-color: CanvasText; }
}`;
}

export function tableStickyHeaderClassCatalog(): string[] {
  return ['sw-table-sticky'];
}
