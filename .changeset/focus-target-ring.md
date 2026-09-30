---
'@scalewing/react': minor
---

A programmatic focus target takes the accent focus ring (`docs/requests/teisoro-focus-target.md`, Teisoro F-007-S05 task 1375, NSF-34, ENT-29, DRW-30). The generated document canvas gains `:where([data-theme] [tabindex='-1']:focus-visible)` with the same ring as links and native controls (`--sw-focus-ring-width` solid `--sw-color-accent`, `--sw-focus-ring-offset` out), so a notice or card a script focuses after a save, such as a `Box tabIndex={-1} radius="lg"` round a `Card`, no longer shows the browser's outline. The ring shows only when focus is visible, as the browser's does, and the rule has zero specificity, so a component's own ring always wins. No new prop or class and no new dependencies.
