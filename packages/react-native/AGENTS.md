# React Native agent rules

Follow the root `AGENTS.md`. On conflict, the root wins.

## Hard rules for React Native

1. This package renders with React Native primitives. Do not import `react-dom`, CSS files, or `@scalewing/react`.
2. Do not accept `className` or fake `sw-*` class strings.
3. Spacing, color, named palettes, and type come from the active theme's token steps, for example `paddingTop={4}`. Button sizes come from `theme.control`. Card glass uses `theme.glass` fills. Field is a labeled native text input with token-owned control chrome; `rows` above one makes it multi-line. DateField, TimeField, and WheelField are field-shaped disclosure buttons that open a month grid, snapping hour, minute, and (on a 12-hour locale) period wheels, or one wheel over consumer-supplied `{ id, label }` items, all built from `ScrollView`; Stepper is a labeled bounded number between round minus and plus buttons on a pill track that fills its column, with the value as one adjustable element; MultiSelect and SingleSelect are labeled groups of checkbox or radio chips; SingleSelect takes one id or the empty string. Consumers pass placeholder and navigation copy; Scalewing owns value contracts (`YYYY-MM-DD`, `HH:MM`), bounds, and locale formatting through `Intl`. TabBar is a bottom tab list with icon slots and an optional trailing control; consumers pass Lucide (or product SVG) nodes, not a Scalewing catalog. SegmentedControl is an in-page radiogroup on a glass pill track. Table is a compact row/cell layout for scores and standings; TableRow may take optional `onPress`. Accordion is controlled disclosure with optional independent title navigation. Select, Dialog, Split, and Toast are web-only. ThemeProvider `palette` applies a named overlay.
4. React and React Native are peer dependencies. Do not pin a product's Expo SDK here.
5. Components stay thin. Mapping from props to `StyleSheet` values belongs in named functions. `Field` owns native input label, hint/error, disabled, and focus semantics; consumers provide product copy and controlled value state.
6. Add tests for style mapping and theme changes. Rendering tests must not require a full native build.

## Prefer

```ts
<Box padding={4} paddingTop={2}>
  {children}
</Box>
```

## Avoid

CSS class APIs, hex colors in JSX, and React Native Web.
