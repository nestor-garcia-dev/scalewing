---
'@scalewing/react': minor
---

`NavCount` `tone?: 'danger' | 'accent'` (default `danger`): `accent` draws the count pill in the accent colour with its on-colour figures, for a count that is news (what was added since the person last looked) rather than work waiting. New exports `navCountTones`, `NavCountTone`; new class `sw-nav-count-accent`; an unknown tone throws a `RangeError`. Existing counts are unchanged. No new tokens, no new dependency. Request: `docs/requests/teisoro-nav-count-tone.md`.
