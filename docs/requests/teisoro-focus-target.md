Scalewing request from Teisoro.

Status: implemented on `claude/services-leftovers` for Teisoro F-007-S05 task 1375; pull request pending review.
Renderer: react
Surface: the document canvas's focus ring for a programmatic focus target (an element with `tabindex="-1"`). No new component, class or prop.
Source: Teisoro UX final check `services-nsf.md`, finding NSF-34 (polish, the part left for Scalewing), shared with ENT-29 (`services-entries.md`) and DRW-30 (`services-drawer-cash-and-audits.md`).

## Follow-up request (2026-09-30, Teisoro F-007-S05 task 1375): the accent ring on a focused notice

### Finding

After a save Teisoro moves focus to the notice that says what happened, so a screen reader reads it and a keyboard user starts from there: `StatusCallout`'s `Box tabIndex={-1} radius="lg"` round an outlined `Card` (ENT-29, NSF-34) and the closed day's notice (DRW-30, `ClosedDayClose.tsx`). The ring goes round the whole card now, but it is the browser's 2 px `0,95,204` outline (`writes-a-record-off-with-the-keyboard-after-a-long-enough-re/en-1280/05-the-record-written-off.part-1.png`, x 63–64), not the accent ring (`3,105,161` in Teisoro's palette) every other focused control in the journey shows. Teisoro owns no CSS, and Scalewing had a ring only for its own controls, links and native text controls.

Why Box/Card/Text cannot do this: none of them draws a focus ring; a `className` or `style` with the ring's declarations would be hand-written CSS in the consumer.

Existing surface this might already be: the generated document canvas, which already gives links and native text controls the accent ring. This extends it; no new API.

Teisoro use: `apps/teisoro-web/src/app/drawer-forms/StatusCallout.tsx` (every Services save notice), `apps/teisoro-web/src/app/drawer-close/ClosedDayClose.tsx` (the closed day's notice).

### Behavior

- The canvas gains `:where([data-theme] [tabindex='-1']:focus-visible) { outline: var(--sw-focus-ring-width) solid var(--sw-color-accent); outline-offset: var(--sw-focus-ring-offset); }`: the accent ring 2 px past the element's edge, following its `border-radius` (a `Box radius` matching the card's).
- `tabindex="-1"` is the mark of a script-only focus target: it takes focus from `focus()` but is no tab stop. Focusable controls (`tabindex="0"`, native controls) are not changed.
- `:focus-visible`, as the browser's own outline: the ring shows when the browser would show one, after a keyboard press, and not after a mouse press, so a notice focused after a click stays quiet as it does today.
- `:where()` keeps the whole selector at zero specificity. Author styles beat the user-agent outline at any specificity, so it replaces the browser's ring; and every component rule (a roving `tabindex="-1"` item's, such as a tab or a calendar day) wins over it.
- Forced colors keep the solid 2 px outline in the system's color, as every other Scalewing ring.

### Rejected alternatives

- A `Box` prop (`focusRing` or `focusTarget`). Every consumer would have to know to set it, and a heading focused after a route change would still show the browser's outline. The canvas already owns the ring of the elements it styles.
- A ring class (`sw-focus-ring`). A class the consumer must remember, and the start of a utility family for one declaration pair.
- `outline: none` on focus targets (NSF-34's other suggestion). A keyboard user would lose where focus went; the ring is the point.
- `:focus` instead of `:focus-visible`. It would draw a ring after every mouse press on Save, which the browser deliberately does not.
- Every `[tabindex]`. A `tabindex="0"` element is a control, which should be a Scalewing component with its own ring; the request is for script-only targets.
- A larger offset (NSF-34 asked for 4 px round a text line). The ring now goes round the card, not its text, and 2 px is the offset of every other ring.

### Evidence

`focus-target.test.tsx` (the generated rule's accent ring and offset; the exact selector; zero specificity, placed before the component classes; a `Box` with `tabIndex={-1}` and a `radius` inside the themed canvas); `apps/gallery/e2e/focus-target.spec.ts` on desktop-en, mobile-es and forced-colors, with the gallery Canvas section's new "Save den notes" notice (a `Box tabIndex={-1} radius="lg"` round an outlined `Card`): after a keyboard press the notice has focus with a solid 2 px outline 2 px out, in the accent color outside forced colors, its box and radius the card's; after a mouse press it has focus and no outline. Without the rule the outline is the browser's `auto` style.
