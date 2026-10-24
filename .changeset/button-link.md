---
'@scalewing/react': minor
---

`ButtonLink`: a link drawn as a `Button`, for a destination that reads as
an action (a site's Contact us or Sign in). An `<a href>` with the
Button's `variant`, `size` and `width`, so it opens like any link and works
on a page rendered with no script; it keeps its variant's words over the
canvas link colour, hover included. `aria-current="page"` marks the
current page with the pressed button's ring (a Highlight border in forced
colours). New class `sw-button-link`; an unknown variant, size or width
throws a `RangeError`. No new tokens or dependencies. Request:
`docs/requests/teisoro-button-link.md`.
