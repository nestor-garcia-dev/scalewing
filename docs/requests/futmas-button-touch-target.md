Scalewing request from FutMas.

Status: released in `@scalewing/react` 1.51.0 (PR #254; accepted 2026-10-24; FutMas F-010-S12, the S12 plan's "Scalewing gap list" row 2; standing owner approval for Scalewing changes and releases).
Renderer: react
Missing surface: a 44 px touch target for every `Button` size on a coarse pointer. An extension of `Button`, not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: C1's checklist actions and Settings' row buttons are `size="sm"` (32 px), the F-010 acceptance criteria ask for 44 px targets on touch, and FutMas cannot write media queries. Scalewing gave 44 px only to icon-only Buttons, Buttons in `Nav`, `EmptyState` and `DateRangeButton`'s actions, not to a plain `sm` Button.
Existing surface this might already be: `Button size="md"` (44 px everywhere, too heavy for a dense row on a laptop).
Workaround I almost used: `size="md"` for every row action.

## Accepted API (2026-10-24)

No new props. Under `(pointer: coarse)` every `.sw-button` (so `Button`, `ButtonLink` and the controls built on them) is at least `--sw-control-md-min-height` (44 px) high and wide, after the size rules, which it outranks only by order. Padding and type stay the size's. Rules that already set a larger target (the DocumentViewer steps) keep theirs; a full-width attached `ButtonGroup` below md and a `width="full"` Button in an `Inline` keep `min-width: 0` (the 44 px height still applies). Small Buttons inside Scalewing's own surfaces grow too: DateField's calendar footer (Clear, Today) makes the calendar popover 12 px taller on a phone, Toast's action, a Step's Edit.

Evidence: `button-touch-target.test.ts` (the rule, its order after every size, the fine-pointer heights kept); `apps/gallery/e2e/task-list.spec.ts` on mobile-es (the checklist's `sm` Buttons are at least 44 × 44 px) and desktop-en (still 32 px); the existing `empty-state`, `pagination` and `button` specs pass; `calendar-button.spec.ts` now presses outside the taller calendar at a point it does not cover (it pressed the heading's middle, which the calendar now reaches on mobile-es).
