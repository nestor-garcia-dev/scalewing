---
'@scalewing/react': minor
---

`FileField` `onRemove` and `removeLabel`: Remove beside a chosen file, a neutral button after the change button in the full field, named by its words and the label ("Remove Cover photo"); the consumer clears `value` and focus moves to the empty field. `FileField` `compact`: the field at a text field's height for a form row; chosen, the thumbnail (or mark) and the name cut to one line are the change button, named by the label and `changeLabel` and described by the name and detail (read, not drawn), with Remove as a quiet button at the row's end. Set `onRemove` and `removeLabel` together (a `RangeError` otherwise, and for blank words). New classes `sw-file-field-compact`, `sw-file-field-pick`, `sw-file-field-remove` and `sw-file-field-actions`; disabled, the compact row and its Remove fade alike. A field without them renders as before. No new tokens or dependencies. Request: `docs/requests/teisoro-file-field-compact.md`.
