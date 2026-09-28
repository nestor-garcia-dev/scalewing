Scalewing request from Teisoro.

Status: implemented on `claude/closeout-ux-surfaces`; pending review, merge and a `@scalewing/react` minor release. Do not version, tag or publish until the owner says so.
Renderer: react
Missing surface: `ActionBar`, a new component: a page's actions and one short status line on a glass bar that sticks to the bottom of the viewport while the content above it scrolls, clearing the bottom safe area, with an option to stick only below the `md` breakpoint. Generated classes `sw-action-bar`, `sw-action-bar-status`, `sw-action-bar-actions`, `sw-action-bar-sticky`, `sw-action-bar-sticky-below-md`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: nothing published is sticky at the bottom. `AppHeader` is sticky at the top only, `ButtonGroup` is an in-flow row, and `Card` has no position. A bottom bar needs `position: sticky`, a safe-area inset, a breakpoint query and a glass surface, and Teisoro owns no CSS, media queries or inline styles.
Existing surface this might already be: `ButtonGroup` (the in-flow action row; its buttons can go in the bar), `AppHeader` (top chrome, not actions), `Toast` (a transient message, not controls), `Dialog` (modal). None stays with the reader on a long page.
Workaround I almost used: repeating Save draft and Finalize at the top of the form, or an inline `style={{ position: 'sticky', bottom: 0 }}` on a `Card`.
Teisoro use: F-007-S03 task 1280, UX review finding UX-4 ("On a phone, Save draft and Finalize are only at the very bottom", major; `docs/features/F-007-journey-suite-scale.in-progress/ux-reviews/closeouts-close-a-register.md`). At 390 the closeout form is ten to twelve screens tall and the only Save draft and Finalize buttons are after the last section. The page renders `<ActionBar stickyBelow="md" status={savedLine}>` as the last child of the form while the closeout can be edited, with Save draft and Finalize as its children and `savedLine` "Draft saved 5:00 PM" or "Not saved yet".
Proposed API: a new `ActionBar` (props type `ActionBarProps`): `children` (the actions), `status?: string`, `stickyBelow?: 'md'`, plus the `div` HTML attributes and a forwarded ref.

```tsx
<Stack gap={4}>
  {longForm}
  <ActionBar status="Draft saved at 5:00 PM" stickyBelow="md">
    <Button variant="secondary" onPress={save}>
      Save draft
    </Button>
    <Button onPress={finish}>Finish</Button>
  </ActionBar>
</Stack>
```

Behavior and failure boundary: presentation only. The bar is `position: sticky` with `bottom` one spacing step above `env(safe-area-inset-bottom)`, so it stays stuck while its parent is on screen and rests in its own place after the last section, never covering the end of the page; place it as the last child of the content it acts on (an ancestor with `overflow` other than `visible` stops it from sticking). Without `stickyBelow` it is always sticky; with `stickyBelow="md"` only the `below md` query of the breakpoint token makes it sticky, and from `md` up it sits in page flow. The surface is the glass fill, hairline border and specular of `AppHeader`, solid under Reduce Transparency. Horizontal padding also clears the left and right safe-area insets. The status line is a muted caption at the inline start; the actions sit at the inline end on one wrapping row, and on a phone the status takes its own line and the actions share the row under it. The bar has no role by default: pass `role="region"` with an `aria-label` to make it a landmark. The status is a polite live region (`role="status"`), rendered even while empty so that the first status is announced too; an empty status takes no room in the bar. A consumer that also announces the same event some other way (for example by moving focus to a notice) should drop one of the two so it is not read twice. The bar paints under an open popup: a glass `Card` or `Accordion` holding an open `Select`, `ActionMenu` or `Tooltip` lifts above it (the generated stacking order in `packages/react/src/css/stacking.ts`), so an option under the bar can still be tapped. Safe-area insets only apply when the page's viewport meta has `viewport-fit=cover`. Not in scope: hiding the bar while the keyboard is open, a top variant, or an overflow menu.

Design notes:

- A new component rather than a `sticky` prop on `ButtonGroup`: the bar owns a surface, a status line and a position, three responsibilities `ButtonGroup` (a row of buttons) should not grow.
- `stickyBelow` follows `hideBelow` and `columnsBelow`: one breakpoint name from the `md` token, generated as a component modifier under the existing query, not a new responsive utility family.
- Children lay out directly in the actions row. A `ButtonGroup` passed as the only child keeps its own contract (its buttons stack full width on a phone).

Scalewing owns the component, the generated classes, the tests, the gallery evidence (the ActionBar section's survey list and `stickyBelow="md"` example, checked in `apps/gallery/e2e/action-bar.spec.ts` at 1280, 390 and in forced colors) (including an open `Select` in an `Accordion` over the stuck bar and a bar whose first status appears after a save) and the changeset. Teisoro owns the status copy, which actions show when, and its focus handling, and adopts the release in task 1285.
