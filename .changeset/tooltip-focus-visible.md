---
'@scalewing/react': minor
---

`Tooltip` opens on a visible focus only, and keeps its bubble inside the screen (`docs/requests/teisoro-tooltip.md`, 2026-10-08 follow-up, Teisoro F-006-S11, SET-9). Behavior changes, no API change:

- A focus opens the tooltip only when it is `:focus-visible` (the keyboard, or a script after keyboard use). The focus a click or a tap gives no longer opens it, so a pressed control does not keep its help shown, even on the next page, until the focus moves. Hover still opens it. A browser without `:focus-visible` counts every focus as visible, as before.
- A tap toggles the tooltip only on a trigger that does nothing else on a tap, such as a focusable badge. A tap on a control (a button, a link or image-map area, a form control or its label, media with controls, an editable region or an element with a widget role such as combobox, slider, textbox or treeitem, or anything inside one) does what the control does and leaves the tooltip closed. Consumers that relied on a tap on an icon button showing its help should show the name as text on touch screens.
- The bubble is a manual popover on the top layer while it shows, placed beside its trigger as `ActionMenu` is: under it (over it near the bottom of the screen), lined up with its start or, where that would leave the screen, its end, a `space-2` inset from every edge, following scrolling and resizing. While hidden it stays in the page (a `label` tooltip still names its trigger) and is not a popover. `.sw-tooltip` is now `position: fixed` and capped at `min(18rem, 100% − 2 × space-2)` of the viewport.

No new classes, tokens or dependencies.
