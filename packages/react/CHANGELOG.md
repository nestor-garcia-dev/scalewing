# @scalewing/react

## 1.59.2

### Patch Changes

- ed35abb: `GlyphTile` letters are readable text: a tile holding letters mixes its categorical fill 25 % toward black, so white letters keep 4.5:1 (WCAG 1.4.3) on every fill in both schemes (neutral 3.26:1 before, 5.35:1 after; orange, the lightest, 5.08:1). A glyph keeps the fill as it is (3:1, WCAG 1.4.11). `Stepper`'s − and + grow to the 44 px touch target both ways on a coarse pointer (32 px wide before). No API change.

## 1.59.1

### Patch Changes

- 3f78164: An xs `Field`'s own text input (`input` of a typed kind, or `textarea`) now draws at the xs size: the document canvas's `[data-theme]` typed-input rule outranked `.sw-field-xs`, so the control kept the md min-height (44 px) and the inherited font size beside a 28 px xs `Select`. The xs rule now matches it under `[data-theme]` (caption type, xs min-height and padding), and on a coarse pointer the control is the 44 px touch target. Adorned and search inputs keep their frames' rules. No API change.

## 1.59.0

### Minor Changes

- 9ca5393: Muted words on a row's hover fill now keep 4.5:1: while a pressable `FixtureRow`, `ListRow` or `TableRow` shows the quiet fill (hovered, a ListRow or TableRow pressed, a TableRow's action focused), the parts on it read `--sw-color-muted` as the text colour, including the meta, details, a muted `TableCell`, the chevron and a consumer's `Text color="muted"` (muted was 4.14:1 on the fill in `ink` light, 3.47:1 in `harvest` dark). No prop, nothing changes at rest, toned words keep their tone, forced colours unchanged. `LiveRegion` (new, `LiveRegionProps`, `LiveRegionPoliteness`, `liveRegionPolitenesses`): a status line whose changing words are announced, an always-mounted region that starts empty (`role="status"` polite by default, or `role="alert"` with `politeness="assertive"`, `aria-atomic`), its string `children` swapped in as a new node on each change or `announceKey` change (the first words once it has been mounted 100 ms), drawn inline in `Text`'s look (`variant`, `color`) or `visuallyHidden`; an unknown politeness throws a `RangeError`, a look with `visuallyHidden` a `TypeError`. `AppShell` `skipLink` (opt-in, `AppShellSkipLink`: `{ label }`): a skip link first in the shell, hidden until focused, then fixed at the window's top start; a press moves focus to `main`, which gets an id and `tabindex="-1"` only with it, without changing the address; a blank label throws a `RangeError`. `Select` `disabled` (opt-in): a native disabled trigger, out of the Tab order and faded (`GrayText` in forced colours), its list never opens and `onChange` never runs. New class `sw-app-shell-skip-link` and stacking layer `skipLink` (7). SiteHeader's skip link now shares its look's rules (`css/skip-link.ts`); its output is unchanged apart from rule order.

## 1.58.0

### Minor Changes

- cf53284: `Field` `descriptionTone` (opt-in, `FieldDescriptionTone`, `fieldDescriptionTones`: `'muted'` default, `'warning'`): a warning description in the warning colour after a small `aria-hidden` alert glyph, for a hint that needs the person but is not an error; it stays in the control's `aria-describedby`, sets no `aria-invalid` and no danger border, gives way to `error`, and takes `CanvasText` in forced colors. `FixtureGroup` `titleHidden` (opt-in): the title still names the list (`aria-labelledby`) but is not drawn, for a group whose heading is already on screen. `Text` `font` (opt-in, `TextFont`, `textFonts`: `'sans'` default, `'mono'`): the platform's monospace face through the generated `sw-font-mono` class at the variant's size, weight and colour, for a code read character by character. Unknown tones and fonts throw a `RangeError`. New classes `sw-field-description-warning`, `sw-field-description-glyph`. `FieldProps` now lives in `components/field/field-props.ts` and is still exported from the package root.

## 1.57.0

### Minor Changes

- 9a42d28: `FixtureRow` `score` (opt-in, `FixtureScore`: `{ label, home, away, onChange(side, value), onSubmit(), onCancel?(), disabled?, error? }`, boxes `FixtureScoreBox`: `{ value, label, ref?, invalid? }`): two score boxes between the sides in place of `center` (now optional when `score` is given), digits only (`inputmode="numeric"`, two digits, selected on focus) in a group named by `label`, each box named by its own `label`; Enter calls `onSubmit`, Escape `onCancel`; 32 px squares on a fine pointer and 44 px on a coarse one; `error` is said politely under the row and marks the boxes invalid. A score row is never a link or a button, and works with `flag`, `select` and `action`. `FixtureRow` `detail` (opt-in): a full-width part under the row, outside its press area. `TableRow` `rule="after"` (opt-in, `TableRowRule`, `tableRowRules`): a 2 px muted rule under the row, such as a cut under the last playoff place, `CanvasText` in forced colors. New types `FixtureScore`, `FixtureScoreBox`, `FixtureScoreSide`, `TableRowRule`; new classes `sw-fixture-score`, `sw-fixture-score-box`, `sw-fixture-score-dash`, `sw-fixture-score-error`, `sw-fixture-item-below`, `sw-fixture-detail`, `sw-table-row-rule-after`.

## 1.56.0

### Minor Changes

- 384520b: `FixtureRow` `select` (opt-in, `{ label, checked, onCheckedChange, disabled? }`): a leading checkbox with its label visually hidden, before the row and outside its press area, in the run's new first column (`sw-fixture-list` is now `auto minmax(0, 1fr) auto minmax(0, 1fr) auto auto auto`, six below `md`; the row spans `2 / -2`); the standard 24 px box, 44 px on a coarse pointer; works with `flag`, `action`, `href` and `onPress`. New type `FixtureSelect`; new classes `sw-fixture-item-select`, `sw-fixture-select`, `sw-fixture-row-flag-inline`. Fixes: below `md` a flagged row with no details' line keeps its flag inline; `ScheduleGrid` `labels.pickedUp` receives the input as a second argument (`ScheduleGridCarryMode`: `keyboard`, `tap`, `drag`; one-argument functions you pass still work, but a call to `defaultScheduleGridLabels.pickedUp` now needs the mode) and the default words fit it; a key or tap carry is cancelled when focus leaves the grid (a press on a header keeps focus and the carry); a drag release handled before the pick-up renders no longer leaves the item held; `DateToggleCalendar` `onChange` drops `value` entries outside `min`–`max` or on disabled days.

## 1.55.0

### Minor Changes

- 81c0b16: `FixtureRow` `flag` (`{ label, tone? }`, amber `warning` by default or `danger`) and `action` (opt-in): a named issue mark at the row's start, read first (and before an `aria-label`), on the first line from `md` and leading the details' line below it; and a control after the row, outside its press area, lined up in the run's new last column at every width. New types `FixtureFlag`; new classes `sw-fixture-row-flagged`, `sw-fixture-flag`, `sw-fixture-flag-mark`, `sw-fixture-flag-warning`, `sw-fixture-flag-danger`, `sw-fixture-item-action`, `sw-fixture-action`. The fixture list's grid gains a sixth (`auto`) column, empty without actions. New `ScheduleGrid`: items in a grid of rows by columns, moved by mouse or pen drag with one hover target (drop on another item to swap), by a tap then a tap on touch, or by keys (roving focus, M or Space to pick up, arrows, Enter to drop, Escape to cancel); `canDrop` decides every target (`true` or `{ reason }`), `disabledCells` are never targets, each with its reason; polite announcements in English by default (`labels`, `defaultScheduleGridLabels`); classes `sw-schedule-grid*`. New `DateToggleCalendar`: month grids from `min` to `max` whose days toggle (`aria-pressed`), with `isDateDisabled`, `toggledLabel`, `locale`, `weekStartsOn` and `disabled`, one Tab stop and keys that skip days that cannot be toggled; classes `sw-date-toggle*`. Requests: `docs/requests/futmas-fixture-row-action-flag.md`, `docs/requests/futmas-schedule-grid.md`, `docs/requests/futmas-date-toggle-calendar.md`.

## 1.54.0

### Minor Changes

- 4c2d7cd: `Box` `external` and `newTabLabel` (opt-in, `as="a"` only): a link that opens in a new tab, `target="_blank"` with `noopener noreferrer` added to `rel`, a decorative arrow (↗) after its words drawn with borders in the link's colour, and `newTabLabel` (your words, such as "(opens in a new tab)", required with `external`) read after its name. New class `sw-link-external-mark`. `Stepper` `onCommit` and `commitDelay` (opt-in): the finished count once per entry, on blur, on Enter and `commitDelay` ms (default 600) after the last − / + press or step key, never per typed digit and never for an unchanged count; `onChange` is unchanged. Requests: `docs/requests/futmas-external-link.md`, `docs/requests/futmas-stepper-commit.md`.

## 1.53.0

### Minor Changes

- 2d5e8ef: `Checkbox` `labelVisuallyHidden` (the label stays the name, not drawn; the box is its own target, 44 × 44 px on a coarse pointer) and `indeterminate` (the mixed state: a dash on the accent fill, the native `indeterminate` property and `aria-checked="mixed"`). `TableSelectCell` (`label`, `checked`, `indeterminate?`, `onCheckedChange`, `disabled?`, `as?: 'td' | 'th'`): a table's select column holding that Checkbox, as narrow as the box. New classes `sw-checkbox-label-hidden`, `sw-table-select`. Request: `docs/requests/futmas-table-row-selection.md`.

  `Dialog` `placement` (`'center'`, the default, or `'end'`): from md up a full-height side panel at the inline end with Dialog's title row, close button, scrolling content and pinned footer; below md the centred dialog or the bottom sheet with `sheetBelow`. Exports `dialogPlacements`, `DialogPlacement`. New class `sw-dialog-end`. Request: `docs/requests/futmas-dialog-side-panel.md`.

  `PasteRows`: a text area for rows pasted from a spreadsheet, a polite count of the columns found and one `Select size="xs"` per column choosing its meaning (`label`, `description?`, `value`, `onValueChange`, `columns`, `mapping`, `onMappingChange`, `countLabel`, `columnLabel?`, `delimiter?`, `rows?`, `placeholder?`, `error?`, `disabled?`, `required?`), with the pure `parsePastedRows(text, delimiter?)` (tab or comma cells, quoted cells, blank rows dropped). Exports `PasteRows`, `PasteRowsProps`, `PasteRowsColumn`, `parsePastedRows`, `PastedRows`, `PastedRowsDelimiter`, `pastedRowsDelimiters`. Request: `docs/requests/futmas-paste-rows.md`.

  `Select`: on a coarse pointer the trigger and each option are at least 44 px high at every size, as every `Button` is since 1.51.0; a fine pointer keeps `xs` at 28 px, and an `xs` Select's open list is taller on touch. Request: `docs/requests/futmas-select-touch-target.md`.

  No new tokens or dependencies.

## 1.52.0

### Minor Changes

- 03f2e78: Site chrome follow-ups from Teisoro's marketing-site UX review. `SiteHeader` takes an optional `skipLink` (`{ label, href }`, exported as `SiteHeaderSkipLink`): a "skip to content" link that is the header's first focusable element, visually hidden until it has focus, then a pill on the surface with the accent ring laid over the bar's start (`sw-site-header-skip-link`); a blank label or an `href` that is not a `#fragment` throws a `RangeError`. While a sticky `SiteHeader` is on the page, the document's `scroll-padding-top` clears the bar (56 px, 72 px from `lg`), its hairline and a small gap, so `#fragment` links, `:target` and `scrollIntoView` land below the bar; a header with `sticky={false}` changes nothing. Below `lg`, the bar's `compactActions` (now in a `sw-site-header-compact-actions` box with `display: contents`) step aside while the menu is open, since the menu holds its own `menuActions`, leaving the brand and the close button. On a coarse pointer, a plain link that is all of a `SiteFooter` bottom-row slot (`legal` or `end`) gets the 44 px touch target, as the group links have. No new tokens or dependencies. Request: `docs/requests/teisoro-site-chrome-follow-ups.md`.

## 1.51.0

### Minor Changes

- cf5de2a: `TaskList`: a setup checklist, an `ol` (`role="list"`) named by `label` with one row per `items` entry (`{ id, title, detail?, status, action? }`): a 24 px status marker hidden from assistive technology (`done` a check on the success fill, `next` an accent ring round a dot, `todo` a grey ring, `waiting` a muted lock), the title, a muted detail line and an optional action at the row's end that wraps under the words on a narrow column. Each title is read with its status word ("Season, Done") as one hidden line; `labels` (`Partial<TaskListLabels>`) replaces the English words (`defaultTaskListLabels`), a word left out or `undefined` staying English. `action` may be a function given `{ titleId }` to describe the action by its task. Exports `TaskList`, `TaskListProps`, `TaskListItem`, `TaskListActionContext`, `TaskListLabels`, `TaskListStatus`, `taskListStatuses`, `defaultTaskListLabels`. New classes `sw-task-list*`; a blank label, word, id, title or detail, a repeated id, or an unknown status throws a `RangeError`. Request: `docs/requests/futmas-task-list.md`.

  `Button` (and `ButtonLink` and the controls built on them): on a coarse pointer every size is at least 44 × 44 px, the md control height, so an `xs` or `sm` Button in a table row or a checklist is a comfortable touch target. Padding and type keep the size's; only the minimum box grows, so rows and popovers holding small Buttons are taller on phones and tablets (DateField's calendar footer, Toast's action, a Step's Edit). Two layouts keep `min-width: 0` so they can share a row: a full-width attached `ButtonGroup` below md and a `width="full"` Button in an `Inline`; both keep the 44 px height. A fine pointer is unchanged. Request: `docs/requests/futmas-button-touch-target.md`.

  No new tokens or dependencies.

## 1.50.0

### Minor Changes

- d707587: `ScreenPreview`: a drawn stand-in for an app's screen on a public page, a `figure` whose screen is one image (`role="img"`) named by `label`, with an optional `eyebrow`, `title` and visible `caption`. `frame="card"` (default) or `"device"`, a 20rem phone from `md` and the card below it. Its content is `PreviewGroup`s of `PreviewRow`s (`kind` `plain`, `total`, `note`, `filled`, `alert`) and `PreviewTiles` (three to a row on a phone, six from `md`). New classes `sw-screen-preview*`, `sw-preview-*`, with `screenPreviewFrames` and `previewRowKinds`; a blank label, an unknown frame or kind, or bad tiles throw a `RangeError`. No new tokens or dependencies. Request: `docs/requests/teisoro-screen-preview.md`.
- 7a647d3: `ThemeProvider` takes `frame` (`none` by default, or `site`): `site` writes `data-frame="site"` and makes the themed root a column at least the window's height whose last child (the footer) is pushed to its foot, so a short page's footer meets the window's foot. `themeFrames` and `ThemeFrame` list the frames; an unknown one throws a `RangeError`. No new tokens or dependencies. Request: `docs/requests/teisoro-site-frame.md`.

## 1.49.0

### Minor Changes

- 2ae2974: `Hero`: a public page's opening, a `section` named by its title. An optional `eyebrow` (muted label words), the `title` (the page's `h1` in the `hero` size), an optional `lead` and `actions`, and an optional `media` picture that keeps its own width beside the words from `md` and sits under them below it, where the actions stack to the full width. With no picture the words keep the reading width. New classes `sw-hero*`; a blank `title` throws a `RangeError`. No new tokens or dependencies. Request: `docs/requests/teisoro-hero.md`.
- dc0c896: `EmptyState` (new): where a list or a page has nothing yet, a centred panel on the surface with a dashed hairline edge that fills its column (a page column or a Card). `title` is a heading at `titleAs` (`h2` by default, or `h3`; `emptyStateTitleElements`), `description` a muted line, `icon` a decorative glyph in a quiet square, `actions` a centred row that wraps (44 px Buttons on a coarse pointer). Forced colours keep the dashed edge. A blank `title` or `description` or an unknown `titleAs` throws a `RangeError`. New classes `sw-empty-state`, `sw-empty-state-icon`, `sw-empty-state-title`, `sw-empty-state-description`, `sw-empty-state-actions`. No new tokens or dependencies. Request: `docs/requests/futmas-empty-state.md`.
- 6d3cbe8: `Grid` takes `fit` (`narrow` 15rem, `medium` 16.25rem, `wide` 18.75rem): as many columns as the grid's width holds at that minimum, sharing the row, one when the grid is narrower, so a row of cards reflows with no breakpoint. Not with `columns` or `columnsBelow`; either, or an unknown `fit`, throws a `RangeError`. New classes `sw-grid-fit-*` and the `gridFits` list and `GridFit` type. No new tokens or dependencies. Request: `docs/requests/teisoro-grid-fit.md`.
- b466bbb: `Text` takes the tokens' new variants `hero` (an `h1` by default), `headline` (an `h2`) and `lead` (a `p`), each stepping down to its compact size below `md` like `display` and `heading`. New classes `sw-text-hero`, `sw-text-headline`, `sw-text-lead`, generated from the tokens. Needs `@scalewing/tokens` 1.7.0. Request: `docs/requests/teisoro-showcase-type.md`.
- 7b57979: `Stepper` takes `unit` (opt-in), a short muted word after the count inside its frame, such as "min" or "players". The count is read with it (`aria-valuetext` "90 min") unless `valueText` says it in words; the unit itself is hidden from assistive technology. The frame draws the control surface, focus ring and the invalid, changed and disabled states; the count keeps its few-digit width, so the frame never follows it. A blank `unit` throws a `RangeError`. New classes `sw-stepper-count`, `sw-stepper-unit`. No new tokens or dependencies. Request: `docs/requests/futmas-stepper-unit.md`.

### Patch Changes

- Updated dependencies [b466bbb]
  - @scalewing/tokens@1.7.0

## 1.48.0

### Minor Changes

- a4b524c: `AppShell` gains `pageBar`, a band at the top of `main` on every layout (the solid surface with a hairline under it and the page's inline padding, its children a wrapping row with space between them), sticky under the compact top bar below `lg` (the shell measures the bar and sets `--sw-app-shell-bar-height`, falling back to its usual height) and at the window's top from `lg`; and `menuCount`, `menuCountLabel` and `menuCountTone`, the shared count pill on the compact bar's menu button, read in its name after a comma ("Open menu, 6 need you"). `header` and `railHeader` are documented as hosts for an interactive switcher trigger, whose popup opens on the top layer. `AppHeader` accepts a `ref` for its `header`. New class `sw-app-shell-page-bar`; an invalid menu count, a blank label, an unknown tone or a label or tone without a count throws a `RangeError`. No new tokens or dependencies. Request: `docs/requests/futmas-app-shell-page-bar.md`.
- 0d789a6: `Band`: a full-width stretch of the page in one fill, its content in a
  centred column with the page gutter (16 px, 24 px from `md`), for a site's
  footer, one dark closing section or a grey strip.

  - `tone`: `surface` (the cards' fill), `subtle` or `inverse`, the dark band
    (`--sw-color-inverse`, which a brand moves with a theme overlay). Inside
    the inverse band the theme's words, muted words, hairlines, subtle fill,
    accent and `onAccent` read on the dark fill, so `Text`, a filled `Card`,
    a primary `Button` and the focus ring need no variant; every plain link
    takes the band's words with a half-strength underline.
  - `width` `container` or `reading`; `as` `section`, `div`, `aside` or
    `footer`; `paddingY` (default 8), `paddingTop`, `paddingBottom`.
  - Forced colours outline the inverse band.

  New classes `sw-band`, `sw-band-inner`, `sw-band-<tone>`,
  `sw-band-inner-<width>`; an unknown tone, width or element throws a
  `RangeError`. Needs `@scalewing/tokens` with `inverse` and `onInverse`. No
  new dependencies. Request: `docs/requests/teisoro-band.md`.

- 54adbbf: `ButtonLink`: a link drawn as a `Button`, for a destination that reads as
  an action (a site's Contact us or Sign in). An `<a href>` with the
  Button's `variant`, `size` and `width`, so it opens like any link and works
  on a page rendered with no script; it keeps its variant's words over the
  canvas link colour, hover included. `aria-current="page"` marks the
  current page with the pressed button's ring (a Highlight border in forced
  colours). New class `sw-button-link`; an unknown variant, size or width
  throws a `RangeError`. No new tokens or dependencies. Request:
  `docs/requests/teisoro-button-link.md`.
- a4bb2f5: `CommandPalette` and `CommandPaletteTrigger`. CommandPalette is a search over the product on the top layer: a modal dialog near the window's top holding a field (an ARIA combobox) over an always-open listbox of grouped results the consumer filters from `query`; ↑/↓ move the active row (wrapping, the Enter key cap on it), Enter or a press asks to close and then runs the item; Escape, a press outside or the shortcut again close it and focus returns to where it was. A polite status says `countText`, `emptyText` or `loadingText`; `hint` is a footer line; `shortcut="mod+k"` listens for ⌘K (Apple) or Ctrl+K, left alone in another text field. CommandPaletteTrigger is the search-looking pill with a key hint that opens it, or its glyph alone with `compact`. 44 px targets on a coarse pointer and forced colours covered. New classes `sw-command-palette*`; invalid words, groups or items throw a `RangeError`. No new tokens or dependencies. Request: `docs/requests/futmas-command-palette.md`.
- ff103a2: `ContextSwitcher`: a button showing the context in use (a workspace, a competition, a season) that opens a non-modal popup on the top layer to switch it: an optional filter field (an ARIA combobox that narrows the options by label or detail, case and accents ignored, its empty words shown and announced), the options in groups as a listbox (each with a mark, a detail, a status `Badge` and the shared count pill, all read in its name; the current one checked and `aria-selected`), and footer commands. Arrow keys, Enter, Home/End and typeahead in the listbox; Escape closes it with focus back on the trigger; a press outside or focus leaving closes it. `triggerAppearance` `framed` (default), `text`, `pill` or `icon` (a glyph alone, named by the label and the current option); `width="full"` fills a sidebar's top; `align` start or end. 44 px targets on a coarse pointer, right-to-left and forced colours covered. New classes `sw-context-switcher*` (its count joins the shared pill as `sw-context-switcher-count`); invalid groups, options, words or props throw a `RangeError`. No new tokens or dependencies. Request: `docs/requests/futmas-context-switcher.md`.
- 82fe15a: `FixtureRow` and `FixtureGroup`: one pairing of two sides with a kickoff time (a grey chip) or a score (bold figures) between them, the home side ending at the centre and the away side starting from it, marks on the centre side, meta and a status `Badge` at the end (under the sides below `md`, `metaHideBelow` leaving the meta out below `md` or `lg`); with `href` or `onPress` the whole row is a link or a button with a chevron. `FixtureGroup` is a caption naming the run's list, one grid with each row a subgrid, so the centres line up down the run. 44 px rows, right-to-left and forced colours covered. New classes `sw-fixture-*`; invalid words or props, or a row outside a group, throw a `RangeError`. No new tokens or dependencies. Request: `docs/requests/futmas-fixture-row.md`.
- 22f1769: Behaviour change: `GlyphTile` children that are a string or a number are now letters. An empty or whitespace-only string (which used to render an empty tile) and four or more letters (which used to render, clipped) now throw a `RangeError`; a number counts by its digits, so `{12345}` throws. The letters are sized from the tile and ignore the surrounding font size.

  `GlyphTile` holds up to three letters in place of a glyph, such as initials ("NSL"): drawn in one line at weight 600, one letter at half the tile's side, two at 0.42, three at a third, so every count fits every size. A glyph child is unchanged. New classes `sw-glyph-tile-text`, `sw-glyph-tile-text-1`/`-2`/`-3`. No new tokens or dependencies. Request: `docs/requests/futmas-glyph-tile-three-letters.md`.

- 1321a50: `SiteFooter`: a public site's footer on the dark inverse band. `brand`,
  an optional `tagline`, `groups` of links (each a `nav` named by its label,
  the label shown above its links; a link's `current`, `lang` and
  `hrefLang`), and a bottom row past a hairline with `legal` at its start and
  `end` (such as a language switch) at its end. Links are the band's muted
  words, the current one its words at label weight, underlined on hover and
  focus, 44 px on a coarse pointer. Two columns of groups below `md`, one
  spread row from `md`. New classes `sw-site-footer*`; no groups, an empty
  group, blank or repeated ids, blank labels or a blank `href` throw a
  `RangeError`. No new tokens or dependencies. Request:
  `docs/requests/teisoro-site-footer.md`.
- 987e0ef: `SiteHeader`: a public site's header. The brand; from `lg` the main
  destinations as a row of links (the current one at label weight over a
  bar) and `actions` at the bar's end; below `lg` `compactActions` and a menu
  button that opens the destinations as large rows and `menuActions` under
  the bar over the window. The menu is a native `details`, so it opens and
  closes by touch, click and keyboard with no script (a server-rendered
  page); script adds Escape (focus back on the button) and closes it when a
  link is chosen, focus leaves it, a press lands outside it or the window
  widens to `lg`. Forced colours draw the current bar as a thick underline. Nothing traps focus. `labels`
  (`openMenu`, `closeMenu`) name the button by its state; `menuIcon` and
  `closeIcon` are its glyph slots; `sticky` (default `true`). New classes
  `sw-site-header*`; no items, blank or repeated ids, blank labels or hrefs,
  or blank names throw a `RangeError`. No new tokens or dependencies.
  Request: `docs/requests/teisoro-site-header.md`.
- e82df4e: `Skeleton`: grey placeholder bars where content is loading, in place of a page spinner. A polite status named by `label` (read once), the bars hidden; `variant="lines"` (default) is 1–6 bars of text with ragged ends, the last shorter, and `variant="rows"` is list rows (a mark and a bar, 44 px, hairlines between). The bars pulse gently and stay still under reduced motion; forced colours keep their edges. New classes `sw-skeleton*`; blank words, `lines` outside 1–6 or an unknown variant throw a `RangeError`. No new tokens or dependencies. Request: `docs/requests/futmas-skeleton.md`.

## 1.47.0

### Minor Changes

- 26fe8e5: `AppShell`: a web workspace's frame with a pinned side navigation of grouped destinations beside the page in `main`, which scrolls with the document. From 75rem a full sidebar (header, groups with optional captions, footer; glyph, label and count per destination, the current one on a quiet fill), sticky at the viewport's height with only its nav scrolling; from `lg` to 75rem an icon rail whose labels stay in each link's name and show in a Tooltip, the count a pill on the glyph, with `railHeader`/`railFooter`; below `lg` a sticky AppHeader `bar` whose menu button opens the same navigation in a modal drawer from the inline start (Escape, a press outside, its close button or choosing a destination close it, focus returning to the menu button). Items follow `SectionNav`'s rules plus a required `icon`; `onNavigate` takes a plain press for a client router; invalid groups, items or words throw a `RangeError`. New classes `sw-app-shell*` (the count joins the shared count pill as `sw-app-shell-count`); the 75rem width is internal, not a public breakpoint. `SectionNav` and `AppShell` now share one item validation (`nav-items.ts`); `SectionNav`'s behaviour and messages are unchanged. No new tokens or dependencies. Request: `docs/requests/futmas-app-shell.md`.
- 26fe8e5: `NavCount` `tone="warning"`: an amber count for work that needs the person but is not urgent, the warning tint with the warning ink (a warning Notice's, 4.5:1 in every palette) inside a warning edge; `navCountTones` is now `['danger', 'accent', 'warning']`. `AppShell` items take `countTone` (NavCount's tones, `danger` by default; needs a `count`). New classes `sw-nav-count-warning`, `sw-app-shell-count-accent` and `sw-app-shell-count-warning`. The default stays danger. No new tokens or dependencies. Request: `docs/requests/futmas-nav-count-warning.md`.

## 1.46.0

### Minor Changes

- f93ec57: `Button` `width`: `'content'` (the default, as before) or `'full'`, which fills the container's inline size in a `Stack`, a `Grid` cell or a column, and in an `Inline` row takes the space its siblings leave (as a full `Select` does; in a wrapping row it grows from its words and wraps), such as an Edit beside a ••• `ActionMenu` that keeps its own square at the row's end. The words stay centred. An unknown width throws a `RangeError`. New class `sw-button-full`; `ButtonWidth` and `buttonWidths` are exported. No new tokens or dependencies. Request: `docs/requests/teisoro-button-full-width.md`.
- 58bcede: `FileField` `onRemove` and `removeLabel`: Remove beside a chosen file, a neutral button after the change button in the full field, named by its words and the label ("Remove Cover photo"); the consumer clears `value` and focus moves to the empty field. `FileField` `compact`: the field at a text field's height for a form row; chosen, the thumbnail (or mark) and the name cut to one line are the change button, named by the label and `changeLabel` and described by the name and detail (read, not drawn), with Remove as a quiet button at the row's end. Set `onRemove` and `removeLabel` together (a `RangeError` otherwise, and for blank words). New classes `sw-file-field-compact`, `sw-file-field-pick`, `sw-file-field-remove` and `sw-file-field-actions`; disabled, the compact row and its Remove fade alike. A field without them renders as before. No new tokens or dependencies. Request: `docs/requests/teisoro-file-field-compact.md`.
- 0441a50: `ListGroup` `variant="tiles"`: the same one list (its name, its items and their count) with its rows laid out as tiles, each row its own bordered panel on the surface and no hairline between them, in `tileColumns` equal columns (2, 3 by default, or 4) a space-3 apart from `md` up, and one a row below it whatever `tileColumns` says, such as a strip of new arrivals. A row's press fill and inset focus ring stay inside its tile. Tiles take no `maxHeight` or `footer`, and `tileColumns` needs `tiles` (a `RangeError`, as for a count other than 2, 3 or 4). New classes `sw-list-group-tiles` and `sw-list-group-tiles-2`, `-3`, `-4`; `listTileColumnCounts` and `ListGroupTileColumns` are exported. No new tokens or dependencies. Request: `docs/requests/teisoro-list-group-tiles.md`.
- ccc2f79: `Select` `aria-labelledby`: in place of `label`, the id of words the page already draws, such as a label above a choice that is a `SegmentedControl` on a wide screen and a `Select` on a phone. The select then draws no label of its own, so a screen reader meets the words once instead of the page's words followed by the select's hidden copy; the trigger and its open list are named by them. `required` still sets `aria-required` and draws no mark. `label` and `aria-labelledby` are exclusive (a type union, and a `RangeError` for neither, a blank id, both, or `requiredMark` with `aria-labelledby`). A select with `label` renders exactly as before. **Types:** `SelectProps` is now a union (`SelectNaming`), so `label` is optional on the type. Code that reads `props.label` from a `SelectProps` narrows it first, for example a wrapper typed `SelectProps & { label: string }`, or a check `if (props.label !== undefined)`. No new classes, tokens or dependencies. Request: `docs/requests/teisoro-select-labelledby.md`.

## 1.45.0

### Minor Changes

- 4170f23: `Article` `contentLang`: the language of the title and the body (a BCP 47 tag such as `es`) when it is not the page's, set as `lang` on the title's heading and the body's box only, never the eyebrow, meta line, actions or cover, which are the app's words (WCAG 3.1.2). The article's name is unchanged. A blank `contentLang` throws a `RangeError`. No new classes, tokens or dependencies. Request: `docs/requests/teisoro-article-content-lang.md`.
- fada31f: `ListRow` `titleLang`: the title's language (a BCP 47 tag such as `es`) when it is not the page's, set as `lang` on the title's box only (its words and the wordless unread dot), never the detail, value, tag or unread words (WCAG 3.1.2). A pressable row's name and description are unchanged; it works with `truncate`. A blank `titleLang` throws a `RangeError`. No new classes, tokens or dependencies. Request: `docs/requests/teisoro-list-row-title-lang.md`.
- 8ed264e: `Step` `titleDetail`: muted words after an open step's title, on its line, such as "Optional" or "Wetlands done · Woodlands empty", at the label size and body weight in the muted colour, a space-2 after the title on its baseline or on their own line under it where they do not fit. Drawn while the step is open (current, error, or any step of `Steps open`), outside the heading, so the heading and the region keep the title's name; an open list's region is described by the words. A blank `titleDetail` throws a `RangeError`. New classes `sw-steps-title-line` and `sw-steps-title-detail`. No new tokens, no new dependency. Request: `docs/requests/teisoro-step-title-detail.md`.

### Patch Changes

- 54907b3: `Steps`: a folded step's heading reads "The site, Done", not "The site , Done" (checked against Chromium's accessibility tree; the name is one text box, so there are no two boxes to space apart). Its name is now one visually hidden line (the title, a comma and the status word) and the drawn title is `aria-hidden` on its own box; the step's region and its Edit button are still named by the drawn title, and nothing drawn changes. A current step, and a skipped step showing its reason, are unchanged. The heading's text content now holds the title twice (drawn, then in the spoken line), so a test reading a folded heading's `textContent` or finding its title with a pattern (`getByText(/The site/)`) finds both: query headings by role and name (`getByRole('heading', { name: 'The site, Done' })`). Copying a folded heading, or finding its title in the page, meets the words twice too. No new classes, tokens or dependencies. Request: `docs/requests/teisoro-steps-status-words.md`.

## 1.44.0

### Minor Changes

- 2af39a5: `ActionMenu` `triggerAppearance="icon"`: the consumer's `trigger` glyph alone in a round quiet button as wide as it is tall (the sm control height, 44 px on a coarse pointer), muted with no fill, outline or chevron, the text colour on the quiet fill on hover and while open; named by `label`, for a row's own ••• menu. An icon trigger without a glyph throws a `RangeError`. New class `sw-action-menu-trigger-icon`; `actionMenuTriggerAppearances` gains `icon`. No new tokens, no new dependency. Request: `docs/requests/teisoro-action-menu-icon-trigger.md`.
- 38a1715: `DescriptionList` `layout`: `columns` (the default, unchanged) or `spread`, each row's term at its start and its detail at its end, end-aligned, side by side at every width, for a short box of facts. New class `sw-description-list-spread`, new exports `descriptionListLayouts` and `DescriptionListLayout`; an unknown layout throws a `RangeError`. No new tokens, no new dependency. Request: `docs/requests/teisoro-description-list-spread.md`.
- f426251: `FileField` `value.preview`: the address of a small image of a chosen photo, such as an object URL the consumer made from the `File`, drawn as a decorative 3:2 thumbnail (a space-8 by a space-6, cropped to fill, at the small radius) before the file's name in place of `icon`. A blank preview throws a `RangeError`. New class `sw-file-field-preview`. No new tokens, no new dependency. Request: `docs/requests/teisoro-file-field-preview.md`.
- 76ae2b4: `FilterChips` option `tone`: `neutral` (the default, unchanged) or `warning`, which draws that chip, while it is not chosen, in the warning tint with its words and count in the warning ink (a warning `Notice`'s, 4.5:1 in every palette and scheme); chosen it is the accent and at a zero count quiet, like every chip. New class `sw-filter-chip-warning`, new exports `filterChipTones` and `FilterChipTone`; an unknown tone throws a `RangeError`. No new tokens, no new dependency. Request: `docs/requests/teisoro-filter-chip-tone.md`.
- 49f90af: `FilterChipsRow`: several `FilterChips` groups on one row, each keeping its own name, choices and Tab stops, an optional `end` group at the row's end (at its own line's end when the row wraps), and `overflow` `wrap` (the default) or `scroll`, where every group's chips stay on one row that scrolls sideways together inside the row's own box, never the page, a group's own scroll giving way. New classes `sw-filter-chips-row`, `sw-filter-chips-row-end`, `sw-filter-chips-row-scroll`; new exports `FilterChipsRow` and `FilterChipsRowProps`; an unknown overflow throws a `RangeError`. The private slot check `hasSlot` moved from the list rows to `components/slot.ts`, shared by both. No new tokens, no new dependency. Request: `docs/requests/teisoro-filter-chips-row.md`.
- a6c790c: `ListRow` `truncate`: opt-in, keeps the title and the detail line to one line each, cut with "…" where they do not fit; the unread dot follows the cut words, the whole words stay in the row's name, description and a `title` tooltip, and the value, tag and action keep their words whole. New classes `sw-list-row-truncate` and `sw-list-row-title-text`. Rows without it are unchanged. No new tokens, no new dependency. Request: `docs/requests/teisoro-list-row-truncate.md`.
- d4647b8: `sw-container-reading`: a utility class that centres a column at the reading width (`--sw-reading-max`, 46rem, `Article`'s), as `sw-container` does at the container width, and full width below it; for a form or text that reads better narrower than the page. No new tokens, no new dependency. Request: `docs/requests/teisoro-container-reading.md`.
- 7da3f25: `sw-font-mono`: a utility class that sets an element, or a native text control such as a `Field`'s `textarea`, in the platform's monospace face (`ui-monospace, monospace`, the generic CSS names only, so no face is chosen) at the size it already has, outranking the canvas's text control rules. For words read as typed code or marks, such as a Markdown source being written. No new tokens, no new dependency. Request: `docs/requests/teisoro-font-mono.md`.

### Patch Changes

- 68be1ea: `ListRow` `truncate`: the one-line rule for the title's words box (`sw-list-row-title-text`) is scoped to truncated rows (`.sw-list-row-truncate .sw-list-row-title-text`), as the detail's already was; a truncated row looks the same.

## 1.43.0

Not published: its release validation failed before publication (a gallery test timed out, fixed in #211). Its changes ship in 1.44.0, listed there.

## 1.42.0

### Minor Changes

- 5218882: `Article`: a page that reads like a post, on a card (`variant`, as `Card`'s) no wider than the new `--sw-reading-max` (46rem): an optional `cover` photo (`{ src, alt }` or `null`) edge to edge across the top, the `eyebrow` with the consumer's `actions` at its row's end, the `title` in heading type (`titleAs` `h1`, `h2` or `h3`; it names the `article` landmark, which the ref reaches), the muted `meta` line, a hairline and the body. New exports `Article`, `ArticleProps`, `ArticleCover`, `ArticleTitleElement`, `articleTitleElements`; new `sw-article*` classes. No new tokens, no new dependency. Request: `docs/requests/teisoro-article.md`.
- 6befd6c: `DocumentViewer`: a PDF drawn from its bytes (never a URL) one page at a time with PDF.js, fitted to its width, with 48-point previous and next steps around "Page n of m" in a polite live region, pinch and `+`/`-`/`0` zoom, a transparent text layer for assistive technology and selection, the consumer's loading and failed words and actions, and no download or print of its own. New exports `DocumentViewer`, `DocumentViewerProps`, `DocumentViewerLabels`; new export path `@scalewing/react/document-viewer-worker` (the PDF.js worker entry, bundled by the consumer, such as Vite's `?worker&url`); new `sw-document-viewer*` classes.

  New production dependency: `pdfjs-dist` 6.4.299, pinned exactly. Rationale: drawing PDFs needs a full parser and renderer, and PDF.js (Mozilla, Apache-2.0) is the maintained browser-grade one, at the version a server checking the same uploads can pin too. It is loaded with a dynamic import only when a viewer opens a document, its legacy build is used for older browsers, and it runs hardened: nothing fetched beyond the bytes, no eval, no XFA, no scripting. Its optional `@napi-rs/canvas` (Node only, 28 to 35 MB per platform) is never loaded in a browser and can be skipped with pnpm's `ignoredOptionalDependencies`; `pdfjs-dist` asks for Node 22.13 or later. Request: `docs/requests/teisoro-document-viewer.md`.

- d387481: `FileField`: one file chosen with the system picker or dropped on the field, with `Field`'s label, description and error. Empty, a wide zone named by the label and `chooseLabel` (`dropLabel` after it where the pointer can drag); chosen (`value={{ name, detail }}`), the file's name and detail with the consumer's `icon` and a `changeLabel` button. `onChange` receives the `File`; nothing is read or uploaded, and a dropped file is not filtered by `accept`. New exports `FileField`, `FileFieldProps`, `FileFieldValue`; new `sw-file-field*` classes. No new tokens, no new dependency. Request: `docs/requests/teisoro-file-field.md`.
- 33a6d6e: `ListRow` `unread` / `unreadLabel`, `tag` and `action`: an accent dot after the title for a row the person has not opened, read as `unreadLabel` after the title (required while `unread`); a short status such as a `Badge` before the row's end, describing a pressable row; and a control such as an `ActionMenu` after the row, outside its press area, in the same list item. New classes `sw-list-row-unread`, `sw-list-row-tag`, `sw-list-item-action`, `sw-list-row-action`; an unread row without words throws a `RangeError`. Existing rows are unchanged, except that an empty `leading` (`null`, `false` or `''`, as `leading={isLate && <Dot />}` gives) no longer draws an empty mark box and its gap before the title. No new tokens, no new dependency. Request: `docs/requests/teisoro-list-row-trailing.md`.
- f027566: `MarkdownView` (`newTabLabel` required): Markdown drawn in Scalewing's type as React elements, never as HTML from a string: paragraphs, headings (`#` as an `h2`, with ids from their words and an optional `idPrefix`), lists, bold, italic, links (`http`, `https` and `mailto` only, read as the browser would, in a new tab with `rel="noopener noreferrer"`; reference links and autolinks too; any other scheme shows as plain words), block quotes as a highlighted box, line breaks, thematic breaks and `![caption](photo:<id>)` photos the consumer resolves (`resolveImage`) to a safe address, with words (their alt or caption) and captions. Raw HTML, scripts, tables, other images and unresolved or wordless photos are left out, code is shown as plain text, and quotes, lists and marks nested past 16 levels are shown as their words; the reading is linear, so a realistic 50,000-character page reads in about 7 ms and the slowest crafted one in about a tenth of a second. `inspectMarkdown(source, options)` returns the `headings` (for an "On this page" list), the first 100 `omissions` and `omissionCounts` (for an editor to say what will not be shown), refusing what the view refuses. New exports `MarkdownView`, `MarkdownViewProps`, `MarkdownOptions`, `inspectMarkdown`, `MarkdownInspection`, `MarkdownHeading`, `MarkdownImage`, `MarkdownImageResolver`, `MarkdownOmission`, `MarkdownOmissionKind`, `MarkdownOmissionCounts`, `markdownOmissionKinds`; new `sw-markdown*` classes. New production dependency, pinned exactly: `markdown-it` 14.3.2 (MIT; a CommonMark parser to tokens, linear in the text with capped nesting; its HTML renderer is never used), about 53 kB gzip, loaded only by apps that import the view. Request: `docs/requests/teisoro-markdown-view.md`.
- 8f70607: `NavCount` `tone?: 'danger' | 'accent'` (default `danger`): `accent` draws the count pill in the accent colour with its on-colour figures, for a count that is news (what was added since the person last looked) rather than work waiting. New exports `navCountTones`, `NavCountTone`; new class `sw-nav-count-accent`; an unknown tone throws a `RangeError`. Existing counts are unchanged. No new tokens, no new dependency. Request: `docs/requests/teisoro-nav-count-tone.md`.

## 1.41.0

### Minor Changes

- f6bce98: `BarChart`: an item `tone="neutral"` (the muted grey, 3:1 against the track and the surface in every palette; `barChartTones` gains `neutral`) and `appearance="bare"` (`BarChartAppearance`, `barChartAppearances`; default `track`), the bars alone with no track and no value axis. An unknown appearance throws a `RangeError`. New class `sw-bar-chart-bare`; no new tokens or dependencies. Request: `docs/requests/teisoro-bar-chart-bare.md`.
- 2f34b46: `ThemeProvider` `canvas="grouped"` (`ThemeCanvas`, `themeCanvases`; default `default`, unchanged): an opt-in grey page tone so white cards stand apart, written as `data-canvas="grouped"` on the themed node. The generated canvas declares `--sw-canvas-grouped` (light: the background with 7 % of the muted colour; dark: the background) and paints it only where a canvas asks for it. The text and muted colours keep 4.5:1 on it in every palette; keep links and accent words in the cards. An unknown value throws a `RangeError`. New public CSS hooks: the `data-canvas` attribute and the `--sw-canvas-grouped` custom property. No new tokens, classes or dependencies. Request: `docs/requests/teisoro-canvas-grouped.md`.
- 9c6078b: `DateField` `entry="calendar"` (`DateFieldEntry`, `dateFieldEntries`; default `typed`, unchanged): a day-picker field, one neutral field-shaped `Button` showing the calendar glyph and the chosen day in the locale's medium style, or `labels.chooseDate` while empty, that opens the same calendar. It is named by the label and its words and described by `description` and `error`; a required one is described by the new `labels.required` ("Required"). The consumer's `error` reports a missing day. An unknown entry throws a `RangeError`. New classes `sw-date-field-calendar-entry`, `sw-date-field-calendar-entry-text` and `sw-date-field-calendar-entry-invalid`; no new tokens or dependencies. Request: `docs/requests/teisoro-date-field-calendar-entry.md`.
- 995cb76: `DenominationGrid`: a row's `negativeAppearance="plain"` (`DenominationGridNegativeAppearance`, `denominationNegativeAppearances`; default `danger`) sets its negative counts in the text colour with their minus, for counts going out by design; `transposeBelow` (`'md' | 'lg'`, `DenominationTransposeBreakpoint`, `denominationTransposeBreakpoints`; strip only) draws the strip below that width with a row per denomination and a column per grid row, entry, value lines and totals kept; `countDigits` (3 to 6, entry rows only) keeps that many digits' room in entry counts. A signed count's cell also takes `sw-denomination-cell-signed`. Unknown values, `transposeBelow` on tiles and `countDigits` out of range or without entry rows throw a `RangeError`. New classes `sw-denomination-cell-signed`, `sw-denomination-cell-plain`, `sw-denomination-count-digits` and the `sw-denomination-transposed*` family; no new tokens or dependencies. Request: `docs/requests/teisoro-denomination-grid-board.md`.
- 9ad24d3: `Dialog` gets three options:

  - `status` (a line beside the actions, in the footer's polite live region);
  - `canvas="grouped"` (`ThemeCanvas`; the grouped canvas grey fill, solid, so cards stand apart);
  - `sheetGrabber` (a decorative grabber on the bottom sheet; needs `sheetBelow`).

  An `ActionBar` or `Dialog` `summary` whose `value` is empty no longer throws. It means there is no figure yet: the line is left out and the live region stays, so the first figure is still announced.

  New classes: `sw-dialog-footer-note`, `sw-dialog-canvas-grouped`, `sw-dialog-grabber` and `sw-dialog-has-grabber`. New stacking layer `sheetGrabber`. No new tokens or dependencies. Request: `docs/requests/teisoro-dialog-board.md`.

- 594a9c7: `Field` `width` (`FieldWidth`, `fieldWidths`: `xs` 4rem, `sm` 6rem, `md` 8rem, `lg` 12rem, `xl` 16rem, the Table column sizes): caps the control (or an adorned or search field's frame) at that width at the column's start, never wider than the column, so a short value does not stretch across a form; the label and messages keep the column. Left out, nothing changes. It needs one native text control or select child (a `TypeError` otherwise); an unknown width throws a `RangeError`. New classes `sw-field-sized` and `sw-field-width-*`; no new tokens or dependencies. Request: `docs/requests/teisoro-field-width.md`.
- 74d6db2: `FilterChips` gains four opt-in options: `labelVisuallyHidden` (the label stays the group's name, not drawn); `countAppearance="inline"` (`FilterChipCountAppearance`, `filterChipCountAppearances`; default `figure`), the count in the chip's words after a hidden middle dot; `overflow="scroll"` (`FilterChipsOverflow`, `filterChipsOverflows`; default `wrap`), one row that scrolls sideways inside its own box; and `multiple` with a `value` list and `onChange(values)`, each chip a checkbox and its own Tab stop (a multiple group cannot be `required`). Unknown values, a multiple value that is not a list or holds a value that is no option, and `required` with `multiple` throw a `RangeError`. New classes `sw-filter-chip-count-inline` and `sw-filter-chips-scroll`; no new tokens or dependencies. Request: `docs/requests/teisoro-filter-chips-board.md`.
- 7cd729f: `SegmentedControl` `fullWidthBelow` and an attached `ButtonGroup` `fullWidthBelow` (the layout `Breakpoint`, `md`): below it the control fills its column, its segments or buttons sharing the width equally; from it up nothing changes. `SegmentedControl` `size="sm"` (`SegmentedSize`, `segmentedSizes`; default `md`) pads each segment a step less and keeps its label on one line with an ellipsis past its share. Unknown values, and `fullWidthBelow` on a group that is not attached, throw a `RangeError`. New classes `sw-segmented-field-full-below-md`, `sw-segmented-sm` and `sw-button-group-full-below-md`; no new tokens or dependencies. Request: `docs/requests/teisoro-full-width-controls.md`.
- a044de3: `ListRow` `valueTone="warning"` (the warning colour's ink, halfway to the text colour, 4.5:1 on the surface in every palette; `listRowValueTones` gains `warning`) and `valueBadge` (a `BadgeTone`: the value drawn as a Badge at the row's end, still in the row's name; needs a value, never with `valueTone`). New class `sw-list-row-value-warning`; no new tokens or dependencies. The refusal for a value option without a value now reads "ListRow valueDetail, valueTone and valueBadge need a value". Request: `docs/requests/teisoro-list-row-value.md`.
- 0d0b1bd: `Switch` `layout="trailing"` (`SwitchLayout`, `switchLayouts`; default `leading`): the words first and the control at the end of a full-width row; and `checkedTone="success"` (`SwitchCheckedTone`, `switchCheckedTones`; default `accent`): the success track while on, `Highlight` in forced colours. Unknown values throw a `RangeError`. New classes `sw-switch-trailing` and `sw-switch-success`; no new tokens or dependencies. Request: `docs/requests/teisoro-switch-trailing.md`.

## 1.40.0

### Minor Changes

- 935ff2a: `DateRangeButton`: a button showing a range of days (`value` `{ start, end }`, `YYYY-MM-DD`) that opens a calendar to pick a first and a last day. From `md` up it is a popover with the `presets` (`DateRangePreset`: `id`, `label`, `range`; a press applies it at once) beside two months (above them below `lg`), the range being picked in a polite status, and Cancel and Apply; below `md` it is a Dialog bottom sheet with the presets in a row and one month. The first press sets the start and the second the end; days after `max` are disabled, and once a start is pressed so are the days past `maxDays`. Apply calls `onChange` with a changed range; Cancel, Escape, a press outside and the sheet's close keep the value. Its name is `label`, `labels.nameSeparator` and the range it shows. `labels` (`DateRangeButtonLabels`) holds every word, `dayCount` included; `min`, `today`, `weekStartsOn`, `locale`, `disabled`, `id`, `size` and `variant` (default `neutral`) as on CalendarButton. Input it cannot draw throws a `RangeError`. New exports `DateRangeButton`, `DateRangeButtonProps`, `DateRangeButtonValue`, `DateRangePreset`, `DateRangeButtonLabels`; new `sw-date-range-*` classes. It shares CalendarButton's private calendar grid, popover and month steps, whose public behaviour is unchanged. `ButtonGroup attached` now finds its buttons by type, so an open calendar beside one keeps the group's dividers and corners. No new tokens, no new dependency. Request: `docs/requests/teisoro-date-range-button.md`.
- 3192e17: Web `ListGroup` and `ListRow`, the counterpart of react-native's. `ListGroup` is a list (`ul`, role kept) of rows with hairlines between them, a bordered `panel` or `plain` rows inside a surface, named by `aria-label` or `aria-labelledby`; `maxHeight` (`{ rows }`) bounds it to rows of a title and one detail line that scroll inside a named, focusable region shaded at an edge with more past it, and `footer` stays pinned under the rows, such as a total. `ListRow` has a `title` (`titleAppearance` `strong` or `plain`, `tone` `danger`), a muted `detail`, a `value` with `valueDetail` and `valueTone` (a table cell's tones) and a hidden `leading` mark; `onPress` or `href` makes the whole row a button or link with a chevron, named by its title and value and described by its details (`href` with `onPress` takes a plain press for a client router); `selected` makes it a choice with a check (`aria-pressed` or `aria-current`); `accessory="none"` hides the chevron; `disabled` blocks presses. Input it cannot draw throws a `RangeError`. New exports `ListGroup`, `ListGroupProps`, `ListRow`, `ListRowProps`, `listGroupVariants`, `listRowTones`, `listRowTitleAppearances`, `listRowValueTones`, `ListGroupMaxHeight`, `ListGroupVariant`, `ListRowTone`, `ListRowTitleAppearance`, `ListRowValueTone`; new `sw-list*` classes; no new tokens, no new dependency. Request: `docs/requests/teisoro-list-group.md`.
- 1d3fafd: `NavCount`: a count after a Nav destination's words, placed inside its link or Button (`<a href="/tasks">Tasks<NavCount count={8} /></a>`), such as the tasks waiting in an area. It is SectionNav's count pill, now one shared rule, and it is read in the destination's name ("Tasks 8"); `countLabel` is read in place of the bare number ("Tasks 8 tasks to do") with the pill hidden from assistive technology; a `count` of 0 shows nothing. A count that is not a whole number from 0 or a blank `countLabel` throws a `RangeError`. New exports `NavCount`, `NavCountProps`; new class `sw-nav-count`; no new tokens, no new dependency. Request: `docs/requests/teisoro-nav-count.md`.
- 62c33b1: `StatTile` `appearance="plain"` (`StatTileAppearance`, `statTileAppearances`; default `card`): the figure without the tile's surface, edge, radius or padding, top-aligned, for figures inside a card, such as four answers in a row divided by a composed `Separator`. A plain tile cannot be `emphasis="primary"`; that or an unknown appearance throws a `RangeError`. New class `sw-stat-tile-plain`; no new tokens, no new dependency. Request: `docs/requests/teisoro-stat-tile-plain.md`.

## 1.39.0

### Minor Changes

- 9a3234b: `ChartLegend`: a chart's key, a list (`role="list"` kept) of items, each an `aria-hidden` swatch and its words, in a wrapping row in the caption type. `items` (`ChartLegendItem[]`) take a `label`, a `swatch` (`ChartLegendSwatch`: `bar`, `line`, `marker` as a downward triangle, `box` as the boxed current period's dashed outline) and a `tone`: a `bar` a fill tone (`ChartFillTone`: the categorical colours, and `DataBar`'s statement tones), the others a stroke tone (`ChartStrokeTone`: `accent`, `success`, `warning`, `danger`, `neutral`); anything else, or an empty label, throws a `RangeError`. Every chart mark reads one tone table (`sw-chart-tone-<tone>` classes handing `--sw-chart-fill`, `--sw-chart-stroke` and `--sw-chart-ink` to the marks inside), so a swatch is the colour of the mark it names; fills keep 1.5:1, strokes 3:1 and inks 4.5:1 on the surface in every palette and scheme. `DataBar`'s fills now come from that table, unchanged. Forced colours draw every swatch in the system text colour. New exports `ChartLegend`, `ChartLegendProps`, `ChartLegendItem`, `ChartLegendSwatch`, `chartLegendSwatches`, `ChartTone`, `ChartFillTone`, `chartFillTones`, `ChartStrokeTone`, `chartStrokeTones`; new classes `sw-chart-legend`, `sw-chart-legend-item`, `sw-chart-legend-swatch`, `sw-chart-legend-<swatch>` and `sw-chart-tone-<tone>`; no new tokens, no new dependency. Request: `docs/requests/teisoro-chart-legend.md`.
- 2eb7b03: `ColumnChart`: columns for each of its `categories`, one per series (`ColumnChartSeries`: `id`, `label`, a value per category, a categorical `tone`), `mode` `'stacked'` (positives up from zero, negatives down) or `'grouped'` (side by side), with an optional accent `line` (`ColumnChartLine`, such as a running total) on its own right-hand scale whose zero and grid lines are level with the columns' and whose last value is written beside that axis (`endLabel`), a boxed `highlight` (the current period) and `callouts` (`ColumnChartCallout`) pinned above a column with a dashed leader. `formatValue` writes the figures and `formatTick` the axes. It is an SVG laid out for the width it measures: under 480 px it is shorter, labels fewer categories and lists its callouts under the plot, never scrolling sideways. The drawing is `aria-hidden`; a visually hidden table captioned by `label` carries every figure, the boxed row `aria-current`, and the callouts stay a list. Colours come from the chart tones (ChartLegend's), and forced colours use system colours. Input it cannot draw throws a `RangeError`. New exports `ColumnChart`, `ColumnChartProps`, `ColumnChartSeries`, `ColumnChartLine`, `ColumnChartCallout`, `ColumnChartMode`, `columnChartModes`; new `sw-chart-*` plot classes (`sw-chart`, `sw-chart-svg`, `sw-chart-tick`, `sw-chart-tick-line`, `sw-chart-category`, `sw-chart-grid`, `sw-chart-zero`, `sw-chart-highlight`, `sw-chart-line`, `sw-chart-dot`, `sw-chart-end-label`, `sw-chart-leader`, `sw-chart-callout-text`, `sw-chart-column`, `sw-chart-callouts`, `sw-chart-callout`, `sw-chart-callout-dot`); no new tokens, no new dependency. Request: `docs/requests/teisoro-column-chart.md`.
- 8dcd928: `DataBar` `tone="danger"`: a light red range bar for a shortage, never for cash leaving (money out stays `muted`). `DataBarTone` and `dataBarTones` gain `'danger'`, last; its fill is the danger colour at 40 % mixed into the surface, at 1.5:1 or more on it in every palette and scheme like every tone, and red beside the grey of money out. The shared chart fill tones gain it too, so a `ChartLegend` `bar` swatch can name it. New class `sw-data-bar-danger`; no other tone changes; no new tokens, no new dependency. Request: `docs/requests/teisoro-data-bar-short.md`.
- 88d1b95: `LineChart`: a value over time, `points` (`LineChartPoint`: a `YYYY-MM-DD` `x` and a value `y`, in date order) placed by the days between them, `curve` `'linear'` or `'step'` (each value held until the next date), an optional `area` tinted from the line's stroke `tone` (default `accent`), `markers` (`LineChartMarker`: a downward triangle and words at one of the points' dates, in a stroke tone; words that would meet are left out of the drawing) with `markersLabel` heading their table column, `ticks` (the dates the time axis labels, thinned from the last), a boxed `highlight` period (`LineChartPeriod`), the last value beside the plot (`endLabel`), and `formatValue`, `formatTick` and `formatDate`. It is laid out for its measured width like ColumnChart, never scrolling sideways; the drawing is `aria-hidden` and a visually hidden table captioned by `label` (its value column `valueLabel`) carries every date, value and marker, the boxed rows `aria-current`. Input it cannot draw throws a `RangeError`. New exports `LineChart`, `LineChartProps`, `LineChartPoint`, `LineChartMarker`, `LineChartPeriod`, `LineChartCurve`, `lineChartCurves`; new classes `sw-chart-area`, `sw-chart-marker`, `sw-chart-marker-label`; no new tokens, no new dependency. Request: `docs/requests/teisoro-line-chart.md`.

## 1.38.0

### Minor Changes

- ac063ea: `DataBar`: a decorative (`aria-hidden`) horizontal range bar for a table cell or a list row, from `from` to `to` on a track whose domain runs from `min` to `max`, such as where a statement's line leaves the running total. A domain from below zero to above it draws a zero line, so a column of differences diverges around it, the bar's end at zero square. `tone` (`DataBarTone`: `neutral`, `success`, `muted`, `strong`, `accent`; no danger tone, money out is `muted`) colours it from the semantic colours mixed into the surface. Values past the domain are clamped; non-finite numbers, a `min` not under `max` and an unknown tone throw a `RangeError`. The bar follows the writing direction and is drawn in the system text colour in forced colours. New exports `DataBar`, `DataBarProps`, `DataBarTone`, `dataBarTones`; new classes `sw-data-bar`, `sw-data-bar-fill`, `sw-data-bar-diverging`, `sw-data-bar-zero-start`, `sw-data-bar-zero-end` and `sw-data-bar-<tone>`; no new tokens, no new dependency. Request: `docs/requests/teisoro-data-bar.md`.
- b95f9ea: `Pagination`: previous and next steps through a list shown a page at a time, in a `nav` landmark named by `aria-label` or `aria-labelledby`. It shows the consumer's `rangeLabel` (such as "1–25 of 130 changes") at the inline start, a polite live region, and the steps at the end: icon-only neutral `sm` Buttons named by `labels` (`PaginationLabels`: `previous`, `next`), square, 44 px on a coarse pointer, with a private chevron mirrored right to left. `page` and `pageCount` count from 1 and `onPageChange` receives the page a step goes to. At either end a step is `aria-disabled` (the neutral grey) but stays a Tab stop, so focus is not dropped at the last page, and a press there does nothing. Invalid pages or an empty step label (`labels.previous` or `labels.next`) throw a `RangeError`. New exports `Pagination`, `PaginationProps`, `PaginationLabels`; new classes `sw-pagination`, `sw-pagination-range`, `sw-pagination-steps`, `sw-pagination-step`, `sw-pagination-glyph`, `sw-pagination-glyph-previous` and `sw-pagination-glyph-next`; no new tokens, no new dependency. Request: `docs/requests/teisoro-pagination.md`.
- 744ed13: `Table` `maxHeight` (opt-in): bounds a table's height by a row count, `{ rows: number }` (new type `TableMaxHeight`), and the rest of the rows scroll inside the table's own region. The region is as tall as that many single-line body rows plus the header row and the footer row when there is one, from the type and spacing tokens the cells are drawn with (compact density included; a sorting header as tall as its buttons, the 44 px touch target on a coarse pointer). The header pins to the region's top and a `TableFooter sticky` total to its bottom; the region stays a keyboard stop named after the table, and an edge with rows scrolled past it draws the scroll shade, cast from the pinned header or total, or from the region's own edge where nothing is pinned (none in forced colours). While the region has keyboard focus, the pinned header and total carry the part of its focus ring they cover. Printed, every row shows. Page pinning (`stickyHeader="page"`, a sticky footer in a table that fits) is unchanged for tables without `maxHeight`; with it, `stickyHeader` `'page'` or `false` throw a `RangeError`, as does a row count that is not a whole number from 1. New classes `sw-table-bounded`, `sw-scroll-more-top` and `sw-scroll-more-bottom`; no new tokens, no new dependency. Request: `docs/requests/teisoro-table-contained-scroll.md`.
- b638b5e: `TableRow` `variant="total"`: a total mid-table, such as a subtotal the rows above add up to before the table goes on. Its cells are at weight 600 under a 2 px rule across its top (the cells' own collapsed border, kept in forced colours), as a `TableFooter` total is drawn, with no fill, so accent text keeps the contrast it has on the table's own surface. `tableRowVariants` is now `['default', 'sub', 'total']`. New class `sw-table-row-total`; no new tokens, no new dependency. Request: `docs/requests/teisoro-table-row-total.md`.

## 1.37.0

### Minor Changes

- a9e2447: `DenominationGrid` row `valueRow` (opt-in, strip layout): a line right under a row that gives each column's value, such as the money its count adds up to. It is its own table row on the subtle fill, named in the label column (`label`), each consumer-formatted value centred under its count in tabular figures (`null` or `''` blank), with the row's `total` moved onto it; each typed count is described by the value under it, which is no tab stop. `Stepper` gains `aria-describedby` (ids read before its error). The grid still does no arithmetic or currency formatting. New classes `sw-denomination-value-row` and `sw-denomination-value`; no new tokens, no new dependency. Request: `docs/requests/teisoro-denomination-value-row.md`.

## 1.36.0

### Minor Changes

- bc5d37c: A `Button` with `aria-disabled="true"` now looks disabled (`docs/requests/teisoro-button-aria-disabled.md`, Teisoro F-011 task 2210): the faded look, or with `disabledAppearance="neutral"` the neutral grey, and `GrayText` in forced colors, while it stays focusable and its `onPress` still runs, for a submit that, pressed while off, takes the person to what is missing. No new prop, token, class or dependency.
- 3d431f7: `Steps` `open` shows every step's fields at once (`docs/requests/teisoro-steps-open.md`, Teisoro F-011 task 2210): each step is a region named by its title, its marker still following its status (a number to fill, a check when done, "!" in error, a grey ring when greyed), every title at the open size, no step `aria-current` and no focus moved when a status changes. Off by default; a list without `open` is unchanged. New generated classes `sw-steps-open` and `sw-steps-region`. No new tokens, no new dependency.

### Patch Changes

- 743a7a0: Every press control and link now renders an explicit `tabindex="0"` (Teisoro F-011 task 2205), so Safari users reach it with Tab: Safari's default leaves a `<button>`, a link, a checkbox and a radio out of the Tab order unless it carries a `tabindex`, so Tab from a field went past them to the address bar. Covered: `Button` (with `CalendarButton` and `InfoTip`), `Box as="a"` with an `href`, `SectionNav` links, the `Select`, `MultiSelect` and `ActionMenu` triggers, `SegmentedControl` items, `DateField`'s calendar button and month steps, a search `Field`'s clear button, `Table` sort and `TableCell onPress` buttons, `Checkbox` (and `MultiSelect`'s rows), `Switch`, and the checked (else first enabled) radio of a `RadioGroup` or `FilterChips`. A consumer's `tabIndex` wins; a `Stepper`'s − and + and roving items keep their `-1`. No new prop, class or token, no new dependency.

## 1.35.1

### Patch Changes

- 521903d: `Table` `stickyHeader` (`true` or `'page'`) now pins the whole `TableHeader` as one group (Teisoro F-011 task 2200): the `thead` is sticky, not each `thead th`, so a row under the column headings (such as a running total) stays in view right under them with all its cells, `td` as well as `th`, where before only its `th` pinned (at the same edge as the headings) and its `td` cells scrolled away. Every pinned head cell is on the glass (solid under Reduce Transparency, the system canvas in forced colours) and draws its row rule on its own `::before` instead of a collapsed bottom border, which stayed behind as the row moved and left a gap the rows under it showed through. No public API change, no new class, no new tokens, no new dependency.

## 1.35.0

### Minor Changes

- 287d933: `Table` `stickyHeader="page"` pins the header row to the page's top while the page scrolls, without a sticky `TableFooter` (`docs/requests/teisoro-table-sticky-page.md`, Teisoro F-011 task 2180). While the table fits its width its region stops being a scroll box, as it already did for a sticky footer; a table wider than its region scrolls sideways in it and pins inside it. `true` (the default) and `false` are unchanged; any other value (including an untyped `null` or `0`, which used to mean not sticky) throws a `RangeError`. New type `TableStickyHeader` and generated class `sw-table-sticky-page`. No new tokens, no new dependency.

## 1.34.0

### Minor Changes

- 7e4cbb2: A whole-row press for a table row's one action, such as a search result that is picked (`docs/requests/teisoro-table-row-press.md`, Teisoro F-011 task 2185):

  - `TableRow pressable` (opt-in): a plain primary pointer press anywhere on the row activates the row's first link or button. A press with a modifier key, on another control in the row, already handled, or ending a text selection is left alone, as is a row whose action is disabled. The row is not a control (no role, no tab stop): keyboard and screen reader users use the action itself. The row takes the pointer cursor and the quiet fill while hovered, pressed, or while its action has keyboard focus (an outline in `Highlight` under forced colours), and underlines its action on hover.
  - `TableCell onPress` (a body cell or a row header): the cell's children become a button in the cell's own text style at weight 600, underlined on hover and focus, for the row's action. A non-function value or one on a sortable header throws a `TypeError`.

  New generated classes `sw-table-row-press` and `sw-table-action`. No new tokens, no new dependency.

## 1.33.1

### Patch Changes

- 2a52f01: `Split` no longer widens the page in a narrow container. The split is now at most its container's width less the split minimum (`max-width: calc(100% - var(--sw-split-min))`), so the next column keeps 14rem and the start pane shrinks below its 22rem default instead of running past the container. Before, at 390 px the pane kept 22rem, the next column got no width and its words pushed the page out sideways (the gallery measured 481 px; found by Teisoro F-011). The drag and keyboard range follows the same room: the pane's maximum is the container less the handle and the next column's minimum (as before), and when that room is under the minimum the range narrows to it, so a gesture starts from the width on screen, a move to the end never collapses or jumps the pane, and one step to the start collapses it. The pane keeps the width the reader chose (a collapse never overwrites it) and shows it held to the container's range, so a pane expanded after the container widens shows at least its minimum. The separator's `aria-valuenow` reports the width that shows (100 when the container leaves no range) and follows container resizes. No API, class or token changes.

## 1.33.0

### Minor Changes

- 3a3dbf6: A quiet link look for a title that opens something, such as a table row's title (`docs/requests/teisoro-box-link-quiet.md`, Teisoro F-011 task 2145):

  - `Box` `link` (`BoxLink`, `boxLinkAppearances`): `'accent'` (default, unchanged: the canvas link) or `'quiet'`, which keeps the surrounding text's colour at weight 600 and underlines on hover and keyboard focus. Its weight is the non-colour cue (WCAG 1.4.1), so it is for text lighter than 600; axe's `link-in-text-block` passes it on colour (the same colour and background as its text) or on its weight, and an accent link in body text that falls under 3:1 fails it. Only for `as="a"` (otherwise a `TypeError`); an unknown value throws a `RangeError`.

  New generated class `sw-link-quiet`. No new tokens. The gallery adds `axe-core` (4.13.0, already in the lockfile through `eslint-plugin-jsx-a11y`) as an exact-pinned dev dependency for its accessibility check (pinned to the version the lockfile already holds, so nothing new is fetched); no production dependency.

### Patch Changes

- f3f318e: A scroll region (`Table`'s wrapper, the `DenominationGrid` strip) is now `position: relative`, so it is the containing block of anything absolutely placed inside it that no nearer box holds, such as a visually hidden label (`sw-sr-only`) or a field's hidden name in a cell past the region's edge. Before, such a label was placed against the page and widened it on a phone while the table scrolled sideways (reported by Teisoro F-011, an inline edit in a table row at 390 px). Anything absolutely placed in a table with no positioned box in between now anchors to the table's region and scrolls with it, rather than to a positioned box outside the table (or the page). No API, class or token changes.

## 1.32.0

### Minor Changes

- 2e203ef: `ActionMenu` `triggerAppearance` (`ActionMenuTriggerAppearance`, `actionMenuTriggerAppearances`): `'framed'` (default, unchanged) or `'text'`, an unframed trigger drawn as its words and a chevron in the text color, the quiet fill on hover and while open, the sm height with the 44 px coarse-pointer target (`docs/requests/teisoro-action-menu-text-trigger.md`, Teisoro F-011 release R6, S17 shell). An unknown value throws a `RangeError`. New generated class `sw-action-menu-trigger-text`. No new tokens or dependencies.
- 36e9de7: A full-width bar look for page chrome, opt-in (`docs/requests/teisoro-app-header-bar.md`, `docs/requests/teisoro-box-border-bottom.md`, Teisoro F-011 release R6):

  - `AppHeader` `appearance` (`AppHeaderAppearance`, `appHeaderAppearances`): `'glass'` (default, unchanged) or `'bar'`, a full-width band of the solid surface with the border hairline under it, no blur, rounding, side or top border. An unknown value throws a `RangeError`.
  - `Box` `border="bottom"` draws only the hairline under the box, for a sub-bar under the header. Every `Box`-based component takes it.

  New generated classes `sw-app-header-bar`, `sw-border-bottom`. No new tokens or dependencies.

- d0eabcd: `ButtonGroup` `appearance` (`ButtonGroupAppearance`, `buttonGroupAppearances`): `'default'` (unchanged) or `'track'`, an attached group's buttons as words in the text color on one quiet grey track with a border hairline between them, whatever their variant (`docs/requests/teisoro-button-group-track.md`, Teisoro F-011 release R6, S17 shell; closes the "attached day buttons as separate filled buttons" item of D-37). An unknown value, or `track` without `attached`, throws a `RangeError`. New generated class `sw-button-group-track`. No new tokens or dependencies.
- ce334c3: `Button` `variant="neutral"` (web only; `webButtonVariants`, and the React `ButtonVariant` type now includes it) is a quiet grey fill in the text color, and `disabledAppearance` (`ButtonDisabledAppearance`, `buttonDisabledAppearances`): `'faded'` (default, unchanged) or `'neutral'`, a disabled button on that grey with muted words at full opacity, whatever its variant; a ghost still fades (`docs/requests/teisoro-button-neutral.md`, Teisoro F-011 release R6). An unknown `disabledAppearance` throws a `RangeError`. A Badge inside a neutral button takes the surface, as in any filled button. `CalendarButton` `variant` takes the same web list. The quiet grey fill is now one named constant (`css/quiet-fill.ts`) shared by the menu, list, calendar, split and dialog rules; their CSS is unchanged. New generated classes `sw-button-neutral`, `sw-button-disabled-neutral`. No new tokens or dependencies; `@scalewing/tokens` `buttonVariants` and React Native are unchanged.
- 547fe7a: `DenominationGrid` framed count-sheet look, every option off by default so existing grids are unchanged (`docs/requests/teisoro-denomination-grid-frame.md`, Teisoro F-011 release R6):

  - `frame` (`DenominationGridFrame`, `denominationGridFrames`): `'none'` (default) or `'table'`, a strip drawn as a framed table (a border hairline at the `sm` radius on its scroll region, the heading row on the subtle fill, a rule between columns, counts at label size centred). The tiles layout ignores it.
  - `totalEmphasis` (`DenominationTotalEmphasis`, `denominationTotalEmphases`): `'default'` or `'strong'`, bold label-size totals, a neutral row's in the text color.
  - `cellToneAppearance` (`DenominationCellToneAppearance`, `denominationCellToneAppearances`): `'text'` or `'pill'`, a toned read-only strip count on its tone's tint in the tone's ink (the Notice's fill and words); outlined in forced colors.
  - `zeroLabel=""` now leaves zero counts blank instead of throwing; a non-string `zeroLabel` throws.
  - `DenominationGridEntry.limitAppearance` passes through to the entry Steppers.

  Every read-only strip count now sits in a `sw-denomination-cell-value` span (no visual change). New generated classes `sw-denomination-scroll-framed`, `sw-denomination-framed`, `sw-denomination-totals-strong`, `sw-denomination-cell-tones-pill`, `sw-denomination-cell-value`. The Notice's tint and ink moved to a shared `tone-tint` module (no change to its CSS). No new tokens or dependencies.

- 8666e25: `Dialog` `appearance` (`DialogAppearance`, `dialogAppearances`): `'glass'` (default, unchanged) or `'banded'`, the dialog on the solid surface with the medium elevation, its title row a full-width band over a hairline (a lone title too), the footer the band it already is, and the close button a circle on the quiet muted fill (`docs/requests/teisoro-dialog-banded.md`, Teisoro F-011 release R6). Forced colors outline the dialog and keep the hairlines. An unknown value throws a `RangeError`. New generated class `sw-dialog-banded`. No new tokens or dependencies.
- 35dc401: `Nav` `appearance` (`NavAppearance`, `navAppearances`): `'default'` (unchanged) or `'words'`, every destination (a link or a Button of any variant) as plain words, the others muted at medium weight and the current one (`aria-current`) in the text color at label weight, with no fill, visible border or underline (destinations need visible words: a glyph-only one keeps `default`); forced colors draw the current one's border in Highlight and underline it (`docs/requests/teisoro-nav-words.md`, Teisoro F-011 release R6, S17 shell). An unknown value throws a `RangeError`. New generated class `sw-nav-words`. No new tokens or dependencies.
- 0a659ef: `requiredMark` (`RequiredMark`, `requiredMarks`) on `Field`, `Select`, `DateField`, `Combobox` and `FilterChips`: `'visible'` (default, unchanged) or `'hidden'`, which leaves out the label's `aria-hidden` " \*" while the control stays required (native `required` or `aria-required`) (`docs/requests/teisoro-required-mark.md`, Teisoro F-011 release R6). An unknown value throws a `RangeError`. No new classes, tokens or dependencies.
- 026764c: `SegmentedControl` `variant="raised"` (`SegmentedControlVariant` gains `'raised'`): a grey track (the quiet muted fill, no border) as wide as its segments, every segment the md control height in label type with its words in the text color, the selected one the surface raised by the small elevation (`docs/requests/teisoro-segmented-control-raised.md`, Teisoro F-011 release R6). In the dark scheme the selected segment draws a muted hairline ring (a shadow does not show there). Item icons, `error` (its danger outline is restated after the raised rules) and `disabled` behave as on the other tracks; the compact icon track's rules exclude it (their specificity unchanged). The default `compact` and `filled` tracks are unchanged. New generated class `sw-segmented-raised`. No new tokens or dependencies.
- 547fe7a: `Stepper` `limitAppearance` (`StepperLimitAppearance`, `stepperLimitAppearances`): `'faded'` (default, unchanged) or `'plain'`, which keeps − at `min` and + at `max` in their usual look while they stay disabled (`docs/requests/teisoro-stepper-limit.md`, Teisoro F-011 release R6). A disabled or read-only Stepper is unchanged; forced colors still grey a button at its limit. An unknown value throws a `RangeError`. New generated class `sw-stepper-limit-plain`. No new tokens or dependencies.

## 1.31.0

### Minor Changes

- ae2d883: `Combobox` (with `ComboboxProps`, `ComboboxGroup`, `ComboboxOption`, `ComboboxBadge`, `ComboboxAction`, `ComboboxSize` and `comboboxSizes`): a text input with a list of suggestions, an ARIA 1.2 combobox with list autocomplete (`docs/requests/teisoro-combobox.md`, Teisoro F-011 release R5).

  - `label`, `inputValue`, `onInputChange`, `groups` (`{ label?, options: { value, label, description?, badge?, disabled? }[] }[]`, filtered by the consumer), `onSelect`, `action?` (`{ label, onPress, badge? }`), `emptyText`, `note?`, `listLabel?`, `countText?` (`(count) => string`), and the Field props `labelVisuallyHidden`, `placeholder`, `description`, `error`, `required`, `disabled`, `size` (`md` | `xs`).
  - Focus stays in the input; the arrow keys move `aria-activedescendant` and wrap; Enter or a press chooses; a disabled option is never chosen; Escape closes, then empties; Alt+ArrowUp, blur, Tab or a press outside closes; the pointer moves the active option; the active option is held by value across new results; input-method keys are ignored; an always-present polite live region announces the empty text and `countText`.
  - The list is on the popup layer (`openPopups` gains `.sw-combobox-popup`), solid under reduced transparency, with forced-colours rules. Blank words, duplicate values, an unknown size or badge tone throw a `RangeError`.
  - New classes `sw-combobox*`. No new tokens or dependencies.

- c79024a: `Field` `variant="search"` (`fieldVariants`, `FieldVariant`), the web twin of the native search field (`docs/requests/teisoro-field-search.md`, Teisoro F-011 release R5): a hidden label that still names a `type="search"` input, a `leading` glyph slot, and, while the input holds text and is enabled and not read-only, a clear button named `clearLabel` that returns focus to the input and calls `onClear` (Escape too). The browser's own clear button is hidden; `enterKeyHint` defaults to `search`. Missing or blank `clearLabel`, missing `onClear`, `prefix`/`suffix`, a non-input or uncontrolled child, or the search props on an outlined field throw. New classes `sw-field-search-field`, `sw-field-search`, `sw-field-search-leading`, `sw-field-search-clear`, `sw-field-search-cross`. No new tokens or dependencies.

## 1.30.0

### Minor Changes

- 63695b5: `ActionMenuItem` `detail`, `detailLang` and `separatorBefore` (`docs/requests/teisoro-action-menu-detail.md`, Teisoro F-011 release R4):

  - `detail`: a short current value at the command's end in the muted colour with a chevron (mirrored right to left, `CanvasText` in forced colours), read in its name; it wraps between words. `detailLang` marks its language. A blank `detail`, a blank `detailLang` or one without `detail` throws a `RangeError`.
  - `separatorBefore`: a `role="separator"` hairline before the command (never before the first), skipped by the arrow keys.
  - New classes `sw-action-menu-detail`, `sw-action-menu-chevron`, `sw-action-menu-separator`. No new tokens or dependencies.

- 180e140: `ButtonGroup` `attached` (`docs/requests/teisoro-button-group-attached.md`, Teisoro F-011 release R4): one joined control, such as Previous, Today and Next. Its direct `Button` children at one height with no gap, single dividers (overlapping borders; a borderless variant's in its text colour), square inner and `sm`-radius outer corners; an isolated stacking context raises a pressed toggle and the focused button's outer ring over their neighbours (a new `joinedControlOrder` in `css/stacking.ts`). It keeps its row on a phone and sizes to its buttons. New class `sw-button-group-attached`. No new tokens or dependencies.
- b64e6ce: `FilterChips` `required`, `error` and `aria-describedby`, and `value: ''` for nothing chosen yet (`docs/requests/teisoro-filter-chips-validation.md`, Teisoro F-011 release R4):

  - `required`: each radio `required` and the required mark after the label.
  - `error`: a polite message under the chips linked by `aria-describedby`, the group `aria-invalid`, and every chip's edge in danger (`Mark` in forced colors).
  - `aria-describedby`: consumer description ids, before the error.
  - `value` may be `''` (nothing chosen); a value that is neither `''` nor an option still throws a `RangeError`.
  - New class `sw-filter-chips-error`. No new tokens or dependencies.

- a60f130: `SectionNav` item `count` and `appearance="filled"` (`docs/requests/teisoro-section-nav-count.md`, Teisoro F-011 release R4):

  - `SectionNavItem.count?: number`: a 20 px filled pill after the label (danger with its on-colour figures, a `CanvasText` edge in forced colours), part of the link's accessible name; 0 shows none; a count that is not a whole number from 0 throws a `RangeError`.
  - `SectionNavItem.countLabel?: string`: the count in words, read in place of the bare number (the pill then hidden from assistive technology); blank or without `count` throws.
  - `appearance?: 'underline' | 'filled'` (`SectionNavAppearance`, `sectionNavAppearances`): `filled` drops the hairline and the underline or start bar, sets every link at the `sm` control (44 px on a coarse pointer) at weight 500 and fills the current one at 600 (a 2 px `Highlight` edge in forced colours), in the row or the side list; an unknown value throws a `RangeError`.
  - New classes `sw-section-nav-filled` and `sw-section-nav-count`. No new tokens or dependencies.

- 3beef0d: `TableFooter` (with `TableFooterProps`): the table's `tfoot` for a total row, its cells at weight 600 under a 2 px rule (`docs/requests/teisoro-table-footer.md`, Teisoro F-011 release R4).

  - `sticky` pins the footer to the bottom edge on the header's glass, on a new stacking layer `stickyFooter` (2) between sticky table cells (1) and the sticky `ActionBar`. The other layers move up one: `bottomChrome` 3, `popupHost` 4, `topChrome` 5 (`popup` stays 10); update any test or stylesheet that pins those numbers. A sticky `ActionBar` or a `Dialog` footer covers a pinned footer, so do not pair them.
  - In forced colors pinned footer and header cells are the solid system canvas.
  - While a table with a sticky footer fits its width, its region stops being a scroll box (`sw-scroll-fits`, now on every measured `Table` region whose content fits, which changes its class list), so the footer and the sticky header pin to the page; a wider table scrolls sideways and pins inside its region.
  - New classes `sw-table-footer-sticky` and `sw-scroll-fits`. No new tokens or dependencies.

- d08712d: Table ledger extensions (`docs/requests/teisoro-table-ledger.md`, Teisoro F-011 release R4):

  - `TableCell` `tone` (`success`, `danger`, `muted`, `accent`; `TableCellTone`, `tableCellTones`): the cell's text in the theme colour.
  - `Table` `columnRules`: a hairline between columns, mirrored right to left.
  - `TableRow` `variant="sub"` (`TableRowVariant`, `tableRowVariants`) indents the row's header (`th scope="row"`) with a guide bar under the row above, and `TableRow` `struck` keeps a voided row on the record: subtle fill, muted, struck through (a Badge in a line of text stays plain).
  - A body or footer row header (`th scope="row"`) now reads as body text instead of a muted column header.
  - An unknown `tone` or `variant` throws a `RangeError`. No new tokens or dependencies.

## 1.29.0

### Minor Changes

- 98f6f89: `GlyphTile` (with `GlyphTileProps`, `GlyphTileHue`, `GlyphTileSize` and `glyphTileSizes`): a small rounded square in a categorical colour holding the consumer's glyph in white, the mark of a kind beside its name (`docs/requests/teisoro-glyph-tile.md`, Teisoro F-011 release R3).

  - `hue` (`green`, `blue`, `orange`, `purple`, `teal`, `rose` or `neutral`, from `@scalewing/tokens` categorical colours), `size` (`sm` 24, `md` 28 by default, `lg` 32), `children` (the glyph, drawn at spacing step 4).
  - Always `aria-hidden`; forced colors draw its edge. An unknown `hue` or `size` throws a `RangeError`.
  - New generated custom properties `--sw-categorical-<colour>` and `--sw-categorical-on` in both schemes, and classes `sw-glyph-tile`, `sw-glyph-tile-<hue>` and `sw-glyph-tile-<size>`. Needs `@scalewing/tokens` 1.5.0. No new dependencies.

- b8fe06f: `MultiSelect` (with `MultiSelectProps`, `MultiSelectOption` and `MultiSelectAlign`): several choices from a short list behind one trigger (`docs/requests/teisoro-multi-select.md`, Teisoro F-011 release R3).

  - `label`, `options` (`{ value, label, icon?, separatorBefore? }`), `value`, `onChange` (checked values in the options' order), `allLabel`, `clearLabel`, `summary` (the trigger's words), `disabled`, `align`.
  - A disclosure: a button with `aria-expanded` showing a group of native checkboxes, with All and Clear, on the popover layer beside the trigger; focus moves to the first checkbox, Escape returns it to the trigger, and focus or a press outside closes the panel.
  - Blank words, no or duplicate options, an unknown value or `align` throw a `RangeError`.
  - New generated `sw-multi-select-*` classes; the panel joins the popup layer in `css/stacking.ts`. No new tokens or dependencies.

- 4a648a9: `SegmentedControl` item `icon` (`docs/requests/teisoro-segmented-control-icon.md`, Teisoro F-011 release R3): a consumer mark (such as a `GlyphTile`) before an item's label, `aria-hidden`. A track with icons takes the `md` control height and label type, a subtle track fill and a raised selected item; a track without icons is unchanged. New generated classes `sw-segmented-with-icons` and `sw-segmented-item-icon`. No new tokens or dependencies.

## 1.28.0

### Minor Changes

- 73e7cf1: `DenominationGrid` `labelAppearance` (with `DenominationLabelAppearance` and `denominationLabelAppearances`): `'tone'` (default, unchanged) or `'plain'`, row labels in the text color at label weight with no tone stripe, in both layouts; a row's tone still colors its total (`docs/requests/teisoro-denomination-grid-label.md`, Teisoro F-011 release R2). An unknown value throws a `RangeError`. New generated class `sw-denomination-labels-plain`. No new tokens or dependencies.
- 6fc5c25: `Dialog` `description`, `icon`, `footer`, `summary`, `size="xl"` and `role` (with `DialogRole` and `dialogSizes`): a sheet's header and pinned footer (`docs/requests/teisoro-dialog-header-footer.md`, Teisoro F-011 release R2).

  - `description`: a muted line under the title and the dialog's accessible description. `icon`: a consumer glyph or tile before the title, `aria-hidden`.
  - `footer`: the actions, pinned to the dialog's bottom edge under a hairline while the content scrolls. `summary`: ActionBar's labelled figure at the footer's start, in a polite status region.
  - `size="xl"`: 65rem (`--sw-dialog-max-xl`). `role="alertdialog"` for a warning that interrupts.
  - An unknown `size` or `role`, a blank `description` or an invalid `summary` throws a `RangeError` (an unknown size used to render `md`). `role` is typed `'dialog' | 'alertdialog'` (any other role used to pass through to the element).
  - New generated classes `sw-dialog-xl`, `sw-dialog-header-framed`, `sw-dialog-icon`, `sw-dialog-titles`, `sw-dialog-description`, `sw-dialog-footer`, `sw-dialog-footer-status` and `sw-dialog-footer-actions`. No new tokens or dependencies.

- 792f7f5: `Notice` `variant="band"` (with `NoticeVariant` and `noticeVariants`): a full-width square strip of page chrome, such as an environment strip above the app header (`docs/requests/teisoro-environment-strip.md`, Teisoro F-011 release R2).

  - Square, the container's full width, at least the `xs` control height, caption type, its words centered; the tone's fill and ink as for every notice.
  - Its role defaults to `none` (no live region) unless `role` is given. Forced colors draw a rule under it.
  - An unknown `variant` throws a `RangeError`.
  - New generated class `sw-notice-band`. No new tokens or dependencies.

- f543d5f: `Notice` (with `NoticeProps`, `NoticeTone`, `NoticeRole` and `noticeTones`): a tinted note in the page's flow (`docs/requests/teisoro-notice.md`, Teisoro F-011 release R2).

  - `tone: 'info' | 'success' | 'warning' | 'danger'`, `title?` (a bold lead), `children` (the message), `action?` (one link or small `Button`), `icon?` (a consumer glyph, hidden from assistive technology), `role?: 'status' | 'alert' | 'none'` (danger is an alert, the others a status; `none` is no live region), a forwarded ref.
  - A text message shares the title's row while it fits; a message of elements (a sentence and a `Checkbox` or `Field`) stacks under the title.
  - The fill mixes the tone into the surface (the accent tint for info) and the words move the tone toward the text color, keeping 4.5:1 on the fill in every palette (see the request for the two palettes whose own danger is below that). Forced colors draw a border.
  - An unknown `tone` or `role`, a blank `title`, or nothing to say throws a `RangeError`.
  - New generated classes `sw-notice`, `sw-notice-info`, `sw-notice-success`, `sw-notice-warning`, `sw-notice-danger`, `sw-notice-icon`, `sw-notice-content`, `sw-notice-stacked`, `sw-notice-title`, `sw-notice-body` and `sw-notice-action`. No new tokens or dependencies.

- 9e372e1: `Progress` `tone="warning"` (with `progressTones`): the bar in the semantic warning color, such as the time left before an idle sign-out (`docs/requests/teisoro-progress-warning.md`, Teisoro F-011 release R2). New generated class `sw-progress-warning`. An unknown `tone` now throws a `RangeError` instead of rendering an unstyled bar. No new tokens or dependencies.
- 3d761ba: `Toast` `title`, `action`, `showRemaining` and `placement` (with `ToastAction`, `ToastPlacement` and `toastPlacements`): a corner card that confirms a save (`docs/requests/teisoro-toast-action.md`, Teisoro F-011 release R2).

  - `title`: a bold first line; the children become a muted detail.
  - `action: { label, onPress }`: a ghost small Button at the end; it runs `onPress`, then closes the toast.
  - `showRemaining`: a thin `aria-hidden` line that runs down over the toast's duration.
  - `placement: 'bottom' | 'top-end'` (default `bottom`, unchanged).
  - A toast with an action or the line takes the pointer, and its time is held while the pointer or focus is on it. A plain toast is unchanged and stays click-through.
  - A travelling toast (`anchor` and `target`) ignores `placement` and `showRemaining`. When the toast closes with focus inside, focus returns to where it came from.
  - `title` is now the toast's bold first line and is no longer forwarded to the element as the HTML `title` attribute.
  - A blank `title` or `action.label`, a missing `onPress`, or an unknown `placement` throws a `RangeError`.
  - New generated classes `sw-toast-title`, `sw-toast-detail`, `sw-toast-action`, `sw-toast-interactive`, `sw-toast-top-end`, `sw-toast-remaining` and `sw-toast-paused`. No new tokens or dependencies.

## 1.27.0

### Minor Changes

- 495d542: `ActionBar` `summary` (with `ActionBarSummary` and `ActionBarSummaryTone`): a labelled figure first in the bar's polite status region (`docs/requests/teisoro-action-bar-summary.md`, Teisoro F-011 release R1).

  - `summary: { label, value, detail?, tone?: 'default' | 'danger' | 'success' }`: the label and detail in muted label-size words, the value in the `heading` variant at tabular figures, on one baseline; `tone` colors the value only. Any `status` follows it in the same live region.
  - A blank `label`, `value` or `detail`, or an unknown `tone`, throws a `RangeError`.
  - New generated classes `sw-action-bar-summary`, `sw-action-bar-summary-label`, `sw-action-bar-summary-value`, `sw-action-bar-summary-detail`, `sw-action-bar-summary-danger` and `sw-action-bar-summary-success`. No new tokens or dependencies.

- db1d77b: `DenominationGrid` count entry (`docs/requests/teisoro-denomination-grid-entry.md`, Teisoro F-011 release R1), with the new types `DenominationGridEntry` and `DenominationGridRowEmphasis`:

  - `DenominationGridRow.entry` (`onChange(columnKey, value)`, `decrementLabel`, `incrementLabel`, `max?`, `errors?`, `placeholder?`) makes a strip row's `cells` editable, one full-width `Stepper` per column named by the row label and the column's label and caption. Entry counts are zero or more and unsigned, and every count's name is its own. A strip with an entry row centres its heads and read-only counts; a `cellTones` tone draws an entry count's border (`accent` is the `Stepper`'s changed look).
  - `DenominationGridRow.caption` (a muted line under the label), `emphasis` (`'default' | 'quiet'`, the subtle fill) and `disabled` (faded, entry disabled, `aria-disabled`), both strip only.
  - `DenominationGridColumn.caption`: a muted note after the column label, such as "× 100".
  - Entry rows need the strip layout; bad caps, messages, button names, captions or emphasis throw a `RangeError`.
  - `Stepper` is now `position: relative`, so its hidden label and empty error region never widen a scroll region's page.
  - New generated classes `sw-denomination-entry`, `sw-denomination-strip-entry`, `sw-denomination-label-words`, `sw-denomination-label-caption`, `sw-denomination-head-caption`, `sw-denomination-row-quiet` and `sw-denomination-row-disabled`. No new tokens or dependencies.

- 92357d4: `Steps` and `Step` (with `StepsProps`, `StepProps`, `StepStatus`, `StepHeadingLevel` and `StepsLabels`): a one-page vertical stepper (`docs/requests/teisoro-steps.md`, Teisoro F-011 release R1).

  - `Steps`: an `ol` of steps numbered by their place, with `headingLevel` (2 by default) and `labels` (the status words assistive technology hears; English by default).
  - `Step`: `status` (`'upcoming' | 'current' | 'done' | 'error' | 'skipped'`), `title`, `summary`, `onEdit` and `editLabel`, `skippedReason`, `headingLevel`, `children`. The current and error steps are open with their fields; a done step folds to a check, its title, a truncated summary and a ghost Edit named by its title; steps ahead and skipped ones are greyed. A line joins each marker to the next.
  - The current step has `aria-current="step"`; focus moves to a step's heading when it becomes current from a folded state (the first such step in an update).
  - New generated classes `sw-steps`, `sw-steps-item`, `sw-steps-item-<status>`, `sw-steps-header`, `sw-steps-marker`, `sw-steps-title`, `sw-steps-reason`, `sw-steps-summary`, `sw-steps-edit` and `sw-steps-body`, from tokens (the `xs` control height marker, the `title` and body type). No new tokens or dependencies.

- 35934e1: `Stepper` (with `StepperProps` and `StepperWidth`): a whole-number count changed with − and + or typed, the web counterpart of the react-native `Stepper` (`docs/requests/teisoro-stepper.md`, Teisoro F-011 release R1).

  - `label`, `labelVisuallyHidden`, `value` (`number | null`), `onChange`, `min` (default 0), `max` (open when left out), `step` (default 1), `decrementLabel`, `incrementLabel`, `error`, `changed`, `disabled`, `readOnly`, `valueText`, `placeholder`, `name`, `width` (`'fixed' | 'full'`), and a ref to the input.
  - The count is a native text input with `role="spinbutton"` and the one tab stop (ArrowUp and ArrowDown step it, Home and End go to `min` and a finite `max`); the − and + buttons are named pointer targets outside the tab order that keep focus where it was, all three in a `group` named by the label. − stops at `min`, + at `max`; an empty box counts as `min`.
  - Typed text other than digits (and a leading minus when `min` is below zero) is refused; a typed count is reported as typed, even outside the bounds, for the consumer's `error`.
  - New generated classes `sw-stepper`, `sw-stepper-full`, `sw-stepper-track`, `sw-stepper-button`, `sw-stepper-input`, `sw-stepper-invalid`, `sw-stepper-changed` and `sw-stepper-readonly`, sized from the `md` control height and spacing step 6. No new tokens or dependencies.

## 1.26.0

### Minor Changes

- e484799: `DescriptionList` and `DescriptionItem` (with `DescriptionListProps` and `DescriptionItemProps`): terms paired with what each says, one per row (`docs/requests/teisoro-description-list.md`, Teisoro F-006-S03).

  - A `dl` of items, each a `div` grouping a `dt` (`term`) with its `dd` (`children`); the list and each item take their own HTML attributes and `className`.
  - From `md` up the items share the list's two columns (`subgrid`): the term column as wide as the widest term, up to 40% of the list, then the detail. Every row aligns to its top, a hairline (`--sw-color-border`, `CanvasText` in forced colors) divides the rows, and the list is flush above its first row and below its last.
  - Below `md` each term sits over its detail.
  - A term and a detail are columns of lines: each child is its own line with its own line height, so a caption term starts level with a caption detail; each is as wide as its content unless it sets its own width (a `Progress` fills the detail), and long unbreakable words wrap. Wrap inline content in one element.
  - New generated classes `sw-description-list`, `sw-description-item`, `sw-description-term` and `sw-description-detail`. No new tokens or dependencies.

## 1.25.0

### Minor Changes

- 34131f3: `InfoTip` and `InfoTipProps`: a toggletip, a ghost icon-only `Button` whose only job is to show its tip (`docs/requests/teisoro-tooltip.md`, 2026-10-09 follow-up, Teisoro F-006-S11). Since 1.22.0 a tap on a `Button` presses it and never opens its `Tooltip`, so an ⓘ beside a figure could not show its help on a touch screen.

  - `label` (the button's name), `content` (the tip, plain text), `children` (the decorative glyph), `size` (a Button size; `md` by default, and 44 px on a coarse pointer at every size).
  - Hover and a visible focus show the tip as `Tooltip` does. A press (a tap, a click, Enter or Space) shows it and keeps it shown when the pointer leaves; the next press, Escape, blur or a press outside hides it.
  - The tip is the button's description (`aria-describedby`). A press also puts it in a visually hidden polite live region (`role="status"`), so a screen reader user who presses the button hears it. Every InfoTip renders that `role="status"` element, empty until a press, and while a press holds the tip open its text is in the page twice (the bubble and the region): a test that finds a `status` or the tip's text should scope its query.
  - `type="button"`: it never submits a form. An empty `label` or `content` throws a `RangeError`.
  - New generated class `sw-info-tip` (the square icon button, shared with `sw-calendar-button`, whose rules are equivalent: same declarations and specificity, one block reordered).

  `Tooltip`'s behavior is unchanged for every other trigger: a tap on a control still does what the control does and leaves its tooltip closed. No new tokens or dependencies.

## 1.24.0

### Minor Changes

- e6ed0d6: `Field` `changed` now also tints the control's fill (`docs/requests/teisoro-field-validation.md`, 2026-10-09 follow-up, Teisoro F-006-S11 task 1890), so a changed field no longer reads as the focused one: beside the accent border it keeps, the native control or the adorned frame takes the accent at 12 % as a background image over its own fill, which focus never draws. The value keeps 4.5:1 or more on the tint in every palette and scheme (6.74:1 at the lowest); the tint is on the text controls and select only (not a range, color or file input); while a placeholder shows the fill stays plain; on the tint an adorned field's prefix and suffix take the text color; a select keeps its chevron above it, placed for its size (`xs` included) by a private `--sw-select-chevron-inset` the select rule sets; and forced colors drop it and keep the `Highlight` border. No API change: same prop, same `sw-field-changed` class, no new tokens or dependencies. A consumer that layered its own background image on a changed control (none should: Scalewing owns the canvas) would now see it replaced.

  `BarChartItem` takes an optional `tone` (`docs/requests/teisoro-bar-chart.md`, 2026-10-09 follow-up, Teisoro F-006-S11 task 1890): `'accent'`, `'success'`, `'warning'` or `'danger'` (new exported type `BarChartTone` and list `barChartTones`) colors a bar by what it means in place of its sign's default, such as a diverging chart's overage in warning and shortage in danger. New generated classes `sw-bar-chart-fill-accent`, `sw-bar-chart-fill-success`, `sw-bar-chart-fill-warning` and `sw-bar-chart-fill-danger`; a toned negative bar keeps `sw-bar-chart-fill-negative` and its diverging shape. Without a tone a chart is unchanged. An unknown tone throws a `RangeError`. Forced colors now draw every bar in `CanvasText`: a token fill was painted as the canvas there, so bars were invisible on their tracks. No new tokens and no new dependencies.

## 1.23.0

### Minor Changes

- f51d196: A `Button` inside `Nav` is at least 44 × 44 px on a coarse pointer (`docs/requests/teisoro-nav.md`, Teisoro F-006-S11, UX-16), whatever its `size`, as `SectionNav` links, `CalendarButton` and the `ActionMenu` trigger already are; a fine pointer is unchanged. Only the minimum height and width grow, so a label beside its glyph keeps its line. No new classes, tokens or dependencies.
- f51d196: `hideBelow` and `hideFrom` take `lg` (64rem) (`docs/requests/teisoro-responsive-visibility.md`, 2026-10-09 follow-up, Teisoro F-006-S11, SET-3 and UX-16), for content that fits only from a laptop up, such as a row of labelled destinations a tablet shows as glyphs. New generated classes `sw-hide-below-lg` and `sw-hide-from-lg`; new exported types `VisibilityBreakpoint` (`'md' | 'lg'`) and `BreakpointDirection` (`'from' | 'below'`). The layout props keep the one layout breakpoint, `md`. `breakpointQuery(direction, breakpoint)` is now exported: the media query a hide class uses, so an app's `matchMedia` follows the same width; an unknown direction or breakpoint throws a `RangeError`. An unknown `hideBelow` or `hideFrom` now throws a `RangeError` (it produced a class with no rule). No new tokens and no new dependencies.

## 1.22.0

### Minor Changes

- 2737927: `ActionMenu` `header` (`docs/requests/teisoro-action-menu.md`, 2026-10-08 follow-up, Teisoro F-006-S11, SET-2). `header?: ReactNode` is a non-interactive block above the commands, such as who is signed in: each child a line of its own, in the caption size and the muted color, set off from the commands by a hairline and lined up with their words. It is not a menu item: it sits in the popover beside the `role="menu"` element, outside the arrow-key order, and is the menu's description (`aria-describedby`), so it is read as the menu opens. Without a header the markup is unchanged (the menu is the popover); with one, the popover is a `div.sw-action-menu-list` holding `.sw-action-menu-header` and the menu (`.sw-action-menu-items`), and the trigger's `aria-controls` names the popover. `null`, `false` and `''` are no header. New generated classes `sw-action-menu-header` and `sw-action-menu-items`. No new tokens and no new dependencies.
- 2737927: `ActionMenuItem` `lang` (`docs/requests/teisoro-action-menu.md`, 2026-10-08 follow-up, Teisoro F-006-S11, SET-14). `lang?: string`, a BCP 47 tag, marks a command's label as another language than the page's, such as "English" on a Spanish page, so assistive technology reads it in its own language (WCAG 3.1.2). It is set on the label's own element, not the command, so the command keeps the page's language for anything else. Without it the markup is unchanged. No new classes, tokens or dependencies.
- 94a2f1d: `BarChart` `formatValue` and `diverging` (`docs/requests/teisoro-bar-chart.md`, Teisoro F-006-S11, RPT-14). `formatValue?: (value: number) => string` writes the axis's values and every item's value that has no `valueLabel`, such as a currency (default: the plain number it wrote before, so the axis's "0" is now `formatValue(0)`). `diverging?: boolean`, off by default, puts zero in the middle of each track behind a hairline: a positive value's bar grows toward the inline end and a negative value's toward the start, each up to half the track on the same scale, with a square end at zero, and the axis reads minus `max`, 0 and `max`. Without it every bar still grows from the start. New generated class `sw-bar-chart-diverging`. No new tokens and no new dependencies.
- 637d17e: `CalendarButton` `range` (`docs/requests/teisoro-calendar-button.md`, 2026-10-08 follow-up, Teisoro F-006-S11, RPT-17). `range?: { start: string; end: string }` (`YYYY-MM-DD`, both ends included) is the span a page shows around `value`, such as a week or a month: the open calendar tints its days as one band per week row (the accent at 16 % over the calendar's glass, 24 % under the pointer; square inside, rounded at the start and the end, both for a one-day range; `Mark` and `MarkText` in forced colors, today included). Every number on the band is in the text color, which keeps 4.5:1 on it in every palette and scheme, as muted and accent do not; today keeps its accent ring, 3:1 or more on the band. A picker for a period thus shows the whole period. `value` stays the selected day, now always a pill, and today's ring is unchanged. The tint is not announced; the page's own heading names the period. A malformed end or a start after the end throws a `RangeError`. New exported type `CalendarButtonRange`; new generated classes `sw-date-field-day-in-range`, `sw-date-field-day-range-start`, `sw-date-field-day-range-end`. No new tokens and no new dependencies.
- 9ab7c15: `DenominationGrid` `labelWidth` (`docs/requests/teisoro-denomination-grid.md`, 2026-10-08 follow-up, Teisoro F-006-S11, DRW-27 and VLT-14). `labelWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` (4, 6, 8, 12 and 16 rem, the `Table` column sizes) lines a strip's columns up with every other strip of the same columns in a container of the same width, such as the cards of a feed: the row labels take that width and the count columns (and the total column from md up) share the rest of the strip's scroll region equally, measured from the region (a size container, `100cqi`) rather than from the counts, so every column is sized and no content moves one. A count wider than its share widens its column and the strip scrolls as a plain one does; below md the total column still takes no width. Without it each strip sizes its columns by its own content, as before. The tiles layout ignores it. An unknown width throws a `RangeError`. New exported type `DenominationLabelWidth`; new generated classes `sw-denomination-scroll-aligned`, `sw-denomination-strip-aligned`, `sw-denomination-label-{xs,sm,md,lg,xl}`; the strip sets `--sw-denomination-columns` and `--sw-denomination-total` on its table. No new tokens and no new dependencies.
- 9ab7c15: `DenominationGrid` shows its `totalLabel` (`docs/requests/teisoro-denomination-grid.md`, 2026-10-08 follow-up, Teisoro F-006-S11, HIS-11). The strip's total column header, which was visually hidden at every width, now shows the label over the totals from md up, in the column heads' style (`sw-denomination-head`), its end on theirs. Below md it stays visually hidden with the column, as each total sits under its row's label there. A strip without `totalLabel` keeps its empty corner. The label's span is now `sw-denomination-total-label` (was `sw-sr-only`). New generated class `sw-denomination-total-label`. No API change and no new dependencies.
- cdd92aa: `Field` `changed` (`docs/requests/teisoro-field-validation.md`, 2026-10-08 follow-up, Teisoro F-006-S11, COR-5). `changed?: boolean` marks a value the person changed from a saved one, such as a field in a correction: the control's border, or an adorned field's frame, in the accent color and a hairline thicker through an inset shadow, so nothing moves (`Highlight` in forced colors). It is a cue beside the words: say what the value was in `description`. `invalid` and `error` win over it. It sets no ARIA state. Like `invalid`, passing it, even `false` but not `undefined`, requires one native control child from the first render (a `TypeError` otherwise). New generated class `sw-field-changed`. No new tokens and no new dependencies.
- c6e46b3: `SectionNav` (`docs/requests/teisoro-section-nav.md`, Teisoro F-006-S11, ADM-1), a new component: the navigation between the sections of one area, such as a portal's pages. A labelled `nav` (`aria-label` or `aria-labelledby`) of links from `items` (`{ id, label, href, current?, icon? }`), quieter than a workspace's navigation: label-size words in the muted color, no fill, the current item in the text color over an accent underline on the row's hairline. `current` is `'page'`, `'location'` (a page inside the section) or a boolean, written as `aria-current`. `onNavigate?: (item) => void` takes a plain press (main button, no modifier key) after preventing the browser's navigation, for a client router; a modified or middle press keeps the browser's behavior. `verticalFrom?: Breakpoint` stacks the items as a side list from that breakpoint, the current one marked by a bar at its start. A coarse pointer gets 44 px targets; forced colors draw `LinkText` and a `Highlight` mark. The links carry a click handler only when `onNavigate` is given, so a server component can render the nav without one. Empty or duplicate ids, empty labels and an unknown `verticalFrom` throw a `RangeError`. New exported types `SectionNavItem`, `SectionNavProps`; new generated classes `sw-section-nav`, `sw-section-nav-list`, `sw-section-nav-link`, `sw-section-nav-icon`, `sw-section-nav-vertical-from-md`. No new tokens and no new dependencies.
- 864119d: `Table` `layout` and `verticalAlign`, and `TableCell` `width` (`docs/requests/teisoro-table.md`, 2026-10-08 follow-up, Teisoro F-006-S11, CHG-15 and HIS-12). `layout?: 'auto' | 'fixed'` (default `auto`): `fixed` sizes the columns from the header row's widths alone (`table-layout: fixed`), so a filter that hides a row moves no column; a column without a width shares what is left (when every column has one, spare width is shared in proportion to them). `width?: 'min' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'` on a cell: the sizes are 4, 6, 8, 12 and 16 rem; `min` gives an auto table's column the least room its content allows and keeps that cell on one line (set it on each cell of the column), and is no width in a fixed table. `verticalAlign?: 'middle' | 'top'` (default `middle`): `top` starts every cell of a tall row on its first line. The deprecated HTML `width` attribute is no longer accepted on `TableCell`: browsers honoured it as a presentational hint, so a cell given `width="120"` had that width, and it is now a type error and a `RangeError`. Migration: pass one of the sizes above (`width="sm"` and so on), or a class of your own; no known consumer passed it. An unknown value throws a `RangeError`. New exported types `TableLayout`, `TableVerticalAlign`, `TableColumnWidth`; new generated classes `sw-table-fixed`, `sw-table-top`, `sw-table-col-{min,xs,sm,md,lg,xl}`. `TableCell` moved to its own module; its import path from the package is unchanged. No new tokens and no new dependencies.
- 0f613ea: `TableCell` `sort` and `onSort` (`docs/requests/teisoro-table.md`, 2026-10-08 follow-up, Teisoro F-006-S11, RPT-13): a header cell (`as="th"`) with `sort?: 'ascending' | 'descending' | 'none'` and `onSort?: () => void` is its column's sort control. Its children become a `button` in the header's own text style (caption, semibold, muted; the sorted column's name in the text color) with a stroked chevron after them: up when `ascending`, down when `descending`, a quieter pair when `none`. In a `numeric` or `align="end"` column the chevron goes before the name, so the name lines up with the figures. The cell carries `aria-sort` only while it is the sorted column. The button has the accent focus ring and a 44 px target on a coarse pointer. `sort` on a data cell, or one of the two without the other, throws a `TypeError`; an unknown `sort` throws a `RangeError`. New exported type `TableSort`; new generated classes `sw-table-sort`, `sw-table-sort-glyph`, `sw-table-sort-{ascending,descending,none}`. No new tokens and no new dependencies.
- 5e52402: A `Tabs` strip shows that it scrolls (`docs/requests/teisoro-tabs.md`, 2026-10-08 follow-up, Teisoro F-006-S11, RPT-11). While its labels are scrolled out past an inline edge, the tablist adds `sw-scroll-more-start` and/or `sw-scroll-more-end` and that edge draws the same inset shade as a wide `Table`'s scroll region, mirrored right to left, under the tabs so nothing moves. A strip whose labels fit is unchanged: no class, no shadow. It measures on mount, on scroll and on resize; before mount and on the server it reports no overflow. Forced colors draw no shade. `sticky` strips take it too. The classes already exist (`scrollShadeRules` now generates them for the strip); no prop changes, no new tokens and no new dependencies.
- ac55076: `Tooltip` opens on a visible focus only, and keeps its bubble inside the screen (`docs/requests/teisoro-tooltip.md`, 2026-10-08 follow-up, Teisoro F-006-S11, SET-9). Behavior changes, no API change:

  - A focus opens the tooltip only when it is `:focus-visible` (the keyboard, or a script after keyboard use). The focus a click or a tap gives no longer opens it, so a pressed control does not keep its help shown, even on the next page, until the focus moves. Hover still opens it. A browser without `:focus-visible` counts every focus as visible, as before.
  - A tap toggles the tooltip only on a trigger that does nothing else on a tap, such as a focusable badge. A tap on a control (a button, a link or image-map area, a form control or its label, media with controls, an editable region or an element with a widget role such as combobox, slider, textbox or treeitem, or anything inside one) does what the control does and leaves the tooltip closed. Consumers that relied on a tap on an icon button showing its help should show the name as text on touch screens.
  - The bubble is a manual popover on the top layer while it shows, placed beside its trigger as `ActionMenu` is: under it (over it near the bottom of the screen), lined up with its start or, where that would leave the screen, its end, a `space-2` inset from every edge, following scrolling and resizing. While hidden it stays in the page (a `label` tooltip still names its trigger) and is not a popover. `.sw-tooltip` is now `position: fixed` and capped at `min(18rem, 100% − 2 × space-2)` of the viewport.

  No new classes, tokens or dependencies.

## 1.21.0

### Minor Changes

- 2d54950: `DateField` and `CalendarButton` take an optional `today` (`YYYY-MM-DD`): the day the calendar marks as today (`aria-current="date"`), opens on when the field is empty, and picks with **Today**. It defaults to the device's local date, as before. Pass the business's own day when it keeps a time zone the device may not share, so a phone in UTC at 10 PM in New York no longer rings tomorrow while `max` disables it. An empty or malformed `today` throws a `RangeError`.

## 1.20.0

### Minor Changes

- cfcac1a: `Tooltip` `relationship` (`docs/requests/teisoro-tooltip-labels.md`, Teisoro's workspace navigation). `relationship?: 'description' | 'label'`, default `'description'`, and the exported type `TooltipRelationship`. `'label'` makes the tooltip its trigger's accessible name: the trigger gets `aria-labelledby` with the tooltip's id (after its own, if any) instead of `aria-describedby`, so an icon-only control's name is read once rather than as both name and description. The tooltip stays in the page, hidden, so it names the trigger while not shown. With `disabled` there is no tooltip and no reference to it; the trigger then needs its own name (visible text or `aria-label`). Without `relationship` the markup and behavior are unchanged. No new classes, tokens or dependencies.

## 1.19.0

### Minor Changes

- 596b74b: `Tooltip` `disabled` (`docs/requests/teisoro-tooltip-disabled.md`, Teisoro's workspace navigation). `disabled?: boolean` turns the tooltip off, not its trigger, which stays mounted, enabled and focusable: the tooltip element is not rendered, the trigger keeps only its own `aria-describedby`, and Escape reaches the page. Focus, hover and touch are still followed, so a trigger that still has focus, the pointer or an open touch toggle shows the tooltip as soon as it is enabled again. `disabled` must match between the server render and the first client render. A product toggles it at a breakpoint instead of rendering the trigger with and without a `Tooltip`, which mounted a new trigger and lost its focus. Without `disabled` the markup and behavior are unchanged. No new classes, tokens or dependencies.

## 1.18.0

### Minor Changes

- ea2fdf0: `ActionBar` `status` takes a node (`docs/requests/fantasy-football-action-bar-status.md`, the fantasy-football companion's trade verdict): `status?: ReactNode`, widened from `string`, so a `Badge` and a short line can share the status. The status element is now a `div` (was a `p`) that keeps `className="sw-action-bar-status"` and `role="status"`, is still rendered while empty, and still takes no room when empty. It lays its children on one wrapping row a `space-2` gap apart (`space-1` between wrapped rows), so a line that does not fit beside its badge wraps under it at phone width. A string status renders as before; a phrase that mixes text and elements belongs in one `span`. Consumers whose tests looked for a `P` status element need to update that query. No new classes, tokens or dependencies.
- d02521e: `Dialog` `sheetBelow` and `closeLabel` (`docs/requests/fantasy-football-dialog-sheet.md`, the fantasy-football companion's phone review dialogs). `sheetBelow?: Breakpoint` (`'md'`): below that breakpoint the dialog is a bottom sheet, docked to the bottom edge at the full viewport width, top corners at `--sw-radius-lg` and bottom corners square, a `space-8` strip of backdrop left above it (the same dvh-aware cap), and bottom padding that clears `env(safe-area-inset-bottom)`; it slides up on open with `--sw-motion-default`, not under `prefers-reduced-motion`, and draws no grabber. From the breakpoint up it is the centered dialog at its `size`. `closeLabel?: string`: an icon-only ghost close `Button` ends the title row, named by the label, and calls `onClose`; the title still names the dialog and `titleLevel` still applies. The button is the first control, so it takes the focus on open unless content has `autoFocus`. Its X is private control chrome drawn in CSS (no icon dependency). Without `closeLabel` the markup is unchanged. New generated classes `sw-dialog-sheet-below-md`, `sw-dialog-header`, `sw-dialog-close`, `sw-dialog-close-glyph`. No new tokens and no new dependencies.
- c5fd0a9: `Tabs` `sticky` (`docs/requests/fantasy-football-tabs-sticky.md`, the fantasy-football companion's section tabs): `sticky?: boolean`, default `false`, keeps the strip at the top of the viewport (`top: env(safe-area-inset-top, 0px)`) while a long panel scrolls under it, on the sticky `AppHeader`'s `topChrome` layer. The stuck strip is a full-bleed band of the page canvas, not a glass card: `--sw-color-background` at 90 % over the glass blur and saturate tokens, with the strip's existing hairline, solid canvas under `prefers-reduced-transparency` and `Canvas` in forced colors. A sticky element only sticks within its parent, so make the strip a direct child of the page container that holds the panels; each tab's md inline padding (16 px, spacing step 4) lines the first label up with a `space-4` page gutter. New generated class `sw-tabs-sticky`. No new tokens and no new dependencies.

## 1.17.0

### Minor Changes

- 7bb0397: `DenominationGrid` row `cellTones` (`docs/requests/teisoro-denomination-grid.md`, 2026-10-02 follow-up, Teisoro F-007 task 1550, MOV-10): `cellTones?: readonly (DenominationGridTone | null)[]`, one entry per column, tones a single count in place. The count is set in the tone (over a signed row's color and a zero's quiet opacity), and in the tiles layout the tile's border takes the tone too, without moving or resizing the tile. `neutral` or `null` leaves a count as it is; a row's `tone` is unchanged. The wrong length or an unknown tone throws a `RangeError`. New generated classes `sw-denomination-cell-toned` and `sw-denomination-cell-tone-{accent,success,danger,warning}`. No new dependencies.
- 051e0ec: `DenominationGrid` `rowRole` (`docs/requests/teisoro-denomination-grid.md`, 2026-10-02 follow-up, Teisoro F-007 task 1550, CHG-4): `rowRole?: 'region' | 'group'`, default `'region'`. At `'group'` each named tiles row keeps its `aria-label` but is a `group`, not a landmark region, so a page with many grids does not list a region per row. The default keeps today's regions; the strip ignores the prop; an unknown value throws a `RangeError`. New exported type `DenominationGridRowRole`. No new dependencies.
- b810ce3: `Dialog` `titleLevel` (`docs/requests/teisoro-dialog-title-level.md`, Teisoro F-007 task 1550, CHG-13): `titleLevel?: 2 | 3`, default `3`, sets the heading level of the dialog's title. `titleLevel={2}` renders it as an `h2` in the same title style, so a dialog's own section labels can be `h3` headings that read as its parts rather than its peers. The default keeps the `h3` every existing dialog has. New exported type `DialogTitleLevel`. No new dependencies.
- 0a49a53: A wide `Table` (and `DenominationGrid` strip) shows that it scrolls (`docs/requests/teisoro-table.md`, 2026-10-02 follow-up, Teisoro F-007 task 1550, VLT-1 and HIS-3). While its content is scrolled out past an inline edge, the scroll region adds `sw-scroll-more-start` and/or `sw-scroll-more-end` and that edge draws a soft inset shade (the text color at 28%, spacing steps 6 and 5), mirrored right to left, under the content so nothing moves. A table that fits is unchanged: no class, no shadow. The region measures on mount, on scroll and on resize; before mount and on the server it reports no overflow. In forced colors the system scrollbar is the cue. New generated classes `sw-scroll-more-start` and `sw-scroll-more-end`; no prop changes and no new dependencies.

### Patch Changes

- 1648c50: `DenominationGrid` writes a negative count with the typographic minus "−" (U+2212), not a hyphen-minus (`docs/requests/teisoro-denomination-grid.md`, 2026-10-02 follow-up, Teisoro F-007 task 1550, AUD-18). It applies to every negative count, in signed and unsigned rows and in both layouts, so a count matches the sign of the consumer's formatted money. The cell's text is the only change: a test that matched `-1` in a cell now matches `−1`. No API change and no new dependencies.

## 1.16.0

### Minor Changes

- b64a805: `Field` takes `invalid` (`docs/requests/teisoro-field-validation.md`, 2026-09-30 follow-up, Teisoro F-007-S05 task 1375, DRW-18). `invalid?: boolean` marks the native control invalid, `aria-invalid="true"` and the same danger border as `error` (on a `prefix`/`suffix` frame too, `Mark` in forced colors), without a message of its own, for fields whose one error is shown elsewhere, such as under a group of count fields; the consumer points the control's `aria-describedby` at that message, and it is kept. The field's polite region stays empty and its `description` stays. `error` implies it. Passing `invalid`, even `invalid={false}` but not `invalid={undefined}` (so a wrapper forwarding an optional prop is safe), requires one native control child from the first render (a `TypeError` otherwise), so a form that marks a composed child learns it while its fields are valid, not on its first failed submit. `error` is unchanged: it requires the native control only while it holds a message, so `error={undefined}` beside a composed child still renders. Without it nothing changes. No new dependencies.
- 68beae9: A programmatic focus target takes the accent focus ring (`docs/requests/teisoro-focus-target.md`, Teisoro F-007-S05 task 1375, NSF-34, ENT-29, DRW-30). The generated document canvas gains `:where([data-theme] [tabindex='-1']:focus-visible)` with the same ring as links and native controls (`--sw-focus-ring-width` solid `--sw-color-accent`, `--sw-focus-ring-offset` out), so a notice or card a script focuses after a save, such as a `Box tabIndex={-1} radius="lg"` round a `Card`, no longer shows the browser's outline. The ring shows only when focus is visible, as the browser's does, and the rule has zero specificity, so a component's own ring always wins. No new prop or class and no new dependencies.

### Patch Changes

- 849ce60: `Button` sets a glyph one token gap from its label (`docs/requests/teisoro-button.md`, 2026-09-30 follow-up, Teisoro F-007-S05 task 1375). `.sw-button` gains `gap: var(--sw-space-2)`, so a glyph and a label passed as the button's own children sit 8 px apart at every size instead of touching. An icon-only button, a visually hidden name (`CalendarButton`) and a label already wrapped in one element with its own gap (`<Inline as="span" gap={2}>`) are unchanged: each is a single flex item, so there is never a second gap, and the wrapper can be dropped. A phrase split across elements (`Save <strong>draft</strong> now`) already drew its parts touching, because each is a flex item whose edge spaces collapse; they are now 8 px apart. Put such a phrase in one element, where its word spaces are kept. No API change and no new dependencies.
- 9a84726: `DenominationGrid` keeps a row's icon beside its label (`docs/requests/teisoro-denomination-grid.md`, 2026-09-30 follow-up, Teisoro F-007-S05 task 1375, DRW-28). A row's icon and words now sit in `.sw-denomination-label-line`, a flex row that does not wrap, in both layouts, so a long label wraps its words beside the icon instead of dropping them under it. Below `md` the strip no longer puts the icon on its own line over the label: the line stays a row (its gap narrows to spacing step 1 in the strip only; a tiles row keeps step 2), and the phone total keeps its own line under it. New generated class `sw-denomination-label-line`; no API change and no new dependencies.
- b7beef1: `Toast` keeps the page gutter on a phone (`docs/requests/teisoro-toast.md`, 2026-09-30 follow-up, Teisoro F-007-S05 task 1375, DRW-29). `.sw-toast` is capped at `calc(100% - var(--sw-space-4) - var(--sw-space-4))` of the top layer and wraps a long word (`overflow-wrap: break-word`), so a message wider than the screen wraps inside a 16 px gutter on each side instead of running to the edges. A toast is still as wide as its message up to that cap and centred, so a short toast is unchanged. No API change and no new dependencies.

## 1.15.0

### Minor Changes

- c0a1c95: `RadioGroup` options take a `description` (`docs/requests/teisoro-radio-group.md`, 2026-09-29 follow-up, Teisoro F-007-S05 task 1365). `RadioGroupOption.description?: ReactNode` is secondary text for that option: a muted caption at the row's inline end while it fits beside the label, and a second line under the label text when it does not or below `md` (new generated classes `sw-radio-group-body` and `sw-radio-group-option-description`). It is the radio's accessible description (`aria-describedby`), the radio's name stays its `label` text (`aria-labelledby` on the label text), and a press on it chooses the option. It may hold phrasing content such as a `Badge`, nothing interactive; a taller description grows the row downward and the label stays on the radio's line. `undefined`, `null`, booleans and `''` are no description; `0` and a component that renders nothing are one. An option with a description fills the group's width. Without `description` nothing changes. No new dependencies.

## 1.14.0

### Minor Changes

- 84d5fd9: `Select` takes `width?: 'content' | 'full'` (`docs/requests/teisoro-select.md`, 2026-09-29 follow-up). `'content'`, the default, is today's field, as wide as its longest option; nothing changes for existing Selects. `'full'` adds the generated `sw-select-full` class: the field and its trigger fill the container's inline size in a `Stack`, a `Grid` cell or a narrow column, and in an `Inline` row they take the space the siblings leave (`.sw-inline > .sw-select-full { flex: 1 1 0; min-width: 0 }`), so a `Button` beside it keeps its label on one line. The value still ellipsizes, the chevron stays at the inline end (left to right and right to left), and the open list is exactly the trigger's width, so a long option wraps inside it, even a single long word (`overflow-wrap: anywhere`), instead of running past a phone's edge or scrolling sideways. New exported type `SelectWidth`. No new dependencies.

## 1.13.0

### Minor Changes

- ca9350c: `RadioGroup` options take an `icon` (`docs/requests/teisoro-radio-group.md`, 2026-09-28 follow-up, Teisoro CHK-13). `RadioGroupOption.icon?: ReactNode` renders a decorative glyph between the radio and its label, `aria-hidden`, in the text color (new generated class `sw-radio-group-icon`). The option's accessible name stays its `label` text, and a press on the glyph chooses the option. Without `icon` nothing changes. No new dependencies.
- 4b0a029: `SegmentedControl` takes `error` and `required` (`docs/requests/teisoro-segmented-control.md`, 2026-09-28 follow-up, Teisoro DRW-20):

  - `error?: string` renders a `sw-field-error` message under the track in the same polite live region as `Field`'s (always rendered, never an alert), links it to the `radiogroup` by `aria-describedby`, and sets `aria-invalid` and a danger outline on the group (`Mark` in forced colors). An empty string is no error.
  - `required?: boolean` sets `aria-required` on the `radiogroup`; the element that labels the control shows the visible mark.
  - The track now renders inside a `.sw-segmented-field` wrapper (new generated classes `sw-segmented-field` and `sw-segmented-field-filled`) that takes its place in the layout, so the track's width in a Stack, an Inline or block flow is unchanged and a `ref` still reaches the `radiogroup`. A test that measured the control against its `parentElement` should use the wrapper's parent. `error` is meant for a Stack or block layout: while a message shows, the field is at least 24ch wide (capped at its container), so in an `Inline` the row grows.

  Without the new props nothing else changes. No new dependencies.

### Patch Changes

- 6a5b226: A pressed toggle `Button` keeps its label readable in forced colors (`docs/requests/teisoro-button.md`, 2026-09-28 follow-up; a regression from 1.12.0). The `Highlight` fill with `HighlightText` is gone: Chromium paints the forced backplate behind a button's text in `Canvas`, which erased the label (1.00:1 painted). The pressed button now keeps the forced button colors, so its label, glyphs and badges stay readable, and it is marked by the same 2 px ring as outside forced colors, drawn as a `Highlight` border on an out-of-flow `::after`, with a `Highlight` border on the button itself. No `forced-color-adjust`, no API change and no new dependencies.
- d4ef0dc: `DateField`'s label row matches `Field`'s (`docs/requests/teisoro-date-field.md`, 2026-09-28 label row follow-up, Teisoro NSF-35). Its label now uses `Field`'s own label markup (the label words as a `Text` label span and the `aria-hidden` required mark, inside a `<label>` that keeps the canvas type), so a `DateField` beside a `Field` lines up at the label and the control; before, its entry sat 5 px higher. `.sw-date-field-label` no longer sets its own font size, weight or line height. No API change and no new dependencies.
- 58ea2f8: A lone `DenominationGrid` tiles row without an icon or `total`, whose `label` is the grid's own `label`, no longer names itself (`docs/requests/teisoro-denomination-grid.md`, 2026-09-28 lone-row name follow-up, Teisoro SDAY-31). It was a region with the grid's own words inside the grid's group; now the group, named by `label`, is its only name. Every other row, including a lone plain row with different words, is still a region named by its `label`. No API change and no new dependencies.
- 6f5a37c: A disabled text control looks locked (`docs/requests/teisoro-field-disabled.md`, Teisoro DRW-17). A disabled native `input`, `select` or `textarea` on the canvas, `Field`'s adorned frame and `DateField`'s entry take the subtle fill, a dashed border and `cursor: not-allowed`; the value stays in the text color at full opacity (4.5:1 or more in every palette), and forced colors keep the dashed border in `GrayText`. `DateField`'s entry no longer fades to the disabled opacity; its calendar button still does. Every typed input's placeholder is now drawn in `--sw-color-muted` (4.5:1 or more on every palette's field fill) instead of the browser's fixed gray, which fell to 2.3:1 on dark fields. No API change and no new dependencies.
- a747fc5: `Select`'s label row matches `Field`'s (`docs/requests/teisoro-select.md`, 2026-09-28 label row follow-up). Its label now uses `Field`'s own label markup (the label words as a `Text` span and the `aria-hidden` required mark, inside a plain `<label>` that keeps the canvas type), so a `Select` beside a `Field` lines up at the label and the control; before, its trigger sat 5 px higher. `labelVisuallyHidden` hides the span inside the label, as `Field` does. No API change and no new dependencies.

  Consumer and migration notes:

  - The `<label>` element no longer carries `sw-text-label` (or `sw-sr-only` with `labelVisuallyHidden`); a `<span>` inside it does. A selector or test that targeted `label.sw-text-label` in a `Select` should target the label element (`label[for]`, or `getByText(label)` for the span) instead.
  - A visible `size="xs"` label row goes from 18 px (the caption line height on the label itself) to 25 px (the canvas body line box, as a visible `xs` `Field` label has), so an `xs` Select with a visible label sits 7 px lower. Toolbar `xs` Selects with `labelVisuallyHidden` are unchanged: the hidden label takes no row.
  - A visible `md` label row goes from 20 px to 25 px, so the trigger sits 5 px lower, level with a `Field` beside it.

- 2f7e4b0: `TableRow selected` marks the row without moving a column (`docs/requests/teisoro-table.md`, 2026-09-28 follow-up, Teisoro NSF-12). The first cell no longer gains `padding-inline-start` and the 8 px dot is gone. A 4 px accent bar at the row's inline start (3:1 or more against the page and the surface) is drawn inside the first cell's padding, out of flow; it follows the writing direction. The row takes no fill, so text, muted and accent text keep their contrast. Forced colors keep the bar in `Highlight`. No API change and no new dependencies.

## 1.12.0

### Minor Changes

- f389c10: `ActionMenu` takes `align?: 'start' | 'end'` (default `'start'`, unchanged; type `ActionMenuAlign`) (`docs/requests/teisoro-action-menu.md`, 2026-09-28 align follow-up, Teisoro ENT-13). With `'end'` the open menu lines up with the trigger's inline end even where the start would fit, so a menu opened from the end of a card stays over that card instead of hanging past it toward the next one. It still takes the trigger's other edge when the preferred one would leave the screen, mirrored in right-to-left.

  No breaking change and no new dependencies.

- 37ef947: `DenominationGrid`'s strip reads its totals to a screen reader at every width (`docs/requests/teisoro-denomination-grid.md`, 2026-09-28 follow-up, Teisoro SDAY-6). Below `md` the total cell was `display: none`, so on a phone a screen reader never heard a row's total; it now stays in the table, visually hidden, while the `aria-hidden` copy under the row label is what shows.

  - New optional prop `totalLabel?: string` names the total column with a visually hidden `th scope="col"` (class `sw-denomination-total-head`). Without it the header corner is the empty cell it was, and it carries the same class, so below `md` the hidden total column takes no width either way. A blank `totalLabel` throws a `RangeError`.
  - New generated classes `sw-denomination-total-head` and `sw-denomination-total-value` (the total's text inside its cell).

  No breaking change and no new dependencies.

- 9a11c40: `Select` takes `placeholder`, `required` and `error` (`docs/requests/teisoro-select.md`, 2026-09-28 placeholder follow-up, Teisoro DRW-12), consistent with `Field`:

  - `placeholder?: string` shows in the closed trigger, muted, while `value` matches no option (such as `''`). It is not an option, never becomes the value, and counts toward the trigger's width. A blank placeholder throws a `RangeError`.
  - `required?: boolean` marks the label with `Field`'s `aria-hidden` asterisk and sets `aria-required` on the trigger.
  - `error?: string` renders a `sw-field-error` message under the control, linked by `aria-describedby`, with `aria-invalid` and a danger border. Like `Field`'s, it is announced from a polite live region that is always rendered, never as an alert; an empty string is no error.
  - New generated classes `sw-select-placeholder` and `sw-select-invalid`.

  Without the new props nothing changes. No new dependencies.

- cab64c8: `Toast` takes `tone` and `icon` (`docs/requests/teisoro-toast.md`, Teisoro DRW-14):

  - `tone?: 'neutral' | 'success' | 'warning' | 'danger'` (default `neutral`, unchanged) tints the toast's border and icon; the message keeps the text color. A `danger` toast is `role="alert"`, the others `role="status"`. `ToastTone` and `toastTones` are exported.
  - `icon?: ReactNode` puts a consumer glyph, hidden from assistive technology, before the message. Without it the children render unwrapped, as before.
  - New generated classes `sw-toast-success`, `sw-toast-warning`, `sw-toast-danger`, `sw-toast-row`, `sw-toast-icon` and `sw-toast-body`.

  Without `timeoutMs`, a `warning` or `danger` toast now stays 6000 ms instead of 800 ms, so it can be read; `neutral` and `success` keep 800 ms, and a given `timeoutMs` wins. A toned toast still dismisses itself. No breaking change and no new dependencies.

### Patch Changes

- a0550bd: A `Badge` inside a filled `Button` (`primary`, `secondary`, `tertiary` or `danger`) sits on `--sw-color-surface` with its words in `--sw-color-text` and its tone on its border (`docs/requests/teisoro-badge.md`, Teisoro NSF-1, WCAG 1.4.3). Its tone was drawn on the button's fill: a warning badge on the accent measured about 1.1:1. The text color is 4.5:1 or more on the surface in every palette and scheme, which the tone colors are not (for example `mocha` dark danger at 3.29:1); every tone border is at least 3:1.

  No API change and no new dependencies.

- 91249c3: A toggle `Button` (`aria-pressed`) no longer fades when it is not pressed (`docs/requests/teisoro-button.md`, Teisoro NSF-1, WCAG 1.4.3). `.sw-button[aria-pressed='false']` set `opacity: var(--sw-quiet-opacity)` (0.55), which took an unpressed button's label to about 3.8:1 and any badge inside it lower, although the button could be pressed.

  - The unpressed button is drawn at full strength.
  - The pressed button gets a 2 px accent ring outside its fill, past a 2 px gap in `--sw-color-background` (`box-shadow`), so it keeps the accent's contrast on the canvas (4.5:1 or more in every palette) whatever its variant or fill, and a toggle whose states share one variant still shows which is pressed. A focused pressed button moves its focus outline out past the ring.
  - In forced colors, which drop box shadows, the pressed button is filled with `Highlight` and `HighlightText`, as a checked `FilterChips` chip is.

  A visible change for every toggle button. No API change and no new dependencies.

- d872a1c: A `required` `DateField` marks its label with the same `aria-hidden` asterisk as `Field` (`sw-field-required`) (`docs/requests/teisoro-date-field.md`, 2026-09-28 follow-up, Teisoro NSF-15). Before, a required date looked optional beside required fields. The entry's accessible name is unchanged; the label's text content now ends in " *", so a test that finds the entry with an exact `getByLabelText` should use its role and name instead.

  No API change and no new dependencies.

- 0d2c9ad: `DenominationGrid`'s tiles layout shows a lone row's `total` (`docs/requests/teisoro-denomination-grid.md`, 2026-09-28 follow-up, Teisoro ENT-7). A grid with one row and no icon dropped the `total` it was given; the row's label line, with the label and the total, now shows whenever the row has a total. A lone row with neither an icon nor a total is unchanged.

  No API change and no new dependencies.

- d8dc697: Field errors are announced politely from a live region instead of as alerts (`docs/requests/teisoro-field-validation.md`, 2026-09-28 follow-up, Teisoro CHK-3 and DRW-6). `Field`'s error was `role="alert"`, so a refused submit with several invalid fields fired one alert per field at once, while a `Checkbox` error beside them was not announced at all.

  - `Field`, `Checkbox`, `RadioGroup` and `DateField` keep their error in an `aria-live="polite"` region that is always rendered, empty while there is no error, and swap the error's text into it: a new error is announced once, politely, whether it appears while typing or after a submit. The control lists the region in `aria-describedby` with `aria-invalid` while it has text. An empty region takes no room (`:empty { position: absolute; }`).
  - `Field` still shows the error in place of the hint, but the two now have their own ids. `RadioGroup`'s invalid marks key off the fieldset's `aria-invalid`.

  Consumer note: a refused submit is now announced politely rather than as several alerts; the form should also move focus to the first invalid control (or to one form-level summary). Tests that found the error by the hint's id should find it by its text. No API change and no new dependencies.

- a522627: A zero-count `FilterChips` chip is quiet without fading (`docs/requests/teisoro-filter-chips.md`, 2026-09-28 follow-up, Teisoro NSF-1, WCAG 1.4.3). Its face had `opacity: var(--sw-quiet-opacity)` (0.55), about 3.8:1 for its label; it now drops the glass fill and sets its label in `--sw-color-muted` (4.5:1 or more in every palette). In forced colors it is drawn like the other chips instead of in `GrayText`.

  No API change and no new dependencies.

- 7effb60: `Select`'s closed trigger centres its text, ends in the `Accordion` chevron, and keeps its width when the value changes (`docs/requests/teisoro-select.md`, 2026-09-28 trigger follow-up, Teisoro DRW-12). It was sized to the current label, so it jumped when a longer value was chosen; it is now as wide as its longest option, as a native select is, and ellipsizes past the available width. The gradient-triangle caret is replaced by the stroked chevron (shared with `Accordion` through an internal `css/chevron.ts`).

  - New generated classes `sw-select-value`, `sw-select-value-text` and `sw-select-value-sizer`. The trigger's text content and accessible value are still only the current label.

  A visible change to every `Select`. No API change and no new dependencies.

## 1.11.0

### Minor Changes

- 6bc2412: Additive. The stylesheet sets `--sw-color-accentSubtle`, the accent tint
  from `@scalewing/tokens`, and each palette file and `data-palette` rule
  retints it wherever the palette moves the accent or surface. Consumer
  request: `docs/requests/futmas-accent-subtle.md`.

### Patch Changes

- Updated dependencies [6bc2412]
  - @scalewing/tokens@1.4.0

## 1.10.1

### Patch Changes

- 7c27935: `ActionMenu` places its menu with the shared anchored-popover code that the `DateField` and `CalendarButton` calendar use (`docs/requests/teisoro-action-menu.md`, 2026-09-28 follow-up). The menu now opens a `space-1` (4 px) gap below its trigger, or above it when it only fits there, keeps at least `space-2` (8 px) from every viewport edge, and aligns to the trigger's inline start (its right edge in right-to-left), or to the trigger's other edge when the trigger ends a row and the menu would not fit from its start. Before, it sat directly on the trigger and was pushed flush against the screen edge.

  - The menu element is rendered only while it is open, like the calendar; it was a `hidden` element before. `aria-controls` already pointed at it only while open. A test that looked for the closed menu with `{ hidden: true }` now finds nothing.
  - `.sw-action-menu-list` is as wide as its longest command (`width: max-content`, at least the 44 px control height) up to the viewport less both insets, so a long command wraps inside the screen instead of running off it. It resets the popover layer's `inset`, so the placed position holds in right-to-left documents too. Commands take the label line height with a `space-1` block padding, still 28 px tall on one line.
  - The unused `.sw-action-menu-list[hidden]` rule is gone.

  No API change and no new dependencies.

- ab61ca6: `ActionMenu` gives a coarse pointer the 44 px touch target (`docs/requests/teisoro-action-menu.md`, 2026-09-28 touch-target follow-up). Under `@media (pointer: coarse)` the trigger is at least `--sw-control-md-min-height` (44 px) tall and wide, and each command at least 44 px tall; a fine pointer keeps the compact xs height. This follows `CalendarButton`'s coarse-pointer rule, and both now read the target from one internal module.

  Visual change on touch screens only. No API change and no new dependencies.

- df1fa80: The `ActionMenu` menu and the `DateField` and `CalendarButton` calendar are placed again when the popover or its anchor changes size while open, such as commands that change while the menu is open or a month with another row of weeks (`docs/requests/teisoro-action-menu.md`, 2026-09-28 placement follow-up). Before, their shared placement ran only on opening, scroll and window resize. It uses `ResizeObserver` where the runtime has it.

  No API change and no new dependencies.

- 91665ce: The `DateField` and `CalendarButton` calendar and the `ActionMenu` menu now fit the viewport a classic scrollbar leaves (`docs/requests/teisoro-action-menu.md`, 2026-09-28 placement follow-up). Their shared placement measured `window.innerWidth` and `innerHeight`, which include a classic scrollbar, so a popover clamped to the right edge could sit under the scrollbar instead of `space-2` from it. It now measures the root element's client box. The calendar's `max-width` is `100%` of the top layer less both insets instead of `100vw`, as the menu's is.

  Only pages with classic (non-overlay) scrollbars change. No API change and no new dependencies.

- 7b4058e: `Text` drops the browser's paragraph and heading margins (`docs/requests/teisoro-text.md`). Its `p` and `h1`–`h4` elements kept about 1em of margin above and below, which a flex `Stack` or `Inline` adds to its `gap`. A generated `:where(.sw-text-*) { margin: 0; }` rule removes it at zero specificity, so an authored margin (`sw-sr-only`, a consumer class) still wins.

  Visual change: text in a `Stack` or `Inline` sits at the `gap` the page asked for, so dialog titles, section headings and card text are tighter. A page that needs more space raises its `gap`. No API change and no new dependencies.

## 1.10.0

### Minor Changes

- 964e461: New `CalendarButton`: an icon-only `Button` that opens the `DateField` calendar dialog for a date the page already shows, such as a day heading with its own previous and next buttons (`docs/requests/teisoro-calendar-button.md`).

  - Props: `label`, `value` (`YYYY-MM-DD`, never empty), `onChange`, and optional `min`, `max`, `disabled`, `locale`, `weekStartsOn`, `id`, `labels` (the calendar's words `previousMonth`, `nextMonth`, `month`, `year`, `today`, and `nameSeparator`), `size` (`xs`, `sm`, `md`; default `md`), and `variant` (a Button variant; default `ghost`). A `ref` reaches the `<button>`. New types `CalendarButtonProps` and `CalendarButtonLabels`.
  - The accessible name is `label`, `labels.nameSeparator` (default `", "`, overridable per locale, such as `"、"` in Japanese), then the spoken date ("Choose survey day, Tuesday, September 22, 2026"), with `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` while open. Enter, Space, or a press opens the calendar on `value` (a `value` outside `min`/`max` is kept, as on `DateField`, and the calendar opens on the nearest allowed day); choosing a day calls `onChange`, closes, and returns focus to the button; Escape and a press outside close without a change.
  - An empty or invalid `value`, invalid bounds, locale, week start, or calendar words throw a `RangeError` with `DateField`'s messages. Two errors are new: `label must be non-empty text` and `labels.nameSeparator must be non-empty text`.
  - New generated class `sw-calendar-button`: square at every Button size, and at least the 44 px md control height on a coarse pointer. The calendar reuses `sw-date-field-calendar` and its existing stacking layer.

  No new dependencies.

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
