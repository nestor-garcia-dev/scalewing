---
'@scalewing/react': minor
---

`DenominationGrid pinEnd`: while transposed, the last column (the last grid row's value line with its total, else its counts and total) stays in view at the inline end, with the end shade before it, while the columns between scroll (Teisoro F-001, request `docs/requests/teisoro-denomination-pin-end.md`). Needs `transposeBelow`; the default is unchanged. New classes `sw-denomination-scroll-pin-end`, `sw-denomination-transposed-end`. No new tokens or dependencies.
