# Teisoro: site chrome follow-ups (skip link, anchor offset, menu actions, footer touch targets)

Status: implemented, pending release, for the next `@scalewing/react` minor.

Scalewing request from Teisoro.

Renderer: react
Missing surface: `SiteHeader` `skipLink`, plus three fixes to `SiteHeader` and `SiteFooter` behaviour
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: an independent UX review of Teisoro F-017's marketing site (every page is `SiteHeader` inside `ThemeProvider frame="site"`, then `main`, then `SiteFooter`) found four gaps in the shared chrome. In-page jumps (an "On this page" list, a "See how it works" link) land under the sticky bar; there is no skip link; below `lg` the language switch shows twice while the menu is open (in the bar's `compactActions` and the menu's `menuActions`); and a link in the footer's bottom row is about 16 px tall on touch. Each fix is document scroll padding, a link inside the header, or a rule on Scalewing's own classes: product CSS, which Teisoro does not allow.
Existing surface this might already be: `SiteHeader`, `SiteFooter` (both extended here)
Workaround I almost used: a product skip link and `scroll-margin-top` on each target, both product CSS
Proposed API (reusable names only): `<SiteHeader skipLink={{ label, href }}>`

## Behaviour

- **Anchor offset.** While a sticky `SiteHeader` (the default) is on the page, `html:has(.sw-site-header-sticky)` sets `scroll-padding-top` to the bar's height (56 px, 72 px from `lg`, the bar's own expressions), its hairline and spacing step 3, so a `#fragment` jump, `:target` and `scrollIntoView` land below the bar. `sticky={false}` changes nothing.
- **Skip link.** `skipLink?: { label: string; href: string }` (`SiteHeaderSkipLink`) draws `a.sw-site-header-skip-link` as the header's first child and first focusable element (an explicit tab stop). It is visually hidden until it has focus, then a pill on the surface in the text colour with the accent ring, laid over the bar's start in line with the brand. A blank `label`, or an `href` that is not a `#fragment` on the page, throws a `RangeError`. Without the prop nothing changes.
- **Compact actions while the menu is open.** Below `lg`, `compactActions` sit in `sw-site-header-compact-actions` (`display: contents`, so the layout is unchanged) and are hidden while the menu is open, which holds its own `menuActions`; the bar then shows the brand and the close button.
- **Footer bottom row on touch.** On a coarse pointer, a plain link that is all of a `SiteFooter` bottom-row slot (`legal` or `end`, such as a language switch; a link inside running legal words stays inline) is `inline-flex`, centred, at least the 44 px touch target tall, as the group links are. A `ButtonLink` there keeps its own sizing.
- Consumer: every page of Teisoro's public site (F-017 acceptance, task 2725).
