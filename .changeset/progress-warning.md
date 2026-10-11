---
'@scalewing/react': minor
---

`Progress` `tone="warning"` (with `progressTones`): the bar in the semantic warning color, such as the time left before an idle sign-out (`docs/requests/teisoro-progress-warning.md`, Teisoro F-011 release R2). New generated class `sw-progress-warning`. An unknown `tone` now throws a `RangeError` instead of rendering an unstyled bar. No new tokens or dependencies.
