# Teisoro: a real screenshot inside a ScreenPreview

Status: released in `@scalewing/react` 1.60.0 (PR #282).

Scalewing request from Teisoro.

Renderer: react
Missing surface: `PreviewImage`, a screenshot held by `ScreenPreview`
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro F-017's public pages replace their drawn screens with real screenshots from the product's synthetic sample store, in the same card and phone frames. A product may not write CSS or inline style, and a bare `img` keeps its natural width, so it overflows a phone.
Existing surface this might already be: `ScreenPreview` (extended here); `MarkdownView` images are for documents
Workaround I almost used: leaving the drawn screens with made-up figures
Proposed API (reusable names only): `<PreviewImage src width height />` inside a `ScreenPreview`

## Behaviour

- An `img` at the screen's width with its height following, its natural size in `width` and `height`, lazily loaded.
- Decorative (`alt=""`): the `ScreenPreview`'s `label` names the one image.
- A blank `src` or a size that is not a positive whole number throws a `RangeError`.
- Consumer: Teisoro's Home, Services, Cash and For owners pages (F-017 task 2730).
