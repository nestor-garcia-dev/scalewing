---
'@scalewing/react': minor
---

`ActionMenu` `header` (`docs/requests/teisoro-action-menu.md`, 2026-10-08 follow-up, Teisoro F-006-S11, SET-2). `header?: ReactNode` is a non-interactive block above the commands, such as who is signed in: each child a line of its own, in the caption size and the muted color, set off from the commands by a hairline and lined up with their words. It is not a menu item: it sits in the popover beside the `role="menu"` element, outside the arrow-key order, and is the menu's description (`aria-describedby`), so it is read as the menu opens. Without a header the markup is unchanged (the menu is the popover); with one, the popover is a `div.sw-action-menu-list` holding `.sw-action-menu-header` and the menu (`.sw-action-menu-items`), and the trigger's `aria-controls` names the popover. `null`, `false` and `''` are no header. New generated classes `sw-action-menu-header` and `sw-action-menu-items`. No new tokens and no new dependencies.
