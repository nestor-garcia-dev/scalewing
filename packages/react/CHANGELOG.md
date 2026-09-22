# @scalewing/react

## 1.1.0

### Minor Changes

- 01e7d0e: Add `align` (`start`, `center`, `end`) to `Text`, backed by generated `sw-text-align-*` classes, and keep `DenominationGrid` tiles three per row below the `md` breakpoint.

- f00b3cc: Add `DenominationGrid`, a read-only count-per-unit display across a fixed column set. The `strip` layout is a captioned table with a toned row label (icon slot), muted zero cells, signed delta cells toned by sign, and an optional consumer-formatted total that moves under the row label below the `md` breakpoint; the `tiles` layout stacks the column label, count, and an optional consumer-formatted subtotal per column. Generated `sw-denomination-*` classes; invalid columns, rows, or cells throw.
- cc9aa28: Add an optional `count` to `FilterChipOption`. It renders as a tabular chicklet after the chip label (generated `sw-filter-chip-count`), joins the option's accessible name, and a zero count quiets the chip (`sw-filter-chip-quiet`) until it is selected. Negative or fractional counts throw.
- f7f3bf9: Add `Grid`, a Box-based layout that places children in one to four equal-width columns with a token gap step and an optional smaller column count below the `md` breakpoint (`columnsBelow={{ md: 2 }}`), backed by generated `sw-grid-*` classes.

## 1.0.0

### Major Changes

- 52b45c0: Start stable versioning at 1.0.0. Packages now release independently with semantic versioning.

  `@scalewing/tokens` no longer contains web CSS. It removes `generateStylesheet`, `utilityClassCatalog`, `buttonClassNames`, `badgeClassNames`, `badgeSizes`, `badgeTones`, `BadgeSize`, `BadgeTone`, `spacingClass`, `PaddingAxis`, `GapAxis`, `paddingAxes`, `gapAxes`, `breakpointScale`, `Breakpoint`, `HideDirection`, `hideClass` (never published), and the `./styles.css` and `./palette/*.css` exports. Web apps keep importing `@scalewing/react/styles.css` and `@scalewing/react/palette/<id>.css`, which are unchanged. `@scalewing/react` now generates that CSS and exports `utilityClassCatalog`, `badgeSizes`, and `badgeTones`.

### Minor Changes

- 3a3240e: Add `Box` `hideBelow` and `hideFrom` responsive visibility props backed by a `md` breakpoint token and generated `sw-hide-*` classes.

### Patch Changes

- Updated dependencies [3a3240e]
- Updated dependencies [52b45c0]
  - @scalewing/tokens@1.0.0

## 0.7.0

### Minor Changes

- 630bed9: Add wrapping, accessible FilterChips for long single-choice filter sets.
- fad8f45: Add an accessible React ActionMenu with generated token styling for independent commands.
- 1d69e34: Add a controlled date-only DateField with native calendar behavior and generated styling.
- 05e23f5: Add stable hint, error, and required semantics to Field with generated invalid styling.
- b718519: Add supplementary Tooltip help for labelled triggers with keyboard, pointer, and touch access.
- 9e47362: Add a controlled native Checkbox with generated token styling, validation copy, and accessible form semantics.
- 6dac120: Add a controlled React Switch with native checkbox semantics and generated token styling.
- 39a85a4: Add an accessible indeterminate Spinner with generated animation, size variants, and reduced-motion styling.
- de943eb: Add measured Progress with native progressbar semantics and generated tone styling.
- b0ce196: Add a controlled native RadioGroup with token-generated styling and long-label form choices.
- 944f7ef: Add semantic and decorative horizontal or vertical separators with generated token styling.

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

- Keep public package versions aligned with the native TabBar accessibility
  correction. No DOM renderer API changed.
- Updated dependencies
  - @scalewing/tokens@0.6.1

## 0.6.0

### Minor Changes

- Align the public packages with the 0.6.0 native Accordion release, as required
  by the lockstep release workflow. No new token or DOM component API is added.

### Patch Changes

- Updated dependencies
  - @scalewing/tokens@0.6.0

## 0.5.0

### Minor Changes

- Keep public package versions matched for the GitHub `v0.5.0` release tag.
  Native Field ships in this version.

### Patch Changes

- Updated dependencies
  - @scalewing/tokens@0.5.0

## 0.4.0

### Minor Changes

- Keep public package versions matched for the GitHub `v0.4.0` release tag.
  Native TabBar, Table, and SegmentedControl ship in this version.

### Patch Changes

- 01b138f: Point package metadata to the GitHub source repository and document explicit GitHub Actions releases. Package names and runtime APIs are unchanged.
- Updated dependencies [01b138f]
- Updated dependencies
  - @scalewing/tokens@0.4.0

## 0.3.0

### Minor Changes

- 247f158: Adds Accordion, a web disclosure on native details/summary, so in-flow panels can expand without a modal or an always-open Card.
- 247f158: Adds web page chrome: `AppHeader` (sticky glass), `Nav` (label-size link cluster, current page via `aria-current`), compact `Field` (`size="xs"`, `labelVisuallyHidden`), native `select` chevrons, and accent `:focus-visible` on text controls so selects do not keep the user-agent blue ring.
- 247f158: Adds Dialog, a web modal on the native `<dialog>` top layer, so info surfaces can leave nested page flow.
- 247f158: Adds a horizontal BarChart for labeled factor contributions, compact table density (`density="compact"`) with a selected-row marker, and compact Badge chicklets.
- 247f158: Default accent is electric indigo, and glass fill is derived from the merged accent so ThemeProvider overlays retint frost.

  Adds opt-in density (`xs` controls, `data` type, `sw-tabular`) and web `Badge`, `SegmentedControl`, and `Table`. Pin the previous teal with `colors={{ accent: '#0B615E', onAccent: '#FFFFFF' }}` (dark: `#7EDAD6` / `#101214`).

- 247f158: Adds a named palette catalog so products pick a reviewed light/dark overlay instead of copying hex. Apply with ThemeProvider `palette`, `data-palette` on the generated canvas, or `import '@scalewing/react/palette/<id>.css'` after styles.css. Default remains indigo. `colors` still wins over a named palette and may be `{ light, dark }` so end users can switch scheme without the product swapping hex.
- 247f158: Adds Select, a web labeled listbox menu, so a compact choice can open with canvas glass instead of the operating system picker.
- 247f158: Adds Split, a web start pane with a labeled separator, so a column can be resized up to a max width and hidden when dragged too small.
- 247f158: Adds Toast, a web auto-dismiss confirmation on the popover layer that does not trap focus. Optional `anchor` and `target` send it from a press to a destination, then it vanishes. Ghost buttons with `aria-pressed="false"` use quiet opacity so a selected press stays full color.

### Patch Changes

- 247f158: Adds Select action, a last listbox command that does not become the displayed value.
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

- f35314a: Add Box `as="a"` for layout links and Field (label wrapping a native control, token gap) after fantasy-football. Press actions stay on Button; do not use Box as a button.
- f35314a: Add Button (primary, secondary, ghost, danger; sm and md) for DOM and React Native after FutMas and coach-platform requested the same control. Includes onAccent/onDanger, 44px md hit target, focus ring, and disabled opacity tokens.
- f35314a: Shift the default visual language to a quiet glass canvas: Apple-like neutrals and type, frosted Card, pill buttons, and generated document styles so links and native text controls are not user-agent chrome.

### Patch Changes

- Updated dependencies [f35314a]
- Updated dependencies [f35314a]
  - @scalewing/tokens@0.2.0

## 0.1.0

### Minor Changes

- Initial foundation: Box, Stack, Inline, Card, Text, ThemeProvider, and package-owned `styles.css`.
