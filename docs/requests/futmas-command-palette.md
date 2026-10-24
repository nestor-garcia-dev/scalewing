Scalewing request from FutMas.

Status: released in `@scalewing/react` 1.48.0 (PR #234; accepted 2026-10-24; FutMas F-010-S09 "desktop shell and league overview", release W2 "the league frame"; the owner approved the F-010 canvas v15 and the whole feature on 2026-10-24, with standing approval for Scalewing changes, PRs, merges and publishing).
Renderer: react
Missing surface: `CommandPalette`, a top-layer search over the product (a field over an always-open grouped listbox of results, ⌘K / Ctrl+K from anywhere), and `CommandPaletteTrigger`, the search-looking button with a key hint that opens it.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Dialog` plus `Combobox` does not make one. The combobox's list is a popover that opens and closes on its own, and Escape empties its input instead of closing the dialog; there is no item glyph, no Enter hint and no global shortcut. FutMas owns no CSS, so it cannot style a `<kbd>` key hint, a search-looking trigger or the results band.
Existing surface this might already be: `Combobox` (typing with suggestions in a form, a popover list); `Dialog` (a titled modal with a header and footer); `Field type="search"` (a field, not a button that opens a search).
Workaround I almost used: a `Dialog` holding a search `Field` and a `ListGroup` of results, with no keyboard model (arrows, Enter) and no shortcut.
FutMas use: the admin's "Search ⌘K" in the season bar from `lg` (teams, games and actions such as "Show Dorchester Athletic's games", "No teams or games match" when empty, "↑↓ to move · Enter to open · Esc to close" in the footer), the compact search glyph in the compact top bar below `lg`.

## Proposed API (from the brief)

```ts
type CommandPaletteProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  label: string;
  placeholder?: string;
  query: string;
  onQueryChange(q: string): void;
  groups: {
    id: string;
    label: string;
    items: {
      id: string;
      label: string;
      detail?: string;
      icon?: ReactNode;
      onSelect(): void;
    }[];
  }[];
  emptyText: string;
  countText?(n: number): string;
  hint?: string;
  loading?: boolean;
  loadingText?: string;
  shortcut?: 'mod+k' | null;
};
type CommandPaletteTriggerProps = {
  label: string;
  placeholder: string;
  shortcutLabel?: string;
  icon: ReactNode;
  compact?: boolean;
  onPress(): void;
};
```

## Accepted API (2026-10-24)

The brief's API, unchanged. Exported types: `CommandPaletteProps`, `CommandPaletteGroup`, `CommandPaletteItem`, `CommandPaletteShortcut` (with `commandPaletteShortcuts`), `CommandPaletteTriggerProps`.

### CommandPalette

- A native modal `<dialog>` on the top layer named by `label`, kept in step with `open` by Dialog's close-request mechanics (`useDialogCloseRequests`): Escape, a press on the backdrop and a platform close request each become one `onOpenChange(false)`. It sits near the window's top (a tenth of its height from `md`, space-2 on a phone), not centred, so results grow downward; 40rem wide (a named constant of the generator), the window less space-2 each side on a phone; glass like Dialog. Its content is drawn only while open.
- Its body is a column: the field (a band with a hairline under it that turns accent while focused), the listbox (the only part that scrolls), the message, the `hint` (a muted footer line under a hairline).
- The field is an ARIA combobox (`aria-controls`, `aria-expanded="true"`, `aria-autocomplete="list"`, `aria-activedescendant`) named by `label`, with `placeholder`. It takes focus as the palette opens and its words are selected, so typing replaces them. `onQueryChange` hands each change to the consumer, who filters `groups`; a change makes the first item active again.
- The listbox is always open under the field, named by `label`; each group with items is a `group` named by its caption (a muted caption at weight 600, sentence case); a group with no items is not drawn, and with none at all the listbox is hidden. An item shows its decorative `icon`, its label over a muted `detail`; the active row (`aria-selected`, as Combobox marks it) takes the quiet fill and the Enter key cap (↵, hidden from assistive technology) at its end. On the fill the detail moves 30 % toward the text colour to keep 4.5:1 (axe, light and dark).
- ↓ and ↑ move the active row, wrapping (the first row brings its group's caption back into view); Enter, or a press on a row, chooses it: the palette calls `onOpenChange(false)`, and once the dialog has really closed (the consumer set `open` to false) it runs the item's `onSelect`, so an action can move focus to the page. Each opening (and closing) starts the active row over at the first item. With no items the field is `aria-expanded="false"` and the keys do nothing. Keys during an input method's composition are the method's. The pointer moves the active row only when it really moves. A press on any part of the palette but the field keeps focus in the field.
- Focus returns, when the palette closes, to the element that had it before it opened, unless a chosen item moved focus somewhere else.
- A polite status (always in the page, empty as the palette opens and filled just after, so its first words are announced) says `loadingText` while `loading`, `emptyText` when there are no items, otherwise `countText(n)` (nothing without it). `loadingText` and `emptyText` are also drawn as a muted message in place of the results.
- `shortcut="mod+k"` listens on the document for ⌘K on Apple systems (`navigator.userAgentData.platform`, else `navigator.platform`) and Ctrl+K elsewhere, with no other modifier and not repeated or composing (the key in K's place, `KeyK`, counts on a layout that types another letter there): it calls `onOpenChange(!open)` and prevents the browser's own use of the keys. It is left alone while focus is in another text field (an `input` that takes text, a `textarea`, a `select` or editable content), but works from the palette's own field, where it closes the palette. `null` or nothing adds no listener; the listener goes with an unmount or a changed `shortcut`. One palette per page should own the shortcut: two listening palettes would both open.
- Forced colours: the palette's edge is `CanvasText`, the active row `Highlight` with `HighlightText` words and key cap, the focused field's rule `Highlight`. Coarse pointer: rows are 44 px; the field is 44 px always.

### CommandPaletteTrigger

- A real `button` (`aria-haspopup="dialog"`, the explicit `tabIndex`) named by `label`, drawn as a search pill: the surface inside the border hairline, fully rounded, the consumer's `icon` (hidden), the `placeholder` words in the muted colour (cut with an ellipsis) and the `shortcutLabel` key cap at the end (hidden from assistive technology; the consumer chooses "⌘K" or "Ctrl K"). At least 12rem (a named constant) unless its column is narrower. `compact` is the glyph alone in a round quiet button. The sm control height, 44 px on a coarse pointer; the quiet fill on hover. Start `placeholder` with `label`'s words, so the name is in what is shown.

### Classes

`sw-command-palette`, `sw-command-palette-body`, `sw-command-palette-field`, `sw-command-palette-list`, `sw-command-palette-heading`, `sw-command-palette-item`, `sw-command-palette-icon`, `sw-command-palette-words`, `sw-command-palette-label`, `sw-command-palette-detail`, `sw-command-palette-message`, `sw-command-palette-hint`, `sw-command-palette-key` (the key cap both share), `sw-command-palette-trigger`, `sw-command-palette-trigger-compact`, `sw-command-palette-trigger-icon`, `sw-command-palette-trigger-text`.

### Refused with a `RangeError`

CommandPalette: a blank `label` or `emptyText`; a blank `placeholder`, `hint` or `loadingText` when given; `loading` without `loadingText`; an unknown `shortcut`; a group with a blank id or caption; duplicate group ids; an item with a blank id or label; a blank `detail`; duplicate item ids across groups. CommandPaletteTrigger: a blank `label` or `placeholder`; a blank `shortcutLabel`; an `icon` that draws nothing.

No new tokens, public breakpoints or dependencies.
