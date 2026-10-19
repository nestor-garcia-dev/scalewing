---
'@scalewing/react': minor
---

`DocumentViewer`: a PDF drawn from its bytes (never a URL) one page at a time with PDF.js, fitted to its width, with 48-point previous and next steps around "Page n of m" in a polite live region, pinch and `+`/`-`/`0` zoom, a transparent text layer for assistive technology and selection, the consumer's loading and failed words and actions, and no download or print of its own. New exports `DocumentViewer`, `DocumentViewerProps`, `DocumentViewerLabels`; new export path `@scalewing/react/document-viewer-worker` (the PDF.js worker entry, bundled by the consumer, such as Vite's `?worker&url`); new `sw-document-viewer*` classes.

New production dependency: `pdfjs-dist` 6.4.299, pinned exactly. Rationale: drawing PDFs needs a full parser and renderer, and PDF.js (Mozilla, Apache-2.0) is the maintained browser-grade one, the same library and version Teisoro's API uses to check uploads. It is loaded with a dynamic import only when a viewer opens a document, its legacy build is used for older browsers, and it runs hardened: nothing fetched beyond the bytes, no eval, no XFA, no scripting. Its optional `@napi-rs/canvas` (Node only, 28 to 35 MB per platform) is never loaded in a browser and can be skipped with pnpm's `ignoredOptionalDependencies`; `pdfjs-dist` asks for Node 22.13 or later. Request: `docs/requests/teisoro-document-viewer.md`.
