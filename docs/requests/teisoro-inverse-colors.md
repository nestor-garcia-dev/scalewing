# Teisoro: a dark band colour

Status: implemented, pending release, for the next `@scalewing/tokens` minor (web variables `--sw-color-inverse` and `--sw-color-onInverse` with the next `@scalewing/react` minor, through its caret dependency).

Scalewing request from Teisoro.

Renderer: tokens (both renderers read it; web as `--sw-color-inverse` and `--sw-color-onInverse`)
Missing surface: semantic colours `inverse` and `onInverse`, a dark band and the words on it
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro F-017 (owner-approved 2026-10-24) builds a public site whose footer, and at most one section, is a dark navy band with white words and the white logo. The semantic colours are all light under the light page (`background`, `surface`, `subtle`) or action fills (`accent`, `tertiary`); none is a surface meant to hold words, and a brand cannot overlay a colour the theme has no key for.
Existing surface this might already be: `tertiary` (a solid action fill, which a palette may tint; not a surface for paragraphs and links), `text` used as a fill (not a theme colour a brand can move without moving every word)
Workaround I almost used: a hex in the product's own stylesheet, which Teisoro does not allow (Teisoro owns no CSS)
Proposed API (reusable names only): `theme.colors.inverse` and `theme.colors.onInverse`, overlaid like any semantic key (`colors: { inverse: '#0B2038' }`)

## Behaviour

- Light: `inverse` `#1D1D1F` with `onInverse` `#FFFFFF` (16.8:1). Dark: `#2C2C2E` with `#F5F5F7` (12.8:1). The band is dark in either scheme, a step above the black dark page.
- No palette moves them. `createTheme` accepts an overlay of either key and rejects an invalid value, as for every key.
- Consumers: the React `Band` and `SiteFooter` (`teisoro-band.md`, `teisoro-site-footer.md`).
