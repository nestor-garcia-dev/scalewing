---
'@scalewing/react': patch
---

A `Badge` inside a filled `Button` (`primary`, `secondary`, `tertiary` or `danger`) sits on `--sw-color-surface` with its words in `--sw-color-text` and its tone on its border (`docs/requests/teisoro-badge.md`, Teisoro NSF-1, WCAG 1.4.3). Its tone was drawn on the button's fill: a warning badge on the accent measured about 1.1:1. The text color is 4.5:1 or more on the surface in every palette and scheme, which the tone colors are not (for example `mocha` dark danger at 3.29:1); every tone border is at least 3:1.

No API change and no new dependencies.
