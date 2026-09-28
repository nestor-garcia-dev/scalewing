Scalewing request from Teisoro.

Status: implemented for the react 1.9.0 release (Teisoro F-007-S03 task 1280; PR #62 reviewed and merged); pending consumer verification in Teisoro (task 1285).
Renderer: react
Change to an existing surface: `Box` `border` accepts `'dashed'` as well as `true`, a hairline dashed border in the `border` color token (type `BoxBorder = boolean | 'dashed'`).
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Box border` is a solid hairline only, the same border the canvas gives a text input, so a box that is empty on purpose reads as a field to type into. `Card` variants (`glass`, `outlined`, `elevated`, `filled`) are surfaces, not a blank to fill by hand, and Teisoro owns no CSS or inline styles.
Existing surface this might already be: `Box border` itself (this extends its value). `Separator` has no dashed style either.
Workaround I almost used: `style={{ borderStyle: 'dashed' }}` on the `Box`, or dropping the border and leaving an unmarked space.
Teisoro use: F-007-S03 task 1280, UX review finding UX-9 ("Blank deposit-slip boxes look like text fields", `docs/features/F-007-journey-suite-scale.in-progress/ux-reviews/closeouts-close-a-register.md`). `SlipField` renders the printed deposit slip's "Account number", "Customer name" and "Business name" as `<Box border radius="sm" padding={2} background="surface">`, the same frame and height as the form's inputs, so people tap them and try to type. A blank slip field becomes `border="dashed"` with its "write it in by hand" hint as visible muted text.
Proposed API: `border?: boolean | 'dashed'` on `BoxProps`, so on every Box-based component:

```tsx
<Box border="dashed" padding={2} radius="sm">
  <Text color="muted" variant="caption">
    Write it in by hand
  </Text>
</Box>
```

Behavior and failure boundary: presentation only. `border` and `border={true}` keep the solid `1px solid var(--sw-color-border)`; `border="dashed"` is `1px dashed var(--sw-color-border)`, the same width and token, so it only changes the line style; `false` or no prop draws none. It maps to the generated classes `sw-border` and `sw-border-dashed` (the solid `border={true}` moved from an inline style to `sw-border` with the same declaration), emitted after the component rules so the prop still wins over a Box-based component's own frame, and a consumer `style` still wins over the class. In forced colors the system border color replaces the token and the dash stays. No other border styles, widths or colors: a new style needs its own request.

Scalewing owns the prop value, the tests, the gallery evidence (the Layout section's "border solid and dashed" row, checked in `apps/gallery/e2e/layout.spec.ts`) and the changeset. Teisoro owns which slip boxes are blank, the hint copy, and the muted text, and adopts the release in task 1285.
