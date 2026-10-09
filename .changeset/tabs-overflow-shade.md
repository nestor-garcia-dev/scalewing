---
'@scalewing/react': minor
---

A `Tabs` strip shows that it scrolls (`docs/requests/teisoro-tabs.md`, 2026-10-08 follow-up, Teisoro F-006-S11, RPT-11). While its labels are scrolled out past an inline edge, the tablist adds `sw-scroll-more-start` and/or `sw-scroll-more-end` and that edge draws the same inset shade as a wide `Table`'s scroll region, mirrored right to left, under the tabs so nothing moves. A strip whose labels fit is unchanged: no class, no shadow. It measures on mount, on scroll and on resize; before mount and on the server it reports no overflow. Forced colors draw no shade. `sticky` strips take it too. The classes already exist (`scrollShadeRules` now generates them for the strip); no prop changes, no new tokens and no new dependencies.
