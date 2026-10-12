import { zIndex } from './stacking.js';

/*
 * A table footer holds a total: its cells at weight 600 under a heavier
 * rule, a 2 px line in the border colour across the top of its first row.
 * The line is each cell's ::before (absolutely placed, a border, so forced
 * colours keep it), not the cell's own collapsed border, which a sticky
 * cell would leave behind as it moved.
 *
 * A sticky footer pins its cells to the bottom edge on the header's glass
 * (solid surface under reduced transparency, the system canvas in forced
 * colours, as the pinned header cells), on the `stickyFooter` layer: over
 * the cells and the pinned head group, under the ActionBar, which covers
 * it, so a page does not pair the two. Where it pins (the page or the
 * table's own region) is `css-table-page-pin.ts`.
 */
export function cssTableFooterClasses(): string {
  return `.sw-table tfoot :is(th, td) {
  font-weight: 600;
  position: relative;
}

.sw-table tfoot > tr:first-child > :is(th, td)::before {
  border-top: 2px solid var(--sw-color-border);
  content: '';
  /* Over the last body row's 1 px border, so the rule reads 2 px. */
  inset-block-start: -1px;
  inset-inline: 0;
  pointer-events: none;
  position: absolute;
}

.sw-table .sw-table-footer-sticky :is(th, td) {
  background: var(--sw-glass-fill);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  bottom: 0;
  position: sticky;
  ${zIndex('stickyFooter')}
}

@media (forced-colors: active) {
  .sw-table tfoot > tr:first-child > :is(th, td)::before { border-color: CanvasText; }
  .sw-table .sw-table-footer-sticky :is(th, td),
  .sw-table-sticky thead :is(th, td) { background: Canvas; backdrop-filter: none; -webkit-backdrop-filter: none; }
}`;
}

export function tableFooterClassCatalog(): string[] {
  return ['sw-table-footer-sticky'];
}
