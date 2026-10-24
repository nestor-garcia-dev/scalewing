# Teisoro: a public page's type sizes

Status: implemented, pending release, for the next `@scalewing/tokens` and `@scalewing/react` minors.

Scalewing request from Teisoro.

Renderer: tokens, react (native picks the variants up through its theme)
Missing surface: typography variants `hero`, `headline` and `lead`, the sizes of a public page's opening title, its section titles and the sentence under them
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro F-017 (owner-approved 2026-10-24) builds a public marketing site whose approved boards set the page title at 56 px (36 px on a phone), each section's title at 36 px (26 px) and the opening sentence at 20 px (17 px). Scalewing's largest size is `display`, 40 px, sized for an app's page title; a product may not size type itself, so the site would read as an app screen.
Existing surface this might already be: `display` and `heading` (an app's page and section titles), `title` (20 px, semibold, a card's title)
Workaround I almost used: `display` for the page title and `heading` for the sections, 16 and 8 px under the boards
Proposed API (reusable names only): `typographyVariants.hero`, `.headline`, `.lead` with compact sizes; `<Text variant="hero | headline | lead">`

## Behaviour

- `hero` 56/60 bold, compact 36/40: the one opening title of a public page; `Text` renders it as an `h1`.
- `headline` 36/40 bold, compact 26/30: a public page's section title; `Text` renders it as an `h2`.
- `lead` 20/29 regular, compact 17/25 (the body's size): the sentence under a `hero` or `headline`; `Text` renders it as a `p`.
- Compact sizes apply below `md` on web, as `display` and `heading` do; native reads them from `theme.typography`.
- Additive: no existing variant moves.
- Consumer: every page of Teisoro's public site (F-017 S03).
