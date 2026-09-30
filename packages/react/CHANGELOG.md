# @scalewing/react

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
