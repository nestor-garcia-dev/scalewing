---
'@scalewing/react': minor
---

`InfoTip` and `InfoTipProps`: a toggletip, a ghost icon-only `Button` whose only job is to show its tip (`docs/requests/teisoro-tooltip.md`, 2026-10-09 follow-up, Teisoro F-006-S11). Since 1.22.0 a tap on a `Button` presses it and never opens its `Tooltip`, so an ⓘ beside a figure could not show its help on a touch screen.

- `label` (the button's name), `content` (the tip, plain text), `children` (the decorative glyph), `size` (a Button size; `md` by default, and 44 px on a coarse pointer at every size).
- Hover and a visible focus show the tip as `Tooltip` does. A press (a tap, a click, Enter or Space) shows it and keeps it shown when the pointer leaves; the next press, Escape, blur or a press outside hides it.
- The tip is the button's description (`aria-describedby`). A press also puts it in a visually hidden polite live region (`role="status"`), so a screen reader user who presses the button hears it. Every InfoTip renders that `role="status"` element, empty until a press, and while a press holds the tip open its text is in the page twice (the bubble and the region): a test that finds a `status` or the tip's text should scope its query.
- `type="button"`: it never submits a form. An empty `label` or `content` throws a `RangeError`.
- New generated class `sw-info-tip` (the square icon button, shared with `sw-calendar-button`, whose rules are equivalent: same declarations and specificity, one block reordered).

`Tooltip`'s behavior is unchanged for every other trigger: a tap on a control still does what the control does and leaves its tooltip closed. No new tokens or dependencies.
