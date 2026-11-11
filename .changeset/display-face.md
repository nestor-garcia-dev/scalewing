---
'@scalewing/tokens': minor
'@scalewing/react': minor
---

`displayFaceFamilies` (tokens) and `ThemeProvider displayFace` (react): `condensed` sets a page's titles (`hero`, `display`, `headline`, `heading`) in Barlow Condensed, which the app loads, falling back to the platform's narrow sans; `system` (default) keeps the body face. It writes `data-display-face`, which a page without `ThemeProvider` sets itself. Body text, labels and controls keep the system face (FutMas F-024).
