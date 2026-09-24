# React DOM agent rules

Follow the root `AGENTS.md`. On conflict, the root wins.

## Hard rules for React

1. This package renders to the DOM. Do not import `react-native`, Expo, or `@scalewing/react-native`.
2. Components stay thin. Visual values come from `@scalewing/tokens` or generated classes. The generators, class catalog, class-name helpers, and breakpoint token live in `src/css` (ADR 0010).
3. Consumers must import `@scalewing/react/styles.css` explicitly. Do not inject the stylesheet as a hidden side effect of component imports.
4. React is a peer dependency.
5. Prefer semantic HTML (`section`, `p`, headings, `button`, `a`, `label`) and preserve refs.
6. Public class names stay in the generated `sw-*` catalog.
7. Add tests for class mapping, theme switching, and accessibility of composed examples.
8. `Box hideBelow`/`hideFrom` toggle a region at the `md` breakpoint token with generated `sw-hide-*` classes; products must not write their own media queries. `Grid` is equal-width columns from a bounded count; a direct child's `columnSpan` (any Box-based component) covers several columns and is capped at the grid's count at the current width by generated `sw-grid-span-*` rules. `Box as="a"` is a layout link. Do not add `as="button"`; use `Button`. Field wraps a native control with token gap. Select is a labeled listbox menu; Field remains the native OS picker. `size="xs"` and `labelVisuallyHidden` are for toolbar chrome. `action` is a last listbox command that does not become the value. Native text controls inherit the generated document canvas, including accent focus; do not restyle them with hex in JSX. Badge is not a button; `size="sm"` is the table chicklet. SegmentedControl is one exclusive choice. Table `density="compact"` and `TableRow selected` are for ranked lists. BarChart is a labeled horizontal magnitude chart. Split is a start pane with a drag separator, a max width, and collapse below min. Accordion is a native `<details>` disclosure in page flow. Dialog is a modal `<dialog>` on the top layer. Toast is an auto-dismiss status on the popover layer; it does not trap focus. `anchor` and `target` send it from a press to a destination. AppHeader is sticky glass chrome. Nav is a label-size link cluster. ThemeProvider `palette` applies a named token overlay; do not invent hex in JSX to retint the canvas. Public names stay generic so every product can reuse them.
9. A new or changed public web token, class, variant, or component is not done until `apps/gallery` demonstrates the meaningful states.

## Prefer

```ts
<Box as="a" href="#layout" padding={4} paddingTop={2}>
  {children}
</Box>
```

which maps to `sw-padding-4 sw-padding-top-2`.

## Avoid

Hex colors in JSX, copied CSS in examples, and React Native primitives.
