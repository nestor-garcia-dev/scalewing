Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.44.0 (PR #214; accepted 2026-10-20; Teisoro F-014-S07 "Scalewing fidelity", task 2630; the gap Teisoro F-014-S05 task 2620 found on the training boards TrainingMenu and PhoneSection; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: an `ActionMenu` trigger that is a glyph alone, with no chevron.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: every training row ends in a ••• menu drawn as the dots alone in a round 44 px button with no outline and no chevron. `ActionMenu`'s `framed` trigger is an outlined control and its `text` trigger always draws a chevron after its words, so Teisoro's ••• shows a chevron beside the dots. The menu's trigger is ActionMenu's own button, so it cannot be swapped for a `Button`.
Existing surface this might already be: `ActionMenu` `triggerAppearance` `framed` and `text`; `Button` (icon-only, but not a menu trigger).
Workaround I almost used: the text trigger with its chevron, which S05 shipped with the difference recorded.
Teisoro use: `training/DocumentMenu` in `TrainingRow`'s `action` (the Library, sections, phone lists).
Proposed API: a third `triggerAppearance`, `icon`.

## Accepted API (2026-10-20)

- `triggerAppearance="icon"` (`actionMenuTriggerAppearances` gains `icon`): the `trigger` glyph alone, centred in a round button (`sw-action-menu-trigger-icon`, the pill radius) as wide as it is tall: the sm control height, 44 px on a coarse pointer.
- Muted, with no fill, a transparent border kept for forced colours and no chevron; the text colour on the quiet fill on hover (where the pointer hovers) and while the menu is open.
- Its name is `label` ("More for Heron calls"); the glyph says nothing on its own. An icon trigger without a glyph (`undefined`, `null`, a boolean, `''`) throws a `RangeError`.
- Forced colours: ButtonText with the kept border, Highlight while open.
- A bare glyph has no visible words for a sighted pointer user; its name is for assistive technology and voice control (the request accepts the boards' bare •••).
- No new tokens, layers or dependencies.

Evidence: `action-menu-trigger.test.tsx` (the class, the glyph alone in a button named by the label, the menu opening, the refusal of every empty glyph, the generated round quiet rules with no `::after`, the open fill, the coarse-pointer square); gallery "ActionMenu" (More for Owl box 4, a ••• menu, and a disabled one); `apps/gallery/e2e/action-menu-trigger.spec.ts` on desktop-en, mobile-es and forced-colors (no words and no chevron, a 32 px square, 44 on a phone, transparent and muted, round, the hover and open fill and text colour, focus back on close, the forced border drawn, a disabled one faded with no hover fill), with `action-menu.spec.ts` and `tab-order.spec.ts` (WebKit included) passing.
