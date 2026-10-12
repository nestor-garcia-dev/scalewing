Scalewing request from Teisoro.

Status: accepted 2026-10-12 (Teisoro F-011 task 2180; plan approval under Teisoro decisions O-1 to O-4 and D-1). Next: release as the next `@scalewing/react` minor.
Renderer: react
Missing surface: a `Table` header pinned to the page's top while the page scrolls, without a sticky `TableFooter`. An extension of `Table` `stickyHeader`, not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the product owner, looking at the Services day's cash ledger (board ServicesDayLedger2): "this last bottom row doesnt need to be sticky". The ledger's last row (the opening count, or the total of the rows shown) is a sticky `TableFooter` today, and only that sticky footer makes the table's region stop being a scroll box (`sw-scroll-fits` with `.sw-table-footer-sticky`), which is what pins the header to the page. Dropping `sticky` from the footer, measured at 1280 by 500 scrolled down, turns the region back into a scroll box (`overflow: auto`) and the header scrolls off with the rows (its top at −131 px instead of 0). Teisoro owns no CSS, and the region is Scalewing's.
Existing surface this might already be: `Table` `stickyHeader` (pins to the table's own region, which never scrolls vertically); `TableFooter` `sticky` (pins the header to the page only as a side effect of pinning the footer, the thing the owner asked to drop).
Workaround I almost used: an empty sticky `tfoot` to trigger the region rule with the total in the body (depends on an internal selector, leaves an empty row group for screen readers, loses the footer's bold row and 2 px rule); dropping the pinned header (loses the column labels on a long day).
Teisoro use: `CashLedger` (the Services day ledger; its foot row then scrolls with the table).
Proposed API: `Table stickyHeader="page"`.

## Accepted API (2026-10-12)

- `Table` `stickyHeader` takes `true` (default: the header pins to the top of the table's own scroll region, as before), `false` (scrolls away) or `'page'` (new type `TableStickyHeader`). `'page'` adds the generated class `sw-table-sticky-page` next to `sw-table-sticky`; an unknown value throws a `RangeError`.
- While the table fits its width (`sw-scroll-fits`), a region whose table has `sw-table-sticky-page` stops being a scroll box (`overflow: visible`), the rule a sticky `TableFooter` already used, so the header pins to the page's top as the page scrolls, under any sticky top chrome (an `AppHeader` covers it). A table wider than its region still scrolls sideways in it and pins inside it. A non-sticky `TableFooter` in such a table is the table's last row and scrolls with it, keeping its weight 600 and 2 px rule.
- The two region rules now live in their own module (`css/css-table-page-pin.ts`, where a table's pinned rows pin); `sw-scroll-fits` moves to its catalog from the footer's. The footer's own rules are unchanged.
- No new tokens, layers or dependencies.

Evidence: `table-sticky-page.test.tsx` (the classes for `true`, `'page'` and `false`, the `RangeError`, the catalog, the region rule for a page-pinned header and for a sticky footer); `table-footer.test.tsx` (unchanged rules); gallery "Table" ("A header pinned to the page": 30 sites with a non-sticky total); `apps/gallery/e2e/table-sticky-page.spec.ts` on desktop-en, mobile-es and forced-colors (the region not a scroll box while it fits with no sticky footer, the total past the viewport's bottom with the first rows at the top, the header pinned to the page's top mid-table, the total in the flow under the last row at the end; a table widened past its region scrolls in it and fits again when narrowed); `table-footer.spec.ts` and `table.spec.ts` unchanged and passing.
