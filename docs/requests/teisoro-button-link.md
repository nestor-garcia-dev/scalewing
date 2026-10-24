# Teisoro: a link drawn as a button

Status: released in `@scalewing/react` 1.48.0 (with `@scalewing/tokens` 1.6.0).

Scalewing request from Teisoro.

Renderer: react
Missing surface: `ButtonLink`, an `<a href>` with the Button's variants, sizes and width
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro F-017 (owner-approved 2026-10-24) builds a static public site, prerendered to HTML, whose every call to action is a blue "Contact us" pill that opens the Contact page, beside a grey "Sign in" pill to the app. They are destinations, so they must be links: they open in a new tab and work with no script. `Button` is a `<button>` with a required `onPress`, and `Box as="a"` draws a text link, not a pill.
Existing surface this might already be: `Button` (a press control), `Box as="a"` with `link` (a text link)
Workaround I almost used: a `Button` whose `onPress` sets `window.location`, which breaks a new tab and a page with no script
Proposed API (reusable names only): `<ButtonLink href variant size width aria-current>`

## Behaviour

- Renders `<a href>` with the Button's classes for its `variant` (default `primary`), `size` (default `md`) and `width`, plus `sw-button-link`, which keeps the variant's words over the canvas link colour, hover included, with no underline.
- `aria-current="page"` (a site's Contact us on Contact) draws the pressed button's accent ring past a gap in the page background; forced colours draw a Highlight border.
- A link has no disabled state; the consumer renders none instead.
- An unknown variant, size or width throws a `RangeError`.
- Consumer: Teisoro's site header, phone menu, page calls to action and its 404 page.
