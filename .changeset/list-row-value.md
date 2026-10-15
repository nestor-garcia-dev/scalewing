---
'@scalewing/react': minor
---

`ListRow` `valueTone="warning"` (the warning colour's ink, halfway to the text colour, 4.5:1 on the surface in every palette; `listRowValueTones` gains `warning`) and `valueBadge` (a `BadgeTone`: the value drawn as a Badge at the row's end, still in the row's name; needs a value, never with `valueTone`). New class `sw-list-row-value-warning`; no new tokens or dependencies. The refusal for a value option without a value now reads "ListRow valueDetail, valueTone and valueBadge need a value". Request: `docs/requests/teisoro-list-row-value.md`.
