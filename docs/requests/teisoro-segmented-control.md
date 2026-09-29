Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S21 task 810; pending independent review and packed-consumer verification.
Renderer: react
Missing surface: `SegmentedControl` `variant="filled"`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the drawer adjustment dialog asks "What do you want to do?" and the answer (remove from the drawer or add to it) decides the sign of everything below. The compact `SegmentedControl` renders two small chips at content width, which the product owner judged too quiet for that choice on 2026-09-22 and asked for the familiar full-width pill toggle (two equal halves, the selected half filled with the accent). Two `Button`s lose the radiogroup semantics; a `RadioGroup` is a list, not a toggle; Teisoro owns no CSS.
Existing surface this might already be: `SegmentedControl` (compact chips only), `RadioGroup`, `Switch` (a boolean, not two named choices).
Workaround I almost used: two primary/secondary `Button`s tracking the choice in product state.
Teisoro use: the drawer adjustment dialog's direction (`docs/design/drawer-close/08-adjustment-dialog.md`), the workspace shell's language switch (English / Español, in the header's Inline), and later the vault movement direction (S19).
Proposed API: `variant?: 'compact' | 'filled'` on `SegmentedControl`, default `compact` (unchanged look). `filled` adds `sw-segmented-filled`: an equal-column grid (`grid-auto-columns: minmax(0, 1fr)`) that takes the full width in a Stack and its labels' width in an Inline, each item centered at the `md` control height in body type, and the selected item painted `--sw-color-accent` with `--sw-color-onAccent`.
Behavior and failure boundary: presentation only; radiogroup semantics, keyboard arrows and `onChange` are unchanged. No tone prop: the choice's meaning is carried by the consumer's surrounding copy and totals.

Scalewing owns the class, tests, gallery evidence and changeset. Teisoro owns the labels and glyphs inside each segment.

## Follow-up: `disabled` (Teisoro F-002-S21 task 815)

Status: implemented under Teisoro F-002-S21 task 815; pending independent review and packed-consumer verification.
Missing surface: `SegmentedControl` `disabled`.
Why the existing surface cannot do this: the entry edit page shows the payment method (Cash / Debit card) as the same two-half toggle the new-entry page uses, but inert, because the entry contract locks that identity after creation; the workspace header also wants the language switch inert while a language save is in flight. Without the prop the consumer either hides the control (the employee loses the visual anchor Angular keeps) or wraps it in a product stylesheet.
Teisoro use: `docs/design/entry-pages/08-edit-page.md` (identity read-only) and `WorkspaceShell` (saving state).
Proposed API: `disabled?: boolean`, default `false`; a disabled control may omit `onChange` (the type requires it only when the control is live). The group gets `aria-disabled="true"` and `sw-segmented-disabled` (`opacity: var(--sw-disabled-opacity)`), each segment renders `disabled`, `onChange` never fires from a click or an arrow key, and the selected segment keeps its selected look.
Behavior and failure boundary: presentation and interaction only; the consumer still decides the value.

## Follow-up request (2026-09-25, Teisoro F-002-S19 task 1060): an icon slot on items

Status: requested; not started.

`SegmentedControl` items take a `label` node, so a consumer can put an icon in it, but nothing states how an icon-only item gets its accessible name or how the icon sits beside the text at each size. Angular's vault movement filter used icons for All, In and Out; React shows the text alone.

Proposed API: items gain `icon?: ReactNode` (decorative, `aria-hidden`, placed before the label with the control's gap) and `labelVisuallyHidden?: boolean` for an icon-only item whose `label` stays its accessible name. Radiogroup semantics, arrows and `onChange` are unchanged.

Teisoro use: the direction control on `/vault` (`apps/teisoro-web/src/app/vault-page/MovementsCard.tsx`). Design: Teisoro `docs/design/vault/README.md`, Scalewing gap 6.

## Follow-up request (2026-09-28, Teisoro F-007-S05 task 1350): `error` and `required`

Status: merged in #75 (2026-09-28) and released in `@scalewing/react` 1.13.0; Teisoro pins it in F-007-S05.
Source: Teisoro UX re-review `services-drawer-cash-and-audits.md`, finding DRW-20 (polish): after a refused adjustment the direction control's border stays grey (rgb(210,210,215)) while Reason and Notes are outlined in red; only the caption "Choose add or remove." marks it. "Give Scalewing's segmented control (or `RadioGroup`) an `error` prop that draws the danger border and sets `aria-invalid`, as `Select` got in 1.12.0. Teisoro then drops its `data-invalid` group."

Teisoro use: the adjustment dialog's direction (`apps/teisoro-web/src/app/drawer-support/AdjustmentDialog.tsx`), which renders its own caption and a `data-invalid` wrapper today.

Proposed and implemented API (both optional, no default change):

- `error?: string`: a `sw-field-error` message under the track, in the polite `FieldErrorRegion` that `Field`, `Checkbox`, `RadioGroup`, `DateField` and `Select` use (always rendered, empty without an error, never an alert). While it has text the `radiogroup` gets `aria-describedby` (the message) and `aria-invalid="true"`, and its outline turns `--sw-color-danger` (3:1 or more against the page background and the surface in every palette; `Mark` in forced colors). The radios carry no state of their own: `radiogroup` supports `aria-invalid` and `aria-required`, and the group is what the message describes. An empty string is no error.
- `required?: boolean`: `aria-required="true"` on the `radiogroup`. The control has no visible label of its own (it is named by `aria-label` or `aria-labelledby`), so the visible mark belongs to the element that labels it; the gallery shows the `Field` asterisk there.

Layout: the track now always renders inside a `.sw-segmented-field` wrapper (`inline-flex` column for `compact`, `flex` for `filled`, gap `space-1`) that takes the track's place: the track still takes the full width in a Stack, its labels' width in an Inline, and the page width in block flow when filled. The wrapper is always there, so an error that appears later does not remount the group (focus stays) and the live region exists before its text. The message has inline-size containment, so its length never widens the field by itself. While it has text, the field is at least `min(100%, 24ch)` wide. The percentage resolves against the field's container (the Stack or Inline), so a narrow container caps it. In a Stack nothing moves. In an Inline (Scalewing's `.sw-inline`) the field grows to fit the message and the row moves, while the track keeps its labels' width (`align-self: flex-start`). `error` is documented for a Stack or block layout.

Code review of PR #75: a short compact track in an Inline squeezed its message into a column at the track's width (about 100 px, two lines for "Choose the group size."). The review's suggested `min-inline-size: min(100%, 24ch)` on the message did nothing, measured in the gallery: on a contained message the percentage is cyclic against the field, resolves to nothing, and the message stayed 100 px and two lines. Without containment the field grew to the message's full length, and the track grew with it. On the field, the same expression widens it to 257 px (24ch at body type) with the message on one line, keeps a 120 px Stack at 120 px, and leaves the track at its 100 px in an Inline. A `ref` still reaches the `radiogroup`. The segmented rules moved from `css/css-data.ts` to their own `css/css-segmented.ts`.

Consumer note: the `radiogroup`'s parent element is now the wrapper. A test that measured the control against `parentElement` should measure against the wrapper's parent.

Rejected alternatives:

- Rendering the wrapper only while `error` is set. An error would then remount the group, dropping focus from the segment the person is on, and the live region would not exist before its text, so it would not be announced.
- Rendering the message as a sibling of the track (a fragment). In an Inline it would sit beside the track, and in a Stack it would take the Stack's gap rather than the field's.
- `aria-invalid` on each radio. The error is about the choice as a whole, which the group represents; a screen reader announces the group's state and description on entering it.
- A visible `label` prop in the same change. No consumer asked for one; the control is labelled by the consumer's own heading or label today.

Evidence: `segmented-control.test.tsx` (the group described by the polite message with `aria-invalid` and `aria-required`, kept mounted and reachable by `ref` when the error appears, no alert, plain radios, `''` as no error, the wrapper classes per variant; the generated outline and its forced-colors `Mark`, and the outline token at 3:1 or more against background and surface for every palette × light and dark from `createTheme`); `field-error-region.test.tsx` (SegmentedControl added to the shared polite-region check); `apps/gallery/e2e/segmented-control.spec.ts` "SegmentedControl shows an error under the track, described on the group" on desktop-en, mobile-es and forced-colors (emulated, so the `Mark` outline is what changes there) with the gallery's required "Herd movement" and a compact "Group size" in a Stack (its message under a full-width track, on one line, described on the group): `aria-required`, the region empty before "Log movement" and holding "Choose arriving or leaving." after it, `aria-invalid` and the accessible description with no alert, a changed border color, the message under the track and the track's width unchanged, and the region taking no room once a choice clears it. The existing layout test now measures against the wrapper's parent and compares the Inline control with the Stack one, so it also passes at 390 px (it failed there on `main`).
