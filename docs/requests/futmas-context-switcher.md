Scalewing request from FutMas.

Status: accepted 2026-10-24 (FutMas F-010-S09 "desktop shell and league overview", release W2 "the league frame"; the owner approved the F-010 canvas v15 and the whole feature on 2026-10-24, with standing approval for Scalewing changes, PRs, merges and publishing). To ship in `@scalewing/react` 1.48.0.
Renderer: react
Missing surface: `ContextSwitcher`, a button showing the context in use that opens a popup to switch it: an optional filter field, the options in groups as a listbox (the current one checked), and commands in a footer.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the popup is a positioned top-layer surface with a keyboard model (a listbox with an active row, typeahead, a combobox filter over it, Escape back to the trigger) that FutMas cannot build from primitives without its own CSS and focus code.
Existing surface this might already be: `ActionMenu` is `role="menu"`: commands with no group captions, no current or selected state, no badge or count on an item, no filter field (a text field does not belong in a menu) and no footer. `Select` is single-value form chrome with a label, no groups, badges, marks or footer commands. `Combobox` is a text input the person types into, not a button showing the current context.
Workaround I almost used: an `ActionMenu` of leagues (no current mark, no grouping, no "Create a league" footer) and a `Select` for the season (no Draft/Live/Finished badge).
FutMas use: the league switcher at the admin sidebar's top (a crest, the league's name and the person's role; the leagues they run grouped under a caption, "Home · all my leagues" with a "needs you" count, a "Find a league" filter, "Create a league" and "Enter a code" commands), the same switcher as a compact crest in the rail, the competition pill and the season pill (Draft, Live and Finished badges, "Start a new season") in the season bar.

## Proposed API (from the brief)

```ts
type ContextSwitcherProps = {
  label: string;
  trigger: ReactNode;
  triggerAppearance?: 'framed' | 'text' | 'pill';
  groups: {
    id: string;
    label?: string;
    options: {
      id: string;
      label: string;
      detail?: string;
      icon?: ReactNode;
      badge?: { label: string; tone: BadgeTone };
      count?: number;
      countLabel?: string;
      countTone?: NavCountTone;
    }[];
  }[];
  currentId?: string;
  onSelect(option): void;
  filter?: {
    label: string;
    placeholder?: string;
    emptyText: string;
    minOptions?: number;
  };
  actions?: { id: string; label: string; icon?: ReactNode; onSelect(): void }[];
  align?: 'start' | 'end';
};
```

## Accepted API (2026-10-24)

The brief's API, with two additions:

- `triggerAppearance` also takes `'icon'`: the trigger's glyph alone in a round quiet button with no chevron (ActionMenu's `icon` look). The brief's compact crest trigger in the rail needs it: the other three draw a chevron and padding the 44 px rail has no room for. Its name is `label` and the current option's label ("League Neponset Sunday League").
- `width?: 'content' | 'full'` (default `content`): `full` fills the column, the content at the start and the chevron at the end, for the sidebar's top (Button's `width="full"` convention).

The exported types are `ContextSwitcherProps`, `ContextSwitcherGroup`, `ContextSwitcherOption`, `ContextSwitcherBadge`, `ContextSwitcherFilter`, `ContextSwitcherAction`, `ContextSwitcherTriggerAppearance` and `ContextSwitcherWidth`, with `contextSwitcherTriggerAppearances` and `contextSwitcherWidths`.

### Behaviour

- The trigger is a real `button` (`aria-haspopup="dialog"`, `aria-expanded`, the explicit `tabIndex`) named by `label` then what it shows (`aria-labelledby` over a hidden copy of the label and the trigger's content: "Season Fall 2026"), so the visible words are in the name.
- The popup is a non-modal `dialog` named by `label` on the top layer beside the trigger (the menus' `useAnchoredPopover`: a space-1 gap below, or above near the bottom, lined up with the trigger's start or with `align="end"` its end, flipping when it would leave the screen), at least 15rem and never narrower than the trigger (the component sets the trigger's width as `--sw-context-switcher-trigger-width` on the popup, followed while it resizes; the stylesheet takes the larger of the two), capped at the dialog width (or the trigger's, when wider) and the viewport. It holds, in order: the filter field, the listbox (the only part that scrolls, at the Select's list height), the empty words, the footer.
- The listbox is named by `label`; a group with a `label` is a `group` named by its caption (a muted caption at weight 600, sentence case); a group without one adds its options bare. An option shows its decorative `icon`, its label over a muted `detail`, its `badge` (a small `Badge`), its count (the shared count pill, `sw-context-switcher-count` with NavCount's tones; 0 shows no pill, as NavCount's) and, for the current option, the accent check. The name reads all of them (a `countLabel` in place of the number). The current option is `aria-selected="true"` and drawn at label weight; the others are `false`.
- Focus moves into the popup as it opens: to the filter field when there is one (an ARIA combobox: `aria-controls`, `aria-expanded`, `aria-autocomplete="list"`, `aria-activedescendant`) or else to the listbox itself (`tabIndex` 0, `aria-activedescendant`). The active row starts on the current option (else the first) and takes the quiet fill, plus an accent ring while the listbox has visible focus; the pointer moves it too.
- Keys: ↓/↑ move the active row (stopping at the ends), Enter chooses it. In the listbox Home/End go to the first and last row, letters jump by typeahead (a word typed within half a second; a repeated letter steps through the rows starting with it, case and accents ignored) and Space chooses (or is part of a typed word). In the filter field Home, End, Space and letters edit the words. Escape closes the popup and returns focus to the trigger (and is stopped there, so a drawer round the trigger stays open). ↓/↑ on the closed trigger open it.
- The filter narrows the options by label or detail (anywhere in the words, case and accents ignored), keeps the groups' order, drops groups left empty and makes the first match active. With nothing left it shows `emptyText` and says it in a polite status. `minOptions` (default 0) shows the field only from that many options in all.
- Choosing an option closes the popup, returns focus to the trigger, then calls `onSelect(option)`; choosing the current option only closes it. A footer command (a ghost sm `Button`, its icon hidden) closes the popup, returns focus to the trigger, then runs, so a dialog it opens hands focus back there. A press outside, or focus moving out of the popup (Tab past the last command, Shift+Tab back to the trigger), closes it without moving focus; focus leaving the window (no related target) leaves it open until the next press. A press on a non-focusable part of the popup (a caption, the padding, a row, the empty words) is kept from moving focus (its `mousedown` is prevented), so the keys keep working; the field and the commands take focus as usual. Enter (and every list key) during an input method's composition is left to the method. The pointer moves the active row only when it really moves, so a list scrolled under a still pointer by the keys keeps the keys' row.
- Coarse pointer: the trigger, every option and every command are 44 px. Reduced motion: the popup has no motion. Right-to-left: the popup lines up with the trigger's inline start, the chevron and check follow the text direction. Forced colours: the popup's edge is `CanvasText`, the active row `Highlight` with `HighlightText` words (the badge and pill keep their own system colours), the chevron and check `CanvasText`, an open trigger's edge `Highlight`. On the active row's quiet fill the detail moves 30 % toward the text colour to keep 4.5:1.

### Classes

`sw-context-switcher`, `sw-context-switcher-full`, `sw-context-switcher-trigger`, `sw-context-switcher-trigger-content`, `sw-context-switcher-trigger-framed`, `-text`, `-pill`, `-icon`, `sw-context-switcher-popup` (a popup of the stacking order's `popup` layer, listed with the open popups that lift a glass surface), `sw-context-switcher-filter`, `sw-context-switcher-list`, `sw-context-switcher-heading`, `sw-context-switcher-option`, `sw-context-switcher-icon`, `sw-context-switcher-words`, `sw-context-switcher-label`, `sw-context-switcher-detail`, `sw-context-switcher-check`, `sw-context-switcher-empty`, `sw-context-switcher-footer`, `sw-context-switcher-action-icon`, and `sw-context-switcher-count` with `-accent`/`-warning` (the shared count pill, `css-count-pill.ts`). The popup's 15rem least width is a named constant of the generator.

### Refused with a `RangeError`

A blank `label`; a `trigger` that draws nothing (nothing, a boolean or blank words); an unknown `triggerAppearance`, `width` or `align`; no groups; an empty or duplicate group id; a blank group label; a group with no options; an empty or duplicate option id (across groups); a blank option label or detail; a badge with blank words or an unknown tone; a count that is not a whole number from 0; a blank `countLabel` or one without a count; an unknown `countTone` or one without a count; a `currentId` that names no option; a filter with a blank label or `emptyText`, a blank placeholder or a `minOptions` that is not a whole number from 0; an action with a blank id or label, or duplicate action ids.

No new tokens, public breakpoints or dependencies.
