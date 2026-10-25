Scalewing request from FutMas.

Status: implemented for `@scalewing/react` 1.53.0 (accepted 2026-10-24; FutMas F-010-S13 "teams and pasted teams", board C3 Teams, the S13 plan's "Scalewing gap list" row 1; standing owner approval for Scalewing changes and releases).
Renderer: react
Missing surface: a table select column: `Checkbox` with a visually hidden label and a mixed state, and a `TableSelectCell` that renders it in a header or body cell. An extension of `Checkbox` plus one small Table part.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Checkbox` always draws its label and has no mixed state, so a select column cannot be a bare box named "Select Mattapan United", and "Select all" cannot show "some selected". FutMas cannot write CSS for the 44 px touch target.
Existing surface this might already be: `Checkbox` with the team's name as its visible label (the board's crests then have no room), `TableRow selected` (the selected bar, kept).
Workaround I almost used: `ui/RowCheckbox.tsx`, a labelled `Checkbox` in the Team column and a "Select all" with no mixed state.

## Proposed API (S13 plan)

`Checkbox` gains `labelVisuallyHidden?: boolean` and `indeterminate?: boolean` (`aria-checked="mixed"`), 44 px on a coarse pointer in a `TableCell`; or `TableSelectCell { label, checked, indeterminate?, onCheckedChange }`.

## Accepted API (2026-10-24)

Both.

- `Checkbox labelVisuallyHidden`: the label stays the name in a `sw-sr-only` span inside the `label`; the box (24 px) is the target on a fine pointer, at least 44 × 44 px on a coarse one (`sw-checkbox-label-hidden`).
- `Checkbox indeterminate`: a dash on the accent fill (Highlight in forced colours), the native `indeterminate` property set after every render and on every press, and `aria-checked="mixed"` while mixed (so query tools that do not read the property see it). A press reports `!checked`; the consumer decides the next state.
- `TableSelectCell { label, checked, indeterminate?, onCheckedChange, disabled?, as?: 'td' | 'th' }`: the cell (`scope="col"` as a `th`) holding that Checkbox; the column `sw-table-select` is the box's width, 44 px on a coarse pointer. Exported with `TableSelectCellProps`.
- Failure boundary: a blank label or an unknown `as` throws a `RangeError`.

### Deviations from the canvas

- The board's initials crests beside the box are the consumer's (a cell after the select column).

### Classes

`sw-checkbox-label-hidden`, `sw-table-select`.

Evidence: `checkbox-selection.test.tsx`, `table-select-cell.test.tsx`; gallery "Table selection"; `apps/gallery/e2e/table-selection.spec.ts` on desktop-en, mobile-es and forced-colors (names, mixed state, 24 px boxes on desktop and 44 × 44 on touch, Select all through all and none, Space on a row box, no page overflow).
