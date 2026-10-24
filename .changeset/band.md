---
'@scalewing/react': minor
---

`Band`: a full-width stretch of the page in one fill, its content in a
centred column with the page gutter (16 px, 24 px from `md`), for a site's
footer, one dark closing section or a grey strip.

- `tone`: `surface` (the cards' fill), `subtle` or `inverse`, the dark band
  (`--sw-color-inverse`, which a brand moves with a theme overlay). Inside
  the inverse band the theme's words, muted words, hairlines, subtle fill,
  accent and `onAccent` read on the dark fill, so `Text`, a filled `Card`,
  a primary `Button` and the focus ring need no variant; every plain link
  takes the band's words with a half-strength underline.
- `width` `container` or `reading`; `as` `section`, `div`, `aside` or
  `footer`; `paddingY` (default 8), `paddingTop`, `paddingBottom`.
- Forced colours outline the inverse band.

New classes `sw-band`, `sw-band-inner`, `sw-band-<tone>`,
`sw-band-inner-<width>`; an unknown tone, width or element throws a
`RangeError`. Needs `@scalewing/tokens` with `inverse` and `onInverse`. No
new dependencies. Request: `docs/requests/teisoro-band.md`.
