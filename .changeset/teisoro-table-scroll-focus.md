---
'@scalewing/react': patch
---

`Table` scroll wrapper is keyboard reachable: the `sw-table-wrap` element is a `group` named after the table (`aria-label` / `aria-labelledby` mirrored) with `tabIndex={0}` and an accent focus ring, so a wide table with no focusable cell can be scrolled sideways from the keyboard and passes the axe `scrollable-region-focusable` rule.
