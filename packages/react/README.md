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
  ChartLegend,
  ColumnChart,
  LineChart,
  DataBar,
  Box,
  Button,
  CalendarButton,
  DateRangeButton,
  Card,
  Checkbox,
  RadioGroup,
  SectionNav,
  Spinner,
  Pagination,
  Progress,
  Tooltip,
  InfoTip,
  Separator,
  DescriptionList,
  DescriptionItem,
  ListGroup,
  ListRow,
  MarkdownView,
  DenominationGrid,
  FilterChips,
  Grid,
  DateField,
  Field,
  FileField,
  Article,
  Stepper,
  Steps,
  Step,
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

`canvas="grouped"` (opt-in; `themeCanvases`, default `"default"`) sets the page on a quiet grey so white cards stand apart, as a report or a settings page that groups its content in cards: in the light scheme the background with a little of the muted colour, in the dark scheme the background itself, which is already darker than the surface. It writes `data-canvas="grouped"` on the themed node (set the attribute yourself on a `data-theme` node without `ThemeProvider`); a nested `ThemeProvider canvas="grouped"` paints a grouped region. The text and muted colours keep 4.5:1 or more on it in every palette.

The accent does not keep 4.5:1 on the grey in every palette, so keep links and accent words in the cards. An unknown value throws a `RangeError`.

```tsx
<ThemeProvider canvas="grouped" colorScheme="system">
  <Card padding={4}>North colony</Card>
</ThemeProvider>
```

```html
<div class="sw-padding-top-4 sw-padding-x-4"></div>
```

Import the CSS once at the application entry. Do not copy it into your source tree. Optional: import one `@scalewing/react/palette/<id>.css` file after it, or set `data-palette` on the `data-theme` node. React apps can set `palette` on `ThemeProvider` instead.

`Box` `border` draws a hairline in the `border` color token: `border` (or `border={true}`) is solid, and `border="dashed"` is dashed (the generated `sw-border` and `sw-border-dashed` classes; a `style` you pass still wins), for a space to fill in by hand such as a blank on a printed form. `border="bottom"` draws only the hairline under the box (`sw-border-bottom`, solid), for a full-width bar such as a sub-navigation strip under the header; give it `background="surface"` to read as a band. It does not make the box look or act like an input. Every `Box`-based component takes it.

`AppHeader` is the page's top chrome, sticky by default (`sticky={false}` leaves it in flow). Its default `appearance="glass"` is a rounded frosted card. `appearance="bar"` (`AppHeaderAppearance`, `appHeaderAppearances`) is a full-width band of the solid surface with the border hairline under it: no blur, no rounding, no side or top border, the same under Reduce Transparency, and the hairline kept in forced colors. Set it against the page's edges (no side gutter round it) and put the gutter inside it. An unknown `appearance` throws a `RangeError`.

`Box hideBelow="md"` hides a region under 48rem and `hideFrom="md"` hides it at 48rem and wider, so a product can swap a wide layout for a narrow one without its own stylesheet. They also take `lg` (64rem), for content that fits only from a laptop up, such as a row of labelled destinations that a tablet shows as glyphs (name each glyph-only control, for example with `Tooltip relationship="label"`); the layout props keep `md`. `breakpointQuery('below', 'lg')` returns the query a hide class uses (`not all and (min-width: 64rem)`), for an app whose script must follow the same width. An unknown breakpoint throws a `RangeError`. Hidden regions leave the accessibility tree; do not use this to protect data. `Box as="a"` is a layout link. Use `Button` for press actions. `Box as="a" link="quiet"` (opt-in; `link="accent"`, the default, is the canvas link) is a title that opens something, such as a table row's title: it keeps the surrounding text's colour at weight 600 (`sw-link-quiet`) and is underlined on hover and keyboard focus. Its weight is the non-colour cue WCAG 1.4.1 asks for (axe's `link-in-text-block` passes it on colour, the same colour and background as its text, or on its weight; the weight is what keeps it visibly a link), so use it in text lighter than 600. In text already at 600 the quiet look has no cue: an accent link there needs at least 3:1 contrast against the text. `link` on a box that is not `as="a"` throws a `TypeError`, an unknown value a `RangeError`. `Field` associates a native `<input>` or `<select>` with a label and token gap; native text controls inherit the generated document canvas. `Steps` is a one-page vertical stepper: an `ol` of `Step` panels in order, numbered by their place, a line joining each marker to the next (in the success color below a done step). A `Step` takes `status` (`'upcoming' | 'current' | 'done' | 'error' | 'skipped'`) and `title` (a heading at the list's `headingLevel`, 2 by default, or the step's own). The current step is open with its `children` and has `aria-current="step"`; an error step stays open with a "!" marker. A done step folds to one line: a check, the title, its `summary` (truncated) and, with `onEdit` and `editLabel`, a ghost small `Button` at the end named by its label and the title ("Edit The site"). A step ahead is greyed with its number in a ring; a skipped step is greyed with its `skippedReason` after the title (pass your own separator, such as "· not needed"). A folded step's heading ends in its status word for assistive technology (visually hidden; English by default, `labels` on `Steps` takes your words): its name is one visually hidden line, the title, a comma and the word ("The site, Done"), and the drawn title is `aria-hidden`, because a browser lays a hidden box out as a block and would put a space before the comma ("The site , Done"). The step's region and its Edit button are still named by the drawn title. A current step, and a skipped step showing its reason, draw and read their words as they are. The heading's text content now holds the title twice (drawn, then in the spoken line), so a test reading a folded heading's `textContent` or finding its title with a pattern (`getByText(/The site/)`) finds both: query headings by role and name (`getByRole('heading', { name: 'The site, Done' })`). Copying a folded heading, or finding its title in the page, meets the words twice too. The comma after the title is Scalewing's, as before; the word is yours. When a step becomes current from a folded state (upcoming, done or skipped), focus moves to its heading, a programmatic focus target; if several do in one update, the first in the list takes it. A first render, a move between current and error, and a step that turns to error leave focus alone: after a refused submit, move focus to the first invalid field yourself, as with `Field`. An error step has no `aria-current`; its heading's status word says it needs attention. Scalewing holds no order rules: the consumer sets each step's status. `Steps open` (off by default) keeps every step open at once, for a form whose sections are all filled on one page: each step shows its `children` whatever its status, inside a `section` named by its title (a region, class `sw-steps-region`), every title at the open size; the marker still follows the status (a number to fill, a check when done, "!" in error, a grey ring and muted title when greyed, such as after a blocking step), no step is `aria-current`, and no step takes focus when its status changes. Pass the `Step`s as direct children (a Fragment around several would share one number). A `Step` outside `Steps`, a Fragment child, a blank title or reason, an unknown status or heading level, `onEdit` without `editLabel`, or a blank status word throws a `RangeError`.

```tsx
<Steps aria-label="Heron survey">
  <Step
    status="done"
    title="The site"
    summary="North marsh"
    editLabel="Edit"
    onEdit={() => setCurrent(0)}
  />
  <Step status="current" title="The count">
    {fields}
  </Step>
  <Step status="upcoming" title="Review" />
</Steps>
```

`Select` is a labeled listbox menu when the open list must match the canvas.

`Field` supports optional `description`, `error`, and `required` on one native input, select, or textarea child. It preserves an existing `aria-describedby` and appends a stable ID for the hint, or for the error, which replaces the hint on screen while it is supplied. `error` sets `aria-invalid` and token-owned invalid styling. The error sits in a polite live region (`aria-live="polite"`) that is always rendered, empty while there is no error, so an error that appears while the person types, or after a submit, is announced once, politely, when its text is swapped in; it is never `role="alert"`, so a submit that finds several errors does not fire several assertive alerts at once. Empty, the region takes no room in the layout. The consumer owns validation and localized messages, and after a refused submit it moves focus to the first invalid control (or to one form-level summary). `Checkbox`, `RadioGroup` and `DateField` expose their `error` the same way. `invalid` marks the control invalid the same way (`aria-invalid` and the danger border, `Mark` in forced colors) without a message of its own, for fields whose one error is shown elsewhere, such as a count that adds up to nothing under a group of count fields: point each control's `aria-describedby` at that message so it is read with the field. The field's own polite region stays empty and its `description` stays on screen; `error` implies `invalid`. Passing `invalid`, even `invalid={false}` but not `invalid={undefined}`, needs one native control child and throws a `TypeError` on the first render otherwise, so a form learns it while the fields are valid, not on its first failed submit. `error` keeps its rule: it needs the native control only while it holds a message. `invalid` is `Field`'s only: `DateField`, `Select` and the other controls with `error` do not have it yet.

`requiredMark="hidden"` (default `"visible"`; `requiredMarks`, `RequiredMark`) leaves out the label's `aria-hidden` " *" on a required `Field`, `Select`, `DateField`, `Combobox` or `FilterChips`, for a form that marks nothing as required (or marks the optional fields instead). The control stays required (native `required` or `aria-required`, or, on a `DateField` with `entry="calendar"`, its `labels.required` word), so assistive technology still hears it; say in the form's words which fields must be filled. An unknown value throws a `RangeError`.

`Field` `changed` marks a value the person changed from a saved one, such as a field in a correction: the control's border, or an adorned field's frame, takes the accent color a hairline thicker (an inset shadow, so nothing moves; `Highlight` in forced colors), and its fill takes a 12 % accent tint over its own background, so a changed field reads apart from the focused one, whose ring never tints. The value keeps 4.5:1 or more on the tint in every palette; the tint is on text controls and selects (not a range, color or file input), a select's chevron stays where its size puts it, while a placeholder shows the fill stays plain, on the tint an adorned field's prefix and suffix take the text color, and forced colors drop the tint. It is a cue beside the words, so say what the value was in `description`; it sets no ARIA state, and `invalid` and `error` win over it. Like `invalid`, passing it, even `false` but not `undefined`, needs one native control child from the first render (a `TypeError` otherwise).

```tsx
<Field invalid={countIsZero} label="$1 bills">
  <input aria-describedby={countIsZero ? countErrorId : undefined} />
</Field>
```

Every press control and link takes an explicit `tabindex="0"`: `Button` (and the controls built on it, `CalendarButton` and `InfoTip`), `Box as="a"` with an `href`, `SectionNav` links, the `Select`, `MultiSelect` and `ActionMenu` triggers, `SegmentedControl` items (every item, as outside Safari: its arrow keys change the value, not the focus, so it is not a roving group), `DateField`'s calendar button and month steps, a search `Field`'s clear button, a `Table`'s sort and `TableCell onPress` buttons, `Checkbox`, `Switch`, and the checked radio of a `RadioGroup` or `FilterChips` (the first enabled one while none is; the others keep no `tabindex`, so each browser's arrow-key group rule stands). Safari's default (its "Press Tab to highlight each item" setting off) leaves a button, a link, a checkbox and a radio out of the Tab order unless it carries one, so a Safari user would Tab past them; the explicit `0` gives them the order every other browser already does. A `tabIndex` you pass wins, and controls that are deliberately no tab stop keep their `-1`: a `Stepper`'s − and +, and a roving item (a `Tabs` tab, a menu item, a calendar day) other than the current one. A `<summary>` is already in Safari's order and takes none.

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

`Field` `width` (opt-in; `fieldWidths`) caps the control at a Table column size, `xs` 4rem, `sm` 6rem, `md` 8rem, `lg` 12rem or `xl` 16rem, so a short value such as a rate, a count or a code sits in a box its own size instead of stretching across the form's column. The cap is on the control alone (an adorned or search field's frame), placed at the column's start and never wider than the column on a narrow screen; the label, description and error keep the column's width. It caps a text input (the canvas's typed inputs: text, email, number, search, url, password or no type), a select or a textarea (a checkbox, a range or another input type keeps its own size), and a sized select keeps its control height. It needs one native control child, as `prefix` does (a `TypeError` otherwise); an unknown width throws a `RangeError`.

```tsx
<Field label="Body length" suffix="cm" width="sm">
  <input inputMode="decimal" />
</Field>
```

`Field` `variant="search"` (default `"outlined"`; `fieldVariants`) is a search box over one native `<input>` child with a `value`: the `label` is not drawn but still names the input, which becomes `type="search"` (a `searchbox`); `leading` is your glyph at the frame's start, such as a magnifier, hidden from assistive technology; and while the input holds text and is enabled and not read-only, a clear button named `clearLabel` ("Clear search") ends the frame, puts focus back in the input and calls `onClear` (set the value to `''`); Escape with text calls `onClear` too. The browser's own clear button is hidden, so there is one. The input gets `enterKeyHint="search"` unless you pass one. The frame is the adorned field's, so focus, `error`, `description`, `invalid` and the disabled look work as on any field; a press on the glyph focuses the input; the clear button is the 44 px target on a coarse pointer. A search field without a nonempty `clearLabel` or `onClear`, with `prefix` or `suffix`, or with a child that is not an `<input>` with a `value` throws; `leading`, `clearLabel` and `onClear` on an outlined field, or an unknown `variant`, throw too.

```tsx
<Field label="Drop amount" prefix="$">
  <input inputMode="decimal" name="drop" />
</Field>
```

`FileField` is one file chosen with the system picker or dropped on the field, with `Field`'s `label` (above it, or hidden with `labelVisuallyHidden`), `description` and `error` (a polite live region in place of the hint, the frame's edge in the danger color, `Mark` in forced colors). Empty, it is one wide zone on the subtle fill, a button named by the label and `chooseLabel` ("Field guide Choose a PDF"), with `dropLabel` ("or drop it here") muted after it where the pointer can drag (left out on a coarse pointer). Chosen (`value={{ name, detail? }}`), it shows the consumer's `icon` (hidden from assistive technology), the file's name over the muted `detail` and a neutral button named by the label and `changeLabel`, described by the name and detail. Either button opens the picker (the native input is hidden and out of the Tab order, its `accept` the list the picker offers); `onChange` receives the `File` chosen or dropped, the first of several, and when a choice or a drop swaps the zone and the chosen row while focus is in the field, focus moves to the button now there (focus the person moved elsewhere is never taken back). A file dragged over the field draws the accent edge and tint, its words in the text color. It never reads, checks or uploads the file, and a dropped file is not filtered by `accept`: check what you receive (type, size, its header) and say why in `error`, keeping the earlier `value` or none. `disabled` blocks the picker, refuses a dropped file and dashes the frame. `id` prefixes the ids of the field's parts. An empty `label`, `chooseLabel` or `changeLabel`, a blank `dropLabel`, or a `value` with no name or a blank detail throws a `RangeError`.

A chosen photo can show itself: `value.preview` is the address of a small image of it, such as an object URL the consumer made from the `File` (and revokes when another is chosen), drawn as a 3:2 thumbnail (a space-8 wide, a space-6 tall, cropped to fill, at the small radius) before the name in place of `icon`. It is decorative (`alt=""`): the name beside it says which file it is. A blank `preview` throws a `RangeError`.

```tsx
<FileField
  label="Field guide"
  description="A PDF up to 25 MB"
  accept=".pdf,application/pdf"
  chooseLabel="Choose a PDF"
  dropLabel="or drop it here"
  changeLabel="Choose another"
  icon={<FileText />}
  value={file ? { name: file.name, detail: `${pages} pages · ${size}` } : null}
  error={error}
  onChange={(next) => checkPdf(next).then(setFile, (why) => setError(why))}
/>
```

`Stepper` is a whole-number count changed with − and + or typed. The count is a native text input with `role="spinbutton"` and `inputmode="numeric"`, named by `label` (visible above it, or `labelVisuallyHidden` where table headers say it) and the one tab stop: ArrowUp and ArrowDown step it by `step` (default 1), Home goes to `min` and End to a finite `max` (a range below zero takes `inputmode="text"`, since a phone's numeric pad has no minus key). The − and + buttons are pointer targets outside the tab order, named by `decrementLabel` and `incrementLabel` (your copy), and a press on one leaves focus where it was; the count and both buttons sit in a `group` named by the label. − is disabled at `min` (default 0) and + at `max` (no upper bound when left out). `value` is a count or `null` for an empty box, which the buttons treat as `min` and `placeholder` can fill. Typed text is refused unless it is digits (with a leading minus when `min` is below zero), so `onChange` only receives a whole number or `null`; a typed count is reported as typed even outside the bounds, so say why in `error` (a polite message, `aria-invalid` and the danger border, as `Field`'s), and the buttons then move it back inside them. `aria-describedby` takes ids of elements that describe the count, such as the value it adds up to, read before an `error`'s message. `changed` takes `Field`'s changed look; `readOnly` keeps the count focusable and hides the buttons in their own room; `disabled` stops all three. `limitAppearance="plain"` (default `"faded"`) keeps − at `min` and + at `max` in their usual look instead of faded, for a count sheet where a faded − reads as broken; they are still disabled, a disabled or read-only Stepper is unchanged, forced colors still grey them, and an unknown value throws a `RangeError`. The count is a few digits wide and keeps that width (`width="fixed"`), or fills its container (`width="full"`, for a table cell). Bounds that are not whole numbers, `min` above `max`, or a `step` that is not above zero throw a `RangeError`.

```tsx
<Stepper
  label="Herons"
  value={count}
  onChange={setCount}
  max={40}
  decrementLabel="One less"
  incrementLabel="One more"
  placeholder="0"
  error={count !== null && count > nests ? `Only ${nests} nests.` : undefined}
/>
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

`ActionBar` `summary` (`{ label, value, detail?, tone? }`, type `ActionBarSummary`) puts a labelled figure first in the same polite status region, before any `status`: the label and the detail in muted label-size words, the value between them in the `heading` variant (24 below `md`) at tabular figures, all on one baseline and wrapping as one phrase, such as "Counted **$33,790.00** short $4,000.00". `tone` (`'default' | 'danger' | 'success'`, such as danger while short or over and success once it matches) colors the value only, so say why in the detail. Format the value yourself; each new figure is announced politely. For a guided form, the actions are a secondary Cancel and one primary that stays `disabled` until the form is valid. An empty `value` (`''` or only spaces) means there is no figure yet, such as before anything is counted: the summary line is left out and the live region stays, so the first figure is announced when it arrives. Leaving `summary` out is the same; format the value before you pass it, since an empty one hides its detail and tone too. A blank `label` or `detail`, a `value` that is not a string, or an unknown `tone` throws a `RangeError`.

```tsx
<ActionBar
  summary={{
    label: 'Counted',
    value: '14 nests',
    detail: 'short 2',
    tone: 'danger',
  }}
>
  <Button variant="secondary" onPress={cancel}>
    Cancel
  </Button>
  <Button disabled={!matches} onPress={save}>
    Save count
  </Button>
</ActionBar>
```

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

On the web, `variant="neutral"` is a quiet grey fill (the muted color at 16 %, the fill of an open menu row) with its words in the text color and no border: an action beside the primary that should not draw the eye, such as a sheet's Cancel. It is web only (`webButtonVariants`; the shared `buttonVariants` in `@scalewing/tokens` and React Native do not have it). `disabledAppearance="neutral"` (default `"faded"`) draws a disabled button on that grey with its words in the muted color at 48 % (about #AEAEAE on the grey) and full opacity, whatever its variant, instead of fading its own fill (a disabled accent reads as a paler accent); a `ghost` button, which has no fill, still fades. The button is still a disabled `button`; forced colors draw it as any disabled button. An unknown `disabledAppearance` throws a `RangeError`.

A `Button` with `aria-disabled="true"` (not `disabled`) looks disabled, faded or, with `disabledAppearance="neutral"`, on the neutral grey, with `GrayText` in forced colors, yet stays a focusable, pressable `button`: its `onPress` still runs, so a submit pressed while off can take the person to what is missing. Its look alone does not say what is missing: a press while off should show the message of the first thing to fix. Use `disabled` when a press should do nothing.

A `Button` that toggles something passes `aria-pressed`. The pressed button gets a 2 px accent ring outside its fill, past a 2 px gap in `--sw-color-background`, so the ring meets only the page and keeps the accent's contrast on the canvas (4.5:1 or more in every palette, at least the 3:1 a state indicator needs) whatever its `variant` or fill. A focused pressed button moves its focus outline out past the ring. In forced colors, which drop shadows, the pressed button keeps the forced button colors, so its label and any glyph or badge inside it stay readable, and draws the same ring and its own border in the system highlight (`Highlight`); nothing opts out of forced colors. An unpressed button is drawn at full strength, so its label keeps its contrast. To make the choice stand out further, give the pressed button `primary` and the others `secondary`.

`ButtonGroup` is the action row of a form or dialog (`role="group"`, named by `aria-label`): one line from `md` up, aligned by `justify`, and full-width stacked buttons below it. `attached` makes it one joined control instead, such as Previous, Today and Next: its direct `Button` children sit side by side at one height with no gap, their borders overlapping into single dividers (a borderless variant draws its divider in its own text color at low strength), with square inner corners and `sm`-radius outer ones, mirrored right to left. It keeps its row on a phone and sizes to its buttons, so `justify` does not apply. The group is its own stacking context: a pressed toggle's ring and the focused button's usual outer ring paint over the neighbours. Give every button the same variant and size, such as `secondary`; a wrapper around a button (a tooltip's span) is not joined.

`ButtonGroup` `appearance="track"` (an `attached` group only; default `"default"`, `buttonGroupAppearances`) sets the joined buttons as words in the text color on one quiet grey track (the muted fill at 16 %, the sm radius) with the `border` token's hairline between them, whatever their variant, such as Previous, This week and Next above a period. It is for equal-weight navigation: every variant's meaning goes, so keep a primary or destructive action out of it. A pressed button keeps its ring, a focused one its outline and a disabled one fades (`disabledAppearance="neutral"` too); forced colors outline the track, keep every border and draw a pressed button's in Highlight. An unknown value, or `track` without `attached`, throws a `RangeError`.

`ButtonGroup` `fullWidthBelow="md"` (an `attached` group only; the layout `Breakpoint`) makes the joined control fill its column below that breakpoint, its buttons sharing the width equally (each may shrink, so keep their words short), such as earlier, a period and later across a phone; from `md` up it sizes to its buttons as before. On a group that is not attached it throws (that row already stacks full width on a phone), as does an unknown breakpoint.

`Badge` is a non-interactive chicklet with a `tone` (`neutral`, `accent`, `success`, `danger`, `warning`) and a `size` (`md`, or `sm` for a table cell). A badge inside a filled `Button` (every variant but `ghost`) sits on `--sw-color-surface` with its words in the text color and its tone on its border, so it reads at 4.5:1 in every palette whatever the button's fill.

`ActionMenu` opens independent commands from a labelled button. Provide localized command labels and callbacks; use `disabled` for unavailable commands and `destructive` for a dangerous command's presentation. Escape and choosing a command both return focus to the trigger (before the command runs, so a `Dialog` it opens hands focus back to the trigger on close), and outside interaction dismisses the menu. The open menu sits on the popover layer a `space-1` gap below its trigger (above it when it only fits there), at least `space-2` from every viewport edge (a classic scrollbar is not part of the viewport), and aligned to the trigger's inline start (its right edge in right-to-left), or to its other edge when the trigger ends a row and the menu would not fit from its start. `align="end"` (default `"start"`) lines the menu up with the trigger's inline end even where the start would fit, for a trigger that ends a card or a list row, so the menu stays over that card instead of hanging past it; it takes the start when the end would leave the screen. The menu is as wide as its longest command up to the viewport less both insets, and a longer command wraps. The menu follows its trigger through scroll, window resize, and a change in the menu's or the trigger's size. The menu is in the DOM only while it is open. The trigger and its commands use the compact xs control height for a fine pointer; on a coarse pointer the trigger is at least 44 × 44 px (the md control height, as on `CalendarButton`) and every command is at least 44 px tall. An item's `detail` is its current value at the command's end, such as "English" on a Language command that opens a choice: muted, before a chevron that points to the inline end (mirrored right to left), and read as part of the command's name ("Language English"); `detailLang` marks its language. It is meant for a short value; a long one wraps between words, never inside one. The command runs like any other and opens no submenu, so a command that opens a dialog or a picker says so in its label. A blank `detail`, or a blank `detailLang` or one without a `detail`, throws a `RangeError`. `separatorBefore` draws a hairline (`role="separator"`) before a command, setting it apart, such as Sign out; the arrow keys skip it, and it is never drawn before the first command.

`ActionMenu` `header` is a non-interactive block above the commands, such as who is signed in: each child a line of its own, in the caption size and the muted color, set off by a hairline. It sits outside the `role="menu"` element and the arrow keys, and is the menu's description (`aria-describedby`), read as the menu opens; `null`, `false` and `''` are no header. An item's `lang` (a BCP 47 tag) marks its label as another language than the page's, such as "English" on a Spanish page (WCAG 3.1.2).

`ActionMenu` `triggerAppearance="text"` (opt-in; default `"framed"`, `actionMenuTriggerAppearances`) draws the trigger as its words (`trigger`, or `label`) in label type at medium weight in the text color, with the shared muted chevron pointing down after them and no fill or outline; the quiet grey fill shows on hover and while the menu is open. It is the sm control height (the 44 px target on a coarse pointer). Name the trigger with `label` as before, and include the words shown in it (WCAG 2.5.3, so voice control can say them): a person's name that opens their account menu takes a `label` such as "Account, Ada Okafor". The trigger's words are one flex item (mixed inline content keeps its spaces), then the chevron. Forced colors draw its border in the system's border color, the chevron in CanvasText, and an open trigger's border in Highlight. An unknown value throws a `RangeError`.

`triggerAppearance="icon"` (opt-in) draws the `trigger` glyph alone in a round quiet button, as wide as it is tall (the sm control height, 44 px on a coarse pointer), in the muted colour with no fill, outline or chevron; it turns to the text colour on the quiet fill on hover and while the menu is open. Use it for a row's own ••• menu, named by `label` ("More for Heron calls"); the glyph says nothing on its own. An icon trigger without a `trigger` glyph throws a `RangeError`. Forced colors draw it in ButtonText with its kept border, Highlight while open.

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

A sheet over a page takes a fuller frame. `icon` is a consumer glyph or tile before the title (hidden from assistive technology) and `description` a muted line under the title that also describes the dialog (unless you pass `aria-describedby`). `footer` holds the actions, pinned to the dialog's bottom edge under a hairline while the content scrolls, and `summary` (ActionBar's `{ label, value, detail?, tone? }`) puts a labelled figure at the footer's start in a polite live region. `size="xl"` (65rem) holds a six-column count grid with its labels and total. `role="alertdialog"` is for a warning that interrupts, such as an idle sign-out: give its safe action `autoFocus` (the browser otherwise focuses the first footer button), and point `aria-describedby` at the warning in its body when that is not the `description`. `appearance="banded"` (default `"glass"`) draws the dialog on the solid surface with the medium elevation instead of the frosted panel: its title row is a full-width band over a hairline (a lone title too), the footer the band it already is, and the close button a circle on the quiet muted fill in the text color, keeping its touch target; forced colors outline the dialog and keep the hairlines. `status` is one short line in the footer after the summary and before the actions, in the same polite live region: muted caption words, or a `Badge` and a short line in one `span` (a status alone makes a footer; blank words or `false` leave it out). `canvas="grouped"` (default `"default"`) fills the dialog with the grouped canvas grey that `ThemeProvider canvas="grouped"` paints, solid with no blur, so `Card`s inside stand apart; a banded title row and the footer keep the surface. `sheetGrabber` (with `sheetBelow`, which it needs) draws a grabber, a short rounded bar centered at the top of the bottom sheet, hidden from assistive technology; it stays at the top while the content scrolls, does not drag, and is not drawn from the breakpoint up. An unknown `size`, `role`, `appearance` or `canvas`, a blank `description`, an invalid `summary`, or `sheetGrabber` without `sheetBelow` throws a `RangeError`.

```tsx
<Dialog
  open={open}
  onClose={close}
  size="xl"
  closeLabel="Close"
  icon={<ArrowRight />}
  title="Move herons to the lake"
  description="The same herons leave the river count."
  summary={{ label: 'Lake', value: '+14', detail: 'river −14' }}
  footer={
    <>
      <Button variant="secondary" onPress={close}>
        Cancel
      </Button>
      <Button onPress={move}>Move 14 herons</Button>
    </>
  }
>
  {countGrid}
</Dialog>
```

```tsx
<Dialog
  open={open}
  onClose={close}
  sheetBelow="md"
  sheetGrabber
  canvas="grouped"
  title="Tally the roosts"
  summary={{
    label: 'Bats',
    value: counted ? String(counted) : '',
    detail: 'in all roosts',
  }}
  status="Nothing counted yet"
  footer={footerActions}
>
  <Card padding={4}>…</Card>
</Dialog>
```

`Toast` is an auto-dismiss confirmation on the popover layer, controlled by `open` and `onOpenChange`; it does not trap focus and closes after `timeoutMs` (default 800, or 6000 for a `warning` or `danger` toast, which must be read). `anchor` and `target` send it from a press to a destination. `tone` (`neutral` by default, `success`, `warning`, `danger`) tints its border and an optional consumer `icon` (a Lucide glyph, hidden from assistive technology); the message keeps the text color, so its words carry the meaning. A `danger` toast is announced as `role="alert"`, the others as `role="status"`, so do not wrap the message in another live region. A toast still dismisses itself: an error the person must act on belongs in the page. A toast is as wide as its message, up to the page's gutter (spacing step 4) on each side, so on a phone a long message wraps inside the gutter instead of running to the screen's edges.

A toast can also be a corner card that confirms a save: `placement="top-end"` puts it `space-4` from the viewport's top and end corner, `title` is a bold first line with the children as a muted detail under it (pass plain text, not a `Text`), `action` (`{ label, onPress }`) is one ghost small Button at the end that runs `onPress` and then closes the toast, and `showRemaining` adds a thin line that runs down with the time left. A toast with an action or the line takes the pointer, and its time (and the line) is held while the pointer is over it or focus is inside it; each opening starts with the whole time. Pass the time you want, such as `timeoutMs={10000}`, and close it yourself when it no longer applies (for example when the next sale starts). It is never modal and never takes focus; when it closes with focus inside (after its action), focus goes back to where it came from. Keyboard users reach the action in the Toast's place in the DOM, so render it right after the control that saves. A travelling toast ignores `placement` and `showRemaining`.

```tsx
<Toast
  open={saved}
  onOpenChange={setSaved}
  placement="top-end"
  tone="success"
  icon={<Check />}
  title="Heron count saved"
  action={{ label: 'Open', onPress: openCount }}
  showRemaining
  timeoutMs={10000}
>
  12 herons · 2 nests
</Toast>
```

`Switch` is a controlled on/off input. It keeps native checkbox keyboard behavior and exposes switch semantics. Provide the current `checked` value and update it in `onCheckedChange`.

`Switch` `layout="trailing"` (`switchLayouts`, default `"leading"`) puts the label and description first and the control at the end of a row as wide as its column, lined up with the label's first line, as a settings list draws it; the reading order follows. `checkedTone="success"` (`switchCheckedTones`, default `"accent"`) fills the track with the success colour while on, for a setting whose on state is the healthy one (3:1 or more on the surface in every palette; `Highlight` in forced colors); the thumb's place says the state either way. An unknown layout or tone throws a `RangeError`.

```tsx
<Switch
  label="Number the observers"
  description="Names stay out of the file"
  layout="trailing"
  checkedTone="success"
  checked={numbered}
  onCheckedChange={setNumbered}
/>
```

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

`SegmentedControl` is one exclusive choice shown as a track of segments (`role="radiogroup"`), named by `aria-label` or `aria-labelledby`, with a controlled `value` and `onChange`; `variant="filled"` gives every segment the same width and fills the selection with the accent, and `disabled` keeps the choice visible but inert. `error` puts a message under the track (`sw-field-error`), links it to the group by `aria-describedby` and sets `aria-invalid` and a danger outline on the group (`Mark` in forced colors); as `Field`'s it is announced politely from a live region that is always there, never as an alert, and an empty string is no error. `required` sets `aria-required` on the group; since the control has no label of its own, the element that labels it shows the mark. The track sits in a `.sw-segmented-field` wrapper that holds the message and takes the track's place in the layout, so a `ref` still reaches the `radiogroup`. `error` is for a control in a `Stack` or block layout, where the track keeps its width and the message wraps under it. While it shows a message the field is at least 24ch wide, capped at its container, so a short compact track does not squeeze the message into a column. In an `Inline` the field therefore grows and the rest of the row moves, while the track keeps its labels' width. An item's `icon` (such as a small `GlyphTile`) sits before its label, hidden from assistive technology, so the label names the segment; when any item has one, a compact track takes the `md` control height and label type on a subtle fill, with the selected item raised, and a filled track keeps its look and only gains the marks.

`SegmentedControl` `fullWidthBelow="md"` makes the control fill its column below that breakpoint, its segments sharing the width equally whatever the variant (a raised track too); from `md` up it keeps its own width. `size="sm"` (`segmentedSizes`, default `"md"`) pads every segment a step less and keeps each label on one line, ending in an ellipsis past its share while its name keeps the whole label, so three or four segments with counts fit a phone's card (a segment with a mark keeps its padding, and the label truncates on any variant). The ellipsis is a last resort that sighted people cannot expand: keep `sm` labels short enough to fit at the widths you expect, at 200 % zoom too, and never let the hidden part carry meaning. An unknown breakpoint or size throws a `RangeError`.

```tsx
<SegmentedControl
  aria-label="Field log"
  variant="raised"
  size="sm"
  fullWidthBelow="md"
  items={[
    { id: 'changes', label: 'Changes 57' },
    { id: 'people', label: 'People 12' },
  ]}
  value={log}
  onChange={setLog}
/>
```

`variant="raised"` (opt-in; default `"compact"`) is a grey track (the quiet muted fill, no border, corners concentric with the segments' small radius) as wide as its segments even in a `Stack`; every segment is the `md` control height in label type with its words in the text color at medium weight, and the selected one is the surface raised by the small elevation at label weight; in the dark scheme, where a shadow does not show, it draws a hairline ring in the muted color instead (3:1 or more on the track in every dark palette). Item `icon`s keep that look, and `error` and `disabled` behave as on the other tracks. It is the same radiogroup with the same keys; forced colors outline the track and the selected segment.

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

`appearance="words"` (opt-in; default `"default"`, `navAppearances`) draws every destination, a link or a `Button` of any variant, as plain words: no fill, border or underline, label type, the others in the muted color at medium weight and the current one (`aria-current`, not `"false"`) in the text color at label weight. A Button keeps its size, padding, touch target and focus ring; hover lifts a destination to the text color where the pointer can hover, never a disabled one. The current mark is color and weight, so each destination's words must be visible: a glyph-only destination has no weight to change (keep `default` for a glyph rail). Forced colors draw the current one's border in Highlight and underline its words. An unknown value throws a `RangeError`.

`NavCount` puts a count after a destination's words, such as the tasks waiting in an area: place it inside the link or `Button`, after its words (`<a href="/tasks">Tasks<NavCount count={8} /></a>`). It is the pill `SectionNav`'s item `count` draws (the danger color with its on-color figures, an edge in forced colors), a space-2 after the words in a link or a Button, the link keeping its siblings' height, and it is read as part of the destination's name ("Tasks 8"). `count` is a whole number; 0 shows nothing. `countLabel` says what it means in your words ("8 tasks to do"): it is read in place of the bare number ("Tasks 8 tasks to do") and the pill is hidden from assistive technology. `tone="accent"` (default `"danger"`, `navCountTones`) draws the pill in the accent color with its on-color figures, for a count that is news rather than work waiting, such as what was added since the person last looked; its size, spacing and name are the same. Give an accent count a `countLabel` ("3 new") so its words, not its color, say it is news, and place either tone on a neutral or ghost destination, never a filled one of the same color. A count that is not a whole number from 0, a blank `countLabel` or an unknown `tone` throws a `RangeError`.

```tsx
<Nav appearance="words" aria-label="Areas">
  <Box as="a" href="/sightings">
    Sightings
  </Box>
  <Box as="a" href="/tasks" aria-current="page">
    Tasks
    <NavCount count={8} countLabel="8 tasks to do" />
  </Box>
  <Box as="a" href="/field-notes">
    Field notes
    <NavCount count={3} countLabel="3 new" tone="accent" />
  </Box>
</Nav>
```

`SectionNav` is the navigation between the sections of one area, such as a portal's pages: a labelled `nav` (`aria-label` or `aria-labelledby`) of links from `items` (`{ id, label, href, current?, icon?, count? }`), quieter than a workspace's `Nav`. `current` is `'page'`, `'location'` (a page inside that section, such as a detail page under its list) or a boolean, written as `aria-current`; the current item is in the text color over an accent underline, or, from `verticalFrom` (a breakpoint) up, where the items stack as a side list, a bar at its start. `icon` is a decorative glyph before the label. `onNavigate` takes a plain press after preventing the browser's navigation, for a client router; a press with a modifier key or the middle button keeps the browser's behavior, and without `onNavigate` the links carry no handler, so a server component can render the nav. `count` (a whole number) is how many things wait in a section, such as tasks: a filled pill after the label, in the danger color with its on-color figures, read as part of the link's name ("Tasks 3"); 0 shows none, and there is no cap. `countLabel` says what the count means in your words ("3 tasks to do"): it is read in place of the bare number and the pill is hidden from assistive technology. `appearance="filled"` (default `"underline"`) is a quiet row of page buttons for an area's sub-navigation beside its name: no hairline and no underline or start bar, every link the `sm` control with the small radius at weight 500, the current one on a soft muted fill in the text color at 600 (a 2 px `Highlight` edge in forced colors), in the row or the side list. A coarse pointer gets 44 px targets. Empty or duplicate ids, empty labels, a `count` that is not a whole number from 0, a blank `countLabel` or one without a `count`, and an unknown `verticalFrom` or `appearance` throw a `RangeError`. Use `Tabs` for panels on one page.

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

`TableRow pressable` (opt-in) makes the whole row the pointer target of its one action, such as a search result that is picked: a plain primary press anywhere on it calls `click()` on the row's first link or button, so the action's own handler runs. Left alone: a modifier key or non-primary button, a press already handled, a press on another control, a press that ends a text selection (text stays selectable), and a disabled or missing action. Keep one control in the row: a control placed before the action (an icon button, say) would take the row's press. The row is not a control (no role, no tab stop), so keyboard and screen reader users use the action itself. It takes the pointer cursor and the quiet fill while hovered, pressed (a brief flash on touch) or while its action has keyboard focus (a `Highlight` outline in forced colours), and underlines its action on hover (`sw-table-row-press`). A consumer `onClick` runs once per press. Each click of a double click presses the action, as a native button's would, so keep it safe to repeat. `TableCell onPress` (a body cell or a row header in `TableBody`) makes the cell's children that action: a button in the cell's own text style at weight 600, underlined on hover and focus, with the accent focus ring (`sw-table-action`); a non-function value or one on a sortable header throws a `TypeError`.

```tsx
<TableRow pressable>
  <TableCell onPress={() => pick('Red fox')}>Red fox</TableCell>
  <TableCell>Forest</TableCell>
</TableRow>
```

A header `TableCell` (`as="th"`) with `sort` (`'ascending'`, `'descending'` or `'none'`) and `onSort` is its column's sort control: its children become a button in the header's own style with a chevron (before the name in a `numeric` or end-aligned column), and the cell carries `aria-sort` only while it is the sorted column. `sort` on a data cell, or one of the two without the other, throws a `TypeError`. `Table` `layout="fixed"` (default `auto`) sizes the columns from the header row alone, so a filter that hides a row moves no column, and `verticalAlign="top"` (default `middle`) starts every cell of a tall row on its first line. `TableCell` `width` is `min` (an auto table's column takes the least room its content allows, on one line; set it on each cell of the column) or a size, `xs` to `xl` (4, 6, 8, 12 and 16 rem); in a fixed table a column without a width shares what is left, so leave one column, such as a description, unsized. The HTML `width` attribute is not accepted. Unknown values throw a `RangeError`.

A ledger read across as well as down takes `Table` `columnRules` (a hairline at the inline start of every cell after a row's first, mirrored right to left) and `TableCell` `tone` (`success`, `danger`, `muted` or `accent`: the cell's text in the theme colour, as `Text color` uses it; never the only signal, so keep the sign or the words). `TableRow` `variant="sub"` (default `"default"`) sets a row under the one above, as a batch's items: its row header, a `TableCell as="th" scope="row"`, is indented a `space-6` step with a guide bar at the indent (a sub row without a row header is not indented). `TableRow` `variant="total"` is a total mid-table, such as a subtotal the rows above add up to before the table goes on: its cells at weight 600 under a 2 px rule across its top (the cells' own collapsed top border, so forced colors keep it), as a `TableFooter` total is drawn, with no fill, so accent text in it keeps the contrast it has on the table's own surface. Name it with a row header and keep it in the body, after the rows it adds up (not the body's first row under a pinned header, whose rule would sit on its own); a cell's `tone` keeps its colour, and `struck` works on it. Its cells are all at weight 600, so a quiet link or a `TableCell onPress` action in it is no longer set apart by weight: keep a total row's name plain text (a `TableFooter` row is the same). `TableRow` `struck` keeps a voided row on the record: the subtle fill and the text muted and struck through, toned cells included; it works with any variant. A line-through is not read aloud, so say why in the row, such as a `Badge` "Voided": a Badge in a line of text is not struck, but one that is itself a flex item (a direct child of `Inline`) is, so put it in the title's line. A row header in the body or footer (`th scope="row"`) reads as body text. An unknown `tone` or `variant` throws a `RangeError`.

`Table` `stickyHeader` pins the header: the whole `TableHeader` as one group, every row in it (the column headings and any row under them, such as a running total) with all its cells, `th` and `td`, each row under the one above, on the glass with its row and column rules. `true` (default) pins it to the top of the table's own scroll region, `false` lets it scroll away, and `'page'` pins it to the page's top as the page scrolls. With `'page'`, while the table fits its width its region stops being a scroll box (`sw-table-sticky-page`), so the header stays in view under any sticky `AppHeader` (which covers it); a table wider than its region scrolls sideways in it and pins inside it. Use it for a long table whose last row, such as a non-sticky `TableFooter` total, should scroll with the rows. An unknown value throws a `RangeError`.

```tsx
<Table aria-label="Site census" stickyHeader="page">
  …
</Table>
```

`TableFooter` is the table's `tfoot`, for a total: its cells are set at weight 600 under a 2 px rule across its first row (drawn on each cell's `::before`, so forced colors keep it), and a `TableCell as="th" scope="row"` in it names the total. `sticky` pins the footer to the bottom edge on the header's glass (solid under Reduce Transparency, the system canvas in forced colors), on its own layer over the cells and the pinned header. While the table fits its width, a table with a sticky footer stops being a scroll box, so the footer pins to the page's bottom and the sticky header to its top as the page scrolls; a sticky `AppHeader` covers that header. A table wider than its region scrolls sideways in it and pins to the region instead. A sticky `ActionBar` covers a pinned footer, and so does a `Dialog`'s pinned footer, so do not pair them.

`Table` `maxHeight` (opt-in, `{ rows: number }`, type `TableMaxHeight`) bounds the table's height by a row count, and the rest of the rows scroll inside the table's own region: the region is as tall as that many single-line body rows plus the header row and, when there is one, the footer row (from the type and spacing tokens the cells are drawn with, compact density included, a sorting header as tall as its buttons and the 44 px touch target on a coarse pointer; rows of two lines or with controls, a second header or footer row, and a horizontal scrollbar that takes room show fewer at a time). The header pins to the region's top and a `TableFooter sticky` total to its bottom, so a total over every row stays in view while the rows scroll; a non-sticky footer scrolls with the rows. The region stays a keyboard stop named after the table, and while rows are scrolled out past its top or bottom that edge draws the scroll shade (`sw-scroll-more-top`, `sw-scroll-more-bottom`): cast from the pinned header's last row (a header cell spanning rows from an earlier row casts none) or total over the rows under it, or from the region's own edge where nothing is pinned; none in forced colors. While the region has keyboard focus, the pinned header and total carry the part of its focus ring they cover (their side parts on the first and last cells, so avoid `rowSpan` in a bounded table's header). Printed, every row shows. A bounded table never pins to the page, and without `maxHeight` the page pinning above is unchanged. `stickyHeader` `'page'` or `false` with it, a value that is not `{ rows }`, or a row count that is not a whole number from 1 throw a `RangeError`.

```tsx
<Table aria-label="Closeouts" maxHeight={{ rows: 12 }}>
  <TableHeader>…</TableHeader>
  <TableBody>…</TableBody>
  <TableFooter sticky>…</TableFooter>
</Table>
```

`BarChart` `formatValue` writes the axis's values and each value without its own `valueLabel`, such as a currency. `diverging` puts zero in the middle of each track behind a hairline: a positive bar grows toward the inline end and a negative one toward the start, on one scale, and the axis reads minus the maximum, zero and the maximum. Without it every bar grows from the start. An item's `tone` (`BarChartTone`: `'accent'`, `'success'`, `'warning'`, `'danger'` or `'neutral'`, listed in the exported `barChartTones`) colors its bar by what it means in place of its sign's default (the accent, or danger for a negative value), such as a diverging chart's overage in `'warning'` and shortage in `'danger'`, or the usual days in `'neutral'` (the muted grey) beside the busiest ones in the accent; a toned bar keeps its sign's place, every tone keeps 3:1 against the track, and an unknown tone throws a `RangeError`. Forced colors draw every bar in the system text color, so the value and its side of zero carry the meaning there. `appearance="bare"` (`barChartAppearances`, default `"track"`) draws the bars alone, with no track and no value axis, for bars whose values are all written beside them; the track's room is kept, so labels and values line up as before, a diverging bare chart keeps its zero hairline, and every tone keeps 3:1 against the surface it sits on; in forced colors the track's edge is the canvas color. A bar's tone is the charts' stroke color of that tone (`chart-tones.ts`); a `ChartLegend` `bar` swatch takes the lighter fill of a tone, so key a neutral or warning bar with a `marker` or `line` swatch. An unknown appearance throws a `RangeError`.

```tsx
<BarChart
  appearance="bare"
  aria-label="Owls heard by night"
  items={[
    { label: 'Thu', value: 3, tone: 'neutral' },
    { label: 'Fri', value: 9 },
  ]}
/>
```

`DataBar` is a horizontal range bar for a table cell or a list row: a bar from `from` to `to` (whichever is larger is its far end) on a track whose domain runs from `min` to `max`, such as where a statement's line leaves the running total. It fills its container's width, a spacing step 4 tall with no track fill, and its ends follow the writing direction. It is decorative (`aria-hidden`): the figure is the cell's own text, so keep the value beside it, and a cell holding both is named by the figure alone. `tone` (`DataBarTone`, listed in `dataBarTones`; default `'neutral'`) says what the bar is: `'neutral'` for where it started, `'success'` for what came in, `'muted'` for what went out (never danger: an outflow is not an error), `'strong'` for a subtotal, `'accent'` for what was counted or recorded, and `'danger'` for a shortage, never for cash leaving (a light red, the danger colour at 40 %). Each is a semantic colour mixed into the surface, 1.5:1 or more on it, the three greys 1.5:1 or more apart, the shortage's red apart from the grey of what went out, in every palette and scheme. A domain from below zero to above it (`min < 0 < max`) draws a hairline at zero, so a column of differences diverges around it (`from={0} to={value}`), and the bar's end at zero is square; a short bar in `'danger'` and an over bar in `'success'` differ by hue alone, so the bar's side of zero and the signed figure carry the meaning. Values past the domain are clamped to it; non-finite numbers, a `min` not under `max`, or an unknown tone throw a `RangeError`. Forced colors draw the bar and the zero line in the system text color.

A bar in its own column reads as empty cells to assistive technology, which is fine while the figure's cell carries the value; a bar and its figure can also share one cell, side by side in a `Grid`.

```tsx
<TableCell numeric>
  <Grid align="center" columns={2} gap={2}>
    <DataBar from={0} to={-6} min={-10} max={10} tone="muted" />
    <span>−6</span>
  </Grid>
</TableCell>
```

`ChartLegend` is a chart's key: a list of its marks, each a swatch and its words, in a wrapping row in the caption type, placed above the chart or the statement bars it names. `items` (`ChartLegendItem[]`) gives each one's `label`, `swatch` (`ChartLegendSwatch`, listed in `chartLegendSwatches`: `'bar'`, `'line'`, `'marker'` or `'box'`) and `tone`. A `'bar'` is a filled mark and takes a fill tone (`ChartFillTone`, listed in `chartFillTones`): a categorical colour (`'green'`, `'blue'`, `'orange'`, `'purple'`, `'teal'`, `'rose'`, `'neutral'`) for a chart's series, or one of `DataBar`'s statement tones (`'success'`, `'muted'`, `'strong'`, `'accent'`, `'danger'`, and `'neutral'`; a `'bar'` in `'danger'` is DataBar's light shortage fill, for a shortage only, never for cash leaving, and not BarChart's full-colour danger bar, which is the `'line'` swatch's colour). A `'line'`, a `'marker'` (a downward triangle) and a `'box'` (the dashed outline of a boxed current period) are strokes and take a stroke tone (`ChartStrokeTone`, listed in `chartStrokeTones`: `'accent'`, `'success'`, `'warning'`, `'danger'`, `'neutral'`). `ChartTone` is either. Each swatch is the colour of the mark it names in the same tone, because the legend, `DataBar` and the charts read one tone table: a fill keeps 1.5:1 on the surface, a stroke 3:1, in every palette and scheme. The swatches are decorative (`aria-hidden`), so each item reads as its words; the list keeps its role (`role="list"`, which Safari drops from an unmarked list) and takes a name with `aria-label`. An empty or blank `label`, or a swatch or tone the item cannot draw, throws a `RangeError`. Forced colors draw every swatch in the system text color. The contrasts hold on the surface, so put a chart and its legend on it (a `Card`). A `BarChart`'s default bar is a `'bar'` swatch in `'accent'`; its toned bars are drawn in the full semantic colour, the `'line'` swatch's colour.

```tsx
<ChartLegend
  aria-label="Key"
  items={[
    { label: 'Herons', swatch: 'bar', tone: 'blue' },
    { label: 'Running total', swatch: 'line', tone: 'accent' },
    { label: 'Flood', swatch: 'marker', tone: 'danger' },
    { label: 'This week', swatch: 'box', tone: 'accent' },
  ]}
/>
```

`ColumnChart` draws columns for each of its `categories` (weeks, months: each a row header in its table), one per series (`ColumnChartSeries`: a unique `id`, a `label`, a value per category and a categorical `tone`). `mode` (`ColumnChartMode`, listed in `columnChartModes`) is `'stacked'` by default, a category's positive values stacked up from zero and its negative values down from it, or `'grouped'`, side by side, each from zero; negative values always run below the zero line. `line` (`ColumnChartLine`: `label`, a value per category, `endLabel`) draws an accent line over the columns, such as a running total, on its own right-hand scale whose zero and grid lines are level with the columns' (each scale keeps its own round step); its last value is written beside that axis, in the accent's ink, unless `endLabel` is `false`. `highlight` boxes one category (a dashed accent outline, the current period), and its table row is `aria-current`. `callouts` (`ColumnChartCallout[]`: a category `index`, its `text` and an optional categorical `tone` for its words) are pinned in rows above the plot, each beside a dashed leader down to its column. `formatValue` writes the figures (the table and the line's last value; a plain number with at most one decimal by default) and `formatTick` the axes (defaulting to `formatValue`). The chart fills its container's width and is laid out for it in its own pixels, so its words stay the caption size; under 480 px it is compact: a shorter plot, fewer category labels (always the last) and its callouts listed under the plot, so it never scrolls sideways. The drawing is hidden from assistive technology: a visually hidden table captioned by `label` carries every figure, and the callouts stay a list. Fills, strokes and words come from the chart tones, so a `ChartLegend` above it names each series (`bar` in its tone), the line (`line`, `'accent'`) and the box (`box`, `'accent'`); put both on the surface (a `Card`). Forced colors draw the columns in the text color (outlined in the canvas color), the line in the highlight color and every word in the text color. Empty words, a series or line without one finite value per category, a repeated series id, a tone off the categorical scale, or a highlight or callout that is not a category's index throw a `RangeError`.

```tsx
<ColumnChart
  label="Change in birds, last 13 weeks"
  categories={weeks}
  series={[
    { id: 'herons', label: 'Herons', tone: 'blue', values: herons },
    { id: 'egrets', label: 'Egrets', tone: 'purple', values: egrets },
  ]}
  line={{ label: 'Running total', values: runningTotal }}
  highlight={weeks.length - 1}
  callouts={[{ index: 3, text: 'Aug 4 · Roost found +50', tone: 'purple' }]}
  formatValue={signed}
/>
```

`LineChart` draws a value over time: `points` (`LineChartPoint[]`: `x` a `YYYY-MM-DD` date, `y` a value), in date order (a date may repeat, as a balance that changes twice in a day), placed by the days between them. `curve` (`LineChartCurve`, listed in `lineChartCurves`) is `'linear'` by default or `'step'`, each value held until the next date. `area` tints the area between the line and zero with its tone, and `tone` (a `ChartStrokeTone`, `'accent'` by default) colors the line, its dot and its last value, written beside the plot's end unless `endLabel` is `false`. `markers` (`LineChartMarker[]`: `x`, one of the points' dates; `label`; a stroke `tone`) put a downward triangle on the line at that date's last value with its words below it (above it where they would pass the plot's bottom), moved in to stay over the plot; words that would meet an earlier marker's are left out of the drawing, never the table. `markersLabel` heads the table's column of marker words and is required with markers. `ticks` are the dates the time axis labels (the first and last point by default), thinned from the last so none meet; `highlight` (`LineChartPeriod`: `from`, `to`) boxes a period, its rows `aria-current`. `formatValue`, `formatTick` (the value axis) and `formatDate` (the time axis and the table's row headers; the date itself by default) write its words. It is laid out for its measured width like `ColumnChart`, never scrolling sideways, and its drawing is hidden: a visually hidden table captioned by `label`, its value column headed by `valueLabel` (default `label`), carries every date, value and marker. A `ChartLegend` above it names the line (`line` in its tone), the markers (`marker` in theirs) and the box (`box`, `'accent'`). Forced colors draw the line in the highlight color, the markers and every word in the text color, and drop the area. Empty words, a date that is not `YYYY-MM-DD`, points out of date order, a value that is not finite, an unknown curve or tone, a marker off the points' dates or without `markersLabel`, a tick outside the points' dates, or a period that ends before it starts throw a `RangeError`.

```tsx
<LineChart
  label="Birds roosting each night"
  valueLabel="Roosting"
  points={nights}
  area
  markers={[{ x: '2026-08-12', label: '2600', tone: 'warning' }]}
  markersLabel="A flock left"
  ticks={['2026-07-27', '2026-08-17', '2026-10-12']}
  highlight={{ from: '2026-10-06', to: '2026-10-12' }}
  formatDate={shortDate}
/>

<LineChart label="Nest boxes lent" curve="step" tone="warning" points={loans} />
```

`Pagination` steps through a list shown a page at a time, for a list with no total to keep in view (a list that adds up scrolls inside itself instead, with `Table` `maxHeight`). It is a `nav` landmark named by `aria-label` or `aria-labelledby` (one is required), holding the consumer's words for what the page shows (`rangeLabel`, such as "1–25 of 130 changes", in the muted caption at the inline start and announced politely when it changes) and the previous and next steps at the end: icon-only neutral `sm` Buttons, square, the 44 px touch target on a coarse pointer, named by `labels` (`PaginationLabels`: `previous`, `next`) with a private chevron glyph mirrored right to left. `page` (from 1) and `pageCount` place it; a step calls `onPageChange` with the page it goes to. At either end its step looks disabled (`aria-disabled`, the neutral grey) but stays a Tab stop, so focus is never dropped when the last page is reached, and a press there does nothing. Pages that are not whole numbers in range, or an empty step label (`labels.previous` or `labels.next`), throw a `RangeError`. The row wraps on a narrow column, the steps staying at the end.

```tsx
<Pagination
  aria-label="Change pages"
  page={page}
  pageCount={6}
  onPageChange={setPage}
  rangeLabel="1–25 of 130 changes"
  labels={{ previous: 'Previous page', next: 'Next page' }}
/>
```

`DocumentViewer` draws a PDF from its bytes (`data`, an `ArrayBuffer` or `Uint8Array`, never a URL) with PDF.js, one page at a time, fitted to the width it is given, on a quiet grey stage at the large radius. Under the page, "Page n of m" (`labels.page(page, pageCount)`) is a polite live region between 48-point round previous and next steps (`labels.previous`, `labels.next`), which look off at either end but stay Tab stops; with one page only the words show. `page` and `onPageChange` hold the page in the consumer (left out, the viewer keeps its own; a page out of range shows the nearest). Two fingers zoom the page up to four times as wide, keeping the spot of the page between them under the fingers (the stage scrolls across and the boxes around it, the window at last, scroll down; the stage only pans, so the screen does not zoom instead), and on the focused page `+`, `-` and `0` zoom in, out and back to fit width about the middle of what shows; a zoomed page scrolls sideways inside the stage and is drawn again at its size once the zoom rests. The page's text lies over the drawing, transparent (PDF.js's text layer), so assistive technology reads it and the person can select it. While the PDF opens it shows `labels.loading`; when it cannot be opened or a page cannot be drawn, `labels.failed`, an optional `labels.failedDetail` and your `failedAction` (such as Try again and Download PDF) in an alert, and it calls `onError`; when only one page cannot be drawn, the steps stay, so another page can be read. `onLoad` receives the page count. New `data` opens again at the first page, so Try again is new bytes or a new `key`; keep `data` the same object between renders (in state or a memo), since bytes made afresh on each render reopen the PDF every time. The viewer is a region landmark named by `label`; its stage, once open, is a focusable group named by the page words. It has no download or print of its own and opens nothing from the network: no font, character map, colour profile or WebAssembly file (PDF.js uses system fonts and skips what it cannot decode), no XFA, no streaming or range requests, and no code evaluation (`isEvalSupported: false`); it draws from a copy, so your bytes stay usable for a download. PDF.js (`pdfjs-dist`, its legacy build, for the browsers stores run) is loaded the first time a viewer opens a document, so a page without one never downloads it. Missing words, a blank `workerSrc` or a `labels.page` that is not a function throw a `RangeError`.

PDF.js parses in a worker. Scalewing ships the worker entry for its own pinned PDF.js version as `@scalewing/react/document-viewer-worker`; bundle it as a module worker and pass its URL as `workerSrc`. With Vite:

```tsx
import { DocumentViewer } from '@scalewing/react';
import workerSrc from '@scalewing/react/document-viewer-worker?worker&url';

<DocumentViewer
  data={bytes}
  workerSrc={workerSrc}
  label={guide.title}
  labels={{
    previous: t('reader.previousPage'),
    next: t('reader.nextPage'),
    page: (page, count) => t('reader.pageOf', { page, count }),
    loading: t('reader.opening'),
    failed: t('reader.failed'),
  }}
  failedAction={<Button onPress={retry}>{t('reader.tryAgain')}</Button>}
/>;
```

The consumer needs no PDF.js dependency of its own. With another bundler, build `@scalewing/react/document-viewer-worker` as a module worker (`new Worker(url, { type: 'module' })`) and pass the built file's URL. `pdfjs-dist` has an optional native canvas for Node (`@napi-rs/canvas`, 28 to 35 MB per platform) that a browser never loads; a pnpm consumer can skip it with `ignoredOptionalDependencies`. `pdfjs-dist` asks for Node 22.13 or later.

`Spinner` shows indeterminate loading in small, medium, or large sizes. Supply localized `label` for the one announced status in a loading region. Use `decorative` on additional indicators beside that status so screen readers do not hear the same message repeatedly. Reduced motion leaves a static accented ring.

`GlyphTile` is a small rounded square in a categorical colour with the consumer's glyph in white: the mark of a kind beside its name, such as a service in a list. `hue` is one of the `@scalewing/tokens` categorical colours (`green`, `blue`, `orange`, `purple`, `teal`, `rose`, or `neutral`); which kind takes which hue is yours. `size` is `sm` (24), `md` (28, the default) or `lg` (32); the glyph is drawn at spacing step 4 in white, which keeps 3:1 on every fill; pass the SVG (a Lucide component) as the tile's direct child, since only a direct-child SVG is sized. It is always `aria-hidden`, so put the kind's name in visible text beside it. An unknown `hue` or `size` throws a `RangeError`.

```tsx
<Inline gap={2} align="center">
  <GlyphTile hue="teal">
    <Waves />
  </GlyphTile>
  <Text>Reef</Text>
</Inline>
```

`Combobox` is a text input with a list of suggestions, an ARIA 1.2 combobox with list autocomplete. Pass the `label` (drawn above the input unless `labelVisuallyHidden`), the controlled `inputValue` and `onInputChange`, and `groups` you filter from the text yourself: `{ label?, options }`, each option `{ value, label, description?, badge?: { label, tone? }, disabled? }`. Typing, a press on the input or ArrowDown opens the list on the popover layer under the input, at least as wide; each group with a `label` is a `role="group"` under its heading. ArrowDown and ArrowUp move the active option (named by the input's `aria-activedescendant`; focus stays in the input) and wrap; Enter or a press chooses it and calls `onSelect(value)` (set `inputValue` to its label yourself), and a disabled option is shown and read as unavailable but never chosen. `action` (`{ label, onPress, badge? }`) ends the list as one more option, such as adding a new entry. `emptyText` shows when no group has an option, and a polite live region, always in the page, announces it (and, with `countText: (count) => string`, the number of options); `note` is a muted line under the list that describes the input while open. `listLabel` names the list when it differs from the input's label. The active option is held by its value, so it stays put when your results change under it. Escape closes the list and a second Escape empties the input; Alt+ArrowUp, Tab, a blur or a press outside closes it. The input is a `Field` input, so `description`, `error`, `required`, `disabled`, `placeholder` and `size` (`md` or `xs`; `comboboxSizes`) work as on any field. Blank words, duplicate option values, an unknown `size` or badge tone throw a `RangeError`, and an `action` without `onPress` a `TypeError`.

`MultiSelect` is several choices from a short list behind one trigger, such as which kinds a list shows. The trigger reads the muted `label` and then `summary` (your words for what is chosen, such as "All entries" or "2 services") with a chevron; it opens a panel named by the label with `allLabel` and `clearLabel` commands over one checkbox per option, each with an optional `icon` (use a small `GlyphTile`, never a bare dot) and a hairline before an option with `separatorBefore`. `onChange` reports the checked values in the options' order. It is a disclosure of native checkboxes, not a listbox: the first checkbox takes focus as it opens, Escape closes it and returns focus to the trigger, focus or a press outside closes it, and disabling it while open closes it. Blank words, no or duplicate options, a value that is not an option, or an unknown `align` throw a `RangeError`.

```tsx
<MultiSelect
  label="Show"
  summary={
    shown.length === options.length ? 'All sightings' : `${shown.length} kinds`
  }
  options={[
    {
      value: 'forest',
      label: 'Forest',
      icon: (
        <GlyphTile hue="green" size="sm">
          <Trees />
        </GlyphTile>
      ),
    },
    { value: 'station', label: 'Station moves', separatorBefore: true },
  ]}
  value={shown}
  onChange={setShown}
  allLabel="All"
  clearLabel="Clear"
/>
```

`Notice` is a tinted note in the page's flow (`tone`: `info`, `success`, `warning` or `danger`). The fill is the tone mixed into the surface (the accent tint for `info`) and the words are the tone moved toward the text color, so they keep 4.5:1 on the fill in every palette (only where a palette's own `danger` is under 4.5:1 on its surface does the note stay at least as readable as that). `title` is a bold lead; a text message (values interpolated in it included) shares its row while it fits and wraps under it otherwise, and a message with any element (a `span`, or a sentence and a `Checkbox` or `Field` in a `Stack`) is stacked under it. Write the message as plain text or a `span`, not a `Text`, which brings its own color. A control inside keeps its own colors; its muted description takes the notice's ink so it stays readable on the fill. `action` is one link or small `Button` at the end of the row; `icon` is a consumer glyph before the text, hidden from assistive technology. `danger` is `role="alert"` and the other tones `role="status"`; `role="none"` is for a note that is part of the page from the start (no live region). Screen readers announce an `alert` that appears, but not reliably a `status` mounted with its words: to have a status heard, keep the Notice mounted and change its words, or move focus to it. It never dismisses itself. Pass `tabIndex={-1}` and a `ref` to move focus to it. `variant="band"` makes it a full-width square strip of page chrome in caption type with its words centered, at least the `xs` control height, such as an environment strip first on the page (`<Notice tone="warning" variant="band" title="Field station">Records here stay out of the census.</Notice>`). It is as wide as its container, so put it outside any padded column, as the page's first child. A glyph or an action stays on the words' row and the words wrap. A band has no live region unless you pass `role`. An unknown `tone`, `role` or `variant`, a blank `title`, or a note with neither a title nor a message throws a `RangeError`.

```tsx
<Notice tone="danger" title="$30.00 short.">
  Add the bills or change the amount.
</Notice>

<Notice
  tone="info"
  role="none"
  title="Three surveys are due this week."
  action={<Button size="sm" variant="ghost" onPress={openTasks}>Open tasks</Button>}
/>
```

`Progress` shows a known value between zero and a positive maximum. It uses native progressbar semantics and displays the value and maximum beside the localized label. Invalid bounds throw instead of silently clamping. Optional `tone` is `accent`, `success`, `warning` (such as the time left before a sign-out) or `danger`; an unknown tone throws. `showCount={false}` hides the visible `value / max` count when the page shows its own count caption, so the count appears once; the progress bar still exposes its value and maximum.

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

`Article` is a page that reads like a post, on a card (`variant`, as `Card`'s) no wider than the reading width (`--sw-reading-max`, 46rem): an optional `cover` photo (`{ src, alt }`, `alt` required, `''` when it only decorates) (or `null`) edge to edge across the top at 3:1 (2:1 below `md`) with the card's top corners; then, a space-6 from the top and bottom and a space-8 from the sides (space-5 all round below `md`), the `eyebrow` (muted caption type at the label's weight) with your `actions` at its row's end (such as a language switch; under the eyebrow, at its start, when the row is too narrow), the `title` in heading type (`titleAs`: `h1` by default, on the article's own page; `h2` or `h3` under other headings), the muted `meta` line (such as "Manager 1 · Oct 16 · 4 min read"), a hairline, and the body (`children`, your own content, such as paragraphs or Markdown your app draws). It is an `article` landmark named by its title, and its ref is that element; the eyebrow and meta are `div`s, so any content fits. The card sits at the start of a wider column. Empty parts draw nothing. A blank `title`, an unknown `titleAs` or `variant`, or a `cover` with a blank `src` or no `alt` throws a `RangeError`.

```tsx
<Article
  cover={{ src: cover.url, alt: cover.alt }}
  eyebrow="Field guide · Wetlands › Herons"
  title="How to count herons at the north hide"
  meta="Ranger 1 · Oct 16 · 4 min read"
  actions={
    <SegmentedControl
      aria-label="Language"
      variant="raised"
      items={languages}
      value={language}
      onChange={(id) => setLanguage(id === 'es' ? 'es' : 'en')}
    />
  }
  variant="outlined"
>
  <Stack gap={4}>{paragraphs}</Stack>
</Article>
```

`MarkdownView` draws Markdown someone wrote or pasted (`source`) in Scalewing's type, as React elements and never as HTML from a string: paragraphs, headings (`#` drawn as an `h2`, since the page has its own title, `##` an `h3`, `###` and deeper an `h4`, in the title, body and label sizes; a `#` followed straight by a `###` skips a level, as written), bullet and numbered lists, bold, italic, links, block quotes as a highlighted box (the accent's tint with an accent bar; a link or photo caption in it is the text colour), line breaks, thematic breaks (a `Separator`) and photos. A link opens only `http`, `https` or `mailto` addresses, read as the browser would (`new URL`), in a new tab with `rel="noopener noreferrer"`, and carries your `newTabLabel` (required, such as "(opens in a new tab)") as hidden words; reference links and autolinks follow the same rule, and any other scheme (such as `javascript:` or `data:`), a relative or protocol-relative address shows as the link's plain words. Links are the accent, underlined; in the harvest palette's dark scheme the accent is 4.24:1 on the surface, a palette gap the tokens tests record. The only image is `![caption](photo:<id>)`: `resolveImage(id)` returns its `{ src, alt? }` or `null`; it is drawn as a figure at the page's width with the caption under it, outside any paragraph, when its `src` is relative, `https:`, `http:`, `blob:` or a `data:` PNG, JPEG, GIF, WebP, AVIF or SVG and it has words (its `alt`, else the caption). Keep `resolveImage` stable (`useCallback`): a new function reads the source again. Raw HTML (a tag's words stay), scripts, tables, other images and unresolved or wordless photos are left out; code is shown as plain text without highlighting. Quotes, lists and marks nested past 16 levels are shown as their words (a block reaching the parser's 128th level, where it stops reading, is reported once as it may be lost), and the parser's work stays linear, so a realistic 50,000-character page reads in about 7 ms and the slowest crafted one in about a tenth of a second (measured in the request). Each heading gets an id from its words, after `idPrefix`: give every view on a page its own (such as `"page-"`; `''`, the default, is none), or a heading such as "Content" takes the page's `content` id; repeats get `-2`, `-3`. `inspectMarkdown(source, { resolveImage, idPrefix })` gives the same `headings` (`id`, `level`, `text`) for an "On this page" `Nav`, the first 100 `omissions` (`kind`: `html`, `table`, `image`, `link`, `code` or `limit`, and up to 80 characters of `source`) and `omissionCounts` for every kind, for an editor to say what will not be shown. The parser is `markdown-it` (CommonMark, with GFM tables only so they are recognised and left out); its HTML renderer is never used. A `source` that is not text, an `idPrefix` other than `''` or a letter followed by letters, digits, `-` or `_`, or a `resolveImage` that is not a function throws a `RangeError` in both; a blank `newTabLabel` throws in the view.

```tsx
// One stable resolver for both: a new function reads the source again.
const resolveImage = useCallback((id: string) => photos[id] ?? null, [photos]);

const { headings, omissions } = inspectMarkdown(page.body, {
  resolveImage,
  idPrefix: 'page-',
});

<MarkdownView
  source={page.body}
  resolveImage={resolveImage}
  idPrefix="page-"
  newTabLabel="(opens in a new tab)"
/>;
```

`Separator` divides sections with a token-colored line. It is horizontal by default; use `orientation="vertical"` in a flex row. Set `decorative` when the line only supports layout so assistive technology ignores it.

`DescriptionList` pairs terms with what each says, one `DescriptionItem` per row: a `dl` whose items each group a `dt` (`term`) with its `dd` (`children`). From `md` up the term sits in a start column as wide as the widest term, up to 40% of the list, and the detail beside it; every row aligns to its top, so a term and its detail's first line start level, and a hairline divides the rows, with no space above the first row or below the last. Below `md` each term sits over its detail. The list sets only the layout: pass your own `Text` for the term and the detail. Each child of a term or a detail is its own line with its own line height (a column), as wide as its content unless it sets its own width (a `Progress` fills the detail; a `Field` keeps its input's width): wrap inline content, such as words and a link on one line, in one element such as an `Inline`. Long unbreakable words wrap inside their column. A `dl` has no ARIA role, so name a list with a visible heading, and `aria-labelledby` on the `section` around it, rather than an `aria-label` on the list.

`layout="spread"` (opt-in; the default is `columns`) sets each row on its own two columns at every width, for a short box of facts such as a side panel's details: the term at the row's start, as wide as its words up to half the row, and the detail at the row's end, its lines end-aligned. The hairlines, padding and top alignment are the same, and a phone keeps each term beside its detail. An unknown `layout` throws a `RangeError`; `descriptionListLayouts` lists the layouts.

```tsx
<DescriptionList>
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

`StatTile` is one prominent figure with its label: a `label`, a consumer-formatted `value` (tabular figures; `tone` `accent`, `success`, `danger` or `warning` colours it), an optional `caption` under it and an optional `glyph` in a tinted circle. `emphasis="primary"` fills the one figure a page leads with in the accent. `appearance="plain"` (default `"card"`, `statTileAppearances`) drops the tile's surface, edge, radius and padding, top-aligned, for figures inside a card that already has them, such as four answers in a row divided by hairlines: compose a `Grid` and a vertical `Separator` before every tile but the first, hiding the one that would start a row below `md` (`Inline hideBelow="md"` around it). A plain tile cannot be `primary` (there is no surface to fill), and an unknown appearance throws a `RangeError`.

```tsx
<Card padding={5}>
  <Grid columns={4} columnsBelow={{ md: 2 }} gap={4}>
    {answers.map((answer, index) => (
      <Inline align="stretch" gap={4} key={answer.label}>
        {index > 0 ? (
          // 2 is columnsBelow md: an answer that starts a row there has no hairline.
          <Inline
            align="stretch"
            hideBelow={index % 2 === 0 ? 'md' : undefined}
          >
            <Separator orientation="vertical" decorative />
          </Inline>
        ) : null}
        <StatTile appearance="plain" {...answer} />
      </Inline>
    ))}
  </Grid>
</Card>
```

`ListGroup` is rows in one list with a hairline between each pair, the web twin of react-native's: a `ul` (its list role kept) named by `aria-label` or `aria-labelledby`. `variant="panel"` (the default) is one bordered panel; `plain` draws no panel and a hairline above the first row too, for rows inside a `Card`. Each `ListRow` has a `title` (weight 600, or the body weight with `titleAppearance="plain"`; `tone="danger"` for a row that ends something), an optional muted `detail` line, an optional `value` at its end (weight 600, tabular figures; `valueTone` `success`, `danger`, `muted`, `accent` or `warning`, the warning colour's ink moved halfway to the text colour so it keeps 4.5:1 on the surface in every palette; `valueBadge` draws the value as a `Badge` in that tone instead, such as a status, still read in the row's name, never with `valueTone`; `valueDetail` a muted line under it) and an optional `leading` mark such as a status dot, hidden from assistive technology, so the words say what it means. With `onPress` the whole row is a button, and with `href` a link (`onPress` then takes a plain press for a client router); either adds a chevron, a quiet fill under the pointer and 44 px on a coarse pointer, and the row is named by its title and value and described by its detail lines (`aria-label` replaces the name). `selected` makes a pressable row a choice: a check while true, `aria-pressed` on a button or `aria-current` on a link (on a row with neither `onPress` nor `href` it throws, since nothing could read the state). `accessory="none"` hides the chevron of a row that acts in place; `disabled` blocks presses. A row with neither `onPress` nor `href` only states something. `maxHeight={{ rows }}` bounds the list to that many rows of a title and one detail line, the rest scrolling inside its own named region, which shades an edge with more rows past it; a bounded list must be named. `footer` stays pinned under the rows, outside the scroll, such as a `ListRow` with the count and the total (a row there is not a list item). An empty title or value, an unknown variant, tone or badge tone, a `valueDetail`, `valueTone` or `valueBadge` without a value, a value both toned and a badge, or a bad row count throws a `RangeError`.

A row can also carry three trailing parts. `unread` marks it new for the person, such as a document they have not opened: an accent dot after the title's last word (drawn as a border, so forced colors keep it in the text color), hidden from assistive technology, and `unreadLabel` (required while `unread`, such as "New") is read after the title, in a pressable row's name ("Heron calls New"). `tag` is a short status before the row's end, such as a `Badge` ("Only in English"), centred on the row and never wrapped; a pressable row is described by it after its detail lines. `action` is a control after the row and outside its press area, such as an `ActionMenu` of the row's own commands named by the consumer ("More for Heron calls"): it is the row's sibling in the list item, centred on the row, after it in the Tab order, and a press on it never opens the row; it keeps the row's end inset (a space-4 in a panel or outside a ListGroup, none in a plain list), and where `:has` is supported the hover fill spans the row and its control. An empty slot (`undefined`, `null`, `false` or `''`, as conditional JSX gives) draws nothing, for `leading` too. Pair `action` with `accessory="none"` when the row's own chevron would sit beside it. An unread row without `unreadLabel`, or a blank one, throws a `RangeError`. An `aria-label` replaces the whole name, unread words included.

`truncate` (opt-in) keeps a row's title and its detail line to one line each, cut with "…" where they do not fit, for a long list read at a glance such as a shelf of documents. The title's words sit in their own box, so the unread dot follows the cut words and is never hidden; the whole words stay in the row's name and description and in a `title` tooltip on the words and the detail. The value, its detail, the tag and the action keep their words whole. A tooltip needs a pointer, so on a touch screen or from the keyboard the cut words are whole only in what the row opens and in what assistive technology reads; keep `truncate` for rows that open their whole content, or whose words a person does not need in full to choose.

`titleLang` (opt-in) is the title's language, a BCP 47 tag such as `es`, when it is not the page's, such as a document's Spanish title in a list on an English page (WCAG 3.1.2, Language of Parts). It sets `lang` on the title's box, which holds the title's words and the wordless unread dot, so a screen reader speaks the title in that language and the browser hyphenates and shapes it as such; the detail, the value and its detail, the tag, the unread words and the action stay in the page's language (give a tag its own `lang` inside it if it needs one). A pressable row's name and description are unchanged: the title is still read first. It works with `truncate` (the words box sits inside the marked title) and on every kind of row. A blank `titleLang` throws a `RangeError`.

```tsx
<ListRow
  leading={
    <GlyphTile hue="orange">
      <Feather />
    </GlyphTile>
  }
  title={guide.title}
  detail={guide.detail}
  href={guide.href}
  onPress={() => router.push(guide.href)}
  unread={guide.isNew}
  unreadLabel="New"
  tag={guide.onlyOne ? <Badge>Only in English</Badge> : undefined}
  accessory="none"
  action={
    <ActionMenu
      label={`More for ${guide.title}`}
      trigger={<Ellipsis />}
      align="end"
      items={items}
    />
  }
/>
```

```tsx
<Card padding={4}>
  <Text as="h3" id="look" variant="label">
    Worth a look
  </Text>
  <ListGroup aria-labelledby="look" variant="plain">
    <ListRow
      leading={<Circle size={8} fill="currentColor" />}
      title="Wed, Oct 7 · North marsh counted 6 fewer herons"
      detail="Recounted Sat, Oct 10 by Field team A"
      href="/nights/2026-10-07"
      onPress={() => router.push('/nights/2026-10-07')}
    />
  </ListGroup>
</Card>

<ListGroup
  aria-label="Night counts"
  maxHeight={{ rows: 5 }}
  footer={<ListRow title="8 nights" value="+0" />}
>
  {nights.map((night) => (
    <ListRow
      key={night.id}
      title={night.name}
      detail={night.detail}
      value={night.change}
      valueTone={night.tone}
      onPress={() => openNight(night)}
    />
  ))}
</ListGroup>
```

`Card` defaults to `glass`; `outlined` and `elevated` are solid surfaces, and `filled` is a quiet `--sw-color-subtle` fill with no border for plain information apart from pressable rows.

`--sw-color-accentSubtle` is the accent tint from `@scalewing/tokens`: a quiet fill behind accent text or glyphs that keeps 4.5:1. The stylesheet and every palette file set it, and a palette that moves the accent or surface retints it.

`Text` steps `display` and `heading` down to the compact token sizes below the `md` breakpoint; consumers do not size type per viewport.

`sw-container-reading` centres a column at the reading width (`--sw-reading-max`, 46rem, `Article`'s), as `sw-container` centres a page's column at the container width (72rem): `width: 100%`, the max width and auto inline margins, full width below it. Use it for a form or text that reads better narrower than the page, such as an open form of one column. As with `sw-container`, the width is the content box's, so put padding or a border on a child.

`sw-font-mono` sets an element, or a native text control such as the `textarea` in a `Field`, in the platform's monospace face (`ui-monospace, monospace`, the generic names only) at the size it already has, for words read as typed code or marks, such as a Markdown source being written. It outranks the canvas's text control rules.

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

`DenominationGrid` shows integer counts per unit across a fixed set of columns. The `strip` layout is a captioned table: each row has a toned label with an icon slot, muted zero cells, optional signed deltas toned by sign, and an optional consumer-formatted `total` that shows under the label on a phone. Pass `totalLabel` (for example "Total") to name the total column: it renders a `th scope="col"` shown over the totals from `md` up and visually hidden below it, and without it the corner stays an empty cell as before (either way the column takes no width on a phone). `labelWidth` (`xs` to `xl`, the `Table` column sizes) lines a strip's columns up with every other strip of the same columns in a container of the same width, such as the cards of a feed: the row labels take that width and the count columns share the rest of the region equally, so no content moves a column. `labelAppearance="plain"` (default `"tone"`) sets every row label in the text color at label weight with no tone stripe, in both layouts, for a grid whose rows need no color to tell apart; a row's `tone` still colors its total, and an unknown value throws. Three more grid-level options match a framed count sheet, each off by default: `frame="table"` (default `"none"`) draws a strip as a framed table, its scroll region a surface inside a border hairline at the `sm` radius, the heading row on the subtle fill, a rule between columns, the counts at label size centred under their heads and the cells padded a space-3 step across (the tiles layout has no frame and ignores it); `totalEmphasis="strong"` (default `"default"`) sets the row totals in bold label type, a neutral row's in the text color and a toned row's in its tone, under the label on a phone too; and `cellToneAppearance="pill"` (default `"text"`) sets a `cellTones` count of a strip's read-only row on a rounded tint of its tone in the tone's ink (the `Notice` fill and words, 4.5:1 on the tint except where a palette's own `danger` is already under 4.5:1, harvest and mocha dark), outlined in forced colors; entry counts and tiles keep their tone border. A strip row's `valueRow` (`{ label, cells }`, opt-in) adds a line right under it that gives each column's value, such as the money its count adds up to: its own table row on the subtle fill, `label` (such as "Value") in the label column (named with the row's label, "Counted Value", for table navigation), each of `cells` (one consumer-formatted string or `null` per column; `null` or `''` leaves it blank) centred under its count at label size in tabular figures, and the row's `total` moved onto it (bold with `totalEmphasis="strong"`, under the line's name on a phone); the counts' own total cell stays empty. It keeps the row's tone and `disabled` (a disabled line fades its values). Each entry count with a value is described by it (`aria-describedby`, before an error), and the value is no tab stop. The grid still does no arithmetic. A `valueRow` in the tiles layout, a blank label, or cells that are not one string or `null` per column throw a `RangeError`. With `zeroLabel=""` a toned zero or empty count shows nothing in either appearance, so tone only counts that are there. An unknown value of any of them throws a `RangeError`. `zeroLabel` (default `"—"`) is what a zero or empty read-only count shows; an empty string leaves those counts blank, so only the counts that are there stand out (it suits the strip, where the column header names each blank cell, better than tiles, where a blank tile is only its column's name), and a `zeroLabel` that is not a string throws. On a phone the total cell stays in the table, visually hidden, so a screen reader still reads each total in its row; the copy under the label is `aria-hidden`. A strip wider than its container scrolls sideways inside its own keyboard-focusable region, named after `label`, with the row labels pinned at the start and the same edge shade as `Table` while counts are scrolled out of view (the start shade is cast from the pinned labels' edge, since they cover the region's own); the page never scrolls sideways. The `tiles` layout stacks the column label, the count, and an optional `subtotal` string per column. Each tiles row shows its label line (icon, label and `total`) when the grid has several rows, or when a lone row has an icon or a `total`; a lone plain row is named by the grid's `label` alone. Every row is a region named by its `label`, except a lone plain row whose `label` is the grid's own: it has no name of its own, so assistive technology hears the grid's group once rather than a region repeating it. `rowRole="group"` (default `"region"`) keeps every named row's name but makes it a `group` instead of a landmark region, for a page with many grids (one per order card, say) whose rows would otherwise fill the landmark list; the strip ignores it, since its rows are table rows, and an unknown `rowRole` throws a `RangeError` in either layout. A row's icon and its label words stay on one line in both layouts (`sw-denomination-label-line`): a long label wraps its words beside the icon, never under it, and on a phone the strip's total goes on its own line under them. A row's `cellTones` (one Badge tone or `null` per column) tones a single count in place: the count is set in the tone over its signed or zero look, and in the tiles layout its tile's border takes the tone too, so a short bill turns red without leaving its row; `neutral` or `null` leaves a count as it is, a row's `tone` still colors only its label, and a `cellTones` that is not one known tone or `null` per column throws. The tone never says why on its own; put that in words beside the grid. Every negative count, signed or not and in either layout, is written with the typographic minus ("−1"), never a hyphen. The primitive does no arithmetic and no currency formatting; tones reuse the Badge vocabulary. Invalid columns, rows, or cells throw.

`DenominationGrid` board options, all opt-in.

- A row's `negativeAppearance="plain"` (`denominationNegativeAppearances`, default `"danger"`) sets its negative counts in the text colour with their minus. Use it for counts that go out by design, such as bills paid out: going out is not an error, so never red. `"danger"` stays for a shortage.
- `transposeBelow="md"` (or `"lg"`; `denominationTransposeBreakpoints`; the strip layout only) draws the strip transposed below that width, for a phone. Each denomination is a row (its label and caption, pinned while the columns scroll), each grid row a column (its label over its counts, entry steppers or value line), and the totals a last row named by `totalLabel`. Names, entry, cell tones, the zero label and quiet and disabled rows are the strip's; a disabled row says so on its column heads. It reads the width with the breakpoint's media query, so a server render draws the strip, and crossing the breakpoint (turning a phone) remounts the grid, so a count being typed loses focus.
- `countDigits` (3 to 6, entry rows only) keeps that many digits' room in every entry count before the strip scrolls, such as 4 for counts in the thousands in seven columns. The default room is 3.
- An unknown appearance or breakpoint, `transposeBelow` on tiles, or a `countDigits` out of range or without entry rows throws a `RangeError`.

```tsx
<DenominationGrid
  label="Bird rings"
  columns={ringColumns}
  countDigits={4}
  transposeBelow="md"
  totalLabel="Total"
  rows={[
    { id: 'kept', label: 'Keep on hand', cells: kept, entry, valueRow },
    {
      id: 'given',
      label: 'Given out',
      cells: given,
      signed: true,
      negativeAppearance: 'plain',
    },
  ]}
/>
```

A strip row with `entry` makes its counts editable: each column holds a `Stepper` (`width="full"`, its label hidden and named by the row label and the column's label and caption as its header reads, such as "Received $20" or "Counted $1 × 100") whose count is the row's `cells` entry (`null` is an empty box). `entry.onChange(columnKey, value)` reports a change; `entry.decrementLabel` and `entry.incrementLabel` name the buttons; `entry.max` caps each column (`null` for none), `entry.errors` puts a message under a column's count (`null` for none), and `entry.placeholder` fills an empty box. `entry.limitAppearance` is the Steppers' `limitAppearance`: `"plain"` keeps − at 0 (and + at a cap) unfaded. The minimum is 0. The grid still does no arithmetic, so recompute the row's `total` in `onChange`. A strip with an entry row centres its heads and read-only counts over the steppers, and each count keeps spacing step 8 of room, so a narrow strip scrolls in its region instead of crushing it. A `cellTones` tone on an entry count draws its border in the tone (danger for a difference); an `accent` tone, for a suggestion or a change, is the `Stepper`'s `changed` look (border and tint); a message in `entry.errors` wins. A row `caption` is a muted line under its label ("from the customer"), and a column `caption` a muted note after its label ("× 100"). Captions show in both layouts. In the strip, `emphasis="quiet"` sets a row on the subtle fill, for a row to compare against, and `disabled` fades a row that does not apply, disables its entry and marks it `aria-disabled`. Entry rows, quiet rows and disabled rows need the `strip` layout. An entry row's counts are zero or more and it is not `signed`; its label is its own among the entry rows, as each column's label and caption are, so every count has its own name. Breaking any of these, a cap or message list that is not one per column, a cap that is not a whole count of zero or more, blank button names or captions, an unknown `emphasis`, or a `disabled` that is not a boolean throws a `RangeError`.

```tsx
<DenominationGrid
  label="Tag packs"
  columns={[
    { key: 's', label: 'S', caption: '× 10' },
    { key: 'm', label: 'M' },
  ]}
  totalLabel="Total"
  rows={[
    {
      id: 'fitted',
      label: 'Fitted',
      caption: 'this morning',
      cells: fitted,
      total: `${tags(fitted)} tags`,
      entry: {
        onChange: (key, value) => setCount(key, value),
        decrementLabel: 'One less',
        incrementLabel: 'One more',
        max: [6, 4],
        placeholder: '0',
      },
    },
    { id: 'stock', label: 'In stock', emphasis: 'quiet', cells: [6, 4] },
  ]}
/>
```

`FilterChips` presents a long, wrapping single-choice filter set. Provide a localized group `label`, controlled `value`, `onChange`, and options with stable values and localized labels. An optional non-negative integer `count` renders as a tabular chicklet after the label and is part of the option's accessible name; a zero count quiets the chip until it is selected: it drops its glass fill and sets its label in the muted color (4.5:1 in every palette), without fading, since it can still be chosen. Native radios provide arrow and Space navigation; disabled options are skipped. A `value` of `''` is nothing chosen yet, for a choice the person must still make, such as a reason. `required` sets `required` on each radio and shows the required mark after the label (hidden from assistive technology). `error` puts a message under the chips, as `Field`'s does (a polite live region kept in the page, out of the layout while empty), links it to the group by `aria-describedby`, sets `aria-invalid` on the group and edges every chip in the danger color (`Mark` in forced colors); an empty string is no error. `aria-describedby` adds your own description ids, such as a hint, before the error. A value that is neither `''` nor an option throws a `RangeError`; a filter set always passes a real option. Inside a `<form>`, the browser checks `required` radios on submit and shows its own message first, so a form that shows `error` itself sets `noValidate`.

`FilterChips` options for chips that sit above a list, all opt-in: `labelVisuallyHidden` keeps `label` as the group's name without drawing it, for chips whose words and place already say what they filter; `countAppearance="inline"` (`filterChipCountAppearances`, default `"figure"`) writes the count in the chip's own words after a middle dot ("Open · 3"), the dot hidden so the name reads "Open 3"; `overflow="scroll"` (`filterChipsOverflows`, default `"wrap"`) keeps the chips on one row that scrolls sideways inside its own box, never the page, each chip on one line, a focused chip scrolled into view and the focus ring unclipped. `multiple` turns several chips on at once, such as the days of a week: each chip is a native checkbox and its own Tab stop, `value` is a list of the chosen values (empty for none) and `onChange` receives every chosen value in the options' order. A multiple group cannot be `required` (nothing makes a checkbox group required); say what is needed in `error`. A value that is no option, a multiple `value` that is not a list, `required` with `multiple`, or an unknown count appearance or overflow throws a `RangeError`.

An option's `tone` (`filterChipTones`, `FilterChipTone`; default `"neutral"`) set to `"warning"` draws that chip, while it is not chosen, in the warning tint with its words and count in the warning ink (a warning `Notice`'s fill and words, 4.5:1 in every palette and scheme), for a choice that shows what needs a look, such as documents missing a translation. Its words must say why; the tint only draws the eye. Chosen, it is the accent like every chip; with a zero count it is quiet like every chip; it keeps the chips' hairline, so an `error`'s danger edge still shows; forced colours draw it as every chip. An unknown tone throws a `RangeError`.

```tsx
<FilterChips
  label="Nocturnal surveys"
  labelVisuallyHidden
  countAppearance="inline"
  overflow="scroll"
  value={nights}
  onChange={setNights}
  options={[
    { value: 'all', label: 'All', count: 7 },
    { value: 'owls', label: 'Owls heard', count: 3 },
  ]}
/>

<FilterChips
  label="Watch days"
  multiple
  value={watchDays}
  onChange={setWatchDays}
  options={[
    { value: 'fri', label: 'Fri' },
    { value: 'sat', label: 'Sat' },
  ]}
/>

<FilterChips
  label="Camera traps to check"
  labelVisuallyHidden
  multiple
  value={unchecked}
  onChange={setUnchecked}
  options={[
    { value: 'unchecked', label: 'Not checked this week', count: 2, tone: 'warning' },
  ]}
/>
```

`FilterChipsRow` lays several `FilterChips` groups on one row, for filters that need more than one kind of choice, such as kinds (one choice) and a toggle that narrows them (a checkbox). Each group keeps its own name, choices and Tab stops; the row is a plain `div` that lays them out a space-2 apart, their chips level along the bottom (an error under one group lifts its chips above the others'). `end` sets a group apart at the row's end, and at its own line's end when the row wraps. `overflow` (`"wrap"` by default, or `"scroll"`) wraps the groups onto more lines, or keeps every group's chips on one row that scrolls sideways together inside the row's own box, never the page, the focus ring unclipped and a focused chip scrolled into view; inside a scrolling row a group's own `overflow` gives way, and a group is as wide as its chips, so a drawn label or an `error` wraps under them. An empty `end` draws nothing; an unknown `overflow` throws a `RangeError`.

```tsx
<FilterChipsRow
  overflow="scroll"
  end={
    <FilterChips
      label="Not translated"
      labelVisuallyHidden
      multiple
      countAppearance="inline"
      value={untranslated}
      onChange={setUntranslated}
      options={[
        {
          value: 'untranslated',
          label: 'Not translated',
          count: 2,
          tone: 'warning',
        },
      ]}
    />
  }
>
  <FilterChips
    label="Kinds"
    labelVisuallyHidden
    countAppearance="inline"
    value={kind}
    onChange={setKind}
    options={kinds}
  />
</FilterChipsRow>
```

`DateField` is a controlled date-only field that draws its own calendar. Supply `value`, `min`, and `max` as valid `YYYY-MM-DD` dates; use an empty `value` for a blank field. Its callback returns a date-only string or an empty string, without timezone conversion. Invalid serialized dates and inverted bounds throw; a value outside the bounds remains visible with invalid styling. `required` marks the label with the same `aria-hidden` asterisk as `Field` and sets the entry's native `required`. Its label is drawn as `Field`'s (the same label words and mark inside a `<label>` that keeps the canvas type), so its label row and its gap to the entry match a `Field` beside it. For a blank required field, supply `error` when form validation runs to show the message and invalid styling.

`DateField` `entry="calendar"` (opt-in; `dateFieldEntries`, default `"typed"`) is a day picked, never typed, such as a hire date: one neutral `Button` shaped as a field's control (the small radius, sized to its words on one line at the column's start) holding the calendar glyph and the chosen day in the locale's medium style ("Oct 6, 2026"), or `labels.chooseDate` while the field is empty (pass "Choose a day"). It opens the same calendar, which picks, steps by month and year, picks today and, on an optional field, clears. It is named by the label and its words ("Hire date Choose a day"), described by the `description` and `error`, and a label press opens it too. A button has no required state or text to check, so `required` draws the label's mark and says `labels.required` ("Required") after its name, the form's own check supplies `error`, and the danger edge marks it while `error` is set or the value is outside `min`/`max`. A button cannot be `aria-invalid`, so pass an `error` for a value outside the bounds too: the edge alone is colour only. A long day or `chooseDate` in a narrow column ends in an ellipsis; its name keeps the whole words. An unknown `entry` throws a `RangeError`.

```tsx
<DateField
  entry="calendar"
  label="Banding day"
  labels={{ chooseDate: 'Choose a day' }}
  value={bandingDay}
  onChange={setBandingDay}
/>
```

People type the date into a text entry in the locale's numeric order (`MM/DD/YYYY` for en-US, `DD/MM/YYYY` for es), with any non-digit separator, eight bare digits, or ISO `YYYY-MM-DD`. A keystroke calls `onChange` once the entry is complete, meaning its last field is at full width (four year digits, or two digits for a trailing day or month, as in ISO); otherwise the date commits when the person leaves the field or presses Enter, so typing `2024-03-10` never sends `2024-03-01` on the way. If the parent keeps the old value, the typed text stays on screen; any other outside change replaces it. Text that is not a date keeps the last value and, once the person leaves the field, sets `aria-invalid` and shows `labels.invalidEntry`. Like the native date input, the entry blocks form submission through `setCustomValidity`: `labels.invalidEntry` while its text is not a date, and `labels.outOfRange` while its date, typed or given, is outside `min`/`max`. The calendar button beside it opens a WAI-ARIA date picker dialog anchored under the field on the popover layer: the month grid shows today, the selected day, and days outside `min`/`max` as `aria-disabled` (padding before `0001-01-01` or after `9999-12-31` is blank and inert); arrows move by day and week, Home and End to the week's edges, PageUp and PageDown by month, Shift with them by year, Enter or Space selects and closes, and Escape closes and returns focus to the button. Month and year selectors in the header jump decades (the year list spans 120 years back and 20 ahead of today and the shown month, cut to `min` and `max`; the month list offers only months with a day inside them). A new `value`, `min`, or `max` while the calendar is open moves it to the new value or back inside the bounds. **Today** selects today; **Clear** appears only when the field is not `required`. Today is the device's local date unless `today` (a `YYYY-MM-DD` date) is given: pass the business's own day when it keeps a time zone the device may not share, so a phone in another zone after the business's midnight does not mark tomorrow as today, open on it, or pick it while `max` is the business's day. `today` moves the today mark, the empty field's starting day, **Today**, and the year list's span; it may lie outside `min`/`max`, where **Today** is disabled as before. An empty or malformed `today` throws a `RangeError`.

`locale` (BCP 47) sets month and weekday names, spoken dates, and the typed order; it defaults to the nearest `lang` attribute when the field mounts, then `en-US`, and a malformed tag throws. `weekStartsOn` is `0` (Sunday, the default) or `1` (Monday). `labels` overrides the control's own words, English by default: `chooseDate`, `previousMonth`, `nextMonth`, `month`, `year`, `today`, `clear`, `invalidEntry`, `outOfRange`, `required` (said after a required calendar entry's name; `entry="calendar"` only), and the placeholder letters `dayPlaceholder`, `monthPlaceholder`, `yearPlaceholder`. With the typed entry (the default) the field label names only the text entry; the calendar button is named `labels.chooseDate` and described by the field label, so tests find the entry with `getByLabel` or `getByRole('textbox', { name })`. With `entry="calendar"` the one button is named by the label and its words (`getByRole('button', { name })`), and `chooseDate` is its empty text.

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

`DateRangeButton` shows a range of days and opens a calendar to pick a first and a last day, such as a report's period between its own ‹ and › steps. Supply `label` (what pressing it does, such as "Choose survey period"), `value` (`{ start, end }`, both `YYYY-MM-DD` and included) and `onChange`; optional `min`, `max`, `today`, `disabled`, `locale`, `weekStartsOn`, `id` and a `ref` behave as on `CalendarButton`. The button shows a calendar glyph and the range in the locale, sharing what both ends have ("Oct 6 – 12, 2026"; one day as one date); its name is `label`, `labels.nameSeparator`, then that range. The first press on a day sets the start and the second the end; a press before the start starts over from it, and Apply with only a start applies that one day. Days after `max` are disabled, and once a start is pressed so are the days past `maxDays` (a whole number of days, both ends counted, such as 366). The range being picked and its length (`labels.dayCount`) are a polite status. **Apply** calls `onChange` when the range changed, closes and returns focus to the button; **Cancel**, Escape and a press outside close without a change. `presets` (`{ id, label, range }[]`) are ranges chosen in one press: a press applies its range at once and closes, and the one matching the range shown is pressed; a preset outside `min`/`max` or longer than `maxDays` throws, so compute presets from the same bounds and leave out one that does not fit (such as Last year for a station opened this spring). From `md` up the calendar is a popover with the presets beside two months (above them below `lg`, where both do not fit side by side), the range and the hint, and Cancel and Apply; below `md` it is a `Dialog` bottom sheet titled by `label` with the range under the title, the presets in a row that scrolls sideways, one month and the hint over Cancel and Apply. The keyboard is the calendar's: arrows, Home, End, PageUp and PageDown (with Shift by year) move one focus day across both months, and Enter or Space presses it. `labels` takes `previousMonth`, `nextMonth`, `nameSeparator`, `presets` (the presets group's name), `apply`, `cancel`, `close`, `hint` and `dayCount(days)`, in English by default. `size` (default `md`, at least 44 px tall on a coarse pointer) and `variant` (default `neutral`) follow `Button`. A value outside `min`/`max` or longer than `maxDays` is kept; an empty or malformed date, a start after its end, a `maxDays` under 1 or fractional, repeated preset ids, or an empty word throws a `RangeError`.

```tsx
<ButtonGroup aria-label="Survey period" attached>
  <Button aria-label="The period before" variant="neutral" onPress={previous}>
    ‹
  </Button>
  <DateRangeButton
    label="Choose survey period"
    value={period}
    onChange={setPeriod}
    presets={[
      { id: 'week', label: 'Last 7 days', range: lastSevenDays },
      { id: 'month', label: 'This month', range: thisMonth },
    ]}
    max={stationDay}
    maxDays={366}
    today={stationDay}
    labels={{ apply: 'Show' }}
  />
  <Button aria-label="The period after" variant="neutral" onPress={next}>
    ›
  </Button>
</ButtonGroup>
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
