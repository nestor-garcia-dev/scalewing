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
  SectionNav,
  Spinner,
  Progress,
  Tooltip,
  InfoTip,
  Separator,
  DescriptionList,
  DescriptionItem,
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

`Box hideBelow="md"` hides a region under 48rem and `hideFrom="md"` hides it at 48rem and wider, so a product can swap a wide layout for a narrow one without its own stylesheet. They also take `lg` (64rem), for content that fits only from a laptop up, such as a row of labelled destinations that a tablet shows as glyphs (name each glyph-only control, for example with `Tooltip relationship="label"`); the layout props keep `md`. `breakpointQuery('below', 'lg')` returns the query a hide class uses (`not all and (min-width: 64rem)`), for an app whose script must follow the same width. An unknown breakpoint throws a `RangeError`. Hidden regions leave the accessibility tree; do not use this to protect data. `Box as="a"` is a layout link. Use `Button` for press actions. `Field` associates a native `<input>` or `<select>` with a label and token gap; native text controls inherit the generated document canvas. `Select` is a labeled listbox menu when the open list must match the canvas.

`Field` supports optional `description`, `error`, and `required` on one native input, select, or textarea child. It preserves an existing `aria-describedby` and appends a stable ID for the hint, or for the error, which replaces the hint on screen while it is supplied. `error` sets `aria-invalid` and token-owned invalid styling. The error sits in a polite live region (`aria-live="polite"`) that is always rendered, empty while there is no error, so an error that appears while the person types, or after a submit, is announced once, politely, when its text is swapped in; it is never `role="alert"`, so a submit that finds several errors does not fire several assertive alerts at once. Empty, the region takes no room in the layout. The consumer owns validation and localized messages, and after a refused submit it moves focus to the first invalid control (or to one form-level summary). `Checkbox`, `RadioGroup` and `DateField` expose their `error` the same way. `invalid` marks the control invalid the same way (`aria-invalid` and the danger border, `Mark` in forced colors) without a message of its own, for fields whose one error is shown elsewhere, such as a count that adds up to nothing under a group of count fields: point each control's `aria-describedby` at that message so it is read with the field. The field's own polite region stays empty and its `description` stays on screen; `error` implies `invalid`. Passing `invalid`, even `invalid={false}` but not `invalid={undefined}`, needs one native control child and throws a `TypeError` on the first render otherwise, so a form learns it while the fields are valid, not on its first failed submit. `error` keeps its rule: it needs the native control only while it holds a message. `invalid` is `Field`'s only: `DateField`, `Select` and the other controls with `error` do not have it yet.

`Field` `changed` marks a value the person changed from a saved one, such as a field in a correction: the control's border, or an adorned field's frame, takes the accent color a hairline thicker (an inset shadow, so nothing moves; `Highlight` in forced colors), and its fill takes a 12 % accent tint over its own background, so a changed field reads apart from the focused one, whose ring never tints. The value keeps 4.5:1 or more on the tint in every palette; the tint is on text controls and selects (not a range, color or file input), a select's chevron stays where its size puts it, while a placeholder shows the fill stays plain, on the tint an adorned field's prefix and suffix take the text color, and forced colors drop the tint. It is a cue beside the words, so say what the value was in `description`; it sets no ARIA state, and `invalid` and `error` win over it. Like `invalid`, passing it, even `false` but not `undefined`, needs one native control child from the first render (a `TypeError` otherwise).

```tsx
<Field invalid={countIsZero} label="$1 bills">
  <input aria-describedby={countIsZero ? countErrorId : undefined} />
</Field>
```

An element a script focuses, such as a notice or a card announced after a save, takes the same accent focus ring as the canvas's links and native controls, 2 px past its edge (`--sw-focus-ring-width` and `--sw-focus-ring-offset`), instead of the browser's outline. Give it `tabIndex={-1}`, so it takes focus from a script but is no tab stop, and put the focus on the whole card rather than its text, so the ring goes round it clear of the words; a `Box` round the card with the card's `radius` makes the ring follow its corners. As with the browser's own outline, the ring shows only when focus is visible (`:focus-visible`): after a keyboard press, not after a mouse press. The rule has zero specificity, so a component's own ring always wins.

```tsx
<Box ref={notice} tabIndex={-1} radius="lg" role="status">
  <Card padding={4} variant="outlined">
    <Text as="p">Survey saved.</Text>
  </Card>
</Box>
```

A disabled native text control (`<input>`, `<select>` or `<textarea>` on the canvas, a `Field` frame with a `prefix` or `suffix`, or a `DateField` entry) takes the quiet subtle fill, a dashed border and a not-allowed cursor. Its value stays in the text color at full strength, so a locked value is still readable; forced colors keep the dashed border in the system's disabled color. A typed input's placeholder, enabled or disabled, is drawn in the muted color, which keeps 4.5:1 on the field in every palette.

`Field` `prefix` and `suffix` put short text such as `$` or `%` inside the frame of one native `<input>` child, before or after the value. The text is not part of the value; the input is named by its label plus the adornment (`"Drop amount $"`), unless it names itself with its own `aria-label` or `aria-labelledby`, in which case the adornment joins its description. A press anywhere on the frame focuses the input. Formatting the value stays with the consumer. Any other child throws a `TypeError`.

```tsx
<Field label="Drop amount" prefix="$">
  <input inputMode="decimal" name="drop" />
</Field>
```

`Select` is a labeled listbox menu: supply `label`, `options` (`value` and `label`), a controlled `value` and `onChange`; `size="xs"` and `labelVisuallyHidden` are for toolbar chrome, and `action` is a last listbox command that never becomes the value. The closed trigger matches `Field`: its text is centred in the control, it ends in the `Accordion` chevron, and it is as wide as its longest option (as a native select is), so it keeps its width when the value changes; past the available width the label ellipsizes. The option labels that size it are drawn by CSS from `data-label`, so the trigger's text content and accessible value are only the current label. Its label is drawn as `Field`'s (the same label words and mark inside a `<label>` that keeps the canvas type), so a `Select` beside a `Field` lines up at the label and the control.

`Select` `placeholder` shows in the closed trigger, in the muted color, while `value` matches no option (such as `''`); it is not an option, is never selected in the list and never becomes the value, and it counts toward the trigger's width. `required` marks the label with `Field`'s `aria-hidden` asterisk and sets `aria-required` on the trigger. `error` renders a message under the control (`sw-field-error`), links it by `aria-describedby`, sets `aria-invalid` and the danger border; like `Field`'s it is announced politely from a live region that is always there, never as an alert, and an empty string is no error. A blank `placeholder` throws a `RangeError`.

```tsx
<Select
  error={reasonError}
  label="Reason"
  onChange={setReason}
  options={reasons}
  placeholder="Choose a reason"
  required
  value={reason}
/>
```

`Select` `width` is `'content'` (the default: the field is as wide as its longest option, as above) or `'full'`: the field and its trigger fill the container's inline size in a `Stack`, a `Grid` cell or any narrow column, such as a filter above full-width cards on a phone. In an `Inline` row it takes the space its siblings leave, so a `Button` beside it keeps its label on one line. The value still takes the free space and ellipsizes past it, the chevron stays at the inline end (the left, right to left), and the open list is exactly the trigger's width, so it never runs past the screen's edge; a long option wraps inside it, even a single long word.

```tsx
<Select
  label="Show"
  onChange={setFilter}
  options={filters}
  value={filter}
  width="full"
/>
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

`ActionBar` keeps the actions of a long page on a glass bar stuck to the bottom of the viewport, with an optional short `status` (such as when the work was last saved): a string, or a node such as a `Badge` and then a short line. Put it last in the content it acts on: it stays stuck while that content scrolls by and then rests in its own place at the end. `stickyBelow="md"` sticks only on a phone and leaves the bar in page flow from `md` up. The bar clears `env(safe-area-inset-bottom)` (set `viewport-fit=cover` in the page's viewport meta for the inset to apply). Its children are the actions: on a phone they share one row under the status. The status is a polite live region (`role="status"`, kept in the page even while empty), so a new status such as "Draft saved at 5:00 PM" is announced; do not announce the same save a second time with your own notice. The status is a `div` whose children sit on one row a `space-2` gap apart and wrap under one another when the row is full, so a line that does not fit beside its badge drops under it on a phone; put a phrase that mixes text and elements in one `span` so it wraps as a sentence. `undefined`, `null` or `false` leaves the status empty. An open `Select`, `ActionMenu` or `Tooltip` paints over the bar, including inside a glass `Card` or `Accordion`.

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

A `Button`'s own children are laid out in a row one token gap apart (spacing step 2, 8 px), so a glyph passed beside the label never touches it. Pass the glyph and the label as direct children. An icon-only button has one child and is unchanged, and a visually hidden name (`sw-sr-only`) is out of the flow, so it adds no gap. A label already wrapped in one element with its own gap, such as `<Inline as="span" gap={2}>`, is a single child and gets no second gap; it can drop the wrapper. A phrase split across elements, such as `Save <strong>draft</strong> now`, is several flex items: the spaces at their edges collapse, so its parts touched before and are a gap apart now. Put such a phrase in one element (`<span>Save <strong>draft</strong> now</span>`), where its word spaces are kept.

```tsx
<Button onPress={logSighting}>
  <Plus aria-hidden />
  Log sighting
</Button>
```

A `Button` that toggles something passes `aria-pressed`. The pressed button gets a 2 px accent ring outside its fill, past a 2 px gap in `--sw-color-background`, so the ring meets only the page and keeps the accent's contrast on the canvas (4.5:1 or more in every palette, at least the 3:1 a state indicator needs) whatever its `variant` or fill. A focused pressed button moves its focus outline out past the ring. In forced colors, which drop shadows, the pressed button keeps the forced button colors, so its label and any glyph or badge inside it stay readable, and draws the same ring and its own border in the system highlight (`Highlight`); nothing opts out of forced colors. An unpressed button is drawn at full strength, so its label keeps its contrast. To make the choice stand out further, give the pressed button `primary` and the others `secondary`.

`Badge` is a non-interactive chicklet with a `tone` (`neutral`, `accent`, `success`, `danger`, `warning`) and a `size` (`md`, or `sm` for a table cell). A badge inside a filled `Button` (every variant but `ghost`) sits on `--sw-color-surface` with its words in the text color and its tone on its border, so it reads at 4.5:1 in every palette whatever the button's fill.

`ActionMenu` opens independent commands from a labelled button. Provide localized command labels and callbacks; use `disabled` for unavailable commands and `destructive` for a dangerous command's presentation. Escape and choosing a command both return focus to the trigger (before the command runs, so a `Dialog` it opens hands focus back to the trigger on close), and outside interaction dismisses the menu. The open menu sits on the popover layer a `space-1` gap below its trigger (above it when it only fits there), at least `space-2` from every viewport edge (a classic scrollbar is not part of the viewport), and aligned to the trigger's inline start (its right edge in right-to-left), or to its other edge when the trigger ends a row and the menu would not fit from its start. `align="end"` (default `"start"`) lines the menu up with the trigger's inline end even where the start would fit, for a trigger that ends a card or a list row, so the menu stays over that card instead of hanging past it; it takes the start when the end would leave the screen. The menu is as wide as its longest command up to the viewport less both insets, and a longer command wraps. The menu follows its trigger through scroll, window resize, and a change in the menu's or the trigger's size. The menu is in the DOM only while it is open. The trigger and its commands use the compact xs control height for a fine pointer; on a coarse pointer the trigger is at least 44 × 44 px (the md control height, as on `CalendarButton`) and every command is at least 44 px tall.

`ActionMenu` `header` is a non-interactive block above the commands, such as who is signed in: each child a line of its own, in the caption size and the muted color, set off by a hairline. It sits outside the `role="menu"` element and the arrow keys, and is the menu's description (`aria-describedby`), read as the menu opens; `null`, `false` and `''` are no header. An item's `lang` (a BCP 47 tag) marks its label as another language than the page's, such as "English" on a Spanish page (WCAG 3.1.2).

```tsx
<ActionMenu
  header={
    <>
      <Text as="strong" variant="label">
        Estación Laguna Azul
      </Text>
      <Text as="span" color="muted" variant="caption">
        Aves acuáticas
      </Text>
    </>
  }
  items={[
    { id: 'language', label: 'English', lang: 'en', onSelect: toEnglish },
  ]}
  label="Estación Laguna Azul"
/>
```

`Dialog` is a modal `<dialog>` controlled by `open`. Escape, a backdrop press, a platform close request, and a `<form method="dialog">` submit (or a submitter with `formmethod="dialog"`) are each prevented and call `onClose`; none of them closes the dialog itself. A consumer `onKeyDown`, `onCancel`, `onSubmit` or `onPointerDown` that prevents the event vetoes that request. Escape in a search field that holds text clears the field first, and a descendant's own `cancel` (a dismissed file picker) is not a close request. Set `open` to false to close it, or keep it true (for example while a form is saving) and it stays shown. `onClose` is not called when `open` turns false, and it is required: a dialog that must not be dismissed passes a callback that keeps `open` true. The `title` is an `h3` in the title style by default; `titleLevel={2}` renders it as an `h2` in the same style, for a dialog whose own section labels are `h3` headings, so they read as parts of the dialog and not as its peers. The default stays `3` so existing dialogs keep their outline; any value other than `2` renders an `h3`. `sheetBelow="md"` makes the dialog a bottom sheet below `md`: docked to the bottom edge at the full viewport width, top corners rounded and bottom corners square, a `space-8` strip of backdrop above it, and bottom padding that clears `env(safe-area-inset-bottom)` (with `viewport-fit=cover`); it slides up on open unless reduced motion is asked for, and has no grabber, since there is no drag. From `md` up it is the centered dialog at its `size`. `closeLabel` (such as "Close") adds an icon-only ghost close button at the end of the title row, named by the label, which calls `onClose` like Escape; the title still names the dialog. The button is the dialog's first control, so the browser focuses it on open; give a field `autoFocus` to start there instead. Without `closeLabel` the dialog has no close button and its markup is unchanged.

`Toast` is an auto-dismiss confirmation on the popover layer, controlled by `open` and `onOpenChange`; it does not trap focus and closes after `timeoutMs` (default 800, or 6000 for a `warning` or `danger` toast, which must be read). `anchor` and `target` send it from a press to a destination. `tone` (`neutral` by default, `success`, `warning`, `danger`) tints its border and an optional consumer `icon` (a Lucide glyph, hidden from assistive technology); the message keeps the text color, so its words carry the meaning. A `danger` toast is announced as `role="alert"`, the others as `role="status"`, so do not wrap the message in another live region. A toast still dismisses itself: an error the person must act on belongs in the page. A toast is as wide as its message, up to the page's gutter (spacing step 4) on each side, so on a phone a long message wraps inside the gutter instead of running to the screen's edges.

`Switch` is a controlled on/off input. It keeps native checkbox keyboard behavior and exposes switch semantics. Provide the current `checked` value and update it in `onCheckedChange`.

`Checkbox` is a controlled native checkbox for one independent form or confirmation choice. `checked` and `onCheckedChange` own its state. The consumer supplies `error` after validation to describe and style an invalid choice (associated by `aria-describedby` with `aria-invalid` and announced from a polite live region, as `Field`'s error is, never an alert); `required` retains native form semantics.

`RadioGroup` is a controlled fieldset of native radio choices. Supply a unique nonempty `value` for each option, one selected `value` or an empty value for no selection, a `legend`, and `onChange`. Long labels wrap in a vertical group. The consumer provides localized option labels and validation `error`; `required` keeps native form semantics. An option's optional `icon` (a `ReactNode`, such as a Lucide glyph) sits between the radio and the label, in the text color and the option's gap; it is `aria-hidden`, so the radio's accessible name stays the `label` text, and a press on it chooses the option as the label does.

```tsx
<RadioGroup
  legend="Check type"
  onChange={setCheckType}
  options={[
    { value: 'personal', label: 'Personal check', icon: <User /> },
    { value: 'company', label: 'Company check', icon: <Building2 /> },
  ]}
  value={checkType}
/>
```

An option's optional `description` (a `ReactNode`) is secondary text for that option alone, such as its history. It is a muted caption after the label, at the row's inline end, while the two fit on one line; when they do not, and always below the `md` breakpoint, it wraps to a second line that starts under the label text, not under the radio. The label keeps the first line. An option with a description fills the group's width. The description is the radio's accessible description (`aria-describedby` on that option's input), while its name stays the `label` text, and a press on it chooses the option as the label does. A disabled option fades its description with the rest of the option. It may hold phrasing content such as a small `Badge`, but nothing interactive, because it sits inside the option's `<label>`. A description taller than the label, such as a default-size `Badge`, grows the row downward; the label stays on the radio's line. `undefined`, `null`, `false`, `true` and `''` are no description. Any other node is one, including `0` and a component that renders nothing, so pass `undefined` when there is nothing to say. The group's own `description` still describes the whole group.

```tsx
<RadioGroup
  legend="Sighting source"
  onChange={setSource}
  options={[
    {
      value: 'observer',
      label: 'Field observer',
      icon: <User />,
      description: <Badge size="sm">Most recent</Badge>,
    },
    {
      value: 'camera',
      label: 'Camera trap',
      icon: <Camera />,
      description: '2 sightings · last Sep 13, 2026',
    },
  ]}
  value={source}
/>
```

`SegmentedControl` is one exclusive choice shown as a track of segments (`role="radiogroup"`), named by `aria-label` or `aria-labelledby`, with a controlled `value` and `onChange`; `variant="filled"` gives every segment the same width and fills the selection with the accent, and `disabled` keeps the choice visible but inert. `error` puts a message under the track (`sw-field-error`), links it to the group by `aria-describedby` and sets `aria-invalid` and a danger outline on the group (`Mark` in forced colors); as `Field`'s it is announced politely from a live region that is always there, never as an alert, and an empty string is no error. `required` sets `aria-required` on the group; since the control has no label of its own, the element that labels it shows the mark. The track sits in a `.sw-segmented-field` wrapper that holds the message and takes the track's place in the layout, so a `ref` still reaches the `radiogroup`. `error` is for a control in a `Stack` or block layout, where the track keeps its width and the message wraps under it. While it shows a message the field is at least 24ch wide, capped at its container, so a short compact track does not squeeze the message into a column. In an `Inline` the field therefore grows and the rest of the row moves, while the track keeps its labels' width.

```tsx
<SegmentedControl
  aria-labelledby={directionLabelId}
  error={directionError}
  items={[
    { id: 'add', label: 'Add' },
    { id: 'remove', label: 'Remove' },
  ]}
  onChange={setDirection}
  required
  value={direction}
  variant="filled"
/>
```

`Tabs` is the strip for the sections of one page (`role="tablist"`, one `role="tab"` button per item; arrow keys, Home and End move and select), and `TabPanel` is each section's content, hidden while another tab is current. `sticky` (default `false`) keeps the strip at the top of the viewport, under `env(safe-area-inset-top)`, while a long panel scrolls under it, on the same layer as a sticky `AppHeader` (so a page uses one or the other at the top edge). The stuck strip is a full-bleed band of the page canvas, not a glass card: the canvas color at nine parts in ten over the glass blur, with the strip's hairline under it, solid canvas under Reduce Transparency and in forced colors. A sticky element only sticks within its parent: make the strip a direct child of the long page container that also holds the panels, not of a padded `Box` round the strip alone, and keep `overflow` visible on its ancestors. Put the page's side gutter on the title and the panels instead: each tab's inline padding is the md control's 16 px (spacing step 4), so the first label lines up with a `space-4` gutter when the strip runs edge to edge. A strip whose labels do not fit scrolls sideways, and while labels are scrolled out past an inline edge that edge draws the same inset shade as a wide `Table` (none in forced colors), so a phone shows there are more tabs.

`Nav` is a labelled `nav` of a workspace's destinations, links or buttons one token gap apart. A `Button` inside it is at least 44 × 44 px on a coarse pointer, whatever its `size`, so a compact row of destinations is still a touch target on a phone or a tablet.

`SectionNav` is the navigation between the sections of one area, such as a portal's pages: a labelled `nav` (`aria-label` or `aria-labelledby`) of links from `items` (`{ id, label, href, current?, icon? }`), quieter than a workspace's `Nav`. `current` is `'page'`, `'location'` (a page inside that section, such as a detail page under its list) or a boolean, written as `aria-current`; the current item is in the text color over an accent underline, or, from `verticalFrom` (a breakpoint) up, where the items stack as a side list, a bar at its start. `icon` is a decorative glyph before the label. `onNavigate` takes a plain press after preventing the browser's navigation, for a client router; a press with a modifier key or the middle button keeps the browser's behavior, and without `onNavigate` the links carry no handler, so a server component can render the nav. A coarse pointer gets 44 px targets. Empty or duplicate ids, empty labels and an unknown `verticalFrom` throw a `RangeError`. Use `Tabs` for panels on one page.

```tsx
<SectionNav
  aria-label="Reserve office"
  items={[
    { id: 'counts', label: 'Counts', href: '/office/counts', current: 'page' },
    { id: 'rangers', label: 'Rangers', href: '/office/rangers' },
  ]}
  onNavigate={(item) => navigate(item.href)}
  verticalFrom="md"
/>
```

```tsx
<Stack gap={3}>
  <Box paddingX={4}>
    <Text variant="title">Wetland reserve</Text>
  </Box>
  <Tabs
    aria-label="Reserve log"
    id="reserve"
    items={groups}
    onChange={setGroup}
    sticky
    value={group}
  />
  <Box paddingX={4}>
    <TabPanel id="birds" tabsId="reserve" value={group}>
      {birdLog}
    </TabPanel>
  </Box>
</Stack>
```

`Table` aligns data in rows inside its own keyboard-reachable scroll region, named after the table. While the table is wider than the region, each inline edge with columns scrolled out past it draws a soft inset shade (`sw-scroll-more-start`, `sw-scroll-more-end`, mirrored right to left), so a phone, whose scrollbars stay hidden, still shows that the table goes on; a table that fits draws none, and in forced colors the system scrollbar is the cue. `TableCell` takes `numeric` (tabular numerals, end aligned), `align` and `truncate`; `density="compact"` densifies cells. `TableRow selected` sets `aria-selected` and marks the row with a 4 px accent bar at its inline start (3:1 or more against the surface and the page), the right edge in a right-to-left table. The bar is drawn inside the first cell's padding and takes no layout space, so no column moves when a row is picked, and the row takes no fill, so text, muted and accent text keep their contrast; forced colors keep the bar in the system highlight.

A header `TableCell` (`as="th"`) with `sort` (`'ascending'`, `'descending'` or `'none'`) and `onSort` is its column's sort control: its children become a button in the header's own style with a chevron (before the name in a `numeric` or end-aligned column), and the cell carries `aria-sort` only while it is the sorted column. `sort` on a data cell, or one of the two without the other, throws a `TypeError`. `Table` `layout="fixed"` (default `auto`) sizes the columns from the header row alone, so a filter that hides a row moves no column, and `verticalAlign="top"` (default `middle`) starts every cell of a tall row on its first line. `TableCell` `width` is `min` (an auto table's column takes the least room its content allows, on one line; set it on each cell of the column) or a size, `xs` to `xl` (4, 6, 8, 12 and 16 rem); in a fixed table a column without a width shares what is left, so leave one column, such as a description, unsized. The HTML `width` attribute is not accepted. Unknown values throw a `RangeError`.

`BarChart` `formatValue` writes the axis's values and each value without its own `valueLabel`, such as a currency. `diverging` puts zero in the middle of each track behind a hairline: a positive bar grows toward the inline end and a negative one toward the start, on one scale, and the axis reads minus the maximum, zero and the maximum. Without it every bar grows from the start. An item's `tone` (`BarChartTone`: `'accent'`, `'success'`, `'warning'` or `'danger'`, listed in the exported `barChartTones`) colors its bar by what it means in place of its sign's default (the accent, or danger for a negative value), such as a diverging chart's overage in `'warning'` and shortage in `'danger'`; a toned bar keeps its sign's place, every tone keeps 3:1 against the track, and an unknown tone throws a `RangeError`. Forced colors draw every bar in the system text color, so the value and its side of zero carry the meaning there.

`Spinner` shows indeterminate loading in small, medium, or large sizes. Supply localized `label` for the one announced status in a loading region. Use `decorative` on additional indicators beside that status so screen readers do not hear the same message repeatedly. Reduced motion leaves a static accented ring.

`Progress` shows a known value between zero and a positive maximum. It uses native progressbar semantics and displays the value and maximum beside the localized label. Invalid bounds throw instead of silently clamping. Optional `tone` is `accent`, `success`, or `danger`. `showCount={false}` hides the visible `value / max` count when the page shows its own count caption, so the count appears once; the progress bar still exposes its value and maximum.

`Tooltip` adds supplementary plain-text help to one labelled, focusable trigger, or names an icon-only one (`relationship="label"`, below). Supply localized `content` and an existing trigger element; by default it has its own accessible name. It opens on hover or on a visible focus (`:focus-visible`: the keyboard, not the focus a click or a tap gives), closes on pointer leave, blur, Escape, or outside touch, and a tap on a control (a button, a link, a form control or its label, an editable region, an element with a widget role, or anything inside one) does what the control does and leaves the tooltip closed, so on a touch screen a `Tooltip` on a `Button` is never shown. For an icon-only hint whose button does nothing but show it, such as an ⓘ beside a figure, use `InfoTip` (below), which a tap, a click, Enter or Space opens; do not make a non-control focusable to get a tap. A tap still toggles a `Tooltip` whose trigger does nothing else on a tap, such as an existing focusable badge. The bubble is placed beside its trigger on the top layer while it shows and stays a `space-2` inset inside the screen. Keep required instructions visible outside the tooltip. `disabled` turns the tooltip off, not its trigger: the trigger stays mounted, enabled and focusable, and there is no tooltip, no `aria-describedby` from it, and Escape is left to the page. Use it when what the tooltip says is visible at some widths, such as text shown only from `md` up, instead of rendering the trigger with and without a `Tooltip`, which mounts a new trigger and drops its focus. Focus, hover and touch are still followed, so a trigger that still has focus, the pointer or an open touch toggle shows the tooltip as soon as it is enabled again (Escape pressed while disabled reaches the page and does not stop that). `disabled` must be the same in the server render and the first client render, or hydration mismatches; read a breakpoint through a hydration-safe store, such as `useSyncExternalStore` with a server snapshot. `relationship="label"` makes the tooltip its trigger's name instead of its description, for an icon-only control whose tooltip says what it is: the trigger gets `aria-labelledby` (after its own, if any) and no `aria-describedby` from the tooltip, so the text is read once. The tooltip stays in the page, hidden, so it names the trigger while it is not shown, and it wins over an `aria-label`. While `disabled` there is no tooltip to name the trigger, so give the trigger its own name for that state: visible text, such as a label shown only from `md` up, or an `aria-label`. Do not use `relationship="label"` while the trigger shows visible text that differs from `content`: the tooltip would replace that visible label as the name (WCAG 2.5.3, label in name). The default, `relationship="description"`, is the supplementary help above. `relationship` must also be the same in the server render and the first client render.

`InfoTip` is a toggletip: a ghost icon-only `Button` whose only job is to show its tip, built on `Tooltip`'s bubble and placement. `label` is the button's accessible name and `content` its tip, plain text as `Tooltip`'s, both localized by the consumer; `children` is the decorative glyph (a Lucide `Info` with `aria-hidden`); `size` is a Button size, and the default `md` and every size on a coarse pointer are a square 44 px target. Hover and a visible focus show the tip as `Tooltip` does. A press of the button (a tap, a click, Enter or Space) shows it and keeps it shown when the pointer leaves, and the next press hides it; Escape (taken only while the tip shows), blur and a press outside also hide it. The tip is the button's description (`aria-describedby`), read once on focus; a press also puts it in a visually hidden polite live region (`role="status"`, empty until a press opens the tip and emptied when it closes), so a screen reader user who presses the button hears it even with descriptions or hints turned off. The button is `type="button"` and never submits a form, and the ref reaches it. An empty `label` or `content` throws a `RangeError`. There is no `disabled`: where the tip is shown as text instead, render no `InfoTip`.

```tsx
<Inline gap={1}>
  <Text>Expected waders: 128</Text>
  <InfoTip
    content="Counted at the last high tide, before the hides opened"
    label="About the expected waders"
  >
    <Info aria-hidden size={16} />
  </InfoTip>
</Inline>
```

`Separator` divides sections with a token-colored line. It is horizontal by default; use `orientation="vertical"` in a flex row. Set `decorative` when the line only supports layout so assistive technology ignores it.

`DescriptionList` pairs terms with what each says, one `DescriptionItem` per row: a `dl` whose items each group a `dt` (`term`) with its `dd` (`children`). From `md` up the term sits in a start column as wide as the widest term, up to 40% of the list, and the detail beside it; every row aligns to its top, so a term and its detail's first line start level, and a hairline divides the rows, with no space above the first row or below the last. Below `md` each term sits over its detail. The list sets only the layout: pass your own `Text` for the term and the detail. Each child of a term or a detail is its own line with its own line height (a column), so wrap inline content, such as words and a link on one line, in one element such as an `Inline`. Name the list with `aria-label` when the page has several.

```tsx
<DescriptionList aria-label="Habitat survey">
  <DescriptionItem
    term={
      <Text variant="caption" color="muted">
        Wetland
      </Text>
    }
  >
    <Inline align="start" gap={2} wrap>
      <Text variant="data">12 herons</Text>
      <Text variant="caption" color="muted">
        Recounted
      </Text>
    </Inline>
  </DescriptionItem>
</DescriptionList>
```

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

`DenominationGrid` shows integer counts per unit across a fixed set of columns. The `strip` layout is a captioned table: each row has a toned label with an icon slot, muted zero cells, optional signed deltas toned by sign, and an optional consumer-formatted `total` that shows under the label on a phone. Pass `totalLabel` (for example "Total") to name the total column: it renders a `th scope="col"` shown over the totals from `md` up and visually hidden below it, and without it the corner stays an empty cell as before (either way the column takes no width on a phone). `labelWidth` (`xs` to `xl`, the `Table` column sizes) lines a strip's columns up with every other strip of the same columns in a container of the same width, such as the cards of a feed: the row labels take that width and the count columns share the rest of the region equally, so no content moves a column. On a phone the total cell stays in the table, visually hidden, so a screen reader still reads each total in its row; the copy under the label is `aria-hidden`. A strip wider than its container scrolls sideways inside its own keyboard-focusable region, named after `label`, with the row labels pinned at the start and the same edge shade as `Table` while counts are scrolled out of view (the start shade is cast from the pinned labels' edge, since they cover the region's own); the page never scrolls sideways. The `tiles` layout stacks the column label, the count, and an optional `subtotal` string per column. Each tiles row shows its label line (icon, label and `total`) when the grid has several rows, or when a lone row has an icon or a `total`; a lone plain row is named by the grid's `label` alone. Every row is a region named by its `label`, except a lone plain row whose `label` is the grid's own: it has no name of its own, so assistive technology hears the grid's group once rather than a region repeating it. `rowRole="group"` (default `"region"`) keeps every named row's name but makes it a `group` instead of a landmark region, for a page with many grids (one per order card, say) whose rows would otherwise fill the landmark list; the strip ignores it, since its rows are table rows, and an unknown `rowRole` throws a `RangeError` in either layout. A row's icon and its label words stay on one line in both layouts (`sw-denomination-label-line`): a long label wraps its words beside the icon, never under it, and on a phone the strip's total goes on its own line under them. A row's `cellTones` (one Badge tone or `null` per column) tones a single count in place: the count is set in the tone over its signed or zero look, and in the tiles layout its tile's border takes the tone too, so a short bill turns red without leaving its row; `neutral` or `null` leaves a count as it is, a row's `tone` still colors only its label, and a `cellTones` that is not one known tone or `null` per column throws. The tone never says why on its own; put that in words beside the grid. Every negative count, signed or not and in either layout, is written with the typographic minus ("−1"), never a hyphen. The primitive does no arithmetic and no currency formatting; tones reuse the Badge vocabulary. Invalid columns, rows, or cells throw.

`FilterChips` presents a long, wrapping single-choice filter set. Provide a localized group `label`, controlled `value`, `onChange`, and options with stable values and localized labels. An optional non-negative integer `count` renders as a tabular chicklet after the label and is part of the option's accessible name; a zero count quiets the chip until it is selected: it drops its glass fill and sets its label in the muted color (4.5:1 in every palette), without fading, since it can still be chosen. Native radios provide arrow and Space navigation; disabled options are skipped.

`DateField` is a controlled date-only field that draws its own calendar. Supply `value`, `min`, and `max` as valid `YYYY-MM-DD` dates; use an empty `value` for a blank field. Its callback returns a date-only string or an empty string, without timezone conversion. Invalid serialized dates and inverted bounds throw; a value outside the bounds remains visible with invalid styling. `required` marks the label with the same `aria-hidden` asterisk as `Field` and sets the entry's native `required`. Its label is drawn as `Field`'s (the same label words and mark inside a `<label>` that keeps the canvas type), so its label row and its gap to the entry match a `Field` beside it. For a blank required field, supply `error` when form validation runs to show the message and invalid styling.

People type the date into a text entry in the locale's numeric order (`MM/DD/YYYY` for en-US, `DD/MM/YYYY` for es), with any non-digit separator, eight bare digits, or ISO `YYYY-MM-DD`. A keystroke calls `onChange` once the entry is complete, meaning its last field is at full width (four year digits, or two digits for a trailing day or month, as in ISO); otherwise the date commits when the person leaves the field or presses Enter, so typing `2024-03-10` never sends `2024-03-01` on the way. If the parent keeps the old value, the typed text stays on screen; any other outside change replaces it. Text that is not a date keeps the last value and, once the person leaves the field, sets `aria-invalid` and shows `labels.invalidEntry`. Like the native date input, the entry blocks form submission through `setCustomValidity`: `labels.invalidEntry` while its text is not a date, and `labels.outOfRange` while its date, typed or given, is outside `min`/`max`. The calendar button beside it opens a WAI-ARIA date picker dialog anchored under the field on the popover layer: the month grid shows today, the selected day, and days outside `min`/`max` as `aria-disabled` (padding before `0001-01-01` or after `9999-12-31` is blank and inert); arrows move by day and week, Home and End to the week's edges, PageUp and PageDown by month, Shift with them by year, Enter or Space selects and closes, and Escape closes and returns focus to the button. Month and year selectors in the header jump decades (the year list spans 120 years back and 20 ahead of today and the shown month, cut to `min` and `max`; the month list offers only months with a day inside them). A new `value`, `min`, or `max` while the calendar is open moves it to the new value or back inside the bounds. **Today** selects today; **Clear** appears only when the field is not `required`. Today is the device's local date unless `today` (a `YYYY-MM-DD` date) is given: pass the business's own day when it keeps a time zone the device may not share, so a phone in another zone after the business's midnight does not mark tomorrow as today, open on it, or pick it while `max` is the business's day. `today` moves the today mark, the empty field's starting day, **Today**, and the year list's span; it may lie outside `min`/`max`, where **Today** is disabled as before. An empty or malformed `today` throws a `RangeError`.

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

`CalendarButton` is an icon-only `Button` that opens the same calendar dialog for a date the page already shows, such as a day heading with its own previous and next steps: `‹ Tuesday, September 22, 2026 [calendar] ›`. It has no text entry and no empty value. Supply `label` (what pressing it does, such as "Choose survey day"), a `YYYY-MM-DD` `value`, and `onChange`; optional `min`, `max`, `today`, `disabled`, `locale`, and `weekStartsOn` behave as on `DateField`, and `id` and a `ref` reach the `<button>`. `labels` takes the calendar's words (`previousMonth`, `nextMonth`, `month`, `year`, `today`) and `nameSeparator`. The button's accessible name is `label`, `labels.nameSeparator` (default `", "`), then the spoken date (`"Choose survey day, Tuesday, September 22, 2026"`); pass the locale's own pause where a comma does not fit, such as `"、"` in Japanese. It comes with `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` while open; the calendar dialog is named by `label`. Enter, Space, or a press opens it on `value`. As on `DateField`, a `value` outside `min`/`max` is kept rather than refused, and the calendar then opens on the nearest allowed day with `value` shown selected and disabled; a button has no invalid state, so the page that shows the date flags it if it must. Choosing a day or **Today** calls `onChange` with the new date only when it changed, closes, and returns focus to the button; Escape closes without a change and returns focus; a press outside closes without a change and leaves focus where it landed. An empty or malformed `value`, `min`, `max`, or `today`, inverted bounds, a bad `locale` or `weekStartsOn`, an empty `label`, or an empty label word throws a `RangeError`. `size` (`xs`, `sm`, `md`; default `md`) and `variant` (default `ghost`) follow `Button`; the button is square at every size, and on a coarse pointer it is at least 44 px at every size. Place it beside the heading, not inside it, so the heading's text stays only the date. `range` (`{ start, end }`, both `YYYY-MM-DD` and included) is the period a page shows around `value`, such as a week: the open calendar tints its days as one band of the accent per week row, rounded at its ends, with every number on it in the text color (today keeps its accent ring); `value` stays the selected day. The tint is not announced, so the page's heading names the period. A start after the end throws a `RangeError`.

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
