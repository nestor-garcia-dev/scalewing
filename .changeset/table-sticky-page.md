---
'@scalewing/react': minor
---

`Table` `stickyHeader="page"` pins the header row to the page's top while the page scrolls, without a sticky `TableFooter` (`docs/requests/teisoro-table-sticky-page.md`, Teisoro F-011 task 2180). While the table fits its width its region stops being a scroll box, as it already did for a sticky footer; a table wider than its region scrolls sideways in it and pins inside it. `true` (the default) and `false` are unchanged; any other value (including an untyped `null` or `0`, which used to mean not sticky) throws a `RangeError`. New type `TableStickyHeader` and generated class `sw-table-sticky-page`. No new tokens, no new dependency.
