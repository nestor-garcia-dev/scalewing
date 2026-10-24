# Teisoro: a page band

Status: implemented, pending release, for the next `@scalewing/react` minor.

Scalewing request from Teisoro.

Renderer: react
Missing surface: `Band`, a full-width stretch of the page in one fill with its content in a centred column, including a dark band
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro F-017 (owner-approved 2026-10-24) builds a public site whose footer and at most one closing section are a dark navy band, full width, with white words, muted words, links and a light button inside. `Box` takes only the `background` and `surface` fills and keeps the theme's text colour, so `Text` and links would read dark on dark; `Card` is a rounded panel, not a full-width band; the container utility sets the column but no fill or gutter.
Existing surface this might already be: `AppShell`'s `pageBar` (a sticky band inside a workspace frame), `Card` `filled` (a rounded panel)
Workaround I almost used: a product stylesheet with a navy background and white text, which Teisoro does not allow (Teisoro owns no CSS)
Proposed API (reusable names only): `<Band tone="surface | subtle | inverse" width="container | reading" as="section | div | aside | footer" paddingY={8}>`

## Behaviour

- The band fills the width; its content sits in a column as wide as the page container (or the reading width) with the page gutter, 16 px on a phone and 24 px from `md`.
- Inside the inverse band the theme's words, muted words (a 78% mix, 7:1 or more on the default bands and on navy), hairlines, subtle fill, accent and `onAccent` read on the dark fill, so a `Text`, a primary `Button` (light with dark words) and the focus ring need no band-aware variant. Every plain link, a quiet one included, takes the band's words with a half-strength underline, since its colour is the words' own.
- A brand sets its band colour with a theme overlay of `inverse` (`teisoro-inverse-colors.md`).
- Forced colours outline the inverse band.
- An unknown tone, width or element throws a `RangeError`.
- Consumer: Teisoro's site footer (`teisoro-site-footer.md`) and one closing section on its Home and For owners pages.
