---
'@scalewing/react': patch
---

The `ActionMenu` menu and the `DateField` and `CalendarButton` calendar are placed again when the popover or its anchor changes size while open, such as commands that change while the menu is open or a month with another row of weeks (`docs/requests/teisoro-action-menu.md`, 2026-09-28 placement follow-up). Before, their shared placement ran only on opening, scroll and window resize. It uses `ResizeObserver` where the runtime has it.

No API change and no new dependencies.
