---
'@scalewing/react': minor
---

`ButtonGroup` `attached` (`docs/requests/teisoro-button-group-attached.md`, Teisoro F-011 release R4): one joined control, such as Previous, Today and Next. Its direct `Button` children at one height with no gap, single dividers (overlapping borders; a borderless variant's in its text colour), square inner and `sm`-radius outer corners; an isolated stacking context raises a pressed toggle and the focused button's outer ring over their neighbours (a new `joinedControlOrder` in `css/stacking.ts`). It keeps its row on a phone and sizes to its buttons. New class `sw-button-group-attached`. No new tokens or dependencies.
