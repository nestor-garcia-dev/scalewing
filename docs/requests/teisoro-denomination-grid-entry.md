Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.27.0 (PR #114; Teisoro F-011-S02, release R1 "guided-form core", item 2; the inventory's row 14). Depends on the web `Stepper` (`teisoro-stepper.md`, merged in #113).
Renderer: react
Missing surface: count entry in `DenominationGrid`: a row whose counts are typed or stepped (`entry`), with a row `caption`, a quiet row `emphasis`, a column `caption`, and a `disabled` row. An extension of the existing grid, not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the F-011 canvas counts bills on 27 boards in the grid's own shape: bill columns ($1 … $100, or straps and rolls) and a Total, with editable rows (Received, Change, Counted, Take) next to read-only rows (Expected, Last close, Available) under the same column heads. A `Table` of `Stepper`s would lose the grid's column heads, sticky labels, totals, tones and alignment with the read-only rows; a separate count grid would be a parallel surface for the same columns.
Existing surface this might already be: `DenominationGrid` (read-only rows with `signed`, `tone`, `cellTones`, `total`, `labelWidth`), which this extends; `Stepper`, which each entry cell is.
Workaround I almost used: Teisoro's `drawer-forms/DenominationEntryGrid.tsx` and `closeout-form/CashCountSection.tsx`, product grids of `Field`s with their own layout.
Teisoro use: the boards EntryStep2 (Received "from the customer" and Change "from the drawer"), OpenDay1 (Counted "this morning" over a quiet Last close row), PosClose1 (bills and coins, "count each"), VaultCount1 (straps "$1 × 100", loose bills, expected, rolls), CloseDay1, the drawer sheets and every Get change and change-order count. Design: Teisoro `docs/design/redesign-2026-10/component-inventory.md` row 14 and the boards it cites.
Proposed API (inventory): `DenominationGridRow.entry?: { values, onChange(colKey, n), max?, errors?, disabled? }`, `caption?`, `emphasis?: 'default' | 'quiet'`, `cellTones` for highlighted cells, column `caption?`, row `disabled`.

## Accepted API (2026-10-11)

- `DenominationGridRow.entry?: DenominationGridEntry` makes the row's counts editable, one `Stepper` (`width="full"`, label hidden) per column:
  - the counts are the row's `cells` (no separate `values`: one array holds what a row shows, read-only or not); `null` is an empty box;
  - `onChange(columnKey, value: number | null)`;
  - `decrementLabel` and `incrementLabel`: the buttons' names (product copy);
  - `max?`: a cap per column (`null` for none), `errors?`: a message per column (`null` for none), `placeholder?`: what an empty box shows, such as "0".
    Each count is named by its row label and the column's label and caption, as its header reads ("Received $20", "Counted $1 × 100"); entry row labels, and column label-and-caption pairs, must be distinct so no two counts share a name. The minimum is 0: an entry row's counts are zero or more and it is not `signed`.
- `DenominationGridRow.caption?: string`: a muted line under the row label ("from the customer", "Oct 9, 8:41 PM").
- `DenominationGridRow.emphasis?: 'default' | 'quiet'` (strip only): `quiet` sets the row on the subtle fill, for a row shown to compare against (Last close, Expected).
- `DenominationGridRow.disabled?: boolean` (strip only): a row that does not apply ("Card · no cash moved"): its entry is disabled, its label, counts and total fade, and the row is `aria-disabled`.
- `DenominationGridColumn.caption?: string`: a muted note after the column label ("× 100" for a strap of $1 bills).
- `cellTones` also tone an entry cell: the count's border takes the tone (danger for a difference); `accent`, for a count that changed or was suggested, is the `Stepper`'s `changed` look (border and tint). A message in `errors` wins.

Behavior and failure boundary: the grid still does no arithmetic; totals stay consumer strings, and the consumer recomputes them in `onChange`. Entry rows need the `strip` layout (the tiles layout throws a `RangeError`). `entry.max` and `entry.errors` need one entry (or `null`) per column, caps are whole numbers of zero or more, an empty `caption`, an unknown `emphasis`, a `disabled` that is not a boolean, a quiet or disabled row in the tiles layout, a negative count or `signed` on an entry row, duplicate entry row labels or column label-and-caption pairs (with an entry row), and empty entry button names throw a `RangeError`.

Deviations from the inventory: `entry.values` is the row's `cells`; `entry.disabled` is the row's `disabled`, which also covers a read-only row; `entry` adds the two button names and `placeholder`, since Scalewing holds no product copy.

Generated classes: `sw-denomination-entry`, `sw-denomination-strip-entry`, `sw-denomination-label-words`, `sw-denomination-label-caption`, `sw-denomination-head-caption`, `sw-denomination-row-quiet`, `sw-denomination-row-disabled`. No new tokens.
