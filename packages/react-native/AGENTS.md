# React Native agent rules

Follow the root `AGENTS.md`. On conflict, the root wins.

## Hard rules for React Native

1. This package renders with React Native primitives. Do not import `react-dom`, CSS files, or `@scalewing/react`.
2. Do not accept `className` or fake `sw-*` class strings.
3. Spacing, color, named palettes, and type come from the active theme's token steps, for example `paddingTop={4}`. Button sizes come from `theme.control`. Card glass uses `theme.glass` fills. Field, Select, Dialog, Accordion, Split, and Toast are web-only. ThemeProvider `palette` applies a named overlay.
4. React and React Native are peer dependencies. Do not pin a product's Expo SDK here.
5. Components stay thin. Mapping from props to `StyleSheet` values belongs in named functions.
6. Add tests for style mapping and theme changes. Rendering tests must not require a full native build.

## Prefer

```ts
<Box padding={4} paddingTop={2}>
  {children}
</Box>
```

## Avoid

CSS class APIs, hex colors in JSX, and React Native Web.
