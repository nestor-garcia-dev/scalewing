Scalewing request from Teisoro.

Status: accepted and implemented 2026-10-11 (Teisoro F-011 release R6 "canvas fidelity", S17 shell; plan approval under Teisoro decisions O-1 to O-4, D-1, D-2).
Renderer: react
Missing surface: `AppHeader` `appearance="bar"`: the top chrome as a full-width band with a hairline under it. An extension of `AppHeader`, not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the F-011 shell (ShellProposed and every page board) draws the header as a white band across the whole window with a 1 px hairline under it, no rounding, no blur. `AppHeader` is only a rounded glass card, and a plain `Box` would lose the header's sticky layer (`topChrome`) and landmark. Teisoro owns no CSS.
Existing surface this might already be: `AppHeader` (glass card); `Tabs sticky` (a canvas band, but a tab strip); `Notice variant="band"` (an environment strip, toned).
Workaround I almost used: `AppHeader` with `style` overrides (forbidden in Teisoro).
Teisoro use: the shell's top bar (S17).
Proposed API: `appearance?: 'glass' | 'bar'` on `AppHeader`.

## Accepted API (2026-10-11)

- `AppHeaderProps.appearance?: AppHeaderAppearance` (`'glass' | 'bar'`, default `glass`, unchanged; `appHeaderAppearances` exported).
- `bar`: `.sw-app-header-bar` (0,1,0, emitted after the glass header so it wins by order, and before the Box border classes so a Box `border` prop on the header wins over it) takes `--sw-color-surface`, no backdrop filter, no specular shadow, radius 0 and a solid 1 px `--sw-color-border` bottom border only. Sticky and the `topChrome` layer are unchanged. Reduce Transparency changes nothing (already solid); forced colors keep the hairline as a system border.
- The consumer sets it against the page's edges and puts the gutter inside it (README).
- Sizes (D-2): the board's 56 px height comes from the header's content and padding, not this option.
- An unknown value throws a `RangeError`. Generated class `sw-app-header-bar`, rules in `css-app-header-bar.ts`, emitted from `css-chrome.ts`.

Evidence: `bar-surface.test.tsx` (default unchanged, the class, unknown throws, the generated rule and its order); gallery "AppHeader" ("Field station"); `apps/gallery/e2e/bar-surface.spec.ts` on desktop-en, mobile-es and forced-colors (bottom hairline 1 px in the border token, no top or side border, radius 0, the surface fill, no backdrop filter, the sub-bar meeting it edge to edge).
