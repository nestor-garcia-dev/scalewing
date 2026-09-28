---
'@scalewing/react': patch
---

`ActionMenu` gives a coarse pointer the 44 px touch target (`docs/requests/teisoro-action-menu.md`, 2026-09-28 touch-target follow-up). Under `@media (pointer: coarse)` the trigger is at least `--sw-control-md-min-height` (44 px) tall and wide, and each command at least 44 px tall; a fine pointer keeps the compact xs height. This follows `CalendarButton`'s coarse-pointer rule, and both now read the target from one internal module.

Visual change on touch screens only. No API change and no new dependencies.
