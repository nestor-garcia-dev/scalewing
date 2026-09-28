# @scalewing/react

DOM components plus the generated Scalewing stylesheet.

```ts
import '@scalewing/react/styles.css';
import '@scalewing/react/palette/cerulean.css';
import {
  Accordion,
  ActionBar,
  ActionMenu,
  BarChart,
  Box,
  Button,
  CalendarButton,
  Card,
  Checkbox,
  RadioGroup,
  Spinner,
  Progress,
  Tooltip,
  Separator,
  DenominationGrid,
  FilterChips,
  Grid,
  DateField,
  Field,
  Select,
  Switch,
  Split,
  Stack,
  Text,
  ThemeProvider,
} from '@scalewing/react';

<ThemeProvider colorScheme="system" palette="cerulean">
  {children}
</ThemeProvider>
```

`colorScheme` is `"light"`, `"dark"`, or `"system"` so product users can switch. Each named palette already has a light pair and a dark pair. Brand overlays may be a flat `colors` map or `{ light, dark }` so both schemes are declared once.

```html
<div class="sw-padding-top-4 sw-padding-x-4"></div>
```

Import the CSS once at the application entry. Do not copy it into your source tree. Optional: import one `@scalewing/react/palette/<id>.css` file after it, or set `data-palette` on the `data-theme` node. React apps can set `palette` on `ThemeProvider` instead.

`Box` `border` draws a hairline in the `border` color token: `border` (or `border={true}`) is solid, and `border="dashed"` is dashed (the generated `sw-border` and `sw-border-dashed` classes; a `style` you pass still wins), for a space to fill in by hand such as a blank on a printed form. It does not make the box look or act like an input. Every `Box`-based component takes it.

`Box hideBelow="md"` hides a region under 48rem and `hideFrom="md"` hides it at 48rem and wider, so a product can swap a wide layout for a narrow one without its own stylesheet. Hidden regions leave the accessibility tree; do not use this to protect data. `Box as="a"` is a layout link. Use `Button` for press actions. `Field` associates a native `<input>` or `<select>` with a label and token gap; native text controls inherit the generated document canvas. `Select` is a labeled listbox menu when the open list must match the canvas.

`Field` supports optional `description`, `error`, and `required` on one native input, select, or textarea child. It preserves an existing `aria-describedby` and appends a stable ID for the hint, or for the error, which replaces the hint on screen while it is supplied. `error` sets `aria-invalid` and token-owned invalid styling. The error sits in a polite live region (`aria-live="polite"`) that is always rendered, empty while there is no error, so an error that appears while the person types, or after a submit, is announced once, politely, when its text is swapped in; it is never `role="alert"`, so a submit that finds several errors does not fire several assertive alerts at once. Empty, the region takes no room in the layout. The consumer owns validation and localized messages, and after a refused submit it moves focus to the first invalid control (or to one form-level summary). `Checkbox`, `RadioGroup` and `DateField` expose their `error` the same way.

`Field` `prefix` and `suffix` put short text such as `$` or `%` inside the frame of one native `<input>` child, before or after the value. The text is not part of the value; the input is named by its label plus the adornment (`"Drop amount $"`), unless it names itself with its own `aria-label` or `aria-labelledby`, in which case the adornment joins its description. A press anywhere on the frame focuses the input. Formatting the value stays with the consumer. Any other child throws a `TypeError`.

```tsx
<Field label="Drop amount" prefix="$">
  <input inputMode="decimal" name="drop" />
</Field>
```

`Accordion` is a native `<details>` disclosure controlled by `open` and `onOpenChange`. A token chevron at the end of the header replaces the browser triangle and turns when it opens (it holds still under reduced motion). `subtitle` adds one muted caption line under the title, such as a summary of what the section holds; it wraps rather than truncating and is read after the title. `size="sm"` is a quieter disclosure nested inside other content: a label-size title, tighter padding, smaller corners and a header that is an `sm` control (at least 32px).

```tsx
<Accordion
  open={open}
  onOpenChange={setOpen}
  subtitle="Twelve sightings · Two nests"
  title="Wetlands"
>
  <Accordion
    open={methodOpen}
    onOpenChange={setMethodOpen}
    size="sm"
    title="How the count is taken"
  >
    {method}
  </Accordion>
</Accordion>
```

`ActionBar` keeps the actions of a long page on a glass bar stuck to the bottom of the viewport, with an optional one-line `status` (such as when the work was last saved). Put it last in the content it acts on: it stays stuck while that content scrolls by and then rests in its own place at the end. `stickyBelow="md"` sticks only on a phone and leaves the bar in page flow from `md` up. The bar clears `env(safe-area-inset-bottom)` (set `viewport-fit=cover` in the page's viewport meta for the inset to apply). Its children are the actions: on a phone they share one row under the status. The status is a polite live region (`role="status"`, kept in the page even while empty), so a new status such as "Draft saved at 5:00 PM" is announced; do not announce the same save a second time with your own notice. An open `Select`, `ActionMenu` or `Tooltip` paints over the bar, including inside a glass `Card` or `Accordion`.

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

A `Button` that toggles something passes `aria-pressed`. The pressed button gets a 2 px accent ring outside its fill, past a 2 px gap in `--sw-color-background`, so the ring meets only the page and keeps the accent's contrast on the canvas (4.5:1 or more in every palette, at least the 3:1 a state indicator needs) whatever its `variant` or fill. A focused pressed button moves its focus outline out past the ring. In forced colors, which drop shadows, the pressed button is filled with the system highlight. An unpressed button is drawn at full strength, so its label keeps its contrast. To make the choice stand out further, give the pressed button `primary` and the others `secondary`.

`Badge` is a non-interactive chicklet with a `tone` (`neutral`, `accent`, `success`, `danger`, `warning`) and a `size` (`md`, or `sm` for a table cell). A badge inside a filled `Button` (every variant but `ghost`) sits on `--sw-color-surface` with its words in the text color and its tone on its border, so it reads at 4.5:1 in every palette whatever the button's fill.

`ActionMenu` opens independent commands from a labelled button. Provide localized command labels and callbacks; use `disabled` for unavailable commands and `destructive` for a dangerous command's presentation. Escape and choosing a command both return focus to the trigger (before the command runs, so a `Dialog` it opens hands focus back to the trigger on close), and outside interaction dismisses the menu. The open menu sits on the popover layer a `space-1` gap below its trigger (above it when it only fits there), at least `space-2` from every viewport edge (a classic scrollbar is not part of the viewport), and aligned to the trigger's inline start (its right edge in right-to-left), or to its other edge when the trigger ends a row and the menu would not fit from its start. `align="end"` (default `"start"`) lines the menu up with the trigger's inline end even where the start would fit, for a trigger that ends a card or a list row, so the menu stays over that card instead of hanging past it; it takes the start when the end would leave the screen. The menu is as wide as its longest command up to the viewport less both insets, and a longer command wraps. The menu follows its trigger through scroll, window resize, and a change in the menu's or the trigger's size. The menu is in the DOM only while it is open. The trigger and its commands use the compact xs control height for a fine pointer; on a coarse pointer the trigger is at least 44 × 44 px (the md control height, as on `CalendarButton`) and every command is at least 44 px tall.

`Dialog` is a modal `<dialog>` controlled by `open`. Escape, a backdrop press, a platform close request, and a `<form method="dialog">` submit (or a submitter with `formmethod="dialog"`) are each prevented and call `onClose`; none of them closes the dialog itself. A consumer `onKeyDown`, `onCancel`, `onSubmit` or `onPointerDown` that prevents the event vetoes that request. Escape in a search field that holds text clears the field first, and a descendant's own `cancel` (a dismissed file picker) is not a close request. Set `open` to false to close it, or keep it true (for example while a form is saving) and it stays shown. `onClose` is not called when `open` turns false, and it is required: a dialog that must not be dismissed passes a callback that keeps `open` true.

`Switch` is a controlled on/off input. It keeps native checkbox keyboard behavior and exposes switch semantics. Provide the current `checked` value and update it in `onCheckedChange`.

`Checkbox` is a controlled native checkbox for one independent form or confirmation choice. `checked` and `onCheckedChange` own its state. The consumer supplies `error` after validation to describe and style an invalid choice (associated by `aria-describedby` with `aria-invalid` and announced from a polite live region, as `Field`'s error is, never an alert); `required` retains native form semantics.

`RadioGroup` is a controlled fieldset of native radio choices. Supply a unique nonempty `value` for each option, one selected `value` or an empty value for no selection, a `legend`, and `onChange`. Long labels wrap in a vertical group. The consumer provides localized option labels and validation `error`; `required` keeps native form semantics.

`Spinner` shows indeterminate loading in small, medium, or large sizes. Supply localized `label` for the one announced status in a loading region. Use `decorative` on additional indicators beside that status so screen readers do not hear the same message repeatedly. Reduced motion leaves a static accented ring.

`Progress` shows a known value between zero and a positive maximum. It uses native progressbar semantics and displays the value and maximum beside the localized label. Invalid bounds throw instead of silently clamping. Optional `tone` is `accent`, `success`, or `danger`. `showCount={false}` hides the visible `value / max` count when the page shows its own count caption, so the count appears once; the progress bar still exposes its value and maximum.

`Tooltip` adds supplementary plain-text help to one labelled, focusable trigger. Supply localized `content` and an existing trigger element with its own accessible name. It opens on hover or focus, closes on pointer leave, blur, Escape, or outside touch, and toggles on touch. Keep required instructions visible outside the tooltip.

`Separator` divides sections with a token-colored line. It is horizontal by default; use `orientation="vertical"` in a flex row. Set `decorative` when the line only supports layout so assistive technology ignores it.

`Card` defaults to `glass`; `outlined` and `elevated` are solid surfaces, and `filled` is a quiet `--sw-color-subtle` fill with no border for plain information apart from pressable rows.

`--sw-color-accentSubtle` is the accent tint from `@scalewing/tokens`: a quiet fill behind accent text or glyphs that keeps 4.5:1. The stylesheet and every palette file set it, and a palette that moves the accent or surface retints it.

`Text` steps `display` and `heading` down to the compact token sizes below the `md` breakpoint; consumers do not size type per viewport.

`Text` has no margin of its own. Its default `p` and `h1`–`h4` elements drop the browser's block margins, so the `gap` of the `Stack` or `Inline` around it alone sets the spacing; put more space in that `gap`, not in a margin. The reset has zero specificity (`:where(.sw-text-*)`), so an authored margin, such as `sw-sr-only` or a consumer class, still applies.

`Text` takes an optional `align` (`start`, `center`, `end`) mapped to generated `sw-text-align-*` classes, for a heading that must stay centered when it wraps.

`Grid` places children in one to four (or six) equal-width columns with a token `gap` step. `columnsBelow={{ md: 2 }}` drops to fewer columns below the `md` breakpoint so tiles and stat cards stay readable on a phone. It accepts every `Box` prop.

Every `Box`-based component (`Box`, `Stack`, `Inline`, `Card`, `Grid`, …) takes `columnSpan` (1, 2, 3, 4 or 6) to cover several columns of the `Grid` it sits in directly, through the generated `sw-grid-span-*` classes. A span is capped at the columns the grid has at the current width, so it never adds an implicit column, and `columnsBelow` still decides the phone layout. A form about twice the width of a side panel, stacking below `md`:

```tsx
<Grid columns={3} columnsBelow={{ md: 1 }} gap={4}>
  <Stack columnSpan={2} gap={4}>
    {form}
  </Stack>
  <Card variant="outlined">{panel}</Card>
</Grid>
```

Values outside the catalog throw a `RangeError`. There is no per-breakpoint span and no arbitrary column template.

`Grid` `align` (`start`, `center`, `end`, `stretch`) sets where each child sits in the height of its row, with the same generated `sw-align-*` classes as `Stack` and `Inline`. Unset, children stretch. `align="end"` keeps a row of fields level when one label wraps:

```tsx
<Grid align="end" columns={2} gap={3}>
  <Field label="Nest height above the waterline">{heightInput}</Field>
  <Field label="Eggs">{eggsInput}</Field>
</Grid>
```

`DenominationGrid` shows integer counts per unit across a fixed set of columns. The `strip` layout is a captioned table: each row has a toned label with an icon slot, muted zero cells, optional signed deltas toned by sign, and an optional consumer-formatted `total` that shows under the label on a phone. Pass `totalLabel` (for example "Total") to name the total column for a screen reader: it renders a visually hidden `th scope="col"`, and without it the corner stays an empty cell as before (either way the column takes no width on a phone). On a phone the total cell stays in the table, visually hidden, so a screen reader still reads each total in its row; the copy under the label is `aria-hidden`. A strip wider than its container scrolls sideways inside its own keyboard-focusable region, named after `label`, with the row labels pinned at the start; the page never scrolls sideways. The `tiles` layout stacks the column label, the count, and an optional `subtotal` string per column. Each tiles row shows its label line (icon, label and `total`) when the grid has several rows, or when a lone row has an icon or a `total`; a lone plain row is named by the grid's `label` alone. The primitive does no arithmetic and no currency formatting; tones reuse the Badge vocabulary. Invalid columns, rows, or cells throw.

`FilterChips` presents a long, wrapping single-choice filter set. Provide a localized group `label`, controlled `value`, `onChange`, and options with stable values and localized labels. An optional non-negative integer `count` renders as a tabular chicklet after the label and is part of the option's accessible name; a zero count quiets the chip until it is selected: it drops its glass fill and sets its label in the muted color (4.5:1 in every palette), without fading, since it can still be chosen. Native radios provide arrow and Space navigation; disabled options are skipped.

`DateField` is a controlled date-only field that draws its own calendar. Supply `value`, `min`, and `max` as valid `YYYY-MM-DD` dates; use an empty `value` for a blank field. Its callback returns a date-only string or an empty string, without timezone conversion. Invalid serialized dates and inverted bounds throw; a value outside the bounds remains visible with invalid styling. `required` marks the label with the same `aria-hidden` asterisk as `Field` and sets the entry's native `required`. For a blank required field, supply `error` when form validation runs to show the message and invalid styling.

People type the date into a text entry in the locale's numeric order (`MM/DD/YYYY` for en-US, `DD/MM/YYYY` for es), with any non-digit separator, eight bare digits, or ISO `YYYY-MM-DD`. A keystroke calls `onChange` once the entry is complete, meaning its last field is at full width (four year digits, or two digits for a trailing day or month, as in ISO); otherwise the date commits when the person leaves the field or presses Enter, so typing `2024-03-10` never sends `2024-03-01` on the way. If the parent keeps the old value, the typed text stays on screen; any other outside change replaces it. Text that is not a date keeps the last value and, once the person leaves the field, sets `aria-invalid` and shows `labels.invalidEntry`. Like the native date input, the entry blocks form submission through `setCustomValidity`: `labels.invalidEntry` while its text is not a date, and `labels.outOfRange` while its date, typed or given, is outside `min`/`max`. The calendar button beside it opens a WAI-ARIA date picker dialog anchored under the field on the popover layer: the month grid shows today, the selected day, and days outside `min`/`max` as `aria-disabled` (padding before `0001-01-01` or after `9999-12-31` is blank and inert); arrows move by day and week, Home and End to the week's edges, PageUp and PageDown by month, Shift with them by year, Enter or Space selects and closes, and Escape closes and returns focus to the button. Month and year selectors in the header jump decades (the year list spans 120 years back and 20 ahead of today and the shown month, cut to `min` and `max`; the month list offers only months with a day inside them). A new `value`, `min`, or `max` while the calendar is open moves it to the new value or back inside the bounds. **Today** selects today; **Clear** appears only when the field is not `required`.

`locale` (BCP 47) sets month and weekday names, spoken dates, and the typed order; it defaults to the nearest `lang` attribute when the field mounts, then `en-US`, and a malformed tag throws. `weekStartsOn` is `0` (Sunday, the default) or `1` (Monday). `labels` overrides the control's own words, English by default: `chooseDate`, `previousMonth`, `nextMonth`, `month`, `year`, `today`, `clear`, `invalidEntry`, `outOfRange`, and the placeholder letters `dayPlaceholder`, `monthPlaceholder`, `yearPlaceholder`. The field label names only the text entry; the calendar button is named `labels.chooseDate` and described by the field label, so tests find the entry with `getByLabel` or `getByRole('textbox', { name })`.

```tsx
<DateField
  label="Sighting date"
  value={sightingDate}
  onChange={setSightingDate}
  min="2024-01-01"
  max="2024-12-31"
/>

<DateField
  label="Fecha del avistamiento"
  locale="es"
  weekStartsOn={1}
  labels={{ chooseDate: 'Elegir fecha', today: 'Hoy', clear: 'Borrar' }}
  value={fecha}
  onChange={setFecha}
/>
```

`CalendarButton` is an icon-only `Button` that opens the same calendar dialog for a date the page already shows, such as a day heading with its own previous and next steps: `‹ Tuesday, September 22, 2026 [calendar] ›`. It has no text entry and no empty value. Supply `label` (what pressing it does, such as "Choose survey day"), a `YYYY-MM-DD` `value`, and `onChange`; optional `min`, `max`, `disabled`, `locale`, and `weekStartsOn` behave as on `DateField`, and `id` and a `ref` reach the `<button>`. `labels` takes the calendar's words (`previousMonth`, `nextMonth`, `month`, `year`, `today`) and `nameSeparator`. The button's accessible name is `label`, `labels.nameSeparator` (default `", "`), then the spoken date (`"Choose survey day, Tuesday, September 22, 2026"`); pass the locale's own pause where a comma does not fit, such as `"、"` in Japanese. It comes with `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` while open; the calendar dialog is named by `label`. Enter, Space, or a press opens it on `value`. As on `DateField`, a `value` outside `min`/`max` is kept rather than refused, and the calendar then opens on the nearest allowed day with `value` shown selected and disabled; a button has no invalid state, so the page that shows the date flags it if it must. Choosing a day or **Today** calls `onChange` with the new date only when it changed, closes, and returns focus to the button; Escape closes without a change and returns focus; a press outside closes without a change and leaves focus where it landed. An empty or malformed `value`, `min`, or `max`, inverted bounds, a bad `locale` or `weekStartsOn`, an empty `label`, or an empty label word throws a `RangeError`. `size` (`xs`, `sm`, `md`; default `md`) and `variant` (default `ghost`) follow `Button`; the button is square at every size, and on a coarse pointer it is at least 44 px at every size. Place it beside the heading, not inside it, so the heading's text stays only the date.

```tsx
<Inline gap={1}>
  <Button aria-label="Previous day" variant="ghost" onPress={previousDay}>
    ‹
  </Button>
  <Text as="h2" variant="title">
    {spokenSurveyDay}
  </Text>
  <CalendarButton
    label="Choose survey day"
    value={surveyDay}
    onChange={setSurveyDay}
    min="2026-09-01"
    max="2026-09-30"
  />
  <Button aria-label="Next day" variant="ghost" onPress={nextDay}>
    ›
  </Button>
</Inline>
```

```tsx
<Switch
  label="Active habitats only"
  checked={activeOnly}
  onCheckedChange={setActiveOnly}
  description="Hide archived habitats"
/>
```

```tsx
<ActionMenu
  label="Sighting actions"
  items={[
    { id: 'share', label: 'Share', onSelect: shareSighting },
    { id: 'archive', label: 'Archive', onSelect: archiveSighting },
  ]}
/>
```

React is a peer dependency. Rationale: the host app already owns the React runtime.
