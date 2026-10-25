---
'@scalewing/react': patch
---

An xs `Field`'s own text input (`input` of a typed kind, or `textarea`) now draws at the xs size: the document canvas's `[data-theme]` typed-input rule outranked `.sw-field-xs`, so the control kept the md min-height (44 px) and the inherited font size beside a 28 px xs `Select`. The xs rule now matches it under `[data-theme]` (caption type, xs min-height and padding), and on a coarse pointer the control is the 44 px touch target. Adorned and search inputs keep their frames' rules. No API change.
