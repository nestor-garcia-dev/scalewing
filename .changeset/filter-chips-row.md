---
'@scalewing/react': minor
---

`FilterChipsRow`: several `FilterChips` groups on one row, each keeping its own name, choices and Tab stops, an optional `end` group at the row's end (at its own line's end when the row wraps), and `overflow` `wrap` (the default) or `scroll`, where every group's chips stay on one row that scrolls sideways together inside the row's own box, never the page, a group's own scroll giving way. New classes `sw-filter-chips-row`, `sw-filter-chips-row-end`, `sw-filter-chips-row-scroll`; new exports `FilterChipsRow` and `FilterChipsRowProps`; an unknown overflow throws a `RangeError`. The private slot check `hasSlot` moved from the list rows to `components/slot.ts`, shared by both. No new tokens, no new dependency. Request: `docs/requests/teisoro-filter-chips-row.md`.
