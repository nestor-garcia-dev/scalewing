Scalewing request from Teisoro.

Status: accepted and implemented 2026-10-11 (Teisoro F-011 release R6 "canvas fidelity", S17 shell; plan approval under Teisoro decisions O-1 to O-4, D-1, D-2).
Renderer: react
Missing surface: `ActionMenu` `triggerAppearance="text"`: an unframed trigger. An extension of `ActionMenu` (`teisoro-action-menu-header.md`, `teisoro-action-menu-detail.md`), not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the F-011 shell (ShellProposed and every page board) ends the header with the signed-in person's name and a small chevron ("Alex Rivera ⌄"), no outline or fill, opening the account menu. ActionMenu's trigger is always a small outlined control on the glass fill, and its `trigger` slot only replaces the words inside that frame. Teisoro owns no CSS. D-37 also listed "account menu as wide as its content", which this does not change (the menu list is its own surface).
Existing surface this might already be: `ActionMenu` `trigger` (the content, not the frame); a ghost `Button` (not a menu button).
Workaround I almost used: a ghost Button that opens a Dialog (not a menu).
Teisoro use: the shell's account menu (S17).
Proposed API: `triggerAppearance?: 'framed' | 'text'` (generic: how the trigger is drawn).

## Accepted API (2026-10-11)

- `ActionMenuProps.triggerAppearance?: ActionMenuTriggerAppearance` (`'framed' | 'text'`, default `framed`, unchanged; `actionMenuTriggerAppearances` exported).
- `text`: `.sw-action-menu-trigger.sw-action-menu-trigger-text` takes no background, a transparent border (kept, so forced colors can draw one), label type at weight 500 in the text color, `space-3`/`space-2` inline padding, the sm control height (the 44 px target restated on a coarse pointer), and a `::after` chevron (the shared `chevronStroke`, the Select's, pointing down) a space-2 gap after the words. The quiet fill (`quietFill`) shows while `aria-expanded="true"` and on hover where the pointer can hover. The trigger's words are one internal span (one flex item). Forced colors draw the kept border in the system border color, the chevron in CanvasText (as every chevron) and an open trigger's border in Highlight. The `label` includes the visible words (WCAG 2.5.3). The name stays `label`; the menu, keys and focus return are unchanged.
- Sizes (D-2): height 32 (board 32), label 15 (board 14), chevron 8 (board 12).
- An unknown value throws a `RangeError`. Generated class `sw-action-menu-trigger-text`, rules in `css-action-menu-trigger.ts`.

Evidence: `action-menu-trigger.test.tsx` (default unchanged, the class, the words, a press opens the menu, unknown throws, the generated rules and the coarse-pointer target's order); gallery "ActionMenu" ("Ada Okafor"); `apps/gallery/e2e/action-menu-trigger.spec.ts` on desktop-en, mobile-es and forced-colors (no fill or outline, the text color, the chevron, 32 px or the 44 px touch target, the fill while open, a command closes it and focus returns, the keyboard focus ring, a disabled text trigger; in forced colors the drawn border and the CanvasText chevron).
