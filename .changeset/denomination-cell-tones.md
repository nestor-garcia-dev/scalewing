---
'@scalewing/react': minor
---

`DenominationGrid` row `cellTones` (`docs/requests/teisoro-denomination-grid.md`, 2026-10-02 follow-up, Teisoro F-007 task 1550, MOV-10): `cellTones?: readonly (DenominationGridTone | null)[]`, one entry per column, tones a single count in place. The count is set in the tone (over a signed row's color and a zero's quiet opacity), and in the tiles layout the tile's border takes the tone too, without moving or resizing the tile. `neutral` or `null` leaves a count as it is; a row's `tone` is unchanged. The wrong length or an unknown tone throws a `RangeError`. New generated classes `sw-denomination-cell-toned` and `sw-denomination-cell-tone-{accent,success,danger,warning}`. No new dependencies.
