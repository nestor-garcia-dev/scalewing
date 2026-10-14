/*
 * The measures a table's cells are drawn with, shared by the cell rules
 * (`css-table.ts`, `css-table-sort.ts`) and the bounded table's height
 * (`css-table-bounded.ts`), so a change to one moves the other with it.
 */
export const tableCellPadding = {
  comfortable: { block: 'var(--sw-space-2)', inline: 'var(--sw-space-3)' },
  compact: { block: 'var(--sw-space-1)', inline: 'var(--sw-space-2)' },
} as const;

/** The rule under every row (a collapsed cell border). */
export const tableRuleWidth = '1px';

/** The least height of a sortable header's button on a fine pointer. */
export const tableSortMinHeight = 'var(--sw-control-xs-min-height)';
