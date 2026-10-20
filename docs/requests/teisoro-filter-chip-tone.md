Scalewing request from Teisoro.

Status: accepted 2026-10-20 (Teisoro F-014-S07 "Scalewing fidelity", task 2630; the gap Teisoro F-014-S04 task 2615 found on the training boards Main, TrainingSection, PhoneTraining and PhoneSection; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: a web `FilterChips` chip in a warning tone.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the Library's and a section's chips end, for managers, in "Missing a translation · 2", drawn on an amber tint with amber words, so a manager sees at a glance that documents need a translation. Every `FilterChips` chip is the same glass chip, and Teisoro owns no CSS to tint one.
Existing surface this might already be: `Badge tone="warning"` (a status, not a choice); `Notice tone="warning"` (a block note); `FilterChips` (no per-chip tone).
Workaround I almost used: the neutral chip, which S04 shipped with the difference recorded.
Teisoro use: `training/TrainingFilters`'s Missing a translation chip (managers and admins), on the Library and section pages, desktop and phone.
Proposed API: an optional `tone` on a `FilterChipOption`.

## Accepted API (2026-10-20)

- `FilterChipOption.tone?: 'neutral' | 'warning'` (`filterChipTones`, `FilterChipTone`), default `neutral`, which is unchanged.
- A `warning` chip's label takes `sw-filter-chip-warning`. While it is not chosen and its count is not zero, its face is the warning tint (`toneTintFill('warning')`, the warning colour 10% into the surface) and its words and count the warning ink (`toneTintInk('warning')`, the warning colour 70% toward the text colour), a warning `Notice`'s fill and words, 4.5:1 on each other in every palette and scheme (unit test).
- Chosen, it is the accent like every chip; at a zero count it is quiet like every chip; it keeps the chips' hairline, so an `error`'s danger edge still shows on it; forced colours draw it as every chip (Canvas and CanvasText). Its words must say why it matters; the tint only draws the eye.
- An unknown tone throws a `RangeError`. No new tokens, layers or dependencies. New class `sw-filter-chip-warning` (`css/css-filter-chip-tones.ts`).

### Differences from the boards (Teisoro D-29)

- The tint and ink are the theme's warning colour mixed as a Notice's, not the boards' fixed amber `#fff4e5` and `#8a4600`; the chip keeps the chips' hairline, which the board drew without.

Evidence: `filter-chip-tone.test.tsx` (the tones, the class on a warning chip only and the names unchanged, the quiet class beside it at zero, the refusal, the generated rules and their order, the catalog, 4.5:1 in every palette and scheme); gallery "FilterChips" (Camera traps to check: a warning chip with an inline count and a quiet warning chip at zero, light and dark); `apps/gallery/e2e/filter-chip-tone.spec.ts` on desktop-en, mobile-es and forced-colors (the tint and ink on the face and count, painted contrast of 4.5:1 or more, in normal colours the accent once chosen and a zero-count warning chip quiet and then the accent, the danger edge (Mark in forced colours) on a group marked invalid, Canvas and CanvasText in forced colours, the dark scheme's tint and ink at 4.5:1; the browser checks run in the gallery's palette, the unit test covers every palette and scheme by formula). The focus ring sits outside the face, on the page, as every chip's, with `filter-chips.spec.ts` and `filter-chips-board.spec.ts` unchanged and passing.
