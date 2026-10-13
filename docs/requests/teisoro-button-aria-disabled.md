Scalewing request from Teisoro.

Status: accepted 2026-10-12 (Teisoro F-011 task 2210; plan approval under Teisoro decisions O-1 to O-4 and D-1, and the owner's decision of 2026-10-12). Next: release as the next `@scalewing/react` minor.
Renderer: react
Missing surface: the look of a `Button` that is `aria-disabled="true"`. An extension of `Button`'s disabled look, not a new prop.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the Teisoro owner's rule for "every step open" forms (2026-10-12): "The submit is off until everything is valid; pressing it while off (use aria-disabled, not the disabled attribute, so it can be pressed and focused) scrolls to and focuses the first thing to fix, with its message shown." A `disabled` button cannot be focused or pressed; an `aria-disabled` one looks enabled today (only `:disabled` is styled), so the off state is not seen. Teisoro owns no CSS.
Existing surface this might already be: `Button disabled` with `disabledAppearance` (inert: no focus, no press).
Workaround I almost used: keeping the submit enabled and blue while the form is incomplete.
Teisoro use: `GuidedForm mode="open"`'s bar submit (the cash check's "I checked all 6 · Cash $1,180.00", the Services entries, the bounced check payment, the vault's Add and Remove cash).
Proposed API: none new; a consumer passes `aria-disabled="true"` (with `disabledAppearance` as for `disabled`).

## Accepted API (2026-10-12)

- A `Button` with `aria-disabled="true"` looks as a disabled one: `cursor: not-allowed` and the faded opacity, or, with `disabledAppearance="neutral"` and any variant but ghost, the neutral grey fill and muted words at full opacity. It stays a focusable, pressable `button`: `onPress` still runs and the consumer decides what a press while off does.
- In forced colors its border and words are `GrayText`, as the system draws a disabled button.
- No new prop, token, class or dependency; the rules join the existing `sw-button` and `sw-button-disabled-neutral` rules.

Evidence: `button.test.tsx` "Button aria-disabled" (not disabled, focusable, its press runs; the generated rules, including forced colors) and the neutral rules' updated selector; gallery "Button" ("Off until ready": "Count the herd"); `apps/gallery/e2e/button-aria-disabled.spec.ts` on desktop-en, mobile-es and forced-colors (not the disabled attribute, `not-allowed` cursor, the same fill, words and opacity as a disabled neutral button, GrayText in forced colors, a tab stop whose Enter runs its press); `button-neutral.spec.ts` and `button.spec.ts` unchanged and passing.
