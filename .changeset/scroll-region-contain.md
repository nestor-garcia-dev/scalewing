---
'@scalewing/react': patch
---

A scroll region (`Table`'s wrapper, the `DenominationGrid` strip) is now `position: relative`, so it is the containing block of anything absolutely placed inside it that no nearer box holds, such as a visually hidden label (`sw-sr-only`) or a field's hidden name in a cell past the region's edge. Before, such a label was placed against the page and widened it on a phone while the table scrolled sideways (reported by Teisoro F-011, an inline edit in a table row at 390 px). Anything absolutely placed in a table with no positioned box in between now anchors to the table's region and scrolls with it, rather than to a positioned box outside the table (or the page). No API, class or token changes.
