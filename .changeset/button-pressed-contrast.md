---
'@scalewing/react': patch
---

A toggle `Button` (`aria-pressed`) no longer fades when it is not pressed (`docs/requests/teisoro-button.md`, Teisoro NSF-1, WCAG 1.4.3). `.sw-button[aria-pressed='false']` set `opacity: var(--sw-quiet-opacity)` (0.55), which took an unpressed button's label to about 3.8:1 and any badge inside it lower, although the button could be pressed.

- The unpressed button is drawn at full strength.
- The pressed button gets a 2 px accent ring outside its fill, past a 2 px gap in `--sw-color-background` (`box-shadow`), so it keeps the accent's contrast on the canvas (4.5:1 or more in every palette) whatever its variant or fill, and a toggle whose states share one variant still shows which is pressed. A focused pressed button moves its focus outline out past the ring.
- In forced colors, which drop box shadows, the pressed button is filled with `Highlight` and `HighlightText`, as a checked `FilterChips` chip is.

A visible change for every toggle button. No API change and no new dependencies.
