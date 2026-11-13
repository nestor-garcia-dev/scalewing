# FutMas: search in the site header

Status: implemented in `@scalewing/react` 1.65.0 for FutMas F-024 (owner review).

Scalewing request from FutMas.

Renderer: react
Missing surface: a search field in `SiteHeader`, and a search overlay on a phone
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas's owner asked, in the F-024 review on 2026-11-13, for the docs search to be "in the navbar header like a proper search bar", and on a phone an icon that opens a search overlay. The site is rendered at build time, ships no React and keeps no CSS of its own (ADR 0016), so the header slot, the field's look, the full-window overlay and the results dropdown would all be product CSS.
Existing surface this might already be: `CommandPalette` with `CommandPaletteTrigger` (a modal search that needs React running; the site never hydrates), `Field` (a labelled control, not a header search), `SiteHeader actions` (would put the field among the actions with no compact form and no overlay)
Workaround I almost used: a separate "Search the docs" page linked from the docs navigation, which the owner turned down
Proposed API (reusable names only): `<SiteHeader search={{ action, name, label, placeholder, labels: { open, close }, icon }} … />`

## Behaviour

- One GET form drawn once. From `lg` it is a search field in the bar, after the destinations, pushed to the end with the actions.
- Below `lg` a round 44 px search button before the compact actions opens the same form over the whole window as a native popover: the field at the top in the body size (no iPhone zoom), a close button beside it, and the results under it. Opening, Escape and closing need no script; the form submits to `action` with no script.
- An empty, hidden results panel with a polite status line, a list and a row template, for the site's script to fill. From `lg` it drops down under the field as a raised panel; below `lg` it fills the window under the field.
- The consumer's script focuses the field on the popover's `toggle` event and writes the status's final words after un-hiding the panel. No Popover support: no search below `lg`.
- Forced colours: the field, panel and buttons keep a system-colour edge, results are `LinkText`.
- Invalid words or a missing icon throw a `RangeError`.
- Consumer: FutMas's public site header (F-024).
