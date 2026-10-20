Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.44.0 (PR #216; accepted 2026-10-20; Teisoro F-014-S07 "Scalewing fidelity", task 2630; the gap Teisoro F-014-S05 task 2620 found on the training boards TrainingAdd and TrainingWrite; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: a centred column narrower than the page's container, for a form.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the add and write forms are one column, centred at 800 px with 32 px of padding (736 px of content, which is `--sw-reading-max`, 46rem), while the page around them is the 1120 px container. Teisoro centres its pages with the public `sw-container` class (72rem); it has no narrower measure, and Teisoro owns no CSS to cap a width.
Existing surface this might already be: `sw-container` (the page's 72rem); `Article` (46rem, but an `article` card for reading, not a form's column); `Field` `width` (caps one control, not the column).
Workaround I almost used: the full container width, which S05 shipped with the difference recorded.
Teisoro use: `ui/GuidedForm`'s open form, as Training's add and edit forms use it.
Options weighed: a `Stack` or `Box` `measure` prop would add a layout prop for one width, beside a public `sw-container` utility that already does the same at another width; the sibling utility keeps one pattern. Should a third measure appear, the two classes can become one scale then.
Proposed API: a utility class `sw-container-reading`.

## Accepted API (2026-10-20)

- `sw-container-reading`: `width: 100%; max-width: var(--sw-reading-max); margin-inline: auto` (46rem, the reading width `Article` uses), full width below it.
- As with `sw-container`, the width is the content box's: padding or a border goes on a child.
- No new tokens, layers or dependencies. New class `sw-container-reading` in the layout utilities.

Evidence: `css/container-reading.test.ts` (the rule, the variable it reads, the catalog beside `sw-container`); gallery "Layout" (a ranger's sighting report column, and the class in the bounded classes list); `apps/gallery/e2e/layout.spec.ts` on desktop-en, mobile-es and forced-colors (46rem wide and centred at 1280, full width at 390).
