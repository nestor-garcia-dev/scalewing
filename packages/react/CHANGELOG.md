# @scalewing/react

## 1.9.0

### Minor Changes

- a4a30e8: `DateField` draws its own calendar instead of using the browser's `<input type="date">`, so it looks the same in every browser, follows Scalewing's tokens, and shows up in screenshots. The props, the date-only `YYYY-MM-DD` contract, and the `RangeError` guards are unchanged.

  - People type the date into a text entry in the locale's numeric order (`MM/DD/YYYY` for en-US, `DD/MM/YYYY` for es); ISO `YYYY-MM-DD` and eight bare digits also work. A keystroke commits once the entry's last field is at full width (a four-digit year, or two digits for a trailing day or month); a shorter last field commits on blur or Enter. Typed text stays when the parent keeps the old value. Text that is not a date keeps the last value and, after the person leaves the field, sets `aria-invalid` with a message. As with the native input, the entry blocks form submission while its text is not a date or its date is outside `min`/`max` (`setCustomValidity`).
  - A calendar button opens a WAI-ARIA date picker dialog anchored under the field on the popover layer, with month and year selectors for jumping decades, Today, and Clear (only when not `required`). Arrows, Home/End, PageUp/PageDown, and Shift+PageUp/PageDown move focus; Enter or Space selects; Escape closes and returns focus to the button. Days outside `min`/`max` are `aria-disabled`, the month selector offers only months inside them, and padding past `0001-01-01` or `9999-12-31` is blank and inert.
  - New optional props: `locale` (BCP 47; defaults to the nearest `lang` attribute, then `en-US`), `weekStartsOn` (`0` Sunday by default, or `1` Monday), and `labels` for the control's own words (English defaults), including `outOfRange`, the form validation message for a date outside `min`/`max`. New types `DateFieldLabels` and `WeekStart`. New generated `sw-date-field-*` classes for the control and calendar.
  - Migration for tests: there is no `input[type=date]` any more. Find the entry by its label (`getByLabel('Hire date')` or `getByRole('textbox', { name: 'Hire date' })`) and `fill` it in the locale's order or in ISO, or open the calendar with the **Choose date** button. The input's value is now the locale's display text (`03/10/2024`), not `2024-03-10`; assert the serialized value from your own state.

  No new dependencies.

- 4548fc2: `Accordion` takes `subtitle`, one muted caption line under the title, and
  `size="sm"` for a quieter disclosure nested inside other content (a
  label-size title, spacing step 3, `md` corners, and a header that is an `sm`
  control of at least 32px instead of 44px). The header now draws a
  token chevron at its inline end in place of the browser's `details` triangle;
  it turns when the disclosure opens and holds still under reduced motion. See
  `docs/requests/teisoro-accordion-summary.md`.

  ```tsx
  <Accordion
    open={open}
    onOpenChange={setOpen}
    subtitle="Twelve sightings · Two nests"
    title="Wetlands"
  >
    {children}
  </Accordion>
  ```

  New generated classes `sw-accordion-sm`, `sw-accordion-heading` and
  `sw-accordion-marker`, and a new exported type `AccordionSize`. The summary is
  now a flex row instead of `display: list-item`, so the native marker is gone;
  an app that styled `.sw-accordion-summary::marker` has nothing left to style.
  Additive for the public API.

- 38e6f09: New `ActionBar`: a long page's actions and one short `status` line on a glass
  bar that sticks to the bottom of the viewport while the content above it
  scrolls, then rests in place after it (see
  `docs/requests/teisoro-action-bar.md`). `stickyBelow="md"` sticks only below
  the `md` breakpoint and keeps the bar in page flow from `md` up. The bar clears
  the safe-area insets (with `viewport-fit=cover`), is solid under Reduce
  Transparency, and on a phone puts the status on its own line with the actions
  sharing the row under it. The status is a polite live region
  (`role="status"`), always rendered so the first status is announced too; an
  empty status takes no room.

  ```tsx
  <Stack gap={4}>
    {longForm}
    <ActionBar status="Draft saved at 5:00 PM" stickyBelow="md">
      <Button variant="secondary" onPress={save}>
        Save draft
      </Button>
      <Button onPress={finish}>Finish</Button>
    </ActionBar>
  </Stack>
  ```

  New generated classes `sw-action-bar`, `sw-action-bar-status`,
  `sw-action-bar-actions`, `sw-action-bar-sticky` and
  `sw-action-bar-sticky-below-md`; new exported types `ActionBarProps` and `Breakpoint` (the breakpoint names
  `stickyBelow`, `hideBelow` and `columnsBelow` already take, today only
  `'md'`). Additive.

  Every generated `z-index` now comes from one stacking order
  (`src/css/stacking.ts`): sticky table cells 1, the ActionBar 2, a glass `Card`
  or `Accordion` holding an open popup 3 (was 1), the sticky `AppHeader` 4 (was
  2), and popups 10 (the `Select` list was 3). An open `Select`, `ActionMenu`
  or `Tooltip` inside a glass surface now paints over a stuck ActionBar, and
  still under the AppHeader. An app that layered its own element between these
  values should check it against the new numbers.

- affd090: `Box` `border` accepts `'dashed'` as well as `true`: a hairline dashed border
  in the `border` color token, for a space to fill in by hand such as a blank on
  a printed form (see `docs/requests/teisoro-box-border-style.md`). Every
  Box-based component takes it.

  ```tsx
  <Box border="dashed" padding={2} radius="sm">
    {hint}
  </Box>
  ```

  New generated classes `sw-border` and `sw-border-dashed` and a new exported
  type `BoxBorder` (`boolean | 'dashed'`). `border` and `border={true}` look the
  same as before, but the solid hairline is now the `sw-border` class instead of
  an inline `style.border`; a consumer `style` still wins, and the prop still
  wins over a Box-based component's own frame. A test that read
  `element.style.border` should check the class instead. Additive for the
  public API.

- 6a4c4ab: `Field` takes `prefix` and `suffix`: short text inside the control's frame
  before or after the value, such as a currency sign or a unit (see
  `docs/requests/teisoro-field-adornment.md`).

  ```tsx
  <Field label="Drop amount" prefix="$">
    <input inputMode="decimal" name="drop" />
  </Field>
  ```

  The text is not part of the value. The generated `sw-field-adorned` wrapper
  draws the control frame and focus ring, `sw-field-prefix` and
  `sw-field-suffix` are muted, and the input is named by its label plus the
  adornment ("Drop amount $") through `aria-labelledby`. An input that names
  itself with its own `aria-label` or `aria-labelledby` keeps that name, and the
  adornment joins its `aria-describedby` instead. A press on the prefix, the
  suffix or the frame focuses the input. Adornments need one
  native `<input>` child; anything else throws a `TypeError`. Additive; an
  unadorned `Field` renders as before.

- 988bd2c: `Grid` takes `align` (`start`, `center`, `end`, `stretch`): where each child
  sits in the height of its row, through the same generated `sw-align-*` classes
  and `Align` type as `Stack` and `Inline` (see the 2026-09-28 follow-up in
  `docs/requests/teisoro-grid.md`). `align="end"` keeps a row of fields level
  when one label wraps:

  ```tsx
  <Grid align="end" columns={2} gap={3}>
    {fields}
  </Grid>
  ```

  Additive; unset, no class is added and children stretch as before.

- c3d04a8: `Progress` takes `showCount` (default `true`). `showCount={false}` hides the
  visible `value / max` count beside the label when the page shows its own count
  caption, so the count appears once (see the 2026-09-28 follow-up in
  `docs/requests/teisoro-progress.md`). The progress bar still exposes its value
  and maximum to assistive tech.

  ```tsx
  <Progress label="Registers closed" max={2} showCount={false} value={0} />
  ```

  Additive; the count shows as before when the prop is left out.

## 1.8.0

### Minor Changes

- 7d46059: A `DenominationGrid` `strip` wider than its container now scrolls sideways
  inside its own region instead of widening the page (for example an
  eleven-column strip on a 390 px phone, or a six-column strip inside an
  outlined card inside another card). The region is a keyboard-focusable
  `group` named after the grid's `label`, like `Table`'s scroll wrapper, and
  the row labels and the header corner above them stay pinned at the start
  while the counts scroll under them, so each column head stays over its
  counts. The pinned label draws its tone stripe as its own box, so the stripe
  moves with it in every browser.

  Reduce Transparency now takes effect on every glass surface it lists: the
  fallback block is emitted after all component rules, where before most glass
  rules (app header, sticky table head, dialog, toast and others) came after it
  and kept their blur. The block lists glass surfaces only: the filled
  secondary button left it, so it keeps its own fill and text colors.

  New generated classes: `.sw-denomination-scroll` (the scroll region) and
  `.sw-denomination-label-body` (the icon, label, and phone total inside the
  row label cell). `Table` and the strip now share one generated scroll-region
  rule; `.sw-table-wrap` output is unchanged. No prop changes. See
  `docs/requests/teisoro-denomination-grid.md`.

## 1.7.0

### Minor Changes

- 2444ec5: Button `variant="tertiary"` is a solid fill on `--sw-color-tertiary` with
  `--sw-color-onTertiary`. `secondary` now fills with `--sw-color-secondary`
  and draws `--sw-button-secondary-border`, which stays the hairline unless a
  palette fills the secondary action (for example `signal`). The stylesheet
  emits the new semantic colour properties. Default and cerulean themes look
  unchanged.
- 622ab77: `Card variant="filled"` (`.sw-card-filled`) is a quiet `--sw-color-subtle`
  fill with no border, for plain information apart from pressable rows.

### Patch Changes

- Updated dependencies [b5a56b7]
- Updated dependencies [2444ec5]
- Updated dependencies [622ab77]
  - @scalewing/tokens@1.3.0

## 1.6.1

### Patch Changes

- 22ae9c2: `TableCell numeric` and `TableCell align="end"` cells now line up at the end of
  the cell again. The base `.sw-table th, .sw-table td { text-align: start }` rule
  was more specific than `.sw-table-numeric` and `.sw-table-end`, so those cells
  had been aligned to the start since the table styles were added. The alignment
  rules are now `.sw-table .sw-table-numeric` and `.sw-table .sw-table-end`. No
  prop changes.

## 1.6.0

### Minor Changes

- a42f7dd: `Dialog` is now fully controlled by `open`. Escape, a platform close request,
  a backdrop press and a `<form method="dialog">` submit (the form's `method` or
  the submitter's `formmethod`) are each prevented and ask `onClose()`; none of
  them closes the native `<dialog>` itself. A dialog whose consumer keeps `open`
  true (for example while a form is saving) stays shown, including on a repeated
  Escape in Chromium. A consumer `onKeyDown`, `onCancel`, `onSubmit` or
  `onPointerDown` that prevents the event vetoes that request (`onPointerDown`
  used to be dropped). Escape in a search field that holds text clears the field
  first, and a descendant's own `cancel` (a dismissed file picker) is not a close
  request. A backdrop press counts only on the
  dialog element itself, so a nested dialog's backdrop or an overflowing popover
  does not close the outer dialog. See `docs/requests/teisoro-dialog-close.md`.

  `Tooltip` now prevents the Escape it uses while it is visible, so one Escape
  hides a tooltip inside a `Dialog` without also closing the dialog.

  `ActionMenu` returns focus to its trigger before running a selected command,
  as Escape already did, so a `Dialog` opened from a command returns focus to
  the trigger when it closes (`docs/requests/teisoro-action-menu.md`).

  Behavior change: `Dialog` no longer calls `onClose` when `open` turns false
  (it used to echo the native `close` event). Migration: if you ran cleanup in
  `onClose` after setting `open` to false yourself, run it where you set `open`
  to false.

  No prop or type is added or removed.

## 1.5.0

### Minor Changes

- 7b51094: Add `columnSpan` to `Box` and every component built on it (`Stack`, `Inline`,
  `Card`, `Grid`, …), so a direct child of a `Grid` can cover 1, 2, 3, 4 or 6
  columns (see `docs/requests/teisoro-grid-column-span.md`). Three columns with a
  two-column child give a two-to-one page:

  ```tsx
  <Grid columns={3} columnsBelow={{ md: 1 }} gap={4}>
    <Stack columnSpan={2} gap={4}>
      {form}
    </Stack>
    <Card variant="outlined">{panel}</Card>
  </Grid>
  ```

  The generated `sw-grid-span-{1,2,3,4,6}` classes are capped at the
  columns the grid has at the current width, so a span never adds an implicit
  column and `columnsBelow` still stacks the page on a phone. A span outside the
  catalog throws a `RangeError`. New exported types: `GridColumnSpan`,
  `ColumnSpanProps`. Additive; no existing class or prop changes.

## 1.4.1

### Patch Changes

- efdd079: An open `Select`, `ActionMenu` or `Tooltip` inside a glass `Card` or an
  `Accordion` now paints over the surface below it (see
  `docs/requests/teisoro-popup-stacking.md`). Backdrop blur makes each glass
  surface its own stacking context, so the open list painted under the next card
  and a click on a covered option reached that card's field instead. No prop
  changes.

## 1.4.0

### Minor Changes

- e3b4ddc: Add `StatTile`, one prominent figure with its label: a glyph slot, a tabular value with a `tone` (`accent`, `success`, `danger`, `warning`), an optional caption, and `emphasis="primary"` that fills the tile in the accent for the figure a page leads with (generated `sw-stat-tile`, `sw-stat-tile-primary`, `sw-stat-tile-glyph`, `sw-stat-tile-body`, `sw-stat-tile-label`, `sw-stat-tile-value`, `sw-stat-tile-caption`; the tone colours the value through `Text color`).
- 97e172a: Add `Tabs` and `TabPanel`: a `tablist` strip with an accent underline under the current tab, roving focus, ArrowLeft / ArrowRight / Home / End that move and select, sideways scrolling when the labels overflow (generated `sw-tabs`, `sw-tab`, `sw-tab-selected`), and a labelled `tabpanel` that hides itself while another tab is current.
- 98ffed7: Add `Badge tone="warning"`, outlined in the new `warning` colour like `success` and `danger` (generated `sw-badge-warning`), for the middle status a product shows between good and blocked.

### Patch Changes

- aefecaf: `Table` scroll wrapper is keyboard reachable: the `sw-table-wrap` element is a `group` named after the table (`aria-label` / `aria-labelledby` mirrored) with `tabIndex={0}` and an accent focus ring, so a wide table with no focusable cell can be scrolled sideways from the keyboard and passes the axe `scrollable-region-focusable` rule.
- Updated dependencies [98ffed7]
  - @scalewing/tokens@1.2.0

## 1.3.0

### Minor Changes

- 3ce39ea: Add `ButtonGroup`, the action row of a form or dialog: buttons on one line from the `md` breakpoint up, aligned `start`, `end` (default) or `between`; below `md` they stack full width in source order (generated `sw-button-group` and `sw-button-group-*`).
- 3e20a6e: Add `SegmentedControl` `disabled`: the group reports `aria-disabled`, every segment is a disabled button, arrow keys and clicks are ignored, and the track fades to `--sw-disabled-opacity` (generated `sw-segmented-disabled`). The recorded choice stays visible, for an identity that can no longer change; a disabled control may omit `onChange`.

## 1.2.0

### Minor Changes

- 829dbdb: Add `Dialog` `size` (`'md' | 'lg'`): `lg` widens the modal to `--sw-dialog-max-lg` (56rem) so a row of six fields or a data grid fits without folding. The default stays `md` (32rem); phones keep the viewport gutter for both.
- 28b53e0: `Grid` accepts `columns={6}` and `columnsBelow={{ md: 6 }}` (generated `sw-grid-cols-6` and `sw-grid-cols-below-md-6`) so a six-denomination entry row keeps one row on desktop. Five and seven still throw.
- 9363116: Add `SegmentedControl` `variant` (`'compact' | 'filled'`): `filled` gives every segment the same width and an accent-filled selection (generated `sw-segmented-filled`); it takes the full width in a Stack and its labels' width in an Inline. The default `compact` look is unchanged.

## 1.1.0

### Minor Changes

- f45ef5d: Generate compact `display` and `heading` sizes below the `md` breakpoint from the new tokens, so page titles and panel figures stop dominating a phone screen. No product change needed.
- 01e7d0e: Add `align` (`start`, `center`, `end`) to `Text`, backed by generated `sw-text-align-*` classes, and keep `DenominationGrid` tiles three per row below the `md` breakpoint.
- f00b3cc: Add `DenominationGrid`, a read-only count-per-unit display across a fixed column set. The `strip` layout is a captioned table with a toned row label (icon slot), muted zero cells, signed delta cells toned by sign, and an optional consumer-formatted total that moves under the row label below the `md` breakpoint; the `tiles` layout stacks the column label, count, and an optional consumer-formatted subtotal per column. Generated `sw-denomination-*` classes; invalid columns, rows, or cells throw.
- cc9aa28: Add an optional `count` to `FilterChipOption`. It renders as a tabular chicklet after the chip label (generated `sw-filter-chip-count`), joins the option's accessible name, and a zero count quiets the chip (`sw-filter-chip-quiet`) until it is selected. Negative or fractional counts throw.
- f7f3bf9: Add `Grid`, a Box-based layout that places children in one to four equal-width columns with a token gap step and an optional smaller column count below the `md` breakpoint (`columnsBelow={{ md: 2 }}`), backed by generated `sw-grid-*` classes.

### Patch Changes

- Updated dependencies [f45ef5d]
  - @scalewing/tokens@1.1.0

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
