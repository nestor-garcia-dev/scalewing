Scalewing request from Teisoro.

Status: accepted 2026-10-11 (Teisoro F-011 release R6 "canvas fidelity"; plan approval under Teisoro decisions O-1 to O-4, D-1, D-2).
Renderer: react
Missing surface: `Button` `variant="neutral"` and `disabledAppearance`. An extension of `Button`, not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: on every F-011 board a sheet's or page's Cancel and the page actions beside a primary are a grey fill (#e8e8ed, words in the text color, no border), and a primary that cannot be pressed yet ("Record the audit" until a note and a recount are given on DrawerAudit) is the same grey with grey words. Scalewing's `secondary` is an outlined pill (filled only when a palette sets `secondary`), and a disabled button fades its own fill to 40 %, so a disabled primary reads as a pale accent. Teisoro owns no CSS and adds no parallel colours, so it cannot overlay a hex secondary itself.
Existing surface this might already be: `secondary` with a palette or `colors` overlay that sets `secondary` (a theme-level hex in the consumer, which Teisoro's rules forbid, and it would also change the secondary everywhere in the app); `tertiary` (a dark fill).
Workaround I almost used: `ThemeProvider colors={{ light: { secondary: '#E8E8ED' } }}`.
Teisoro use: every Cancel in a sheet footer, page action buttons, and the disabled primary of a sheet or step.
Proposed API: `variant="neutral"` and `disabledAppearance?: 'faded' | 'neutral'`.

## Decision: a prop, not a theme choice

A theme-level choice (a palette or ThemeProvider option that turns every secondary grey and every disabled button grey) was considered. The secondary's fill is themeable, but only as a hex colour overlay, which Teisoro may not hold, and a disabled button's look is not a colour at all, so a theme route would need a new non-colour ThemeProvider concept and a tokens release. A neutral fill is a role of its own (a quiet action, not the second tier), so it is a variant; how a disabled button looks is per button. Both are additive props with today's look as the default.

`neutral` is web only: `buttonVariants` in `@scalewing/tokens` is shared with React Native, whose Button would then need it in the same release. The web list is `webButtonVariants`; the native Button can adopt it later through a tokens change.

## Accepted API (2026-10-11)

- `ButtonProps.variant` accepts `'neutral'`: background `quietFill`, `color-mix(in srgb, var(--sw-color-muted) 16%, transparent)` (the open ActionMenu and Select rows' fill, now one named constant in `css/quiet-fill.ts` shared by every module that used the literal; about #E8E8E9 on white, the board's #E8E8ED), a transparent border, `--sw-color-text` words (4.5:1 and more on the fill, checked in e2e). The React `ButtonVariant` type is the web list; `webButtonVariants` is exported.
- `ButtonProps.disabledAppearance?: ButtonDisabledAppearance` (`'faded' | 'neutral'`, default `faded`, unchanged; `buttonDisabledAppearances`). `neutral`: while disabled, any variant but `ghost` takes the same fill, words in `color-mix(in srgb, var(--sw-color-muted) 48%, transparent)` (about #AEAEAE over the fill; the board's #AEAEB2 on #E8E8ED), opacity 1. Still a disabled `button`; forced colors draw it as any disabled button. An unknown value throws a `RangeError`.
- A Badge inside a neutral button takes the surface, as in any filled button.
- Sizes (D-2): the md control height 44 (board 52 in sheet footers) and the pill radius (board 12).
- Generated classes `sw-button-neutral`, `sw-button-disabled-neutral` in `css-button.ts`.

Evidence: `button.test.tsx` "Button neutral variant and disabledAppearance" (existing variants' classes unchanged, the neutral classes, still disabled and inert, unknown throws, the generated rules); `stylesheet.test.ts` (the Badge-in-a-filled-button rule includes neutral); gallery "Button" ("Sheet actions"); `apps/gallery/e2e/button-neutral.spec.ts` on desktop-en, mobile-es and forced-colors (the grey fill and text color at 4.5:1 or more, a disabled primary and secondary on the same grey at opacity 1, a press on a disabled one does nothing).
