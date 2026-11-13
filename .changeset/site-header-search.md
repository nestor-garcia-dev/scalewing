---
'@scalewing/react': minor
---

`SiteHeader search`: the site's search in the header, rendered on the server
with no script. `search` (`SiteHeaderSearchOptions`: `{ action, name?, label,
placeholder, labels: { open, close }, icon }`) is one GET form drawn once:
from `lg` an sm search field in the bar after the destinations, pushed to the
end with the actions; below `lg` a 44 px search button before the compact
actions that opens the same form over the whole window as a native popover
(the field at the body size so an iPhone does not zoom in, a close button
drawn with `closeIcon`, the results under it). Opening, Escape, closing and
submitting need no script (the consumer's script focuses the field on
`toggle`), and the form submits to `action` as `name` (default `q`). An
empty `hidden` results panel with a polite status, a list and a row
`template` is the consumer's script to fill: from `lg` it drops down under
the field as a raised panel, below `lg` it fills the window. New classes
`sw-site-header-search*`; blank words, a `name` that is not a plain
parameter name, or no `icon` throw a `RangeError`. No new tokens or
dependencies. Request: `docs/requests/futmas-site-header-search.md`.
