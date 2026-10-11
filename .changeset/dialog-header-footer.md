---
'@scalewing/react': minor
---

`Dialog` `description`, `icon`, `footer`, `summary`, `size="xl"` and `role` (with `DialogRole` and `dialogSizes`): a sheet's header and pinned footer (`docs/requests/teisoro-dialog-header-footer.md`, Teisoro F-011 release R2).

- `description`: a muted line under the title and the dialog's accessible description. `icon`: a consumer glyph or tile before the title, `aria-hidden`.
- `footer`: the actions, pinned to the dialog's bottom edge under a hairline while the content scrolls. `summary`: ActionBar's labelled figure at the footer's start, in a polite status region.
- `size="xl"`: 65rem (`--sw-dialog-max-xl`). `role="alertdialog"` for a warning that interrupts.
- An unknown `size` or `role`, a blank `description` or an invalid `summary` throws a `RangeError` (an unknown size used to render `md`). `role` is typed `'dialog' | 'alertdialog'` (any other role used to pass through to the element).
- New generated classes `sw-dialog-xl`, `sw-dialog-header-framed`, `sw-dialog-icon`, `sw-dialog-titles`, `sw-dialog-description`, `sw-dialog-footer`, `sw-dialog-footer-status` and `sw-dialog-footer-actions`. No new tokens or dependencies.
