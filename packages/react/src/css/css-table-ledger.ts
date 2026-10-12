/** The colours a cell's text can take: a signed figure or a quiet value. */
export const tableCellTones = ['success', 'danger', 'muted', 'accent'] as const;
export type TableCellTone = (typeof tableCellTones)[number];

/** A row's place in the table: a row of its own, or one under the row above. */
export const tableRowVariants = ['default', 'sub'] as const;
export type TableRowVariant = (typeof tableRowVariants)[number];

export function assertTableCellTone(tone: unknown): void {
  if (tone !== undefined && !tableCellTones.includes(tone as TableCellTone))
    throw new RangeError(`Unknown TableCell tone: ${String(tone)}`);
}

export function assertTableRowVariant(variant: unknown): void {
  if (!tableRowVariants.includes(variant as TableRowVariant))
    throw new RangeError(`Unknown TableRow variant: ${String(variant)}`);
}

function toneRules(): string {
  return tableCellTones
    .map(
      (tone) => `.sw-table .sw-table-tone-${tone} {
  color: var(--sw-color-${tone});
}`,
    )
    .join('\n\n');
}

/*
 * Ledger rules, for a table read across as well as down.
 *
 * A cell tone colours the cell's text in the theme's semantic colour, as
 * Text color does: 4.5:1 on the surface and the canvas in the default
 * palettes and most named ones (the test names the few palette gaps). A
 * struck row mutes its toned cells, so no tone sits on the subtle fill.
 *
 * Column rules draw a hairline at the inline start of every cell after a
 * row's first, so bill columns read as columns. A border, so forced
 * colours keep it and RTL mirrors it; a sticky header cell draws it on
 * its ::after.
 *
 * A row header in the body (`th scope="row"`, such as an entry's name)
 * reads as body text, not as a column header. The reset is no stronger
 * than `.sw-table th`, so a cell's numeric, tone and struck rules win.
 *
 * A sub row sits under the row above it: its row header is indented a
 * space-6 step with a guide bar at the indent, so a batch's items or a
 * change's parts read as parts of one entry. The bar is the header's
 * ::after (::before is the selected row's bar) and a border, so forced
 * colours keep it.
 *
 * A struck row is a voided one kept on the record: the subtle fill, the
 * text muted and struck through. A Badge in it (an inline-flex box) is not
 * struck when it sits in a line of text (it is an atomic inline box; one
 * that is itself a flex item is struck), so its tag, such as "Voided",
 * stays plain; its words say why the row is struck, since a line-through
 * is not read aloud.
 */
export function cssTableLedgerClasses(): string {
  return `${toneRules()}

.sw-table-column-rules :is(th, td) + :is(th, td) {
  border-inline-start: 1px solid var(--sw-color-border);
}

/* A pinned head cell (in a sticky header group) is positioned, so the
   next cell's fill covers a collapsed border; its rule is a border on its
   own ::after instead, so forced colours keep it and the logical inset
   mirrors it. */
.sw-table-sticky.sw-table-column-rules thead :is(th, td) + :is(th, td)::after {
  border-inline-start: 1px solid var(--sw-color-border);
  content: '';
  inset-block: 0;
  inset-inline-start: 0;
  pointer-events: none;
  position: absolute;
}

:where(.sw-table tbody, .sw-table tfoot) th[scope='row'] {
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
}

.sw-table-row-sub > th[scope='row'] {
  padding-inline-start: calc(var(--sw-space-3) + var(--sw-space-6) + var(--sw-space-3));
  position: relative;
}

.sw-table-compact .sw-table-row-sub > th[scope='row'] {
  padding-inline-start: calc(var(--sw-space-2) + var(--sw-space-6) + var(--sw-space-3));
}

.sw-table-row-sub > th[scope='row']::after {
  block-size: var(--sw-space-5);
  border-inline-start: 2px solid var(--sw-color-border);
  content: '';
  inset-block-start: 50%;
  inset-inline-start: calc(var(--sw-space-3) + var(--sw-space-6));
  pointer-events: none;
  position: absolute;
  transform: translateY(-50%);
}

.sw-table-compact .sw-table-row-sub > th[scope='row']::after {
  inset-inline-start: calc(var(--sw-space-2) + var(--sw-space-6));
}

.sw-table .sw-table-row-struck > :is(td, th) {
  background: var(--sw-color-subtle);
  color: var(--sw-color-muted);
  text-decoration: line-through;
}

.sw-table .sw-table-row-struck > [class*='sw-table-tone-'] {
  color: var(--sw-color-muted);
}

@media (forced-colors: active) {
  .sw-table-column-rules :is(th, td) + :is(th, td),
  .sw-table-sticky.sw-table-column-rules thead :is(th, td) + :is(th, td)::after { border-color: CanvasText; }
  .sw-table-row-sub > th[scope='row']::after { border-color: CanvasText; }
}`;
}

export function tableLedgerClassCatalog(): string[] {
  return [
    ...tableCellTones.map((tone) => `sw-table-tone-${tone}`),
    'sw-table-column-rules',
    'sw-table-row-sub',
    'sw-table-row-struck',
  ];
}
