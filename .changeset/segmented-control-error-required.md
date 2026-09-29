---
'@scalewing/react': minor
---

`SegmentedControl` takes `error` and `required` (`docs/requests/teisoro-segmented-control.md`, 2026-09-28 follow-up, Teisoro DRW-20):

- `error?: string` renders a `sw-field-error` message under the track in the same polite live region as `Field`'s (always rendered, never an alert), links it to the `radiogroup` by `aria-describedby`, and sets `aria-invalid` and a danger outline on the group (`Mark` in forced colors). An empty string is no error.
- `required?: boolean` sets `aria-required` on the `radiogroup`; the element that labels the control shows the visible mark.
- The track now renders inside a `.sw-segmented-field` wrapper (new generated classes `sw-segmented-field` and `sw-segmented-field-filled`) that takes its place in the layout, so the track's width in a Stack, an Inline or block flow is unchanged and a `ref` still reaches the `radiogroup`. A test that measured the control against its `parentElement` should use the wrapper's parent. `error` is meant for a Stack or block layout: while a message shows, the field is at least 24ch wide (capped at its container), so in an `Inline` the row grows.

Without the new props nothing else changes. No new dependencies.
