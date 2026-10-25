Scalewing request from FutMas.

Status: implemented for `@scalewing/react` 1.53.0 (accepted 2026-10-24; FutMas F-010-S13, board C4 Add teams, the S13 plan's "Scalewing gap list" row 3; standing owner approval).
Renderer: react
Missing surface: `PasteRows`, a text area for rows pasted from a spreadsheet with one Select per found column choosing what it means.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: nothing parses pasted rows or maps columns; FutMas would grow its own control.
Existing surface this might already be: `Field` with a `textarea` plus `Select size="xs"` per column, composed by hand.
Workaround I almost used: `ui/PasteColumns.tsx`, that composition, with parsing in `teams/paste-teams.ts`.

## Proposed API (S13 plan)

`PasteRows { label, description?, value, onValueChange, columns: readonly { id, label }[], mapping: string[], onMappingChange, countLabel(n) }`.

## Accepted API (2026-10-24)

The plan's API, plus `columnLabel?: (position) => string` (each Select's hidden name, default "Column {n}", for the consumer's language), `delimiter?: 'auto' | 'tab' | 'comma'`, `rows?` (default 6), `placeholder?`, `error?`, `disabled?`, `required?`. Exports `PasteRows`, `PasteRowsProps`, `PasteRowsColumn`, and the pure `parsePastedRows(text, delimiter?)` returning `{ rows, columnCount, delimiter }` (`PastedRows`, `PastedRowsDelimiter`, `pastedRowsDelimiters`).

- A `Field` text area (label, description, error wiring), spell check off.
- Under it an Inline row: a polite `role="status"` caption (`countLabel(columnCount)`, empty while nothing is pasted), then one `Select size="xs" labelVisuallyHidden` per found column with the `columns` choices. `mapping[i]` is column i's id; a change calls `onMappingChange` with a full-length copy (a missing entry, or an id not in `columns`, counts as the first choice).
- Parsing is generic: rows on CR, LF or CRLF; cells on tab or comma (`auto`: tab when the text holds one); quoted cells (`""` a quote, delimiters and line breaks inside) when a cell starts with a quote that closes later; cells trimmed; blank rows dropped; short rows padded. Linear. FutMas keeps its domain parsing (headers, divisions, names) and the preview, and passes `delimiter="tab"` so a team name with a comma is one cell.
- `disabled` disables the text area and leaves the column Selects out (Select has no disabled state); the count line stays.
- Failure boundary: a blank label, no columns, a blank or repeated column id or label, or `rows` under 1 throws a `RangeError`.

No new classes (composed from Field, Inline, Select, Stack and Text).

Evidence: `parse-pasted-rows.test.ts`, `paste-rows.test.tsx`; gallery "PasteRows" (a bird list with a preview the page draws); `apps/gallery/e2e/paste-rows.spec.ts` on desktop-en, mobile-es and forced-colors (count, named Selects, remapping, a one-column paste, empty state, Selects 28 px on desktop and 44 px on touch, no overflow).
