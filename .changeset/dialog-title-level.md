---
'@scalewing/react': minor
---

`Dialog` `titleLevel` (`docs/requests/teisoro-dialog-title-level.md`, Teisoro F-007 task 1550, CHG-13): `titleLevel?: 2 | 3`, default `3`, sets the heading level of the dialog's title. `titleLevel={2}` renders it as an `h2` in the same title style, so a dialog's own section labels can be `h3` headings that read as its parts rather than its peers. The default keeps the `h3` every existing dialog has. New exported type `DialogTitleLevel`. No new dependencies.
