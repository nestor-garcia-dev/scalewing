Scalewing request from Teisoro.

Status: merged in #103 (2026-10-09) and released in `@scalewing/react` 1.23.0 for Teisoro F-006-S11 task 1885; Teisoro pins and adopts it in that task.
Renderer: react
Missing surface: a touch-sized target for a `Button` inside `Nav` on a coarse pointer.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Button`'s sizes are fixed (`sm` is 32 px tall at every pointer), and a product may not write its own media query or size rule; a larger `size` would also grow the button on a fine pointer, where the compact row is wanted.
Existing surface this might already be: `SectionNav` links, `CalendarButton` and the `ActionMenu` trigger already grow to 44 px on a coarse pointer; `Nav`'s buttons do not.
Workaround I almost used: `size="md"` on the glyph-only destinations below 64rem, which grows them on a desktop window too and leaves the labelled ones at 32 px on a touch laptop or an iPad in landscape.
Source: Teisoro UX review `closeouts-close-a-register.md`, UX-16 (the phone header's destinations are 32 px tall), and the independent review of Teisoro's design pass (`docs/design/remaining-routes/01-shell.md`, "The destinations at every width", 2026-10-09: a 44 px target at every width on touch).
Teisoro use: the workspace header's eight destinations, a `Nav` of ghost and primary `sm` buttons.

Proposed API: none. A `Button` inside `Nav` (`.sw-nav .sw-button`) is at least 44 × 44 px (`--sw-control-md-min-height`) on a coarse pointer, whatever its `size`.

Behavior and failure boundary: presentation only; a fine pointer is unchanged. Only the minimum height and width grow, so a label beside its glyph keeps its line, and a glyph-only button stays centred. The rule outranks the size classes (0,2,0 against 0,1,0) whatever the order.

Rejected alternatives:

- A responsive `size` on `Button`. A new API for a need every navigation shares.
- The rule on every small `Button`. A dense table's or toolbar's buttons are not destinations, and the 44 px rule there is a design decision of its own.

Evidence: `visibility.test.tsx` (the generated rule); `apps/gallery/e2e/responsive-visibility.spec.ts` on desktop-en, mobile-es and forced-colors: the gallery's habitat destinations in a `Nav` are 44 px targets on the coarse pointer (mobile-es) and compact on a fine pointer.
