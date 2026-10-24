---
'@scalewing/react': minor
---

`AppShell` gains `pageBar`, a band at the top of `main` on every layout (the solid surface with a hairline under it and the page's inline padding, its children a wrapping row with space between them), sticky under the compact top bar below `lg` (the shell measures the bar and sets `--sw-app-shell-bar-height`, falling back to its usual height) and at the window's top from `lg`; and `menuCount`, `menuCountLabel` and `menuCountTone`, the shared count pill on the compact bar's menu button, read in its name after a comma ("Open menu, 6 need you"). `header` and `railHeader` are documented as hosts for an interactive switcher trigger, whose popup opens on the top layer. `AppHeader` accepts a `ref` for its `header`. New class `sw-app-shell-page-bar`; an invalid menu count, a blank label, an unknown tone or a label or tone without a count throws a `RangeError`. No new tokens or dependencies. Request: `docs/requests/futmas-app-shell-page-bar.md`.
