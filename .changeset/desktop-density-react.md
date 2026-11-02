---
'@scalewing/react': minor
---

Opt-in desktop primitives for a data tool (FutMas F-010-S28). Nothing changes for a consumer that does not opt in, except one fix: `FilterChips`' face lacked `box-sizing: border-box`, so a chip now measures its intended 44 px instead of 54 px.

- `ThemeProvider density="compact"`, on a fine pointer only: md controls 36/14, sm 28/10, xs 24/8, chips 32, Card corners the md radius, 15/22 reading text. Touch keeps 44 px.
- `PageHeader`: title, subtitle, back link, actions and a row below.
- `AppShell contentMaxWidth="container"` and `sidebarTone="subtle"`.
- `Grid rail`: a main column beside a fixed 20rem rail, stacking below the breakpoint it names.
- `FixtureGroup sides="fixed"`: the score at one place across runs.
- `DescriptionList termWidth`: `sm`, `md` or `lg`.
- `FilterChips selectedStyle="subtle"`.
- `TabItem` `count`, `countLabel` and `countTone`.
- `Text maxLines`, and the `bodySm` variant. Needs the matching `@scalewing/tokens`.

`Button` now reads the `--sw-control-*` variables instead of literal pixels. Their values are unchanged, so nothing moves, unless an app overrides those variables in its own CSS, which now moves its Buttons too.
