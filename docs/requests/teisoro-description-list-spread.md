Scalewing request from Teisoro.

Status: merged, shipping in `@scalewing/react` 1.43.1 (tagged as 1.43.0, which was never published; PR #207; accepted 2026-10-19; Teisoro F-014-S07 "Scalewing fidelity", task 2630; the gap Teisoro F-014-S04 task 2615 found on the training board TrainingReader; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: a web `DescriptionList` whose details sit at their rows' end, beside their terms at every width.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the reader's "Managers only" box lists a document's facts (Section, Topic, Kind, Languages, Who can see it) with each term at the row's start and its value right-aligned at the row's end, divided by hairlines, in a narrow side column. `DescriptionList` puts the details in a column beside the terms (and under them below `md`), so they start mid-row. Rows of `Inline justify="between"` would lose the `dl` semantics and the hairlines.
Existing surface this might already be: `DescriptionList` (its columns layout); `ListRow` with a `value` (a list, not terms and their details, and in label type).
Workaround I almost used: the columns layout, which S04 shipped with the difference recorded.
Teisoro use: `training/TrainingReaderPage`'s details box (managers and admins), desktop and phone.
Proposed API: an opt-in layout on `DescriptionList`.

## Accepted API (2026-10-19)

- `layout?: 'columns' | 'spread'` (`descriptionListLayouts`, `DescriptionListLayout`), default `columns`, which is unchanged.
- `spread` adds `sw-description-list-spread`: each item is its own two-column grid at every width, the term fitting its words up to half the row (`fit-content(50%)`) at the start and the detail taking the rest, its lines end-aligned (`text-align: end`, `align-items: flex-end`), a space-4 apart (the list's column gap, set again because a row's own grid does not inherit it). The hairlines, padding and top alignment stay; the narrow-screen rule that stacks a term over its detail does not apply, so a phone keeps the rows spread.
- The terms and details stay the consumer's `Text`; the list sets only the layout. An unknown layout throws a `RangeError`.
- No new tokens, layers or dependencies. New class `sw-description-list-spread`.

### Differences from the boards (Teisoro D-29)

- Rows are padded a space-2 above and below, the list's own rhythm; the board drew 11 px.

Evidence: `description-list-spread.test.tsx` (the layouts and default, the class beside a consumer's, the `dt` and `dd` in each row, the refusal, the generated rules after the narrow-screen rule, the catalog); gallery "DescriptionList" (a field station's facts in a third-width card named by its heading, one detail long enough to wrap on a phone); `apps/gallery/e2e/description-list.spec.ts` on desktop-en, mobile-es and forced-colors (each term and detail side by side at every width a space-4 apart, the detail's words ending at the row's end, `text-align: end`, a long detail wrapping beside its term on a phone, the hairlines), the columns test's assertions unchanged and passing, its locator now excluding the spread list.
