---
'@scalewing/react': minor
---

`ScreenPreview`: a drawn stand-in for an app's screen on a public page, a `figure` whose screen is one image (`role="img"`) named by `label`, with an optional `eyebrow`, `title` and visible `caption`. `frame="card"` (default) or `"device"`, a 20rem phone from `md` and the card below it. Its content is `PreviewGroup`s of `PreviewRow`s (`kind` `plain`, `total`, `note`, `filled`, `alert`) and `PreviewTiles` (three to a row on a phone, six from `md`). New classes `sw-screen-preview*`, `sw-preview-*`, with `screenPreviewFrames` and `previewRowKinds`; a blank label, an unknown frame or kind, or bad tiles throw a `RangeError`. No new tokens or dependencies. Request: `docs/requests/teisoro-screen-preview.md`.
