---
'@scalewing/react': patch
---

`DenominationGrid` writes a negative count with the typographic minus "−" (U+2212), not a hyphen-minus (`docs/requests/teisoro-denomination-grid.md`, 2026-10-02 follow-up, Teisoro F-007 task 1550, AUD-18). It applies to every negative count, in signed and unsigned rows and in both layouts, so a count matches the sign of the consumer's formatted money. The cell's text is the only change: a test that matched `-1` in a cell now matches `−1`. No API change and no new dependencies.
