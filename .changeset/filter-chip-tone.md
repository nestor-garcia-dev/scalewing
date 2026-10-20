---
'@scalewing/react': minor
---

`FilterChips` option `tone`: `neutral` (the default, unchanged) or `warning`, which draws that chip, while it is not chosen, in the warning tint with its words and count in the warning ink (a warning `Notice`'s, 4.5:1 in every palette and scheme); chosen it is the accent and at a zero count quiet, like every chip. New class `sw-filter-chip-warning`, new exports `filterChipTones` and `FilterChipTone`; an unknown tone throws a `RangeError`. No new tokens, no new dependency. Request: `docs/requests/teisoro-filter-chip-tone.md`.
