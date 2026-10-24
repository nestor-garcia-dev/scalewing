---
'@scalewing/react': minor
---

`SiteHeader`: a public site's header. The brand; from `lg` the main
destinations as a row of links (the current one at label weight over a
bar) and `actions` at the bar's end; below `lg` `compactActions` and a menu
button that opens the destinations as large rows and `menuActions` under
the bar over the window. The menu is a native `details`, so it opens and
closes by touch, click and keyboard with no script (a server-rendered
page); script adds Escape (focus back on the button) and closes it when a
link is chosen, focus leaves it, a press lands outside it or the window
widens to `lg`. Forced colours draw the current bar as a thick underline. Nothing traps focus. `labels`
(`openMenu`, `closeMenu`) name the button by its state; `menuIcon` and
`closeIcon` are its glyph slots; `sticky` (default `true`). New classes
`sw-site-header*`; no items, blank or repeated ids, blank labels or hrefs,
or blank names throw a `RangeError`. No new tokens or dependencies.
Request: `docs/requests/teisoro-site-header.md`.
