---
'@scalewing/react': minor
---

Table ledger extensions (`docs/requests/teisoro-table-ledger.md`, Teisoro F-011 release R4):

- `TableCell` `tone` (`success`, `danger`, `muted`, `accent`; `TableCellTone`, `tableCellTones`): the cell's text in the theme colour.
- `Table` `columnRules`: a hairline between columns, mirrored right to left.
- `TableRow` `variant="sub"` (`TableRowVariant`, `tableRowVariants`) indents the row's header (`th scope="row"`) with a guide bar under the row above, and `TableRow` `struck` keeps a voided row on the record: subtle fill, muted, struck through (a Badge in a line of text stays plain).
- A body or footer row header (`th scope="row"`) now reads as body text instead of a muted column header.
- An unknown `tone` or `variant` throws a `RangeError`. No new tokens or dependencies.
