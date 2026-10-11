---
'@scalewing/react': minor
---

`ActionMenuItem` `detail`, `detailLang` and `separatorBefore` (`docs/requests/teisoro-action-menu-detail.md`, Teisoro F-011 release R4):

- `detail`: a short current value at the command's end in the muted colour with a chevron (mirrored right to left, `CanvasText` in forced colours), read in its name; it wraps between words. `detailLang` marks its language. A blank `detail`, a blank `detailLang` or one without `detail` throws a `RangeError`.
- `separatorBefore`: a `role="separator"` hairline before the command (never before the first), skipped by the arrow keys.
- New classes `sw-action-menu-detail`, `sw-action-menu-chevron`, `sw-action-menu-separator`. No new tokens or dependencies.
