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
  FilterChips,
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

`Box as="a"` is a layout link. Use `Button` for press actions. `Field` associates a native `<input>` or `<select>` with a label and token gap; native text controls inherit the generated document canvas. `Select` is a labeled listbox menu when the open list must match the canvas.

`Field` supports optional `description`, `error`, and `required` on one native input, select, or textarea child. It preserves an existing `aria-describedby`, appends a stable message ID, and replaces the hint with an alert when an error is supplied. `error` sets `aria-invalid` and token-owned invalid styling. The consumer owns validation and localized messages.

`ActionMenu` opens independent commands from a labelled button. Provide localized command labels and callbacks; use `disabled` for unavailable commands and `destructive` for a dangerous command's presentation. Escape returns focus to the trigger, and outside interaction dismisses the menu.

`Switch` is a controlled on/off input. It keeps native checkbox keyboard behavior and exposes switch semantics. Provide the current `checked` value and update it in `onCheckedChange`.

`Checkbox` is a controlled native checkbox for one independent form or confirmation choice. `checked` and `onCheckedChange` own its state. The consumer supplies `error` after validation to announce and style an invalid choice; `required` retains native form semantics.

`RadioGroup` is a controlled fieldset of native radio choices. Supply a unique nonempty `value` for each option, one selected `value` or an empty value for no selection, a `legend`, and `onChange`. Long labels wrap in a vertical group. The consumer provides localized option labels and validation `error`; `required` keeps native form semantics.

`Spinner` shows indeterminate loading in small, medium, or large sizes. Supply localized `label` for the one announced status in a loading region. Use `decorative` on additional indicators beside that status so screen readers do not hear the same message repeatedly. Reduced motion leaves a static accented ring.

`Progress` shows a known value between zero and a positive maximum. It uses native progressbar semantics and displays the value and maximum beside the localized label. Invalid bounds throw instead of silently clamping. Optional `tone` is `accent`, `success`, or `danger`.

`Tooltip` adds supplementary plain-text help to one labelled, focusable trigger. Supply localized `content` and an existing trigger element with its own accessible name. It opens on hover or focus, closes on pointer leave, blur, Escape, or outside touch, and toggles on touch. Keep required instructions visible outside the tooltip.

`Separator` divides sections with a token-colored line. It is horizontal by default; use `orientation="vertical"` in a flex row. Set `decorative` when the line only supports layout so assistive technology ignores it.

`FilterChips` presents a long, wrapping single-choice filter set. Provide a localized group `label`, controlled `value`, `onChange`, and options with stable values and localized labels. Counts belong in those labels. Native radios provide arrow and Space navigation; disabled options are skipped.

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
