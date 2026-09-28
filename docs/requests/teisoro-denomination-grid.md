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
