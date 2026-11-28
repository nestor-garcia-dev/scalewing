---
'@scalewing/react': minor
---

A `Button`, `ButtonLink` and `ActionMenu` keep their natural width as an item of a flex row (`flex-shrink: 0`) and are never wider than their container (`max-width: 100%`): in a crowded row their siblings give way first, so their words stay on the one line they take, and only where the words are longer than the whole container do they wrap, inside the pill. Words are never cut, and no component's DOM changes. New `shrink={false}` on every Box-based component (`FlexItemProps`, class `sw-no-shrink`) keeps a box such as a header's actions in their own `Inline` at its natural width in a crowded row. No new tokens, no new dependency; no prop is removed or renamed. Request: `docs/requests/teisoro-button-natural-width.md`.

Migration: nothing to change in code, but check one case after upgrading. A row of several Buttons in an `Inline wrap={false}` that is narrower than all of them now overflows where their words used to wrap as they were squeezed: give it `wrap`, or a row of its own below `md`. A Button or menu in a nested `Inline` in a crowded row: give that `Inline` `shrink={false}`, or its controls spill out of it.
