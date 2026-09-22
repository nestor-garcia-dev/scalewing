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
