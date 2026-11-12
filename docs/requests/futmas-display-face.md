# FutMas: a condensed face for a public page's titles

Status: implemented for FutMas F-024-S02.

Scalewing request from FutMas.

Renderer: tokens and react
Missing surface: a display face for `Text` titles (`hero`, `display`, `headline`, `heading`)
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas's owner-approved public-site canvas (F-024, version 12) sets every title and scoreline in Barlow Condensed, so the site reads like a fixture board. Scalewing has one family, the system face. The site keeps no CSS of its own (ADR 0016), so it cannot set a family on its titles.
Existing surface this might already be: `Text font="mono"` (a second family, but for code)
Workaround I almost used: a site stylesheet, which FutMas forbids
Proposed API (reusable names only): tokens `displayFaceFamilies` (`system`, `condensed`); `<ThemeProvider displayFace="system | condensed">`, writing `data-display-face`, which a server-rendered page without `ThemeProvider` sets on its themed node itself.

## Behaviour

- `condensed` sets the four title variants in `"Barlow Condensed", "Arial Narrow", sans-serif` with no negative tracking; sizes, weights and the compact steps below `md` stay the variants' own.
- Body, lead, labels, controls and data keep the system face.
- The consumer loads the face (FutMas self-hosts it from `@fontsource/barlow-condensed`); Scalewing ships no font files.
- `system` (default) changes nothing; an unknown face throws a `RangeError`; `displayFaces` lists the faces.
- Consumer: every page of FutMas's public site (F-024-S02 onward).
