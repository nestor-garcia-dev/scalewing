---
'@scalewing/react': minor
---

A wide `Table` (and `DenominationGrid` strip) shows that it scrolls (`docs/requests/teisoro-table.md`, 2026-10-02 follow-up, Teisoro F-007 task 1550, VLT-1 and HIS-3). While its content is scrolled out past an inline edge, the scroll region adds `sw-scroll-more-start` and/or `sw-scroll-more-end` and that edge draws a soft inset shade (the text color at 28%, spacing steps 6 and 5), mirrored right to left, under the content so nothing moves. A table that fits is unchanged: no class, no shadow. The region measures on mount, on scroll and on resize; before mount and on the server it reports no overflow. In forced colors the system scrollbar is the cue. New generated classes `sw-scroll-more-start` and `sw-scroll-more-end`; no prop changes and no new dependencies.
