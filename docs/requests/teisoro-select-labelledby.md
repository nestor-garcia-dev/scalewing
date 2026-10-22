Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.46.0 (PR #224; accepted 2026-10-22; Teisoro F-014-S06 "Acceptance and UX check", task 2632; a gap its acceptance review deferred, D-116; plan approval under the owner's F-014 delegation of 2026-10-19 and the owner's 2026-10-22 go-ahead for the deferred gaps).
Renderer: react
Missing surface: a `Select` named by words the page already draws, without a label of its own.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro's `ChoiceTrack` is a short choice in every guided form (a payment's How, a check's deposit, a training document's kind and language). From `md` up it is a raised `SegmentedControl` named by the page's visible label through `aria-labelledby`; below `md` the same choice is a `Select`, which needs a `label`, so Teisoro passes the same words with `labelVisuallyHidden`. On a phone a screen reader then reads the page's label, then the select's hidden label (the same words again), then the combobox named by it: the label twice. `Select` draws its label itself and takes no `aria-labelledby`, so Teisoro cannot point it at the words it already shows.
Existing surface this might already be: `Select` `labelVisuallyHidden` (keeps the hidden copy of the words); `SegmentedControl` and `ListGroup` already take `aria-labelledby`.
Workaround I almost used: dropping the page's visible label below `md` and showing the select's own label instead, which needs a second, phone-only label row in every guided form and breaks the label's line-up with the fields beside it.
Teisoro use: `ui/ChoiceTrack` (every guided form, app-wide) passes its `labelId` to the phone's `Select`.
Proposed API: `'aria-labelledby'?: string` on `Select`, exclusive with `label`.

## Accepted API (2026-10-22)

- `SelectProps` is `SelectNaming & …`: either `label` (with the optional `labelVisuallyHidden`), or `'aria-labelledby'` (the id of the page's words), never both (a type union, checked at run time too).
- Named by `aria-labelledby`, the select draws no `<label>`, hidden or shown, and no label row (its stack has no gap above the trigger). The trigger and its open listbox are `aria-labelledby` that id, so both are named by the page's words.
- `required` sets `aria-required` as before; no mark is drawn, since the page draws the words (and any mark).
- `error`, `placeholder`, `size`, `width` and `action` are unchanged.
- Refused with a `RangeError`: no `aria-labelledby` and a blank `label`; a blank `aria-labelledby`; `aria-labelledby` with `label`, `labelVisuallyHidden` or `requiredMark` (there is no label to mark).
- A select with `label` renders exactly as before. No new classes, tokens or dependencies.

Evidence: `select-labelledby.test.tsx` (named by the page's words, no label element or hidden copy, the words once in the document, no label row; the open listbox named by them and a choice committed; `required` as `aria-required` without a mark; the error described; the four refusals); gallery "Select" (the "Den habitat" example: a `Text` label and a select named by it); `apps/gallery/e2e/select-labelledby.spec.ts` on desktop-en, mobile-es and forced-colors (the combobox named "Den habitat", the words once in the example and in its accessibility tree, the trigger under them, the open list named by them, a choice committed), with `select.spec.ts` unchanged and passing.
