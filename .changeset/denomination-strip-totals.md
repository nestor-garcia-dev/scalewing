---
'@scalewing/react': minor
---

`DenominationGrid`'s strip reads its totals to a screen reader at every width (`docs/requests/teisoro-denomination-grid.md`, 2026-09-28 follow-up, Teisoro SDAY-6). Below `md` the total cell was `display: none`, so on a phone a screen reader never heard a row's total; it now stays in the table, visually hidden, while the `aria-hidden` copy under the row label is what shows.

- New optional prop `totalLabel?: string` names the total column with a visually hidden `th scope="col"` (class `sw-denomination-total-head`). Without it the header corner is the empty cell it was, and it carries the same class, so below `md` the hidden total column takes no width either way. A blank `totalLabel` throws a `RangeError`.
- New generated classes `sw-denomination-total-head` and `sw-denomination-total-value` (the total's text inside its cell).

No breaking change and no new dependencies.
