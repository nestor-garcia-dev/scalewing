---
'@scalewing/react': patch
---

`GlyphTile` letters are readable text: a tile holding letters mixes its categorical fill 25 % toward black, so white letters keep 4.5:1 (WCAG 1.4.3) on every fill in both schemes (neutral 3.26:1 before, 5.35:1 after; orange, the lightest, 5.08:1). A glyph keeps the fill as it is (3:1, WCAG 1.4.11). `Stepper`'s − and + grow to the 44 px touch target both ways on a coarse pointer (32 px wide before). No API change.
