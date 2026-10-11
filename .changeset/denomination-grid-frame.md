---
'@scalewing/react': minor
---

`DenominationGrid` framed count-sheet look, every option off by default so existing grids are unchanged (`docs/requests/teisoro-denomination-grid-frame.md`, Teisoro F-011 release R6):

- `frame` (`DenominationGridFrame`, `denominationGridFrames`): `'none'` (default) or `'table'`, a strip drawn as a framed table (a border hairline at the `sm` radius on its scroll region, the heading row on the subtle fill, a rule between columns, counts at label size centred). The tiles layout ignores it.
- `totalEmphasis` (`DenominationTotalEmphasis`, `denominationTotalEmphases`): `'default'` or `'strong'`, bold label-size totals, a neutral row's in the text color.
- `cellToneAppearance` (`DenominationCellToneAppearance`, `denominationCellToneAppearances`): `'text'` or `'pill'`, a toned read-only strip count on its tone's tint in the tone's ink (the Notice's fill and words); outlined in forced colors.
- `zeroLabel=""` now leaves zero counts blank instead of throwing; a non-string `zeroLabel` throws.
- `DenominationGridEntry.limitAppearance` passes through to the entry Steppers.

Every read-only strip count now sits in a `sw-denomination-cell-value` span (no visual change). New generated classes `sw-denomination-scroll-framed`, `sw-denomination-framed`, `sw-denomination-totals-strong`, `sw-denomination-cell-tones-pill`, `sw-denomination-cell-value`. The Notice's tint and ink moved to a shared `tone-tint` module (no change to its CSS). No new tokens or dependencies.
