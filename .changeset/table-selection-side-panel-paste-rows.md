---
'@scalewing/react': minor
---

`Checkbox` `labelVisuallyHidden` (the label stays the name, not drawn; the box is its own target, 44 × 44 px on a coarse pointer) and `indeterminate` (the mixed state: a dash on the accent fill, the native `indeterminate` property and `aria-checked="mixed"`). `TableSelectCell` (`label`, `checked`, `indeterminate?`, `onCheckedChange`, `disabled?`, `as?: 'td' | 'th'`): a table's select column holding that Checkbox, as narrow as the box. New classes `sw-checkbox-label-hidden`, `sw-table-select`. Request: `docs/requests/futmas-table-row-selection.md`.

`Dialog` `placement` (`'center'`, the default, or `'end'`): from md up a full-height side panel at the inline end with Dialog's title row, close button, scrolling content and pinned footer; below md the centred dialog or the bottom sheet with `sheetBelow`. Exports `dialogPlacements`, `DialogPlacement`. New class `sw-dialog-end`. Request: `docs/requests/futmas-dialog-side-panel.md`.

`PasteRows`: a text area for rows pasted from a spreadsheet, a polite count of the columns found and one `Select size="xs"` per column choosing its meaning (`label`, `description?`, `value`, `onValueChange`, `columns`, `mapping`, `onMappingChange`, `countLabel`, `columnLabel?`, `delimiter?`, `rows?`, `placeholder?`, `error?`, `disabled?`, `required?`), with the pure `parsePastedRows(text, delimiter?)` (tab or comma cells, quoted cells, blank rows dropped). Exports `PasteRows`, `PasteRowsProps`, `PasteRowsColumn`, `parsePastedRows`, `PastedRows`, `PastedRowsDelimiter`, `pastedRowsDelimiters`. Request: `docs/requests/futmas-paste-rows.md`.

`Select`: on a coarse pointer the trigger and each option are at least 44 px high at every size, as every `Button` is since 1.51.0; a fine pointer keeps `xs` at 28 px, and an `xs` Select's open list is taller on touch. Request: `docs/requests/futmas-select-touch-target.md`.

No new tokens or dependencies.
