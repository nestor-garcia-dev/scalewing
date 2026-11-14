---
'@scalewing/react': minor
---

`SiteHeader` search, from FutMas's F-024 review (`futmas-site-header-search.md`):

- From `lg` the search field gives up its width first on a crowded bar. It now starts at its 10rem floor and grows up to 16rem into the bar's spare room (`flex: 1 1 10rem; max-width: 16rem`, was `flex: 0 1 16rem`), so long destinations and actions (FutMas's Spanish header at 1366 px) no longer wrap while the field keeps 16rem. They shrink only once the field is at 10rem.
- New optional `labels.cancel` (`search={{ …, labels: { open, close, cancel: 'Cancel' } }}`): the open search's button below `lg` shows that word instead of the ✕ glyph, as an iPhone app's search does beside the field's own clear ✕. The word is the button's only name (no `aria-label`), drawn in the accent at label size, 44 px tall, with the new class `sw-site-header-search-cancel`. Without it the glyph named `labels.close` stays. A blank or non-string `cancel` throws a `RangeError`.
- The results' row template's link carries `tabindex="0"`, as every Scalewing link does, so Safari's default Tab order reaches a result the site's script clones from it.
