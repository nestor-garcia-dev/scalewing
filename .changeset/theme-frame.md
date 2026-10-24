---
'@scalewing/react': minor
---

`ThemeProvider` takes `frame` (`none` by default, or `site`): `site` writes `data-frame="site"` and makes the themed root a column at least the window's height whose last child (the footer) is pushed to its foot, so a short page's footer meets the window's foot. `themeFrames` and `ThemeFrame` list the frames; an unknown one throws a `RangeError`. No new tokens or dependencies. Request: `docs/requests/teisoro-site-frame.md`.
