---
'@scalewing/react': minor
---

A quiet link look for a title that opens something, such as a table row's title (`docs/requests/teisoro-box-link-quiet.md`, Teisoro F-011 task 2145):

- `Box` `link` (`BoxLink`, `boxLinkAppearances`): `'accent'` (default, unchanged: the canvas link) or `'quiet'`, which keeps the surrounding text's colour at weight 600 and underlines on hover and keyboard focus. Its weight is the non-colour cue (WCAG 1.4.1), so it is for text lighter than 600; axe's `link-in-text-block` passes it on colour (the same colour and background as its text) or on its weight, and an accent link in body text that falls under 3:1 fails it. Only for `as="a"` (otherwise a `TypeError`); an unknown value throws a `RangeError`.

New generated class `sw-link-quiet`. No new tokens. The gallery adds `axe-core` (4.13.0, already in the lockfile through `eslint-plugin-jsx-a11y`) as an exact-pinned dev dependency for its accessibility check (pinned to the version the lockfile already holds, so nothing new is fetched); no production dependency.
