# @scalewing/react-native

## 1.7.0

### Minor Changes

- 671eefa: Native `Progress` joins the web one with the same props: `label`, `value`,
  `max`, and `tone` (`accent`, `success`, or `danger`). It shows the label,
  a muted "value / max" count, and a pill track filled to value / max, and it
  is one accessible progress bar with its value range. Invalid labels and
  ranges throw a `RangeError` (see `docs/requests/futmas-native-progress.md`).

## 1.6.0

### Minor Changes

- 8e6713a: Native `Accordion` takes an optional `subtitle`, a muted one-line caption
  below the title, and `truncateTitle`, which keeps the title on one line with a
  tail ellipsis instead of wrapping (see
  `docs/requests/futmas-accordion-subtitle.md`). A separate title action's
  default accessible name now reads the subtitle after the title. Existing
  headers are unchanged.

## 1.5.0

### Minor Changes

- 28ef041: Native `Field` takes `rows` for a multi-line field that starts that many body
  lines tall, aligns text to the top, and grows with its content (see
  `docs/requests/futmas-field-multiline.md`). The existing `multiline`
  passthrough is unchanged.
- 03faf65: Pickers close the way people expect (see `docs/requests/futmas-wheel-close.md`).
  A tapped row closes `WheelField`; `TimeField` stays open on a tapped hour and
  closes on a tapped minute or AM/PM row; a scroll that settles on a row selects
  and keeps the picker open. Opening a `DateField`, `TimeField`, or `WheelField`
  closes any other one open under the same `ThemeProvider`. No prop changes.

### Patch Changes

- 7d92139: `Stepper` announces its value as the number itself (see
  `docs/requests/futmas-stepper-value-text.md`). iOS read the adjustable value
  as a percentage of its range, so VoiceOver said "14 percent" for 1 of 1 to 8
  and UI tests read "14%". No prop changes.

## 1.4.0

### Minor Changes

- fba8568: Add `Stepper`, a labeled bounded number between raised round minus and plus
  buttons on a glass pill track that fills its column, so several can share a
  row (see `docs/requests/futmas-stepper.md`). Props: `label`, `value`,
  `onChange`, `min`, `max`, `step` (default 1), `decrementLabel`,
  `incrementLabel`, `disabled`, `hint`, `error`, and `testID` (parts
  `<testID>-decrement`, `-value`, `-increment`). A button fades and stops at
  its bound; the value is one adjustable element with increment and decrement
  actions. No new dependency.
- 03ef416: Add `WheelField`, a labeled field-shaped disclosure that opens one snapping
  wheel over an ordered list of `{ id, label }` items for choices that chips
  cannot hold, such as a year (see `docs/requests/futmas-wheel-field.md`). It
  reuses the wheel behind `TimeField` with no native module or new dependency:
  rows are radio targets, a settled scroll or a tap selects, an empty value
  rests on the first item and reports nothing until a tap or a scroll. Props:
  `items`, `value`, `onChange`, `label`, `placeholder`, `disabled`, `hint`,
  `error`, `wheelLabel`, and `testID` (the column is `<testID>-wheel`).

## 1.3.0

### Minor Changes

- 6254880: `TimeField` discloses scrolling wheels instead of hour and minute chips: an
  hour column on the locale's hour cycle, a minute column on `minuteStep`, and
  an AM/PM column on 12-hour locales, all snapping `ScrollView`s built from
  tokens with no native module or new dependency (see
  `docs/requests/futmas-time-field.md`, revision 2026-09-22). Rows are radio
  targets; a settled scroll or a tap selects. New optional props `periodLabel`
  and `testID` (columns are named `<testID>-hours`, `-minutes`, `-period`).

## 1.2.0

### Minor Changes

- 2d22293: Add `SingleSelect`, a labeled group of radio chips for one choice among more
  options than a `SegmentedControl` can show. It shares the chip and labeled
  control layer with `MultiSelect`, takes one selected id or the empty string,
  and reports only a change to a different item.

## 1.1.0

### Minor Changes

- 9ef2b14: Add `DateField`, `TimeField`, and `MultiSelect` for React Native (see
  `docs/requests/futmas-date-field.md`, `futmas-time-field.md`, and
  `futmas-multi-select.md`). `DateField` discloses a localized month grid with
  `min`/`max` bounds; `TimeField` discloses hour and minute chips on a
  `minuteStep`; `MultiSelect` is a labeled group of checkbox chips. Fix `Field`
  text clipping on iOS by dropping the fixed `lineHeight` from the native input
  and centering vertically on Android. No dependencies were added.

## 1.0.0

### Major Changes

- 52b45c0: Start stable versioning at 1.0.0. Packages now release independently with semantic versioning.

  `@scalewing/tokens` no longer contains web CSS. It removes `generateStylesheet`, `utilityClassCatalog`, `buttonClassNames`, `badgeClassNames`, `badgeSizes`, `badgeTones`, `BadgeSize`, `BadgeTone`, `spacingClass`, `PaddingAxis`, `GapAxis`, `paddingAxes`, `gapAxes`, `breakpointScale`, `Breakpoint`, `HideDirection`, `hideClass` (never published), and the `./styles.css` and `./palette/*.css` exports. Web apps keep importing `@scalewing/react/styles.css` and `@scalewing/react/palette/<id>.css`, which are unchanged. `@scalewing/react` now generates that CSS and exports `utilityClassCatalog`, `badgeSizes`, and `badgeTones`.

### Patch Changes

- Updated dependencies [3a3240e]
- Updated dependencies [52b45c0]
  - @scalewing/tokens@1.0.0

## 0.7.0

### Patch Changes

- Updated dependencies [630bed9]
- Updated dependencies [fad8f45]
- Updated dependencies [1d69e34]
- Updated dependencies [05e23f5]
- Updated dependencies [b718519]
- Updated dependencies [9e47362]
- Updated dependencies [6dac120]
- Updated dependencies [39a85a4]
- Updated dependencies [de943eb]
- Updated dependencies [b0ce196]
- Updated dependencies [944f7ef]
  - @scalewing/tokens@0.7.0

## 0.6.1

### Patch Changes

- e2f410c: Keep native TabBar destinations from overlapping at large Dynamic Type sizes.
- Updated dependencies
  - @scalewing/tokens@0.6.1

## 0.6.0

### Minor Changes

- ebbbd43: Add a controlled native Accordion with optional separate title navigation,
  leading/metadata slots, expanded accessibility state, and theme-owned chrome.

### Patch Changes

- ebbbd43: Make native segmented selection visible with paired accent/onAccent colors
  and a larger minimum touch height. Existing component props are unchanged.
- Updated dependencies
  - @scalewing/tokens@0.6.0

## 0.5.0

### Minor Changes

- Keep public package versions matched for the GitHub `v0.5.0` release tag.
  Native Field ships in this version.
- 7cf64df: Add an accessible token-styled native `Field` with label, hint,
  error, focus, disabled, and standard React Native text-input behavior.

### Patch Changes

- Updated dependencies
  - @scalewing/tokens@0.5.0

## 0.4.0

### Minor Changes

- Keep public package versions matched for the GitHub `v0.4.0` release tag.
  Native TabBar, Table, and SegmentedControl ship in this version.
- feef1f8: Add native SegmentedControl with radiogroup semantics, a glass pill track, and a surface-filled selected item. Labels stay in the consumer.
- feef1f8: Add native TabBar with selected tab semantics, icon slots, and an optional trailing control for round search-style actions.
- feef1f8: Add native Table with compact density, numeric cells, and the same row/cell language as the web table.

### Patch Changes

- 01b138f: Point package metadata to the GitHub source repository and document explicit GitHub Actions releases. Package names and runtime APIs are unchanged.
- feef1f8: Allow optional `onPress` on native TableRow so compact score rows can open a detail screen without a product-only MatchRow.
- Updated dependencies [01b138f]
- Updated dependencies
  - @scalewing/tokens@0.4.0

## 0.3.0

### Minor Changes

- 247f158: Default accent is electric indigo, and glass fill is derived from the merged accent so ThemeProvider overlays retint frost.

  Adds opt-in density (`xs` controls, `data` type, `sw-tabular`) and web `Badge`, `SegmentedControl`, and `Table`. Pin the previous teal with `colors={{ accent: '#0B615E', onAccent: '#FFFFFF' }}` (dark: `#7EDAD6` / `#101214`).

- 247f158: Adds a named palette catalog so products pick a reviewed light/dark overlay instead of copying hex. Apply with ThemeProvider `palette`, `data-palette` on the generated canvas, or `import '@scalewing/react/palette/<id>.css'` after styles.css. Default remains indigo. `colors` still wins over a named palette and may be `{ light, dark }` so end users can switch scheme without the product swapping hex.

### Patch Changes

- Updated dependencies [247f158]
- Updated dependencies [247f158]
- Updated dependencies [247f158]
- Updated dependencies [247f158]
- Updated dependencies [247f158]
- Updated dependencies [247f158]
- Updated dependencies [247f158]
- Updated dependencies [247f158]
- Updated dependencies [247f158]
- Updated dependencies [247f158]
- Updated dependencies [247f158]
- Updated dependencies [247f158]
  - @scalewing/tokens@0.3.0

## 0.2.0

### Minor Changes

- f35314a: Add Button (primary, secondary, ghost, danger; sm and md) for DOM and React Native after FutMas and coach-platform requested the same control. Includes onAccent/onDanger, 44px md hit target, focus ring, and disabled opacity tokens.
- f35314a: Shift the default visual language to a quiet glass canvas: Apple-like neutrals and type, frosted Card, pill buttons, and generated document styles so links and native text controls are not user-agent chrome.

### Patch Changes

- Updated dependencies [f35314a]
- Updated dependencies [f35314a]
  - @scalewing/tokens@0.2.0

## 0.1.0

### Minor Changes

- Initial foundation: Box, Stack, Inline, Card, Text, and ThemeProvider for React Native.
