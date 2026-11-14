Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.66.0 (PR #298; accepted 2026-11-14; Teisoro F-001 task 2910, the onboarding acceptance review's follow-ups; the product owner agreed with every recommendation on 2026-11-14).
Renderer: react
Missing surface: four opt-in options on existing form and checklist components, each named as a gap by the acceptance review's board comparison:

1. `Checkbox appearance="tile"`: a set of choices drawn as tiles.
2. `RadioGroup descriptionLayout="stacked"`: long option descriptions under their labels at every width.
3. `Field variant="read-only"`: a value shown, not typed.
4. `TaskList numbered` and `TaskList actionBelow`: open tasks numbered, and each action on a full-width line under the words on a phone.

Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro owns no CSS. (1) The boards draw a store's services as bordered tiles, the whole tile a press target, edged in the accent while chosen; Teisoro has three controls for the same choice today (chips, a checkbox in a `Card`, a plain checkbox), and a `Card` round a `Checkbox` makes only the words a press target. (2) The role picker's descriptions are long; `auto` puts them at the row's end on a wide screen, far from their radio (UX-20). (3) A `readOnly` input looks editable (UX-14). (4) Get started's boards number the open items and, on a phone, give each a full-width button under its words; `TaskList` draws rings and keeps actions at the row's end.
Existing surface this might already be: `FilterChips` (pills, not tiles), `ListGroup` tiles (rows, not form choices), `Card` + `Checkbox` (only the words press), `Field` with `readOnly` (the editable look), `TaskList` (rings, actions at the end).
Workaround I almost used: none that keeps Teisoro free of CSS.
Teisoro use: one shared service tile in setup's "What your store does", Store settings' services and a provider's services; the role picker in Add employee's login step; the invitation's email; Admin › Get started.

## Accepted API (2026-11-14)

- `Checkbox` gains `appearance?: 'plain' | 'tile'` (`checkboxAppearances`, `CheckboxAppearance`), default `plain` (unchanged). `tile` (`sw-checkbox-tile`, `-checked`, `-invalid`) draws the box, label and description in a bordered tile as wide as its column; the label's `::after` covers the tile, so the whole tile is one press target; the accent edge while chosen or mixed, the danger edge while invalid (which wins). A tile with `labelVisuallyHidden`, or an unknown appearance, throws a `RangeError`.
- `RadioGroup` gains `descriptionLayout?: 'auto' | 'stacked'` (`radioGroupDescriptionLayouts`, `RadioGroupDescriptionLayout`), default `auto` (unchanged). `stacked` (`sw-radio-group-stacked`) puts every description on its own line under its label at every width. An unknown layout throws a `RangeError`.
- `Field` gains `variant="read-only"` (`sw-field-read-only`): the subtle fill with no edge, in the text colour, a plain cursor; forced colours a dotted `CanvasText` edge. It needs one native `input` or `textarea` child with `readOnly` and takes no prefix, suffix, `error`, `invalid` or `changed` (a `TypeError` otherwise).
- `TaskList` gains `numbered?: boolean` (`sw-task-list-numbered`): a `todo` or `next` task's marker shows its 1-based place in the list (drawn only, `aria-hidden` as the marker is), and `actionBelow?: Breakpoint` (`sw-task-list-action-below-md`): below the breakpoint each action takes its own line under the words, as wide as them, its control stretched. An unknown breakpoint throws a `RangeError`.
- No new tokens or dependencies. Every default is unchanged.

### Differences from the boards (Teisoro)

- A tile's label keeps the label weight whether chosen or not (the board's unchosen tile is lighter), so a press does not move the words.

No board figures are quoted here.

Evidence: `checkbox-tile.test.tsx`, `radio-group-stacked.test.tsx`, `field-read-only.test.tsx`, `task-list-layout.test.tsx` (classes, names and descriptions kept, presses, defaults unchanged, refusals, generated rules); the existing tests unchanged apart from `fieldVariants`' list; gallery sections Checkbox (habitat tiles), RadioGroup (volunteer role, stacked), Field (volunteer email, read-only) and TaskList (set up the hide, numbered, actions below md); `apps/gallery/e2e/choice-layouts.spec.ts` on desktop-en, mobile-es and forced-colors (a press on a tile's far end and on its description toggles it, the chosen edge changes, a stacked description sits under its label and chooses it, the read-only field looks apart and takes focus, the numbered markers read 2, 3, 4 and the actions sit under the words, full width and 44 px tall on a phone, no sideways scroll).
