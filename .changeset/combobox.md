---
'@scalewing/react': minor
---

`Combobox` (with `ComboboxProps`, `ComboboxGroup`, `ComboboxOption`, `ComboboxBadge`, `ComboboxAction`, `ComboboxSize` and `comboboxSizes`): a text input with a list of suggestions, an ARIA 1.2 combobox with list autocomplete (`docs/requests/teisoro-combobox.md`, Teisoro F-011 release R5).

- `label`, `inputValue`, `onInputChange`, `groups` (`{ label?, options: { value, label, description?, badge?, disabled? }[] }[]`, filtered by the consumer), `onSelect`, `action?` (`{ label, onPress, badge? }`), `emptyText`, `note?`, `listLabel?`, `countText?` (`(count) => string`), and the Field props `labelVisuallyHidden`, `placeholder`, `description`, `error`, `required`, `disabled`, `size` (`md` | `xs`).
- Focus stays in the input; the arrow keys move `aria-activedescendant` and wrap; Enter or a press chooses; a disabled option is never chosen; Escape closes, then empties; Alt+ArrowUp, blur, Tab or a press outside closes; the pointer moves the active option; the active option is held by value across new results; input-method keys are ignored; an always-present polite live region announces the empty text and `countText`.
- The list is on the popup layer (`openPopups` gains `.sw-combobox-popup`), solid under reduced transparency, with forced-colours rules. Blank words, duplicate values, an unknown size or badge tone throw a `RangeError`.
- New classes `sw-combobox*`. No new tokens or dependencies.
