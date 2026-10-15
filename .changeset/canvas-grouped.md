---
'@scalewing/react': minor
---

`ThemeProvider` `canvas="grouped"` (`ThemeCanvas`, `themeCanvases`; default `default`, unchanged): an opt-in grey page tone so white cards stand apart, written as `data-canvas="grouped"` on the themed node. The generated canvas declares `--sw-canvas-grouped` (light: the background with 7 % of the muted colour; dark: the background) and paints it only where a canvas asks for it. The text and muted colours keep 4.5:1 on it in every palette; keep links and accent words in the cards. An unknown value throws a `RangeError`. New public CSS hooks: the `data-canvas` attribute and the `--sw-canvas-grouped` custom property. No new tokens, classes or dependencies. Request: `docs/requests/teisoro-canvas-grouped.md`.
