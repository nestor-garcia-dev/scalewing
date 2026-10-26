---
'@scalewing/react': patch
---

Forced colours show every choice. The chosen `FilterChips` chip sets `forced-color-adjust: none` on its Highlight face, so Chromium's Canvas backplate no longer hides its HighlightText words, and every `SegmentedControl` variant (plain and filled, not only the icon and raised tracks) outlines its selected item in Highlight. No API change.
