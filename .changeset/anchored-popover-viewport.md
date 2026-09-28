---
'@scalewing/react': patch
---

The `DateField` and `CalendarButton` calendar and the `ActionMenu` menu now fit the viewport a classic scrollbar leaves (`docs/requests/teisoro-action-menu.md`, 2026-09-28 placement follow-up). Their shared placement measured `window.innerWidth` and `innerHeight`, which include a classic scrollbar, so a popover clamped to the right edge could sit under the scrollbar instead of `space-2` from it. It now measures the root element's client box. The calendar's `max-width` is `100%` of the top layer less both insets instead of `100vw`, as the menu's is.

Only pages with classic (non-overlay) scrollbars change. No API change and no new dependencies.
