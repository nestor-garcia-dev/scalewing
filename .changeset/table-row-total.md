---
'@scalewing/react': minor
---

`TableRow` `variant="total"`: a total mid-table, such as a subtotal the rows above add up to before the table goes on. Its cells are at weight 600 under a 2 px rule across its top (the cells' own collapsed border, kept in forced colours), as a `TableFooter` total is drawn, with no fill, so accent text keeps the contrast it has on the table's own surface. `tableRowVariants` is now `['default', 'sub', 'total']`. New class `sw-table-row-total`; no new tokens, no new dependency. Request: `docs/requests/teisoro-table-row-total.md`.
