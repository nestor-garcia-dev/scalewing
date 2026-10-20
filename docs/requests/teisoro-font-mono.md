Scalewing request from Teisoro.

Status: accepted 2026-10-20 (Teisoro F-014-S07 "Scalewing fidelity", task 2630; the gap Teisoro F-014-S05 task 2620 found on the training board TrainingWrite; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: a text control in a monospace face.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the page editor's text box on TrainingWrite holds a Markdown source (`# Title`, `**bold**`, lists), drawn in a monospace face so its marks line up and read as marks. Every Scalewing text control takes the page's sans face from the canvas, and Teisoro owns no CSS to change it.
Existing surface this might already be: `Field` (no font option), `Text` (no family), `MarkdownView` (draws the result, not the source).
Workaround I almost used: the plain text box, which S05 shipped with the difference recorded.
Teisoro use: `training/PageEditor`'s Markdown `textarea` (English and Español tabs).
Options weighed: a `Field` prop would add a font family to one component when the face is a property of any text (a code sample, an identifier); a utility class, like `sw-sr-only` or `sw-container`, serves a `Field`'s native control and any element alike. A monospace face named in `@scalewing/tokens` (SF Mono, Menlo) would need a tokens release and both renderers' sign-off; the generic CSS names `ui-monospace, monospace` choose no face, as the forced-colour rules name system colours, so there is no type value to own. This is deliberate, not a missed token: if a product ever needs a chosen face, it goes in `@scalewing/tokens` beside `fontFamily` with both renderers' sign-off.
Proposed API: a utility class `sw-font-mono`.

## Accepted API (2026-10-20)

- `sw-font-mono` sets `font-family: ui-monospace, monospace` on the element, at the size and line height it already has.
- The rule is `[data-theme] .sw-font-mono, [data-theme] :is(<typed inputs>).sw-font-mono`, one class above the canvas's text control rule, so a `textarea` or text input inside a `Field` takes it; Field's label, hint and error keep the page's face.
- No new tokens, layers or dependencies. New class `sw-font-mono` (`css/css-font-mono.ts`).

### Differences from the boards (Teisoro D-29)

- The source is one face and colour: the board drew Markdown marks in teal, which a `textarea` cannot colour without a second editor layer.
- The size is the field's own, not the board's 13.5 px.

Evidence: `font-mono.test.ts` (generic names only, the rule and its rank over the canvas's controls, the catalog); gallery "Field" (Field guide source, a Markdown `textarea`, and Leg band code, a one-line input); `apps/gallery/e2e/font-mono.spec.ts` on desktop-en, mobile-es and forced-colors (the textarea's and the one-line input's family `ui-monospace, monospace`, another field and the label in the page's face, the same size as a plain control).
