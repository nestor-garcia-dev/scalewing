---
'@scalewing/tokens': minor
---

Additive. Semantic colour `accentSubtle`: a quiet fill tinted with the
accent, and `accentSubtleFor(accent, surface)`. It is a solid mix of 10%
accent into `surface`, stepped down per palette and scheme until accent on
it keeps 4.5:1 (WCAG AA for a 13-point semibold label), and `createTheme`
recomputes it whenever a palette or overlay moves `accent` or `surface`
unless the overlay sets it. Indigo and signal keep 10% (signal 4.83:1
light, 7.42:1 dark); the lowest ratio on a tint is 4.51:1. Harvest's dark
accent is 4.24:1 on its own surface already, so its tint is that surface.
No fixed mix above 0% passes every palette; see ADR 0011. Renderers pick
the colour up through their caret dependency (ADR 0009): native as
`theme.colors.accentSubtle`, web as `--sw-color-accentSubtle`. Consumer
request: `docs/requests/futmas-accent-subtle.md`.
