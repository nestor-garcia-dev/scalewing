---
'@scalewing/react': patch
---

`Table` `stickyHeader` (`true` or `'page'`) now pins the whole `TableHeader` as one group (Teisoro F-011 task 2200): the `thead` is sticky, not each `thead th`, so a row under the column headings (such as a running total) stays in view right under them with all its cells, `td` as well as `th`, where before only its `th` pinned (at the same edge as the headings) and its `td` cells scrolled away. Every pinned head cell is on the glass (solid under Reduce Transparency, the system canvas in forced colours) and draws its row rule on its own `::before` instead of a collapsed bottom border, which stayed behind as the row moved and left a gap the rows under it showed through. No public API change, no new class, no new tokens, no new dependency.
