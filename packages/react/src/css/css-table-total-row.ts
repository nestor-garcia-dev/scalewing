/*
 * A total row mid-table (`TableRow variant="total"`), such as a subtotal
 * the rows above add up to before the table goes on: its cells at weight
 * 600 under the footer's heavier rule, 2 px in the border colour across
 * its top, as a `TableFooter` total is drawn. The rule is the cells' own
 * top border, which the collapsed-border model resolves over the row
 * above's 1 px one, so forced colours keep it (in `CanvasText`) and no
 * pseudo-element is taken from a selected row's bar or a sub row's guide.
 * The row takes no fill: on the subtle fill, accent text (a link or an
 * accent-toned figure) falls under 4.5:1 in several palettes, as the
 * selected row's note in `css-table.ts` found. A total row belongs in the
 * body: a pinned header cell draws its rules on its pseudo-elements
 * instead, and a `TableFooter` already draws the total at the table's
 * end. A cell's `tone` keeps its colour; a struck total row mutes and
 * strikes it as any struck row.
 */
export function cssTableTotalRowClasses(): string {
  return `.sw-table .sw-table-row-total > :is(th, td) {
  border-top: 2px solid var(--sw-color-border);
  font-weight: 600;
}

@media (forced-colors: active) {
  .sw-table .sw-table-row-total > :is(th, td) { border-top-color: CanvasText; }
}`;
}

export function tableTotalRowClassCatalog(): string[] {
  return ['sw-table-row-total'];
}
