Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.41.0 (PR #189; accepted 2026-10-14; Teisoro F-012-S23, release M4 "board fidelity", item 4; plan approval under Teisoro decisions O-1, D-1 and D-9).
Renderer: react
Missing surface: four opt-in `FilterChips` options: a label kept as the group's name but not drawn, a count written inline after a middle dot, one row that scrolls sideways instead of wrapping, and several chips on at once.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: every list board draws its chips with no label above them, each chip as "Label · n", and on a phone the chips stay on one row that scrolls sideways; the store settings board picks its busiest days as chips, several on at once. `FilterChips` always draws its legend, writes a count as a separate muted figure, wraps, and holds one choice. Teisoro F-012-S13, S15, S16, S18, S19 and S20 each list these as remaining differences.
Existing surface this might already be: `FilterChips` (one choice, wrapping, a drawn legend); `MultiSelect` (several choices behind a disclosure button, not chips in view); `Checkbox` (S20's busiest days today, not chips); `SegmentedControl` (one choice, a track).
Workaround I almost used: a Teisoro row of pressed `Button`s with `aria-pressed`, its own scroll box and its own count words.
Teisoro use: the chips of every report's table and list (Days, Nights, Checks, Every change, Employees, Risk management), and the settings' busiest days.
Proposed API: `FilterChips` `labelVisuallyHidden`, `countAppearance="inline"`, `overflow="scroll"` and `multiple`.

## Accepted API (2026-10-14)

- `labelVisuallyHidden?: boolean`: the legend stays the group's name (`sw-sr-only`), not drawn, as Field's and Select's prop of the same name.
- `countAppearance?: 'figure' | 'inline'` (`FilterChipCountAppearance`, `filterChipCountAppearances`), default `figure` (unchanged). `inline` writes the count in the chip's own type at tabular figures after a middle dot hidden from assistive technology, so the name reads "Label n" either way (`sw-filter-chip-count-inline`).
- `overflow?: 'wrap' | 'scroll'` (`FilterChipsOverflow`, `filterChipsOverflows`), default `wrap` (unchanged). `scroll` (`sw-filter-chips-scroll`) keeps one row that scrolls sideways inside the options' own box, never the page, each chip at its words' width on one line; the box is padded by the focus ring's reach and pulled back by the same, so a ring is not clipped; the browser scrolls a focused chip into view; a thin scrollbar stays for a pointer with no sideways wheel.
- `multiple: true` with `value: readonly string[]` and `onChange: (values: string[]) => void` (a discriminated union with the single choice; `FilterChipsProps`): each chip is a native checkbox and its own Tab stop (Safari's Tab order too), `onChange` gets every chosen value in the options' order. A multiple group cannot be `required` (nothing makes a checkbox group required natively): that throws, and `error` says what is needed. A multiple `value` that is not a list, or holds a value that is no option, throws.
- Unknown count appearances and overflows throw a `RangeError`. The single choice is unchanged.
- FilterChips splits by responsibility: the props and option lists (`filter-chips/options.ts`), the checks (`filter-chips/validate.ts`) and one chip (`filter-chips/FilterChip.tsx`); the layouts' CSS is `css/css-filter-chips-layout.ts`. No new tokens or dependencies.

### Differences from the boards (Teisoro D-2)

- The chosen chip keeps Scalewing's accent fill; the boards draw it dark. The unchosen chips keep their hairline on the glass fill; the boards draw grey fills without an edge.
- The scrolling row stays inside its column; the boards bleed it to the screen's edges.

No board figures are quoted here.

Evidence: `filter-chips-board.test.tsx` (the hidden legend as the name, the inline count read as label and count, the scroll class, checkboxes each a tab stop and the values in order, the refusals, the generated rules and catalog); the existing FilterChips tests unchanged; gallery "FilterChips" (a hidden-label, inline-count, scrolling row, and a week of days with several on); `apps/gallery/e2e/filter-chips-board.spec.ts` on desktop-en, mobile-es and forced-colors (the legend not drawn, "· n" in the chip, one row, a phone's row scrolling inside its box to a chip reached by the keyboard, no sideways page scroll at 390 px, light and dark; Space and a press toggle checkboxes, each its own Tab stop); `apps/gallery/e2e/tab-order.spec.ts` on desktop-en, mobile-es, forced-colors and safari (WebKit): a single choice one stop on its checked radio, and Tab from one multiple chip to the next.
