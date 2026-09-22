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
