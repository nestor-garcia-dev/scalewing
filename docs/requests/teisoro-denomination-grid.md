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

Status: implemented as `cellTones` (see "a tone per count, in place" below), merged in #89 (2026-10-02) and released in `@scalewing/react` 1.17.0. The `note` part is not built.

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

Status: merged in #83 (2026-09-30) and released in `@scalewing/react` 1.16.0; Teisoro adopts it next.
Source: Teisoro UX final check `services-drawer-cash-and-audits.md`, finding DRW-28 (polish, the part left for Scalewing). `services-day/adds-cash-from-the-vault-after-a-failed-attempt/es-390/05-the-cash-added.part-3.png`: on the activity cards at 390 px, the "Faltante" and "Agregado" row labels put their ⊖ / ⊕ glyph on its own line above the word.

Teisoro need: the activity cards' bill strips (`apps/teisoro-web/src/app/services-day/ActivityCard.tsx`, `FlowStrips`, one `DenominationGrid` with an icon per row) read "⊖ Faltante" on one line on a phone, as they do on a desktop. Teisoro already keeps its own badge and name on one line (no-break spaces); the row label is Scalewing's markup.

Existing surface this might already be: none. Below `md` the strip's `.sw-denomination-label-body` was `flex-direction: column`, so the glyph, the words and the phone total each took their own line by design, and from `md` up it was a wrapping flex row, so a squeezed column could still drop the words under the glyph. No prop changes that.

Behavior (no API change): the row's glyph and words sit in a new `.sw-denomination-label-line` (a flex row that does not wrap, gap spacing step 2, step 1 below `md`), in both the strip and the tiles layouts (one shared `RowLabelLine`). Only the strip's pinned label column narrows the gap to step 1 below `md`; a tiles row keeps step 2 at every width, as it did before (the first version narrowed both, which the code review of PR #83 caught: Teisoro's transfer dialog tiles would have dropped to 4 px on a phone). Its narrowest width is the glyph, the gap and the longest word, so a long label wraps its words beside the glyph, never under it. Below `md` the strip's label body still stacks, now the line over the phone total, so the total keeps its own line under the label. A row without an icon is unchanged apart from the wrapper; the row header's accessible name is unchanged.

Rejected alternatives:

- `white-space: nowrap` on the label. It would keep the glyph beside the words, but a long label would widen the pinned label column and push every count sideways on a phone; wrapping beside the glyph keeps the column narrow.
- Removing the column layout below `md` and letting the body wrap. The phone total, which must sit under the label, would share the wrap with the words, and a squeezed column would still drop the words under the glyph.
- A prop to choose the layout. There is no case where the glyph should sit over its words.

Evidence: `denomination-grid.test.tsx` ("DenominationGrid row label line": the strip's body is the line (glyph then words) then the phone total; a tiles row's line sits before its total; the line's rule has no `flex-wrap`, and below `md` the body stacks while the line keeps a row with a step 1 gap); `apps/gallery/e2e/denomination-grid.spec.ts` "a DenominationGrid row keeps its glyph beside its words at every width" on desktop-en, mobile-es and forced-colors: in "Tag movement by size" each row's words start after its glyph on the glyph's line, and on a phone the total sits under them; the glyph-to-words gap is 8 px in the "Kit audit" tiles row "Counted" at every width and in the strip 8 px on a desktop and 4 px on a phone; in the new "Den watch" strip, "Returned to the den at dusk" wraps onto two lines on a phone with every line starting after the glyph.

## Follow-up request (2026-09-30, Teisoro F-007-S05 task 1375): count columns that line up from grid to grid — withdrawn from this release

Status: withdrawn from PR #83 on 2026-09-30 by the coordinator after two review rounds; not built. Teisoro keeps DRW-27 open as polish.
Source: Teisoro UX final check `services-drawer-cash-and-audits.md`, finding DRW-27 (polish). `admin/09-the-adjustment-recorded.part-3.png`: the "$1" header sits at about x 522, 515 and 483 on three activity cards (`audit/06-…part-3.png` about x 468), the same at 390 px. The review asked for a `labelWidth`.

Teisoro need: the Services day's activity feed (`apps/teisoro-web/src/app/services-day/ActivityCard.tsx`, `FlowStrips`: one strip per card, the same six bill columns, row labels such as "Received", "Removed", "Agregado") puts each bill column under the one on the card above.

Why the strips misalign: the strip is an auto-layout table at `width: 100%`, so the browser sizes the label column by its words and shares spare width among the count columns in proportion to their widest content, so each card places "$1" differently. `columns` has no width, and Teisoro owns no CSS.

What was tried, and what was learned (for a later design to start from):

1. **`labelWidth?: number` in `ch` plus a token width on every count head, table still `width: 100%`** (e5dc41a). In a roomy card every column is a specified width, the spare width is shared in proportion, and strips line up. But a specified width in an auto-layout table is only a preference: in a card narrower than the label width plus the count columns (about 496 px on a desktop, 304 px below `md`, at 12ch and six columns) Chromium shrinks every column toward its min-content, so the strips misalign again (1–4 px at 450 px, 8 px at a 280 px phone card), and an eleven-column phone strip ignores it. With totals, the total column (left without a width) took all the spare width, so at 1280 px the total sat about 700 px from its counts.
2. **`width: auto` on the table, a hard floor on each count column (an empty `::before` block of the token width), only the label column giving way** (f2c6f77). The total then sits by its counts and narrow phone cards line up. But the floor (64 px per column with padding on a desktop) forces a six-column strip to scroll in any `md`+ card under about 500 px (a 450 px card: 496 and 484 px wide, "$100" hidden, still 12 px apart), where the plain strip fits. And `width: auto` ends each strip after its last column, so with totals of different widths the cards' row separators end at different places: ragged right edges.

Constraints a later design must meet: the plain strip's behavior (fits a phone card, an eleven-column strip scrolls with its label pinned, the phone total takes no width) must not change; a row's total stays next to its counts; the columns must not force scrolling where the plain strip fits; and the separators should span the card. Directions not yet tried: equal count columns sized from the container (for example a CSS grid with `subgrid` rows, which would change the table's semantics, or a container-query width per column), or leaving alignment to a feed that renders its cards' strips as one table.

Rejected along the way: `table-layout: fixed` (an eleven-column phone strip would squeeze its counts into overlapping cells instead of scrolling); hidden candidate labels sizing the label column (it stays content-sized, so with totals the counts still move); a fixed-width total column (totals are consumer strings of any length); a filler cell taking the spare width (an extra cell in every row of a data table).

## Follow-up request (2026-10-02, Teisoro F-007 task 1550): a negative count takes the typographic minus

Status: Merged in #89 (2026-10-02) and released in `@scalewing/react` 1.17.0; Teisoro pins it in F-007 task 1550.
Source: Teisoro UX review `vault-audits-and-tasks.md`, finding AUD-18 (polish). Details 01: the audit's "Difference" row reads "-1" while the page's money reads "−$20.00". `denomination-cells.ts` wrote a negative count with `String(count)`, a hyphen-minus.

Teisoro need: the vault audit details (`apps/teisoro-web/src/app/vault-page/AuditCard.tsx`) show a short bill as "−1", the same sign as the money beside it.

Behavior (no API change): every negative count renders as U+2212 MINUS SIGN followed by its magnitude ("−1"), in a signed row and in an unsigned one, in both layouts. Positive counts in a signed row keep "+"; zero and null keep the zero label; the count is still plain digits (the consumer owns grouping). Totals and subtotals stay consumer strings: a consumer that formats its own negative totals chooses its own sign.

Rejected alternatives:

- Only in a signed row, as the review suggested. A negative count has a sign whether or not the row is signed, and a hyphen is never the right glyph for it; one rule is simpler to document.
- A `formatCount` prop. The grid would hand number formatting to every consumer to fix one glyph; the minus is not a locale choice in the languages Scalewing's consumers ship (en, es).
- `Intl.NumberFormat` with `signDisplay`. Its minus is locale-dependent (a hyphen-minus in `en-US`), which is the glyph being replaced, and it would bring grouping into a primitive that leaves grouping to the consumer.

Evidence: `denomination-grid.test.tsx` ("writes a negative count with the typographic minus, signed or not", and the strip's Net row reading `−1`); `apps/gallery/e2e/denomination-grid.spec.ts` on desktop-en, mobile-es and forced-colors: "Tag movement by size" Net reads `−2` and "Kit check by size" Difference reads `−1`, with no hyphen. The gallery's own negative totals now use the same sign ("−99 g", "−8 g").

## Follow-up request (2026-10-02, Teisoro F-007 task 1550): a tiles row that is not a landmark

Status: Merged in #89 (2026-10-02) and released in `@scalewing/react` 1.17.0; Teisoro pins it in F-007 task 1550.
Source: Teisoro UX review `vault-change-orders.md`, finding CHG-4 (major; the part left for Scalewing). Create 01 `.aria.yml`: each change order holds `group "Order #… · Requested · Bills"` › `region "Bills"` › `list`, so the page lists a landmark named "Bills", "Coin boxes" or "Paid from the vault" per order, 15 regions in one frame. Every named tiles row is a `section aria-label`, a region. The review asks for the region role to be opt-in.

Teisoro need: the change-order cards (`apps/teisoro-web/src/app/change-orders/parts.tsx`, `ChangeTiles`) keep each tiles row named ("Bills", "Coin boxes") inside the order's group, without adding a landmark per row per order.

Proposed API: `rowRole?: 'region' | 'group'` on `DenominationGrid`, default `'region'`; exported type `DenominationGridRowRole`.

Behavior and failure boundary: at `rowRole="group"` every row that is named today keeps the same `aria-label` and gets `role="group"`, so it is announced with its name but is not a landmark; at the default, or with the prop left out, every row is the region it is today. A lone plain row whose label repeats the grid's (SDAY-31) stays unnamed and without a role at either setting. The strip layout has no row containers (its rows are table rows) and ignores the prop. Any other value throws a `RangeError`, as a blank `totalLabel` does. No visual change.

Not done: making `group` the default, which is what "opt-in" literally asks. A consumer that finds a row with `getByRole('region', { name })`, or whose users navigate by landmarks, would change behavior in a minor release. `rowRole="group"` gives Teisoro the result now; flipping the default belongs in the next major release of `@scalewing/react`.

Rejected alternatives:

- Dropping the name from every row (a generic `section`). Several rows need their names to be told apart ("Expected", "Counted"), as the SDAY-31 follow-up found.
- A list of rows (`ul` › `li`) in place of the sections. Each row already holds a list of tiles; a list of lists reads worse than named groups, and the row's name would move to its label line.
- `rowLandmarks?: boolean`. A boolean says what the row is not; naming the role says what it is and leaves room for another value.

Evidence: `denomination-grid.test.tsx` ("DenominationGrid rowRole": regions by default; at `group` no region, each row a named `SECTION` group inside the grid's group, its tiles intact; a lone plain row unnamed and without a role; the strip unchanged; an unknown value throws); `apps/gallery/e2e/denomination-grid.spec.ts` on desktop-en, mobile-es and forced-colors: the new "Nest box check" tiles (`rowRole="group"`) have no region in the DOM or the ARIA snapshot and groups named "Fitted" and "Occupied" with six tiles each, while "Kit audit" and "Tags fitted today" keep their regions.

## Follow-up request (2026-10-02, Teisoro F-007 task 1550): a tone per count, in place

Status: Merged in #89 (2026-10-02) and released in `@scalewing/react` 1.17.0; Teisoro pins it in F-007 task 1550.
Source: Teisoro UX review `vault-moving-cash.md`, finding MOV-10 (minor; the part left for Scalewing), which picks up the 2026-09-25 "a tone per tile" request above. Short 02: typing 41 in the $100 field moves the $100 tile out of its row into a full-width danger-toned "Not enough" row (Teisoro's `TileGroup` in `app/vault-page/parts.tsx` renders a second `DenominationGrid`, because "Scalewing tones a whole row, not a single tile"), and the fields being typed in move down about 135 px.

Teisoro need: the vault holdings tiles in Remove Cash, the audit and the money-truck dialogs keep every tile in its row and turn the short one red in place; the field's own "Only 40 available" says why. The change-orders inventory can tone a tile that needs an order the same way.

Proposed API: `cellTones?: readonly (DenominationGridTone | null)[]` on a row, one entry per column (`null` for none), parallel to `cells`.

Behavior and failure boundary: presentation only, in both layouts. A toned count is set in its tone, over a signed row's sign color and a zero's quiet opacity (a short bill the vault holds none of reads as a red "—" at full opacity). In the tiles layout the tile's border takes the tone too, one hairline thicker through an inset shadow, so no tile moves or resizes. `neutral` or `null` leaves a count as it is. A row's `tone` is unchanged and still colors only its label. Generated classes `sw-denomination-cell-toned` and `sw-denomination-cell-tone-{accent,success,danger,warning}` (in their own `css-denomination-cell-tones.ts`) set `--sw-denomination-cell-tone`; forced colors draw the system colors, and a toned zero keeps the zero's `GrayText` there. A `cellTones` that is not an array, has the wrong length, has a hole, or holds a tone outside the Badge tones throws a `RangeError`, as mismatched `cells` do. The tone never carries meaning alone: the consumer's words beside the grid (the field's caption, a note) say why.

Rejected alternatives:

- A cell as `{ value, tone?, note? }` besides a number, as the 2026-09-25 request proposed. It widens the exported `cells` type, so a consumer that reads `row.cells` as numbers would stop compiling in a minor release; a parallel optional array is additive. The `note` (a string under the count) is left out: MOV-10's fix puts the words in the count field's caption, and a note would be a second place for them.
- `toneOf(column)` on the grid. It tones a column in every row, and a short tile is one row's cell.
- A filled tint. The tone on the count and the border is enough, keeps every text's contrast on the surface, and adds no token.

Evidence: `denomination-grid.test.tsx` ("DenominationGrid cellTones": a tiles row's toned tiles in their order with the marker and tone classes; a strip cell toned over a signed negative, `neutral` and `null` adding nothing; the wrong length and an unknown tone throw; the generated rules); `css/stylesheet.test.ts` (the classes in the catalog); `apps/gallery/e2e/denomination-grid.spec.ts` "a DenominationGrid cell tone marks one tile in place" on desktop-en, mobile-es and forced-colors: in "Tags left in the kit" the danger M tile and the warning L tile keep their row and width (all six on one row on a desktop, three per row on a phone), the M tile's zero count is at full opacity, and outside forced colors the M tile's border, inset shadow and count compute to the danger color while the L tile's border is neither danger nor the plain border; in the "Kit check by size" strip the Counted row's toned S cell computes to the danger color and its untoned XS cell does not.

## Follow-up request (2026-10-08, Teisoro F-006-S11 task 1875): strips that line up from card to card, again

Status: implemented on `claude/teisoro-f006-s11-parts` for Teisoro F-006-S11 task 1875; pull request pending review. It picks up the withdrawn `labelWidth` above (DRW-27) with a design that meets the constraints recorded there.
Source: Teisoro UX reviews `services-drawer-cash-and-audits.md`, finding DRW-27 (polish), and `vault-page-and-access.md`, finding VLT-14 (polish; the part left to Scalewing). The Services day's activity feed and the vault page's movement cards each draw one strip per card with the same bill columns; the "$1" column sits at about x 522, 515 and 483 on three activity cards and at x 409 and 441 on two vault cards, because an auto-layout table sizes its columns by each strip's own labels and counts.

Teisoro need: in each feed, every bill column sits under the one on the card above, at 1280 and 390 px, in both languages.

Proposed API: `labelWidth?: DenominationLabelWidth` (`'xs' | 'sm' | 'md' | 'lg' | 'xl'`, 4 to 16 rem, the `Table` column sizes) on `DenominationGrid`, for the strip.

Behavior and failure boundary: "equal count columns sized from the container", the direction the withdrawn attempts left open. The strip's scroll region becomes an inline-size container (`sw-denomination-scroll-aligned`), and the table (`sw-denomination-strip-aligned` plus `sw-denomination-label-<size>`, which sets `--sw-denomination-label-width`) carries the column count and whether a total column exists as inline custom properties (`--sw-denomination-columns`, `--sw-denomination-total`, as `BarChart` carries `--sw-bar-fill`). Every cell is `box-sizing: border-box`; the row labels and the corner take the label width; every count head and cell, and the total head and cells from md up, take `(100cqi − label width) ÷ (columns + total)`. Every column is sized and the widths add up to the region's width, so the table has no spare width to share by content: two strips with the same columns in regions of the same width have the same column edges whatever their labels and counts. Below md the total column takes no share and no width (`--sw-denomination-total-shown: 0`), as the phone total sits under the row label. A count wider than its share widens its column (an auto table never squeezes content), so only that strip misaligns, and it scrolls as a plain strip would; the labels stay pinned. The plain strip is unchanged without the prop. The tiles layout ignores it. An unknown width throws a `RangeError`.

How it meets the constraints recorded for the withdrawn attempts:

- The plain strip is unchanged (opt-in).
- A row's total stays next to its counts: the total column is one share wide, not the spare width.
- It does not force scrolling where the plain strip fits: the counts' share comes from the container, not a floor, so a six-column strip at 8 rem fits a 390 px phone card; the label width is the consumer's (pick the narrowest that holds the longest label's longest word).
- The separators span the card: the table is still the region's full width.

Rejected alternatives: `table-layout: fixed` (an eleven-column phone strip would overlap instead of scrolling; here an over-wide count widens its column); a `labelWidth` number in `ch` (an arbitrary value, and the label font's `ch` is not the counts'); a feed-level table (the cards are separate landmarks and lists in both consumers).

Evidence: `denomination-aligned.test.tsx` (a plain strip has no class or style; an aligned one has the classes and the column count, a total share only with a total; the tiles layout ignores it; an unknown width throws; the generated container, widths, share and the phone's collapse); `apps/gallery/e2e/denomination-grid.spec.ts` "DenominationGrid labelWidth lines the columns up from card to card" on desktop-en, mobile-es and forced-colors: the gallery's three "Tag activity today" cards ("Tagged", "Released back" with a three-digit count, "Found" and "Lost") have the same column-head edges to a tenth of a pixel, an 8 rem label column, and no sideways scroll at 390 px.

## Follow-up request (2026-10-08, Teisoro F-006-S11 task 1875): the total column's name on screen

Status: implemented on `claude/teisoro-f006-s11-parts` for Teisoro F-006-S11 task 1875; pull request pending review.
Source: Teisoro UX review `vault-history.md`, finding HIS-11 (polish; the part left to Scalewing). The vault history's summary grid passes `totalLabel="Total"`, so a screen reader reads each total under "Total", but the strip puts the label in a `sw-sr-only` span: at 1280 px no word stands over "$40.00 … $50.00".

Behavior (no API change): with `totalLabel`, the total column's `th` carries `sw-denomination-head` (the column heads' caption style, end-aligned) and its label is a `sw-denomination-total-label` span, shown from md up over the totals, its end on theirs. Below md the span is visually hidden with the other phone total rules, since each total sits under its row's label and the column takes no width; it stays in the table for a screen reader. Without `totalLabel` the empty corner is unchanged.

Evidence: `denomination-grid.test.tsx` (the header's classes and the span); `css/stylesheet.test.ts` (hidden below md only); `apps/gallery/e2e/denomination-grid.spec.ts` "DenominationGrid renders the strip table…": at 1280 px "Total weight" is visible and its end is within a pixel of the totals' end; at 390 px its span is under a pixel wide.
