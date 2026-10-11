Scalewing request from Teisoro.

Status: accepted 2026-10-11 for the `@scalewing/react` 1.30.0 release (Teisoro F-011-S05, release R4 "ledger and navigation", item 19; the redesign inventory's row 9).
Renderer: react
Missing surface: `FilterChips` validation: a required choice that starts empty, with an error message.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: six boards (DrawerAdjust, VoidOne, VoidBatchOne, AuditReview2, VaultAdd1, CompanyLookup) pick a reason ("Why", "What happened", "Where from") from a row of single-choice chips, and a reason is required. `FilterChips` is the chip row, but its `value` must match an option (no "nothing chosen yet"), and it has no `required`, no error message and no way to add a description. `RadioGroup` has those but is a vertical list of radios, not chips. Teisoro owns no CSS.
Existing surface this might already be: `FilterChips`, `RadioGroup` (`required`, `error`, `description`), `SegmentedControl` (`error`, `required`).
Workaround I almost used: a `RadioGroup` in place of the chips, or chips with the error in a `Text` under them (not linked to the group).
Teisoro use: `ReasonPicker` (chips + notes field) in DrawerAdjust, Void*, AuditReview2 and VaultAdd1.
Proposed API (inventory): add `error?`, `required?` and `aria-describedby`; the selected chip uses Scalewing's fill, not the mock's black.

## Accepted API (2026-10-11)

- `value: string` may now be `''`: nothing chosen yet (no chip is checked). A value that is neither `''` nor an option still throws a `RangeError`.
- `required?: boolean`: each radio carries `required` (the group's required state, as `RadioGroup`), and the legend shows `Field`'s required mark (`sw-field-required`, `aria-hidden`).
- `error?: string`: a message under the chips (`sw-filter-chips-error`, caption type in the danger colour, `Mark` in forced colours) in a polite live region that is always in the page and out of the layout while empty; the fieldset lists it in `aria-describedby` and carries `aria-invalid="true"`, and every chip's edge turns danger, the chosen chip's too (it keeps its accent fill), and `Mark` in forced colours for every chip. An empty string is no error.
- `'aria-describedby'?: string`: the consumer's description ids, such as a hint, listed before the error.
- Sizes and looks on Scalewing's scale (Teisoro D-2): chips keep `FilterChips`' md height 44 (board 40), label type 15 (board 14 at 600), the glass fill unselected (board #f2f2f7) and the accent fill selected (board #1d1d1f, as the inventory asks); the legend is label type 15/600 (board 13/600 in #3a3a3c); the boards draw no error state, so the error follows `Field`'s (caption, danger, a `space-2` gap); the required mark after the legend is a Scalewing addition (the board's "Why" has none), as `Field` draws it. In a `<form>`, native `required` radios make the browser check first: Teisoro's forms that show `error` set `noValidate`. The fieldset keeps the `group` role with `aria-invalid`, as `RadioGroup` does.

Evidence: `filter-chips-validation.test.tsx` (nothing chosen, the required mark and radios, the group described by a hint then the error, invalid, the empty region kept, an error without required, a blank `aria-describedby` ignored, choosing from nothing, the failure, the generated rules including the invalid edge after the checked rule in both modes); gallery "FilterChips" ("Why remove this sighting": required, a hint, an error on Remove with nothing chosen, cleared by a choice); `apps/gallery/e2e/filter-chips.spec.ts` on desktop-en, mobile-es and forced-colors (no chip checked, required radios, the description with and without the error, invalid, the danger edge or `Mark` in forced colours, Shift+Tab into the empty group and an arrow key choosing and clearing the error, the removal then saved).
