---
'@scalewing/react': minor
---

`SiteFooter`: a public site's footer on the dark inverse band. `brand`,
an optional `tagline`, `groups` of links (each a `nav` named by its label,
the label shown above its links; a link's `current`, `lang` and
`hrefLang`), and a bottom row past a hairline with `legal` at its start and
`end` (such as a language switch) at its end. Links are the band's muted
words, the current one its words at label weight, underlined on hover and
focus, 44 px on a coarse pointer. Two columns of groups below `md`, one
spread row from `md`. New classes `sw-site-footer*`; no groups, an empty
group, blank or repeated ids, blank labels or a blank `href` throw a
`RangeError`. No new tokens or dependencies. Request:
`docs/requests/teisoro-site-footer.md`.
