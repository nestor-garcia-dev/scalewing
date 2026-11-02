Scalewing request from FutMas.

Status: released in `@scalewing/react` 1.61.0 and `@scalewing/tokens` 1.8.0 for FutMas F-010-S28.
Renderer: react
Missing surface: `ThemeProvider density` (`comfortable` | `compact`), with the fix to `.sw-filter-chip-face`, which lacked `box-sizing: border-box` and measured 54 px.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas's admin website is a desktop data tool drawn at phone sizes: 44 px controls, 24 px card corners and 17 px reading text carried over from touch. Sizes come from the theme, and products must not restyle them in app CSS.
Existing surface this might already be: `Button size`, for buttons only; nothing covers Field, Select, FilterChips or Card.
Workaround I almost used: app CSS overriding `--sw-control-md-min-height` on the themed root, on touch too.
Source: FutMas design review, `docs/features/F-010-web-administration-foundation.in_progress/S28-desktop-layout-and-polish.in_progress/ux-review-2026-11-02.md`.
Proposed API: `<ThemeProvider density="compact">`, default `comfortable`, which emits no attribute. New tokens `compactControlScale`, `compactFilterChipMinHeight` and the `bodySm` type variant (15/22/400).
Behavior and failure boundary: Under `[data-density='compact']` and `@media (pointer: fine)` only: md 36/14, sm 28/10, xs 24/8, chips 32, Card corners the md radius, reading text in a Card, Table and DescriptionList `bodySm`, and everything inheriting the root's type too. A coarse pointer keeps the comfortable scale exactly. `css-button.ts` now reads the control variables. A ThemeProvider nested in a compact one is compact, even with `density="comfortable"`: a known limit, as reading text and Card corners are drawn from the compact root's descendants, so a comfortable preview cannot sit inside a compact page. A GlyphTile keeps its size, as it holds letters. An unknown density throws a `RangeError`. The chip fix is the one change a consumer that does not opt in sees: a chip is 44 px, not 54 px.

Scalewing owns the classes, tests, gallery evidence and changeset. FutMas owns adopting it, its copy and its pages.
