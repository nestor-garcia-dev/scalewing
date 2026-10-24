# Teisoro: a site page whose footer meets the window's foot

Status: implemented, pending release, for the next `@scalewing/react` minor.

Scalewing request from Teisoro.

Renderer: react
Missing surface: `ThemeProvider` `frame="site"`, the themed root as a column with its footer at its foot
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro F-017's public site puts `SiteHeader`, `main` and `SiteFooter` straight under `ThemeProvider`. On a page shorter than the window (Contact, the 404) the footer stops mid-window with the grey page under it, unlike the approved boards. The themed root already keeps the window's height, but it is a block; making it a column and pushing the footer down would be product CSS, which Teisoro does not allow. A `Stack` inside the root does not take the root's height.
Existing surface this might already be: `AppShell` (a workspace frame with a side navigation), `ThemeProvider` `canvas`
Workaround I almost used: none that keeps Teisoro free of CSS
Proposed API (reusable names only): `<ThemeProvider frame="none | site">`

## Behaviour

- `site` writes `data-frame="site"`: the themed root becomes a flex column and its last child takes `margin-top: auto`, so the footer sits at the window's foot on a short page and after the content on a long one.
- `none` (default) changes nothing.
- An unknown frame throws a `RangeError`; `themeFrames` lists the frames.
- Consumer: every page of Teisoro's public site (F-017 S03).
