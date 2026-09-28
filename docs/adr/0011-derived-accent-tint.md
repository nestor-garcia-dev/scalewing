# ADR 0011: Derived accent tint

- Status: accepted
- Date: 2026-09-28

## Decision

`accentSubtle` is a semantic colour computed from two others, not a hex
chosen per palette. It is a solid mix of the accent into the surface,
starting at 10% accent (`accentSubtleMix`). The mix steps down one
percentage point at a time until accent on the tint reaches 4.5:1
(`accentSubtleMinContrast`), and stops at 0%, the surface itself.
`createTheme` recomputes it whenever a palette or overlay moves `accent`
or `surface`, the way an unset `secondary` follows `surface`. An overlay
that sets `accentSubtle` wins. Web reads it as `--sw-color-accentSubtle`
from the generated stylesheet and palette files; native reads
`theme.colors.accentSubtle`.

The floor is WCAG AA for normal text. The tint's first use is a 13-point
semibold label (caption size, label weight), which is not large text.

## Rationale

A tinted tile (iOS Contacts actions, FutMas F-002-S25) needs a fill that
belongs to the palette. Hex per palette is 36 more reviewed values that
drift whenever an accent changes, and a consumer overlay would have none.
An accent layered at an opacity is an invented alpha that renderers apply
differently. A solid mix is one pure function in `@scalewing/tokens`, a
valid hex for overlays and contrast checks, and the same on both
renderers.

No fixed mix above 0% keeps every palette at 4.5:1 (at 10%, ten
palette-schemes fall below; at 1%, cornflower light already does), so the
mix is per palette and scheme rather than one global amount.

Measured on 2026-09-28 across the 18 palettes in both schemes:

| Mix  | Palette-schemes                                                                           |
| ---- | ----------------------------------------------------------------------------------------- |
| 10%  | 26, including indigo and signal (signal 4.83:1 light, 7.42:1 dark)                        |
| 9–4% | tangerine light 9%, amber light 7%, capri light and synthwave both 5%, soft-blue light 4% |
| 2–0% | fuchsia light 2%, raspberry light 1%, cornflower light 0%, harvest dark 0%                |

The lowest ratio on a tint is 4.51:1 (cornflower light, synthwave dark).
Harvest's dark accent is 4.24:1 on its own surface before any tint (it
passes on the background, which is what the palette test checks), so its
tint is the bare surface: the tint never lowers the contrast an accent
already has. The accent-subtle test lists that one exception, so a new
palette that falls below the floor fails the build.

## Consequences

- Palettes whose light accent sits near 4.5:1 on white (cornflower,
  raspberry, fuchsia, soft-blue) get a tint that is nearly the surface. A
  component on `accentSubtle` still needs a shape of its own; it must not
  rely on the tint alone to show where it is.
- Raising a palette's tint means a darker accent for that palette, not a
  lower floor.
- `accentSubtleFor(accent, surface)` is public so an overlay author can
  preview the tint. The mix and floor are not a per-product setting.
