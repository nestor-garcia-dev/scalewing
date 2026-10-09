---
'@scalewing/react': minor
---

`hideBelow` and `hideFrom` take `lg` (64rem) (`docs/requests/teisoro-responsive-visibility.md`, 2026-10-09 follow-up, Teisoro F-006-S11, SET-3 and UX-16), for content that fits only from a laptop up, such as a row of labelled destinations a tablet shows as glyphs. New generated classes `sw-hide-below-lg` and `sw-hide-from-lg`; new exported types `VisibilityBreakpoint` (`'md' | 'lg'`) and `BreakpointDirection` (`'from' | 'below'`). The layout props keep the one layout breakpoint, `md`. `breakpointQuery(direction, breakpoint)` is now exported: the media query a hide class uses, so an app's `matchMedia` follows the same width; an unknown direction or breakpoint throws a `RangeError`. An unknown `hideBelow` or `hideFrom` now throws a `RangeError` (it produced a class with no rule). No new tokens and no new dependencies.
