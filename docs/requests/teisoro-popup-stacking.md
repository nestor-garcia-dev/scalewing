Scalewing request from Teisoro.

Status: merged in PR #33 (`151ad7e`) and versioned as `@scalewing/react` 1.4.1, released from tag `react-v1.4.1`; product owner approved the release on 2026-09-23.
Renderer: react
Missing surface: stacking for open popups (`Select` list, `ActionMenu` list, `Tooltip`) inside glass surfaces (`Card` glass, `Accordion`). No new class or prop.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `.sw-card-glass` and `.sw-accordion` use `backdrop-filter`, which makes each one its own stacking context. The list's `z-index: 3` only counts inside its own card, so the next glass card in the page paints over the open list. A click on a covered option lands on the next card's field.
Existing surface this might already be: None. Keyboard selection works, but pointer and touch users cannot pick a covered option.
Workaround I almost used: app CSS raising the card, moving the `Select` into the last card of the page, or selecting by keyboard in the product's browser tests.
Teisoro use: F-002-S15 NSF activity page, where the activity-type `Select` sits in a card above the contact details card.
Proposed behavior: while a glass surface holds an open popup, it lifts one layer (`position: relative; z-index: 1`) above its siblings. `z-index: 1` keeps it under the sticky app header (`z-index: 2`).

Verification: the gallery Select section now has a `Select` in a glass card above a second card. `apps/gallery/e2e/select.spec.ts` clicks the last option with a plain pointer click. It failed before the fix in desktop-en, mobile-es and forced-colors (the next card's input intercepted the click), and passes after it.
