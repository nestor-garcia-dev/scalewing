Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.46.0 (PR #225; accepted 2026-10-22; Teisoro F-014-S06 "Acceptance and UX check", task 2632; a gap its acceptance review deferred, D-116, on the training board TrainingProcedure; plan approval under the owner's F-014 delegation of 2026-10-19 and the owner's 2026-10-22 go-ahead for the deferred gaps).
Renderer: react
Missing surface: a `Button` that fills its row beside a sibling, or its column.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: on Teisoro's page reader the board draws Edit as a grey button filling the row under the details box, with the ••• menu, a 44 px square, at the row's end. `Button` is always as wide as its words and `Inline` has no way to let one child grow; Teisoro owns no CSS, so Edit stays a short button at the row's start with the menu beside it.
Existing surface this might already be: `Select` `width="full"` (the same fill, for a select); `ButtonGroup` (stacks full width below `md` only, and is an action row of its own, not a button beside a menu); `ActionBar`'s actions.
Workaround I almost used: a `Grid` of two columns, which halves the row instead of giving the menu its own square.
Teisoro use: `training/TrainingReaderPage`'s page actions: Edit (`variant="neutral"`) beside the shared `RowMenu`.
Proposed API: `width?: 'content' | 'full'` on `Button`, as on `Select`.

## Accepted API (2026-10-22)

- `width?: ButtonWidth` (`'content' | 'full'`, `buttonWidths`), default `'content'`, which renders exactly as before.
- `'full'` adds `sw-button-full`: `width: 100%` (a `Stack`, a `Grid` cell, a column), and in an `Inline` row `flex: 1 1 0; min-width: 0`, so it takes the space its siblings leave while they keep their own width (a direct child only); in a wrapping `Inline`, `flex: 1 1 auto; width: auto`, so it grows from its words and wraps rather than shrinking past them. Not needed in a `ButtonGroup`, which stacks full width below `md` already. The words stay centred.
- An unknown width throws a `RangeError`.
- No new tokens or dependencies.

Evidence: `button-width.test.tsx` (no class by default; `sw-button-full` with the button's other classes kept, a sibling without it; the generated rules, the wrapping row's included; an unknown width refused); gallery "Button" (`#button-width`: Edit beside an icon `ActionMenu`, and a full button alone in its column); `apps/gallery/e2e/button-width.spec.ts` on desktop-en, mobile-es and forced-colors (Edit from the row's start to one gap before the menu, the menu square at the row's end and centred with it, the lone button the column's width, the words centred, no sideways scroll), with `button.spec.ts` and `button-neutral.spec.ts` unchanged and passing.
