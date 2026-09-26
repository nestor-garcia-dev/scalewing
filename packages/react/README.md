# @scalewing/react

DOM components plus the generated Scalewing stylesheet.

```ts
import '@scalewing/react/styles.css';
import '@scalewing/react/palette/cerulean.css';
import {
  Accordion,
  ActionMenu,
  BarChart,
  Box,
  Button,
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

`Box hideBelow="md"` hides a region under 48rem and `hideFrom="md"` hides it at 48rem and wider, so a product can swap a wide layout for a narrow one without its own stylesheet. Hidden regions leave the accessibility tree; do not use this to protect data. `Box as="a"` is a layout link. Use `Button` for press actions. `Field` associates a native `<input>` or `<select>` with a label and token gap; native text controls inherit the generated document canvas. `Select` is a labeled listbox menu when the open list must match the canvas.

`Field` supports optional `description`, `error`, and `required` on one native input, select, or textarea child. It preserves an existing `aria-describedby`, appends a stable message ID, and replaces the hint with an alert when an error is supplied. `error` sets `aria-invalid` and token-owned invalid styling. The consumer owns validation and localized messages.

`ActionMenu` opens independent commands from a labelled button. Provide localized command labels and callbacks; use `disabled` for unavailable commands and `destructive` for a dangerous command's presentation. Escape and choosing a command both return focus to the trigger (before the command runs, so a `Dialog` it opens hands focus back to the trigger on close), and outside interaction dismisses the menu.

`Dialog` is a modal `<dialog>` controlled by `open`. Escape, a backdrop press, a platform close request, and a `<form method="dialog">` submit (or a submitter with `formmethod="dialog"`) are each prevented and call `onClose`; none of them closes the dialog itself. A consumer `onKeyDown`, `onCancel`, `onSubmit` or `onPointerDown` that prevents the event vetoes that request. Escape in a search field that holds text clears the field first, and a descendant's own `cancel` (a dismissed file picker) is not a close request. Set `open` to false to close it, or keep it true (for example while a form is saving) and it stays shown. `onClose` is not called when `open` turns false, and it is required: a dialog that must not be dismissed passes a callback that keeps `open` true.

`Switch` is a controlled on/off input. It keeps native checkbox keyboard behavior and exposes switch semantics. Provide the current `checked` value and update it in `onCheckedChange`.

`Checkbox` is a controlled native checkbox for one independent form or confirmation choice. `checked` and `onCheckedChange` own its state. The consumer supplies `error` after validation to announce and style an invalid choice; `required` retains native form semantics.

`RadioGroup` is a controlled fieldset of native radio choices. Supply a unique nonempty `value` for each option, one selected `value` or an empty value for no selection, a `legend`, and `onChange`. Long labels wrap in a vertical group. The consumer provides localized option labels and validation `error`; `required` keeps native form semantics.

`Spinner` shows indeterminate loading in small, medium, or large sizes. Supply localized `label` for the one announced status in a loading region. Use `decorative` on additional indicators beside that status so screen readers do not hear the same message repeatedly. Reduced motion leaves a static accented ring.

`Progress` shows a known value between zero and a positive maximum. It uses native progressbar semantics and displays the value and maximum beside the localized label. Invalid bounds throw instead of silently clamping. Optional `tone` is `accent`, `success`, or `danger`.

`Tooltip` adds supplementary plain-text help to one labelled, focusable trigger. Supply localized `content` and an existing trigger element with its own accessible name. It opens on hover or focus, closes on pointer leave, blur, Escape, or outside touch, and toggles on touch. Keep required instructions visible outside the tooltip.

`Separator` divides sections with a token-colored line. It is horizontal by default; use `orientation="vertical"` in a flex row. Set `decorative` when the line only supports layout so assistive technology ignores it.

`Card` defaults to `glass`; `outlined` and `elevated` are solid surfaces, and `filled` is a quiet `--sw-color-subtle` fill with no border for plain information apart from pressable rows.

`Text` steps `display` and `heading` down to the compact token sizes below the `md` breakpoint; consumers do not size type per viewport.

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

`DenominationGrid` shows integer counts per unit across a fixed set of columns. The `strip` layout is a captioned table: each row has a toned label with an icon slot, muted zero cells, optional signed deltas toned by sign, and an optional consumer-formatted `total` that moves under the label on a phone. The `tiles` layout stacks the column label, the count, and an optional `subtotal` string per column. The primitive does no arithmetic and no currency formatting; tones reuse the Badge vocabulary. Invalid columns, rows, or cells throw.

`FilterChips` presents a long, wrapping single-choice filter set. Provide a localized group `label`, controlled `value`, `onChange`, and options with stable values and localized labels. An optional non-negative integer `count` renders as a tabular chicklet after the label and is part of the option's accessible name; a zero count quiets the chip until it is selected. Native radios provide arrow and Space navigation; disabled options are skipped.

`DateField` is a controlled native date input. Supply `value`, `min`, and `max` as valid `YYYY-MM-DD` dates; use an empty `value` for a blank field. Its callback returns a date-only string or an empty string, without timezone conversion. Invalid serialized dates and inverted bounds throw; a value outside the bounds remains visible with invalid styling. For a blank required field, supply `error` when form validation runs to show the message and invalid styling. The browser chooses the calendar and localized display.

```tsx
<DateField
  label="Sighting date"
  value={sightingDate}
  onChange={setSightingDate}
  min="2024-01-01"
  max="2024-12-31"
/>
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
