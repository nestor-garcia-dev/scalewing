# React DOM agent rules

Follow the root `AGENTS.md`. On conflict, the root wins.

## Hard rules for React

1. This package renders to the DOM. Do not import `react-native`, Expo, or `@scalewing/react-native`.
2. Components stay thin. Visual values come from `@scalewing/tokens` or generated classes.
3. Consumers must import `@scalewing/react/styles.css` explicitly. Do not inject the stylesheet as a hidden side effect of component imports.
4. React is a peer dependency.
5. Prefer semantic HTML (`section`, `p`, headings, `button`, `a`, `label`) and preserve refs.
6. Public class names stay in the generated `sw-*` catalog.
7. Add tests for class mapping, theme switching, and accessibility of composed examples.
8. `Box as="a"` is a layout link. Do not add `as="button"`; use `Button`. Field wraps a native control with token gap. Native text controls inherit the generated document canvas; do not restyle them with hex in JSX.
9. A new or changed public web token, class, variant, or component is not done until `apps/gallery` demonstrates the meaningful states.

## Prefer

```ts
<Box as="a" href="/draft" padding={4} paddingTop={2}>
  {children}
</Box>
```

which maps to `sw-padding-4 sw-padding-top-2`.

## Avoid

Hex colors in JSX, copied CSS in examples, and React Native primitives.
