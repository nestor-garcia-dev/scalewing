---
'@scalewing/react': minor
---

`DescriptionList` and `DescriptionItem` (with `DescriptionListProps` and `DescriptionItemProps`): terms paired with what each says, one per row (`docs/requests/teisoro-description-list.md`, Teisoro F-006-S03).

- A `dl` of items, each a `div` grouping a `dt` (`term`) with its `dd` (`children`); the list and each item take their own HTML attributes and `className`.
- From `md` up the items share the list's two columns (`subgrid`): the term column as wide as the widest term, up to 40% of the list, then the detail. Every row aligns to its top, a hairline (`--sw-color-border`, `CanvasText` in forced colors) divides the rows, and the list is flush above its first row and below its last.
- Below `md` each term sits over its detail.
- A term and a detail are columns of lines: each child is its own line with its own line height, so a caption term starts level with a caption detail; each is as wide as its content unless it sets its own width (a `Progress` fills the detail), and long unbreakable words wrap. Wrap inline content in one element.
- New generated classes `sw-description-list`, `sw-description-item`, `sw-description-term` and `sw-description-detail`. No new tokens or dependencies.
