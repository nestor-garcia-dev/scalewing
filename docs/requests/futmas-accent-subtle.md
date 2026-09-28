# FutMas: accent tint colour

Scalewing request from FutMas.

Renderer: tokens (both renderers read it; web as `--sw-color-accentSubtle`)
Missing surface: a semantic colour `accentSubtle`, a quiet fill tinted with the accent
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas F-002-S25 (owner-approved 2026-09-28) puts a row of action tiles under a screen's title, iOS Contacts style: accent icon and label on an accent-tinted rounded tile. The only fills are `surface`, `subtle` (neutral grey), and the solid action colours. None is a tint of the accent, and a tile cannot layer the accent at an opacity without inventing an alpha value.
Existing surface this might already be: `subtle` (neutral, not the accent); the dark glass fill (translucent and a surface, not a tile fill)
Workaround I almost used: an accent layer at a made-up opacity, or a hex per palette in the product
Proposed API (optional, reusable names only): `theme.colors.accentSubtle` and `accentSubtleFor(accent, surface)`

## Owner decision (2026-09-28)

A computed tint, not hex per palette: a solid mix of the accent into the
surface, recomputed by `createTheme` whenever the accent or surface
changes, like `secondary`. Start around 10% accent. Accent-coloured
13-point semibold text on it meets WCAG AA (4.5:1) in every palette and
scheme; where a palette fails, lower the mix.

## Outcome

No single mix above 0% passes every palette, so the mix steps down per
palette and scheme from 10% (ADR 0011). The default indigo and FutMas's
`signal` keep 10% (signal: 4.83:1 light, 7.42:1 dark). The lowest ratio
on a tint is 4.51:1 (cornflower light, synthwave dark). Harvest's dark
accent is 4.24:1 on its own surface before any tint, so its tint is the
surface itself; that is an existing palette gap, not this colour's.

Consumer: the native `ActionRow` (`futmas-action-row.md`).
