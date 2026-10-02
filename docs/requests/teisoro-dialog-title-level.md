Scalewing request from Teisoro.

Status: Merged in #89 (2026-10-02) and released in `@scalewing/react` 1.17.0; Teisoro pins it in F-007 task 1550.
Source: Teisoro UX review `vault-change-orders.md`, finding CHG-13 (minor, WCAG 1.3.1; the part left for Scalewing). Create 02–04 `.aria.yml`: `heading "Create change order" [level=3]`, then `heading "Requesting from the bank" [level=3]` and `heading "Payment" [level=3]`; deposit 01–04 and targets 01 the same. `Dialog` renders its `title` with `Text variant="title"`, an `h3`, so a dialog's own section headings are either its title's peers (`h3`) or skip to `h4` under a title that is not the top of the dialog's outline. The same problem was found in the drawer dialogs (DRW-2).
Renderer: react
Missing surface: `Dialog` `titleLevel` prop (`2 | 3`).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the title is `Dialog`'s own markup (it also names the dialog through `aria-labelledby`); a consumer cannot change its element. Passing `title=""` and drawing an `h2` in the children would leave the dialog without its name.
Existing surface this might already be: `Text` `as` (the element of a text node the consumer renders), not reachable for the title.
Workaround I almost used: rendering the dialog's section labels as `h4` under the `h3` title, or as plain text with no heading, which drops them from the heading outline.
Teisoro use: the change-order dialogs (`apps/teisoro-web/src/app/change-orders/CreateOrderDialog.tsx`, `DebtDialogs.tsx`, `FulfillDialog.tsx`, `TargetsDialog.tsx`) and the drawer dialogs, whose section labels become `h3` under an `h2` title.
Proposed API: `titleLevel?: 2 | 3` on `Dialog`, default `3`; exported type `DialogTitleLevel`.

Behavior and failure boundary: `titleLevel={2}` renders the title as an `h2`; the default (`3`, or the prop left out) keeps the `h3` every existing dialog has, so no consumer's heading outline or tests change unless it opts in. The title keeps the `title` typography variant at either level; the element changes, not the look. The `aria-labelledby` name, focus and close behavior are unchanged.

Rejected alternatives:

- Making the title an `h2` by default, as the review suggested. Every existing dialog's outline would change in a minor release (a consumer whose section labels are `h3` today would gain a level gap no one asked for, and tests that find the title at level 3 would fail); the default can change in a major release.
- Levels 1 and 4. A modal's title under the page's `h1` is at most an `h2`, and an `h4` title would leave the dialog's sections at `h5`, which `Text` cannot render. The union can widen later without breaking anyone.
- `titleAs` taking any element. A dialog's title is always a heading; a level is the smaller, safer API.
- A `heading` slot (a node). The title must stay a string because it names the dialog.

Scalewing owns the prop, the tests, the gallery and the changeset. Teisoro owns which dialogs opt in and the levels of their sections.

Evidence: `dialog.test.tsx` ("titles the dialog with an h3 by default and an h2 at titleLevel 2, in the same style": the default title is an `H3` named by `aria-labelledby`; at level 2 an `h2` with the same class and a section `h3` under it); `apps/gallery/e2e/dialog.spec.ts` "Dialog titles with an h3 by default and an h2 at titleLevel 2, in the same style" on desktop-en, mobile-es and forced-colors: "How we rank" keeps its `h3`, "Log a transect" (now `titleLevel={2}`) has an `h2` title and the `h3` "Sightings per habitat" under it, and both titles compute the same font size, weight and line height.
