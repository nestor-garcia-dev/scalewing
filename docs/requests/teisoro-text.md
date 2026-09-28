Scalewing request from Teisoro.

Status: merged in #68 (2026-09-28) and released in `@scalewing/react` 1.10.1; Teisoro pins it in F-007-S04 task 1310.
Renderer: react
Missing surface: none new. `Text` keeps the browser's paragraph and heading margins, so the spacing between lines is not the token the page asked for.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Text` is the text primitive. Resetting margins per consumer means a `style` or class on every `Text`, which is the hand-written spacing hard rule 2 forbids.
Existing surface this might already be: `Text`.
Workaround I almost used: `style={{ margin: 0 }}` on each `Text`, or a global `p, h1, h2, h3 { margin: 0 }` in Teisoro.
Teisoro use: every page; the UX review found it on the closeout day and its dialogs.

## Why

Teisoro UX review `closeouts-closeout-day-and-prior-day.md`, finding DAY-10: `Text` renders `body` as `p`, `display` as `h1`, `heading` as `h2` and `title` as `h3` with no margin reset. `.sw-stack` and `.sw-inline` are flex containers, so the browser's 1em block margins do not collapse and are added to the gap. `Stack gap={3}` should put 12 px between two deposit-slip steps; they were about 72 px apart for 24 px lines. Dialog titles sat about 55 px above the first line.

## Behavior

- One generated rule, `:where(.sw-text-display, .sw-text-heading, .sw-text-title, .sw-text-body, .sw-text-label, .sw-text-caption, .sw-text-data) { margin: 0; }`, built from the typography variants, removes the margins of every element `Text` renders.
- `:where()` has zero specificity. Author styles beat the user agent's whatever the specificity, so the reset removes the browser margins, and any authored margin still wins: `sw-sr-only`'s `-1px` on a visually hidden `Field` or `Select` label, or a consumer class.
- The text rules (`sw-text-*` variants, their compact sizes below `md`, and `sw-text-align-*`) move from `css-components.ts` to their own `css-text.ts`.

No API change. A patch release; the changeset names the visual change. Teisoro checks the screens that relied on the extra space (the dialog body, the day's subtitle) and raises a `gap` where they need more.

## Rejected alternatives

- `margin: 0` inside each `.sw-text-*` rule (class specificity). It is emitted after the utilities, so it would override `sw-sr-only`'s `-1px` margin, and a consumer class with a margin would win or lose by stylesheet order.
- A global `p, h1, h2, h3, h4 { margin: 0 }` in the document canvas. It would reach markup that is not `Text`, such as a consumer's prose or Markdown.
- Resetting in each consumer (`style={{ margin: 0 }}` or a product stylesheet). Every product would repeat it, and it is the hand-tuned spacing the design system exists to prevent.
- A `margin` or `flush` prop on `Text`. There is no case for the browser margin inside the design system's layout primitives; spacing belongs to `gap`.

## Evidence

- `packages/react/src/css/stylesheet.test.ts`: the zero-specificity reset covers every variant, and `sw-sr-only` is still emitted.
- `apps/gallery/e2e/text.spec.ts` on desktop-en, mobile-es and forced-colors: the section heading, its purpose paragraph and a centred heading have no margin, and the space between two `Text` elements in `Stack gap={3}` is 12 px; a visually hidden `Field` label keeps its `-1px` margin.
- Gallery specs that relied on the old margins: the ActionBar demo relied on the extra height of its eight cards to scroll past a 900 px viewport, so its transect has three more stops (`apps/gallery/src/sections/action-bar.tsx`). All other specs pass unchanged.
