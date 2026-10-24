# Teisoro: a public site's header

Status: implemented, pending release, for the next `@scalewing/react` minor.

Scalewing request from Teisoro.

Renderer: react
Missing surface: `SiteHeader`, a public site's header with a phone menu that works with no script
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro F-017 (owner-approved 2026-10-24) builds a static public site, prerendered to HTML, whose every page opens with the same header: the logo, five destinations with the current one marked, a language switch, Sign in and a blue Contact us; on a phone the logo, the language switch and a ☰ button whose menu lists the destinations, Contact us, Sign in and the language switch. The menu must open and close with JavaScript off, by touch and keyboard, close with Escape and trap no focus. `AppHeader` is a workspace's glass bar and `AppShell`'s drawer is a script-driven modal for an app; neither has a public site's row of destinations or a menu that works without script.
Existing surface this might already be: `AppHeader` (a bar only), `AppShell` (a workspace frame with a modal drawer), `Nav` and `SectionNav` (navigation inside an app)
Workaround I almost used: a product `details` with its own CSS for the panel and the glyph swap, which Teisoro does not allow (Teisoro owns no CSS)
Proposed API (reusable names only): `<SiteHeader brand navLabel items actions compactActions menuActions labels={{ openMenu, closeMenu }} menuIcon closeIcon sticky>`

## Behaviour

- From `lg`: the brand, the destinations as a row of links (the current one, `aria-current`, at label weight over a bar in the words' colour as tall as the bar) and `actions`, spread apart on a 72 px bar.
- Below `lg`: the brand, `compactActions` and the menu button on a 56 px bar. The menu is a native `details` whose `summary` is the button, its glyph and name (`openMenu` or `closeMenu`) swapped by its state; the panel lies under the bar over the rest of the window, with the destinations as large rows (the current one in the accent) and `menuActions` at its foot, scrolling on its own.
- With no script the menu opens and closes by touch, click and keyboard. Script adds Escape (focus back on the button) and closes it when a link in it is chosen, focus leaves it, a press lands outside it, or the window widens to `lg`. Nothing traps focus.
- `sticky` (default `true`) keeps the bar at the window's top, on the top-chrome layer.
- Forced colours draw the hairlines, the current destination (a thick underline for its bar) and the button's frame in system colours.
- Invalid items or words throw a `RangeError`.
- Consumer: every page of Teisoro's public site.
