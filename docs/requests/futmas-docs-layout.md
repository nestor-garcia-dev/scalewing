# FutMas: a docs page's frame

Status: implemented for FutMas F-024-S03, pending release in the next `@scalewing/react` minor.

Scalewing request from FutMas.

Renderer: react
Missing surface: `DocsLayout`, a docs page's frame on a public site
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas's owner-approved public-site canvas (F-024, version 12) has docs pages with a side navigation of grouped links at the start, the article in the middle at the reading width, and an "On this page" list at the end. The site is rendered at build time, ships no JavaScript and keeps no CSS of its own (ADR 0016), so the columns, the sticky side navigation, the group captions and the phone's disclosure would all be product CSS.
Existing surface this might already be: `AppShell` (a signed-in workspace frame: required glyphs, a rail, and a drawer that needs script), `Grid rail` (its rail is at the end and stacks after the main column on a phone), `SectionNav verticalFrom` (one list, not a page layout)
Workaround I almost used: a `Grid rail` with the navigation in the rail, which puts it on the wrong side and below the article on a phone
Proposed API (reusable names only): `<DocsLayout navLabel groups={[{ id, label, items: [{ id, label, href, current, lang, hrefLang }] }]} labels={{ openNav }} aside>{article}</DocsLayout>`

## Behaviour

- A plain wrapper inside the page's one `main`, centred at `SiteHeader`'s bar width with its gutters.
- From `lg`: the navigation (15rem) beside the content (the article at most `--sw-reading-max`); from 80rem, an internal width, a given `aside` (13rem) at the end, not shown below it.
- The navigation and the aside stick below a sticky `SiteHeader` and scroll on their own only when taller than the window.
- Each group's label is a small muted caption naming its list; the current link (`aria-current`, as SectionNav's `current`) takes SectionNav `filled`'s quiet fill at label weight, the others the text colour.
- Below `lg`: a native `details` disclosure at the top of the content, its full-width `summary` (`labels.openNav` and a chevron, at least 44 px) opening the same groups as large rows, with no script. The navigation is drawn twice and only one copy is displayed.
- 44 px links on a coarse pointer; `LinkText` links and a `Highlight` edge on the current one in forced colours.
- Invalid groups, items or words throw a `RangeError`.
- Consumer: FutMas's public docs pages (F-024-S03).
