---
'@scalewing/tokens': minor
---

Additive. Semantic colours `inverse` and `onInverse`: a dark band and the words on it, such as a site footer or one closing section. Light `#1D1D1F` with `#FFFFFF`, dark `#2C2C2E` with `#F5F5F7`, so the band stays dark in either scheme (16.8:1 and 12.8:1). No palette moves them; a brand sets its band with an overlay (`colors: { inverse: '#0B2038' }`), which `createTheme` accepts as it does every semantic key. Renderers pick the colours up through their caret dependency (ADR 0009): web as `--sw-color-inverse` and `--sw-color-onInverse` (the generated canvas and `ThemeProvider` write every semantic key), native as `theme.colors.inverse`. Request: `docs/requests/teisoro-inverse-colors.md`.

Renderer sign-off: Claude for both renderer agents, under the owner's Teisoro F-017 approval (2026-10-24); additive, so no renderer change is needed.
