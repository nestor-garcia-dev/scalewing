Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S21 task 810; pending independent review and packed-consumer verification.
Renderer: react
Missing surface: `Dialog` `size` prop (`'md' | 'lg'`).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Dialog` caps its box at `--sw-dialog-max` (32rem). A drawer count dialog lays six bill fields in one row so a cashier reads them the way the drawer is laid out; at 32rem a six-column `Grid` folds to two rows and the neighbors change. Teisoro owns no CSS, so it cannot pass a width through `className`, and a wider `Card` is not a modal.
Existing surface this might already be: `Dialog` (fixed reading width), `Split` (a resizable pane, not a modal).
Workaround I almost used: three fields per row in every denomination dialog, which loses the drawer's left-to-right order, or a product stylesheet overriding `.sw-dialog`.
Teisoro use: the drawer audit, add cash from vault, drop to vault and drawer adjustment dialogs on the Services day page (design pass `docs/design/drawer-close/README.md`, sections 6 to 8). Every dialog with a denomination entry row is `size="lg"`; confirmation dialogs stay `md`.
Proposed API: `size?: 'md' | 'lg'` on `Dialog`, default `md`; `lg` adds `sw-dialog-lg`, whose `max-width` is `min(var(--sw-dialog-max-lg), calc(100vw - var(--sw-space-8)))` with `--sw-dialog-max-lg: 56rem`.
Behavior and failure boundary: presentation only. Both sizes keep the viewport gutter, so a phone shows the same box for either size; the modal, backdrop, Escape and pointer-outside behavior are unchanged. No new token: the width is a generated variable next to `--sw-dialog-max`, as `--sw-select-max` is.

Scalewing owns the class, the variable, the tests, the gallery section and the changeset. Teisoro owns which dialogs are wide.
