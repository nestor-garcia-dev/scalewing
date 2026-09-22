Scalewing request from Teisoro.

Status: implemented under Teisoro F-002-S21 task 815; pending independent review and packed-consumer verification.
Renderer: react
Missing surface: `ButtonGroup`, the action row of a form or dialog.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: every Teisoro form and dialog ends in a Cancel / primary row. `Inline justify="end" wrap` puts them on one line on desktop, but on a phone the wrapped row leaves the second button hanging right-aligned under the first at its own width (the product owner flagged this on the task 815 preview, 2026-09-22). The phone layout wants each button to fill its row, which needs a breakpoint rule and a child width rule; Teisoro owns no CSS.
Existing surface this might already be: `Inline` (one row, wraps at content width), `Stack` (a column at every width), `Grid` (equal columns, but a phone still gets columns).
Workaround I almost used: two `Inline`s behind `hideBelow` / `hideFrom`, which mounts every button twice.
Teisoro use: the drawer support dialogs and the void dialog (`FormShell`), the entry form's Cancel / Save row, the drawer close finalize row, the status callouts' actions (`docs/design/entry-pages/07-actions-and-states.md`, `09-void-dialog.md`).
Proposed API: `ButtonGroup` with `justify?: 'start' | 'end' | 'between'` (default `end`) and Box props. Generated `sw-button-group` (flex, wrap, gap `--sw-space-2`) with `sw-button-group-{justify}`; below `md` the group becomes a column with every child at `width: 100%`, in source order, so the primary action stays last.
Behavior and failure boundary: layout only. No keyboard or focus behavior; buttons keep their own semantics.

Scalewing owns the classes, tests, gallery evidence and changeset. Teisoro owns which buttons go in the row and their order.
