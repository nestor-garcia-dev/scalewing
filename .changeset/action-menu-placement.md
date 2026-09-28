---
'@scalewing/react': patch
---

`ActionMenu` places its menu with the shared anchored-popover code that the `DateField` and `CalendarButton` calendar use (`docs/requests/teisoro-action-menu.md`, 2026-09-28 follow-up). The menu now opens a `space-1` (4 px) gap below its trigger, or above it when it only fits there, keeps at least `space-2` (8 px) from every viewport edge, and aligns to the trigger's inline start (its right edge in right-to-left), or to the trigger's other edge when the trigger ends a row and the menu would not fit from its start. Before, it sat directly on the trigger and was pushed flush against the screen edge.

- The menu element is rendered only while it is open, like the calendar; it was a `hidden` element before. `aria-controls` already pointed at it only while open. A test that looked for the closed menu with `{ hidden: true }` now finds nothing.
- `.sw-action-menu-list` is as wide as its longest command (`width: max-content`, at least the 44 px control height) up to the viewport less both insets, so a long command wraps inside the screen instead of running off it. It resets the popover layer's `inset`, so the placed position holds in right-to-left documents too. Commands take the label line height with a `space-1` block padding, still 28 px tall on one line.
- The unused `.sw-action-menu-list[hidden]` rule is gone.

No API change and no new dependencies.
