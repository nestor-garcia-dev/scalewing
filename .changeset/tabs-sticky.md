---
'@scalewing/react': minor
---

`Tabs` `sticky` (`docs/requests/fantasy-football-tabs-sticky.md`, the fantasy-football companion's section tabs): `sticky?: boolean`, default `false`, keeps the strip at the top of the viewport (`top: env(safe-area-inset-top, 0px)`) while a long panel scrolls under it, on the sticky `AppHeader`'s `topChrome` layer. The stuck strip is a full-bleed band of the page canvas, not a glass card: `--sw-color-background` at 90 % over the glass blur and saturate tokens, with the strip's existing hairline, solid canvas under `prefers-reduced-transparency` and `Canvas` in forced colors. A sticky element only sticks within its parent, so make the strip a direct child of the page container that holds the panels; each tab's md inline padding (16 px, spacing step 4) lines the first label up with a `space-4` page gutter. New generated class `sw-tabs-sticky`. No new tokens and no new dependencies.
