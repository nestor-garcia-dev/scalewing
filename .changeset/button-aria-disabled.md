---
'@scalewing/react': minor
---

A `Button` with `aria-disabled="true"` now looks disabled (`docs/requests/teisoro-button-aria-disabled.md`, Teisoro F-011 task 2210): the faded look, or with `disabledAppearance="neutral"` the neutral grey, and `GrayText` in forced colors, while it stays focusable and its `onPress` still runs, for a submit that, pressed while off, takes the person to what is missing. No new prop, token, class or dependency.
