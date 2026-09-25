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
