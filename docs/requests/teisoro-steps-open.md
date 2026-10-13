Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.36.0 (PR #164; accepted 2026-10-12; Teisoro F-011 task 2210; plan approval under Teisoro decisions O-1 to O-4 and D-1, and the owner's decision of 2026-10-12).
Renderer: react
Missing surface: a `Steps` list whose every step is open at once. An extension of `Steps`, not a new component.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the Teisoro owner decided on 2026-10-12 that short guided forms become "every step open": the stepper layout stays (numbered sections that turn green as each part is complete), but every section is always open, there is no Continue, and one submit saves (boards StepCheckOpen1, StepCheckOpen2, StepCheckOpen3). `Step` shows its fields only while it is current or in error, so a done step folds and hides them, and only one step can be `aria-current`. Drawing the panels, markers and connector from `Card` and `Text` in the product would need its own marker, tick and line, CSS Teisoro may not write, and would fork the stepped look the closeouts keep.
Existing surface this might already be: `Steps` (folds every step but the current one); `Accordion` (a disclosure the reader opens, no status marker).
Workaround I almost used: every step `current` (no green tick, and every item `aria-current="step"`).
Teisoro use: `GuidedForm mode="open"`, adopted by the cash check, the Services entries, the bounced check payment and the vault's Add and Remove cash.
Proposed API: `Steps open`.

## Accepted API (2026-10-12)

- `Steps` `open?: boolean` (default `false`, unchanged). An open list adds the generated class `sw-steps-open` to its `ol`.
- In an open list every `Step` shows its `children` whatever its status (an empty step has no body). The marker still follows the status: a number on the accent (current: still to fill), a check on the success color (done), "!" on the danger color (error), a number in a grey ring with a muted title (upcoming: greyed, for example after a blocking step), as in a stepped list. A done step's `summary` and Edit still show when given.
- Each step's header and body are one `section` named by its title (`aria-labelledby`, a region; class `sw-steps-region`), so the sections are headed regions in reading order. The `ol` and its `li` items are unchanged.
- No step is `aria-current` in an open list, and no step takes focus when its status changes (nothing folds or opens; focus stays where the person put it). The status words are read after each title as before.
- Every step of an open list takes the open step's padding and its title the `title` variant.
- No new tokens, no new dependency. New generated classes `sw-steps-open` and `sw-steps-region`.

Evidence: `steps-open.test.tsx` (every status's body shown, the regions and their names, no `aria-current`, markers and status words, a skipped step's body and a done step's summary and Edit, no focus moves on status changes, a list without `open` unchanged, the catalog and rules); `steps.test.tsx` unchanged and passing; gallery "Steps" ("Wader count, every step open": typing completes a step, a flooded site blocks the steps after it); `apps/gallery/e2e/steps-open.spec.ts` on desktop-en, mobile-es and forced-colors (every step a visible region, none current, every title 20 px, the tick, the cursor kept, the connector, the block's greyed steps, axe clean); `steps.spec.ts` unchanged and passing.
