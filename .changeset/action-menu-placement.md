---
'@scalewing/react': patch
---

`ActionMenu` places its menu with the shared anchored-popover code that the `DateField` and `CalendarButton` calendar use (`docs/requests/teisoro-action-menu.md`, 2026-09-28 follow-up). The menu now opens a `space-1` (4 px) gap below its trigger, or above it when it only fits there, keeps at least `space-2` (8 px) from every viewport edge, and lines up with the trigger's end when the trigger ends a row and the menu would not fit from the trigger's start. Before, it sat directly on the trigger and was pushed flush against the screen edge.

- The menu element is rendered only while it is open, like the calendar; it was a `hidden` element before. `aria-controls` already pointed at it only while open. A test that looked for the closed menu with `{ hidden: true }` now finds nothing.
- `.sw-action-menu-list` has a `max-width` of the viewport less both insets, and the unused `.sw-action-menu-list[hidden]` rule is gone.

No API change and no new dependencies.
