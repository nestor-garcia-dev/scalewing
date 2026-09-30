Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S21 task 800; pending independent review and packed-consumer verification.
Renderer: react
Missing surface: `DenominationGrid`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Table` renders cells but cannot express a toned row label with an icon slot, muted zero cells, signed delta cells toned by sign, a per-row total that relocates on a phone, or the tile layout (column label over count over subtotal). Teisoro composed a bill-only, read-only strip from `Table`, `Badge`, `Text`, and `Stack` (S13 task 765) and every other route (drawer panel, cash-flow summary, register closeout, vault) would re-implement it with product-owned tone logic.
Existing surface this might already be: Table (no tone or tile vocabulary), BarChart (magnitudes, not counts per column).
Workaround I almost used: a product component carrying tone and zero rules, `Badge` per cell, inline styles for the tile layout.
Teisoro use: the Services day drawer panel (expected and counted tiles with dollar subtotals), the cash-flow summary (In, Out, Net rows with signed cells and totals), and every activity card strip (Received, Change, Paid, Added, Dropped, For bank, Starting). Design specs: Teisoro `docs/design/services-day/02-cash-drawer-panel.md`, `06-cash-flow-summary.md`, `07-activity-cards.md`.
Proposed API: `label`, `columns` (`{ key, label }`), `rows` (`{ id, label, cells, icon?, tone?, signed?, total? }`), `layout` (`strip` | `tiles`), `subtotal` (`(count, column) => string`, tiles only), `zeroLabel`.
Behavior and failure boundary: read-only; the primitive does no money arithmetic (subtotals and totals are consumer-formatted strings, so currency and locale stay in the product); null and zero cells render the zero label at quiet opacity; a signed row prefixes positive counts and tones cells by sign; tones reuse the Badge tone vocabulary; invalid columns, duplicate keys or ids, mismatched cell counts, fractional cells, or an empty zero label throw a `RangeError`. An editable mode (count entry with a live subtotal) is a later request from the drawer close design pass (Teisoro task 810).

Scalewing owns the reusable layout, tone and zero rules, generated classes, tests, gallery evidence, and changeset. Teisoro owns column sets, localized labels, currency formatting, icons, and which rows a card shows.

## Follow-up request (2026-09-25, Teisoro F-002-S19 task 1060): a tone per tile

Status: requested; not started.

`tone` is a row property. Two vault surfaces need it on one cell: Remove Cash marks the denominations the vault is short of (Teisoro now moves them to a second, danger-toned "Not enough" row instead of marking the tile in place), and the change-orders inventory marks each bill or coin tile as needing an order or stocked (Teisoro now uses cards with badges instead of toned tiles).

Proposed API: a cell may be `{ value, tone?, note? }` besides a number, where `tone` reuses the Badge tones and `note` is a short consumer string shown under the count in the tiles layout (for example "Only 40 available" or "Order 2 boxes"). A row tone still applies to cells without their own.

Behavior and failure boundary: presentation only; the grid still does no arithmetic. The tone never carries meaning alone: the note or the row label says it.

Teisoro use: `apps/teisoro-web/src/app/vault-page/MovementDialog.tsx` (the vault's holdings in Remove Cash) and `apps/teisoro-web/src/app/change-orders/InventoryCard.tsx`. Design: Teisoro `docs/design/vault/README.md` gap 7 and `docs/design/vault/change-orders.md` gap 1.

## Follow-up request (2026-09-25, Teisoro F-002-S24 task 988): a wide strip scrolls on a phone

Status: implemented for the react 1.8.0 release (Teisoro F-002-S26; PR #59 reviewed and merged); pending consumer verification in Teisoro.

A `strip` grid with eleven columns (seven bills and four coin rolls) does not fit a 390 px phone, and it does not scroll inside its card: it widens the page to about 630 px, so the whole page scrolls sideways. Teisoro's vault period summary now shows the same rows in two grids, bills and then coin rolls, to stay within the phone width.

Proposed behavior: the `strip` layout scrolls horizontally inside its own container when its columns are wider than the container, as `Table` does, with the row labels kept readable; the page itself never scrolls sideways.

Behavior and failure boundary: layout only; no API change and no arithmetic. A Playwright gallery check at 390 px asserts that the document's scroll width equals the viewport width with an eleven-column strip.

Teisoro use: `apps/teisoro-web/src/app/VaultHistoryPage.tsx` (the period summary could return to one grid). Design: Teisoro `docs/design/audit-restorations/README.md`.

Second Teisoro use (F-002-S26): the Services day's drawer audit card (`apps/teisoro-web/src/app/services-day/CashDrawerPanel.tsx`, a six-column bill strip inside an outlined card inside the drawer panel card) spills past its card's right border at 390 px.

Implementation: the strip renders inside a `ScrollRegion` (`.sw-denomination-scroll`, a keyboard-focusable `group` named after the grid's `label`), generated by the same `scrollRegionRules` that now emit Table's `.sw-table-wrap`, so a strip wider than its container scrolls inside it. The row label cell is sticky at the inline start on a glass fill (surface under reduced transparency), so it stays readable while the counts scroll under it; its icon, text, and phone total now sit in `.sw-denomination-label-body`. No prop changes. Gallery evidence: `apps/gallery/e2e/denomination-grid.spec.ts` checks at 390 px that the document's scroll width equals the viewport with an eleven-column strip ("Sightings by hour"), that the strip scrolls inside its card with its row label pinned, and that a strip inside an outlined card inside a card stays within the outlined card's bounds.

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1335): the strip's totals for a screen reader

Status: merged in #73 (2026-09-28) and released in `@scalewing/react` 1.12.0; Teisoro pins it in F-007-S05 task 1340.
Source: Teisoro UX review `services-day-open-and-close.md`, finding SDAY-6 (major, WCAG 1.3.1).

Below `md` the strip hid each row's total cell with `display: none` and showed an `aria-hidden` copy under the row label, so a screen reader on a phone heard the counts by bill but never the In, Out and Net totals. From `md` up the total was read, but its column header was an empty `td`, so it had no name.

Behavior:

- Below `md` the total cell stays in the table. Its text sits in `.sw-denomination-total-value`, which takes the `sw-sr-only` declarations (now one shared constant in `css-utilities.ts`), and the cell loses its padding, so it takes no width. The copy under the row label stays `aria-hidden`, so the total is read once.
- A new optional `totalLabel?: string` renders the total column's header as a visually hidden `th scope="col"` (`.sw-denomination-total-head`). Without it the corner stays the empty `td` it was, now also classed `sw-denomination-total-head`: the review of PR #73 found that without the class the strip's `td` padding (which outranks `.sw-denomination-corner`) left the hidden column about 8 px wide below `md`. A blank `totalLabel` throws a `RangeError`, as a blank `zeroLabel` does. The tiles layout has no total column and ignores it.

Rejected alternatives:

- A default `totalLabel` of "Total". Scalewing components carry no English defaults (DateField's words come from `labels`); the consumer supplies the word.
- A visible header over the totals. The design has none and the strip is already dense on a phone; a visually hidden `th` names the column without changing the layout.
- Keeping `display: none` and giving the row header the total as hidden text. The total would then be read as part of the row label, not as a cell under its column.

Evidence: `denomination-grid.test.tsx` ("names the total column with a visually hidden header", "keeps the empty corner over the totals without a totalLabel", the blank label case); `css/stylesheet.test.ts` (no `display: none` on the total, the visually hidden value below md); `apps/gallery/e2e/denomination-grid.spec.ts` on desktop-en, mobile-es (390 px) and forced-colors: the gallery's "Tag movement by size" strip has a `Total weight` column header, the Net row's accessible name includes `+268 g` at every width, and on a phone the cell's copy is 1 px wide and clipped while the `aria-hidden` copy under the label shows; the "Sightings by hour" strip, which has no `totalLabel`, keeps its total cells in the table (`117 sightings`) and its total corner and cells at most 1 px wide on a phone. Chromium's own accessibility tree (CDP `Accessibility.getFullAXTree`) at 390 px lists `cell: +268 g` and `columnheader: Total weight`.

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1335): a lone tiles row's total

Status: merged in #73 (2026-09-28) and released in `@scalewing/react` 1.12.0; Teisoro pins it in F-007-S05 task 1340.
Source: Teisoro UX review `services-entries.md`, finding ENT-7 (the Scalewing part; Teisoro owns showing the totals on a saved entry).

In the `tiles` layout a row's label line, which carries its `total`, rendered only when the grid had several rows or the row had an icon. A lone row without an icon silently dropped its `total`: Teisoro passed "Cash received" and "Change given" totals to one-row grids and nothing showed, while the row's region was still named as if it had one.

Behavior: the label line also shows when a lone row has a `total`, with the row label beside it so the figure has a name. A lone row with neither an icon nor a total is unchanged (the grid's `label` names it). No API change.

Rejected alternatives:

- Showing only the total, without the row label. A bare figure under the grid's heading would not say what it totals, and the label line's layout is shared with multi-row grids.
- Documenting that the total is dropped. A prop that is silently ignored is a trap; showing it is what every consumer that passes it wants.

Evidence: `denomination-grid.test.tsx` ("shows a single row's total, with its label, even without an icon"); `apps/gallery/e2e/denomination-grid.spec.ts` on desktop-en, mobile-es and forced-colors: the gallery's one-row "Tags fitted today" tiles show "Fitted" and "53 g".

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1350): a lone tiles row names itself once

Status: merged in #75 (2026-09-28) and released in `@scalewing/react` 1.13.0; Teisoro pins it in F-007-S05.
Source: Teisoro UX re-review `services-day-open-and-close.md`, finding SDAY-31 (polish). Open 03's accessibility tree read `heading "Expected from last close"`, then `group "Expected from last close"`, then `region "Expected from last close"`; close 08 read `group "Dropped denominations"` › `region "Dropped denominations"`, and so did every `BillTiles`. Each tiles row was a `section aria-label={row.label}`, a region, even a lone row whose label line is hidden because the grid's label already names it.

Behavior: a row names itself (`aria-label`, so a region) unless it is a lone row without its label line (no icon, no `total`) whose `label` is the grid's own `label`. That row renders its `section` without a name (a generic element, not a landmark), so the grid's `group` is its only name. A lone plain row with different words keeps its region: its label line is hidden, so the region's name is the only place those words are said (code review of PR #75; the first version dropped every lone plain row's name). No API change; `label` stays required and still names the group, so consumers that pass a label are unaffected. The heading above the grid is the consumer's: Teisoro can keep it, since a heading and the group it introduces is the expected pattern, or pass the heading's words as `label` only.

Rejected alternatives:

- An `aria-labelledby` prop pointing the group at the consumer's heading. It would still name the group with the heading's words, so the heading and the group would still both be heard; it adds API without removing a name.
- Dropping the group role on a lone-row grid. The group is what `label` names and what a consumer's tests find; the region was the duplicate.
- Rendering every row without a region. Several rows need their own names ("Expected", "Counted") to tell them apart.

Evidence: `denomination-grid.test.tsx` ("names a lone plain row only by the grid, not by a second region": with the grid's label, no `region` role, no `aria-label`, tiles still render; "keeps a lone plain row's own name when it differs from the grid's": a region named "Expected" inside the "Drawer count" group), with the existing lone-row-with-total and several-rows tests still finding their regions; `apps/gallery/e2e/denomination-grid.spec.ts` on desktop-en, mobile-es and forced-colors: the gallery's lone plain "Tags in the field kit" (its row now labelled with the grid's words, Teisoro's pattern) has no region and none in its ARIA snapshot, while "Tags fitted today" (a lone row with a total) and "Kit audit" (several rows) keep theirs.

## Follow-up request (2026-09-30, Teisoro F-007-S05 task 1375): a row's glyph stays beside its label

Status: implemented on `claude/services-leftovers` for Teisoro F-007-S05 task 1375; pull request pending review.
Source: Teisoro UX final check `services-drawer-cash-and-audits.md`, finding DRW-28 (polish, the part left for Scalewing). `services-day/adds-cash-from-the-vault-after-a-failed-attempt/es-390/05-the-cash-added.part-3.png`: on the activity cards at 390 px, the "Faltante" and "Agregado" row labels put their ⊖ / ⊕ glyph on its own line above the word.

Teisoro need: the activity cards' bill strips (`apps/teisoro-web/src/app/services-day/ActivityCard.tsx`, `FlowStrips`, one `DenominationGrid` with an icon per row) read "⊖ Faltante" on one line on a phone, as they do on a desktop. Teisoro already keeps its own badge and name on one line (no-break spaces); the row label is Scalewing's markup.

Existing surface this might already be: none. Below `md` the strip's `.sw-denomination-label-body` was `flex-direction: column`, so the glyph, the words and the phone total each took their own line by design, and from `md` up it was a wrapping flex row, so a squeezed column could still drop the words under the glyph. No prop changes that.

Behavior (no API change): the row's glyph and words sit in a new `.sw-denomination-label-line` (a flex row that does not wrap, gap spacing step 2, step 1 below `md`), in both the strip and the tiles layouts (one shared `RowLabelLine`). Its narrowest width is the glyph, the gap and the longest word, so a long label wraps its words beside the glyph, never under it. Below `md` the strip's label body still stacks, now the line over the phone total, so the total keeps its own line under the label. A row without an icon is unchanged apart from the wrapper; the row header's accessible name is unchanged.

Rejected alternatives:

- `white-space: nowrap` on the label. It would keep the glyph beside the words, but a long label would widen the pinned label column and push every count sideways on a phone; wrapping beside the glyph keeps the column narrow.
- Removing the column layout below `md` and letting the body wrap. The phone total, which must sit under the label, would share the wrap with the words, and a squeezed column would still drop the words under the glyph.
- A prop to choose the layout. There is no case where the glyph should sit over its words.

Evidence: `denomination-grid.test.tsx` ("DenominationGrid row label line": the strip's body is the line (glyph then words) then the phone total; a tiles row's line sits before its total; the line's rule has no `flex-wrap`, and below `md` the body stacks while the line keeps a row with a step 1 gap); `apps/gallery/e2e/denomination-grid.spec.ts` "a DenominationGrid row keeps its glyph beside its words at every width" on desktop-en, mobile-es and forced-colors: in "Tag movement by size" each row's words start after its glyph on the glyph's line, and on a phone the total sits under them; in the new "Den watch" strip, "Returned to the den at dusk" wraps onto two lines on a phone with every line starting after the glyph.

## Follow-up request (2026-09-30, Teisoro F-007-S05 task 1375): count columns that line up from grid to grid

Status: implemented on `claude/services-leftovers` for Teisoro F-007-S05 task 1375; pull request pending review.
Source: Teisoro UX final check `services-drawer-cash-and-audits.md`, finding DRW-27 (polish, the part left for Scalewing). `admin/09-the-adjustment-recorded.part-3.png`: the "$1" header sits at about x 522 on the adjustment card, 515 on the drop card and 483 on the vault-to-drawer card; `audit/06-…part-3.png` at about x 468; the same at 390 px (es 05 part-3 and part-4). The review asked for "a fixed row-label width … If `DenominationGrid` has no prop for that, ask Scalewing for a `labelWidth`."

Teisoro need: the Services day's activity feed (`apps/teisoro-web/src/app/services-day/ActivityCard.tsx`, `FlowStrips`: one strip per card, the same six bill columns, row labels such as "Received", "Removed", "Agregado") puts each bill column under the one on the card above.

Existing surface this might already be: none. The strip is an auto-layout table at `width: 100%`, so the browser sizes the label column by its words and shares the spare width among the count columns by their widest count; two cards with different labels or counts put "$1" in different places. `columns` has no width, and Teisoro owns no CSS.

Proposed and implemented API (optional, no default change): `labelWidth?: number`, the row-label column's width in characters of the label type (`ch`), a positive integer (anything else throws a `RangeError`). The strip then takes `sw-denomination-strip-aligned` and sets `--sw-denomination-label-width` on the table:

- the row labels get `width: var(--sw-denomination-label-width)`, and every count column head gets one token width (`--sw-space-8`, `--sw-space-5` below `md`), so no column is sized by its content any more;
- without totals every column is fixed, and the table shares any spare width among them in proportion to those widths; with totals the total column, left without a width, takes the spare width at the end (below `md` it still takes none). Either way, strips of the same width, columns and `labelWidth` put each count column in the same place;
- a label longer than the width wraps its words beside its icon (the previous follow-up), so on a phone it does not widen the column; on a desktop the label column's share of the spare width usually fits it on one line;
- a single word longer than the width, or a count wider than its column (three digits on a phone), still widens that column: the table never cuts content. The README says so.
- the tiles layout has no label column and ignores it, as it ignores `totalLabel`.

Why characters: the width must be the same for every card, whatever its labels, so it cannot come from the content; `ch` follows the label type, the locale's text size and the user's zoom, as `DateField`'s 12ch entry does. The consumer knows its longest label in each language ("Removed", "Agregado") and adds room for the icon. A width from the spacing scale would top out at 48 px, too narrow for a label.

Rejected alternatives:

- `table-layout: fixed`. Columns would ignore their content: an eleven-column strip on a phone would squeeze its counts into overlapping cells instead of scrolling (`teisoro-denomination-grid.md`, 2026-09-25 follow-up).
- Candidate labels (`labelWidthFrom={['Removed', …]}`) drawn hidden in the label column to size it. It sizes the label column exactly, but that column would stay a content-sized one, so with totals it would share the spare width with the total column by content and the counts would move again.
- A shared-width context or a `DenominationGrid` group. More API for the same result, when every card in a feed already has the same width and columns.
- A column width per `columns` entry. Teisoro's columns are all alike; a width per column is a table API this primitive does not need.

Evidence: `denomination-grid.test.tsx` ("DenominationGrid labelWidth": the class and `--sw-denomination-label-width: 10ch` on the table; none without it; tiles ignore it; the generated widths for the labels and count heads, and none for the total column; `0`, `-2`, `1.5` and `NaN` throw); `apps/gallery/e2e/denomination-grid.spec.ts` "DenominationGrid strips with one labelWidth line their columns up" on desktop-en, mobile-es and forced-colors, with the gallery's "Den checks, lined up" card (two strips with different labels, one row and two, different counts; two more with totals): every column head's left edge and width within half a pixel between the pair without totals and between the pair with totals; on a phone the total column takes no width and "Seen at the entrance" wraps onto two lines beside its glyph (one line on a desktop); no strip scrolls. Without `labelWidth` the gallery's other strips put the same columns up to 8 px apart.
