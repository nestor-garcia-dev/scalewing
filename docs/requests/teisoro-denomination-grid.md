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
