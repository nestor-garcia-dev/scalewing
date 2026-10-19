---
'@scalewing/react': minor
---

`FileField`: one file chosen with the system picker or dropped on the field, with `Field`'s label, description and error. Empty, a wide zone named by the label and `chooseLabel` (`dropLabel` after it where the pointer can drag); chosen (`value={{ name, detail }}`), the file's name and detail with the consumer's `icon` and a `changeLabel` button. `onChange` receives the `File`; nothing is read or uploaded, and a dropped file is not filtered by `accept`. New exports `FileField`, `FileFieldProps`, `FileFieldValue`; new `sw-file-field*` classes. No new tokens, no new dependency. Request: `docs/requests/teisoro-file-field.md`.
