---
'@scalewing/react': minor
---

`Notice` `variant="band"` (with `NoticeVariant` and `noticeVariants`): a full-width square strip of page chrome, such as an environment strip above the app header (`docs/requests/teisoro-environment-strip.md`, Teisoro F-011 release R2).

- Square, the container's full width, at least the `xs` control height, caption type, its words centered; the tone's fill and ink as for every notice.
- Its role defaults to `none` (no live region) unless `role` is given. Forced colors draw a rule under it.
- An unknown `variant` throws a `RangeError`.
- New generated class `sw-notice-band`. No new tokens or dependencies.
