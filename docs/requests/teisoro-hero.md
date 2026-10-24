# Teisoro: a public page's opening

Status: released in `@scalewing/react` 1.49.0 (PR #250).

Scalewing request from Teisoro.

Renderer: react
Missing surface: `Hero`, a public page's opening: eyebrow, title, lead, actions and an optional picture beside them
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro F-017 (owner-approved 2026-10-24) opens every page of its public site with the same block: a muted eyebrow, the page title at the `hero` size, a lead and the "Contact us" actions, and on Home and For owners a drawn phone screen beside the words that keeps its own width. On a phone the picture goes under the words and the actions stack to the full width. `Grid` gives equal columns (the picture would take half the row) and `Inline` cannot stack its children to the full width below `md` only; the column split and the stacking would be product CSS, which Teisoro does not allow.
Existing surface this might already be: `Grid` `columns={2}` with `columnsBelow`, `Split` (a drag separator), `Article` (a post on a card)
Workaround I almost used: `Grid columns={2}` with the picture centred in a half-width column, and `ButtonLink width="full"` on every width
Proposed API (reusable names only): `<Hero eyebrow title lead actions media />`

## Behaviour

- A `section` named by its title (`aria-labelledby`), the title the page's `h1` in the `hero` size; the eyebrow muted `label` words; the lead in the `lead` size.
- From `md` the picture keeps its own width at the row's end; below `md` it sits centred under the words.
- The actions wrap in a row, and stack to the full width below `md`.
- With no picture the words keep the reading width.
- No fill or gutter: it sits in the page's column.
- A blank title throws a `RangeError`.
- Consumer: every page opening on Teisoro's public site (F-017 S03).
