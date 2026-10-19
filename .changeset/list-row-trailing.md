---
'@scalewing/react': minor
---

`ListRow` `unread` / `unreadLabel`, `tag` and `action`: an accent dot after the title for a row the person has not opened, read as `unreadLabel` after the title (required while `unread`); a short status such as a `Badge` before the row's end, describing a pressable row; and a control such as an `ActionMenu` after the row, outside its press area, in the same list item. New classes `sw-list-row-unread`, `sw-list-row-tag`, `sw-list-item-action`, `sw-list-row-action`; an unread row without words throws a `RangeError`. Existing rows are unchanged, except that an empty `leading` (`null`, `false` or `''`, as `leading={isLate && <Dot />}` gives) no longer draws an empty mark box and its gap before the title. No new tokens, no new dependency. Request: `docs/requests/teisoro-list-row-trailing.md`.
