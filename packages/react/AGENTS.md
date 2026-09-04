# React DOM agent rules

Follow the root `AGENTS.md`. On conflict, the root wins.

## Hard rules for React

1. This package renders to the DOM. Do not import `react-native`, Expo, or `@scalewing/react-native`.
2. Components stay thin. Visual values come from `@scalewing/tokens` or generated classes.
3. Consumers must import `@scalewing/react/styles.css` explicitly. Do not inject the stylesheet as a hidden side effect of component imports.
4. React is a peer dependency.
5. Prefer semantic HTML (`section`, `p`, headings) and preserve refs.
6. Public class names stay in the generated `sw-*` catalog.
7. Add tests for class mapping, theme switching, and accessibility of composed examples.

## Prefer

```ts
<Box padding={4} paddingTop={2} as="section">
  {children}
</Box>
```

which maps to `sw-padding-4 sw-padding-top-2`.

## Avoid

Hex colors in JSX, copied CSS in examples, and React Native primitives.
