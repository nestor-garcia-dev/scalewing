/*
 * A rule under a row (`TableRow rule="after"`), such as the cut under the
 * last playoff place: its cells' bottom border 2 px in the muted grey, a
 * line that reads stronger than the 1 px hairlines between rows (3:1 on
 * the surface, as a line that carries meaning needs) without taking a
 * colour's meaning. The collapsed-border model resolves it over the next
 * row's top, and a border, so forced colours keep it (in `CanvasText`) and
 * right-to-left needs nothing. The row's words and fill are unchanged; say
 * what the line means in words beside the table.
 */
export function cssTableRowRuleClasses(): string {
  return `.sw-table .sw-table-row-rule-after > :is(th, td) {
  border-bottom: 2px solid var(--sw-color-muted);
}

@media (forced-colors: active) {
  .sw-table .sw-table-row-rule-after > :is(th, td) { border-bottom-color: CanvasText; }
}`;
}

export function tableRowRuleClassCatalog(): string[] {
  return ['sw-table-row-rule-after'];
}
