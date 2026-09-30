---
'@scalewing/react': patch
---

`Toast` keeps the page gutter on a phone (`docs/requests/teisoro-toast.md`, 2026-09-30 follow-up, Teisoro F-007-S05 task 1375, DRW-29). `.sw-toast` is capped at `calc(100% - var(--sw-space-4) - var(--sw-space-4))` of the top layer and wraps a long word (`overflow-wrap: break-word`), so a message wider than the screen wraps inside a 16 px gutter on each side instead of running to the edges. A toast is still as wide as its message up to that cap and centred, so a short toast is unchanged. No API change and no new dependencies.
