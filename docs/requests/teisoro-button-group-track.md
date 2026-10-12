Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.32.0 (PR #149; accepted 2026-10-11; Teisoro F-011 release R6 "canvas fidelity", S17 shell; plan approval under Teisoro decisions O-1 to O-4, D-1, D-2; closes the "attached day buttons" item of D-37).
Renderer: react
Missing surface: `ButtonGroup` `appearance="track"`: an attached group drawn as one grey track. An extension of `ButtonGroup` `attached` (`teisoro-button-group-attached.md`), not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: on the F-011 day pages (ShellProposed, ServicesDayLedger, PosDay) the Previous day, Today and Next day buttons are one grey track (#E8E8ED, radius 8, 32 px) of words and chevrons with hairline dividers between them, no outlines. `ButtonGroup attached` joins the buttons but keeps each button's own fill and outline (a row of outlined or filled buttons, D-37). Teisoro owns no CSS.
Existing surface this might already be: `ButtonGroup attached` with `secondary` buttons (outlined), or with `neutral` buttons (each its own grey fill, the divider tinted from the words).
Workaround I almost used: `neutral` buttons in an attached group (close, but the dividers read as the words' tint, not hairlines, and each button paints its own fill).
Teisoro use: the day navigation beside the page title (S17 shell, S18 day ledger).
Proposed API: `appearance?: 'default' | 'track'` on `ButtonGroup`, meaningful with `attached`.

## Accepted API (2026-10-11)

- `ButtonGroupProps.appearance?: ButtonGroupAppearance` (`'default' | 'track'`, default `default`, unchanged; `buttonGroupAppearances` exported). `track` needs `attached`; without it, or with an unknown value, a `RangeError`.
- `track`: the group takes `quietFill` and `--sw-radius-sm`; each direct `Button` a transparent background and border and `--sw-color-text` (0,4,0, over any variant); the divider between two buttons is `--sw-color-border` on the second's inline-start border, at full height (0,5,0, after the attached group's tinted divider). Pressed rings and focus outlines are unchanged; a disabled button fades in a track whatever its `disabledAppearance` (a neutral disabled button's muted words would read as enabled on the bare track). Forced colors outline the track in CanvasText, keep every border and draw a pressed button's border in Highlight.
- Considered: the track's edge against the canvas is about 1.2:1 and the divider about 1.2:1 on the track (fainter on a dark card); WCAG 1.4.11 does not require a button boundary when its words or glyph identify it, as with `neutral` buttons, and the board draws both this faint. A track is for equal-weight navigation: every variant's meaning goes.
- Sizes (D-2): the button `size` sets the height (`sm` 32, the board's 32); the board's chevron buttons are 36 wide, Scalewing's sm square padding.
- Generated class `sw-button-group-track`, rules in `css-button-group-track.ts`, emitted after the attached rules.

Evidence: `button-group-attached.test.tsx` "ButtonGroup appearance track" (the class, buttons unchanged, unknown or unattached throws, the generated rules, the divider's order, the disabled fade and the forced-colours pressed border); gallery "ButtonGroup" ("Survey week"); `apps/gallery/e2e/button-group-track.spec.ts` on desktop-en, mobile-es and forced-colors (joined with no gap, the grey track, words on no fill in the text color at 4.5:1 or more, the hairline divider and none before the first, a disabled button faded, a press works; the outline in forced colors; the track and divider tokens in the dark scheme).
