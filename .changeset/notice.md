---
'@scalewing/react': minor
---

`Notice` (with `NoticeProps`, `NoticeTone`, `NoticeRole` and `noticeTones`): a tinted note in the page's flow (`docs/requests/teisoro-notice.md`, Teisoro F-011 release R2).

- `tone: 'info' | 'success' | 'warning' | 'danger'`, `title?` (a bold lead), `children` (the message), `action?` (one link or small `Button`), `icon?` (a consumer glyph, hidden from assistive technology), `role?: 'status' | 'alert' | 'none'` (danger is an alert, the others a status; `none` is no live region), a forwarded ref.
- A text message shares the title's row while it fits; a message of elements (a sentence and a `Checkbox` or `Field`) stacks under the title.
- The fill mixes the tone into the surface (the accent tint for info) and the words move the tone toward the text color, keeping 4.5:1 on the fill in every palette (see the request for the two palettes whose own danger is below that). Forced colors draw a border.
- An unknown `tone` or `role`, a blank `title`, or nothing to say throws a `RangeError`.
- New generated classes `sw-notice`, `sw-notice-info`, `sw-notice-success`, `sw-notice-warning`, `sw-notice-danger`, `sw-notice-icon`, `sw-notice-content`, `sw-notice-stacked`, `sw-notice-title`, `sw-notice-body` and `sw-notice-action`. No new tokens or dependencies.
