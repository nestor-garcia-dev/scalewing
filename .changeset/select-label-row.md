---
'@scalewing/react': patch
---

`Select`'s label row matches `Field`'s (`docs/requests/teisoro-select.md`, 2026-09-28 label row follow-up). Its label now uses `Field`'s own label markup (the label words as a `Text` span and the `aria-hidden` required mark, inside a plain `<label>` that keeps the canvas type), so a `Select` beside a `Field` lines up at the label and the control; before, its trigger sat 5 px higher. `labelVisuallyHidden` hides the span inside the label, as `Field` does. No API change and no new dependencies.

Consumer and migration notes:

- The `<label>` element no longer carries `sw-text-label` (or `sw-sr-only` with `labelVisuallyHidden`); a `<span>` inside it does. A selector or test that targeted `label.sw-text-label` in a `Select` should target the label element (`label[for]`, or `getByText(label)` for the span) instead.
- A visible `size="xs"` label row goes from 18 px (the caption line height on the label itself) to 25 px (the canvas body line box, as a visible `xs` `Field` label has), so an `xs` Select with a visible label sits 7 px lower. Toolbar `xs` Selects with `labelVisuallyHidden` are unchanged: the hidden label takes no row.
- A visible `md` label row goes from 20 px to 25 px, so the trigger sits 5 px lower, level with a `Field` beside it.
