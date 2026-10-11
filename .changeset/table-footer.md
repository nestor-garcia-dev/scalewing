---
'@scalewing/react': minor
---

`TableFooter` (with `TableFooterProps`): the table's `tfoot` for a total row, its cells at weight 600 under a 2 px rule (`docs/requests/teisoro-table-footer.md`, Teisoro F-011 release R4).

- `sticky` pins the footer to the bottom edge on the header's glass, on a new stacking layer `stickyFooter` (2) between sticky table cells (1) and the sticky `ActionBar`. The other layers move up one: `bottomChrome` 3, `popupHost` 4, `topChrome` 5 (`popup` stays 10); update any test or stylesheet that pins those numbers. A sticky `ActionBar` or a `Dialog` footer covers a pinned footer, so do not pair them.
- In forced colors pinned footer and header cells are the solid system canvas.
- While a table with a sticky footer fits its width, its region stops being a scroll box (`sw-scroll-fits`, now on every measured `Table` region whose content fits, which changes its class list), so the footer and the sticky header pin to the page; a wider table scrolls sideways and pins inside its region.
- New classes `sw-table-footer-sticky` and `sw-scroll-fits`. No new tokens or dependencies.
