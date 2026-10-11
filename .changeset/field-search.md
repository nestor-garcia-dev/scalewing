---
'@scalewing/react': minor
---

`Field` `variant="search"` (`fieldVariants`, `FieldVariant`), the web twin of the native search field (`docs/requests/teisoro-field-search.md`, Teisoro F-011 release R5): a hidden label that still names a `type="search"` input, a `leading` glyph slot, and, while the input holds text and is enabled and not read-only, a clear button named `clearLabel` that returns focus to the input and calls `onClear` (Escape too). The browser's own clear button is hidden; `enterKeyHint` defaults to `search`. Missing or blank `clearLabel`, missing `onClear`, `prefix`/`suffix`, a non-input or uncontrolled child, or the search props on an outlined field throw. New classes `sw-field-search-field`, `sw-field-search`, `sw-field-search-leading`, `sw-field-search-clear`, `sw-field-search-cross`. No new tokens or dependencies.
