---
'@scalewing/react': minor
---

`Grid` takes `fit` (`narrow` 15rem, `medium` 16.25rem, `wide` 18.75rem): as many columns as the grid's width holds at that minimum, sharing the row, one when the grid is narrower, so a row of cards reflows with no breakpoint. Not with `columns` or `columnsBelow`; either, or an unknown `fit`, throws a `RangeError`. New classes `sw-grid-fit-*` and the `gridFits` list and `GridFit` type. No new tokens or dependencies. Request: `docs/requests/teisoro-grid-fit.md`.
