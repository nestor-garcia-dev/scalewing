---
'@scalewing/react': minor
---

`DocsLayout`: a docs page's frame on a public site, rendered on the server
with no script. `navLabel`, `labels.openNav`, `groups` of links (each
`{ id, label, items }`, its label a muted caption naming its list; an item's
`current`, `lang` and `hrefLang`), an optional `aside` and the article as
`children`. Centred at `SiteHeader`'s bar width with its gutters; from `lg`
the navigation (15rem, sticky below a sticky `SiteHeader`) beside the
content at the reading width, and from 80rem (an internal width) the
`aside` (13rem) at the end, not shown below it. Below `lg` the same
navigation is a native `details` disclosure at the top of the content. The
current link takes SectionNav `filled`'s quiet fill at label weight; 44 px
links on a coarse pointer; `LinkText` and a `Highlight` edge in forced
colours. New classes `sw-docs-layout*`; a blank `navLabel` or
`labels.openNav`, no groups, an empty group, blank or repeated ids (item ids
across groups), and blank labels or hrefs throw a `RangeError`. No new
tokens or dependencies. Request: `docs/requests/futmas-docs-layout.md`.
