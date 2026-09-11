# Architecture

Scalewing is a design system published as three npm packages from one pnpm workspace.

## Packages

```text
@scalewing/react ──────────────┐
@scalewing/react-native ───────┼──> @scalewing/tokens
                               │
apps/gallery ──> react ────────┘
apps/native-example ──> react-native
```

- **`@scalewing/tokens`**: theme objects, named palettes, scales, contrast checks, CSS custom properties, and generated `sw-*` classes.
- **`@scalewing/react`**: DOM components plus `@scalewing/react/styles.css` and optional `@scalewing/react/palette/<id>.css`. Button is a real `<button>`. `Box as="a"` is a layout link. Field wraps a native control with a label and token gap. Select is a labeled listbox menu. Badge, SegmentedControl, Table, BarChart, AppHeader, Nav, and Toast are web dashboard primitives. Split, Dialog, Select, and Toast are web-only.
- **`@scalewing/react-native`**: React Native components and a theme provider. No CSS class API. Button is a `Pressable`. Field is a labeled native text input. TabBar is a bottom tab list. Table is a compact row/cell layout. Accordion is a controlled disclosure with optional independent title navigation.

## CSS ownership

The stylesheet is generated from tokens and published inside the packages. A web app imports it once:

```ts
import '@scalewing/react/styles.css';
```

Consumers do not copy that CSS into application source. Bundlers pull it from `node_modules`.

`sw-padding-top-4` is spacing step `4` (16px in the default scale), not 4 pixels.

React Native has no CSS classes. The same step is `paddingTop={4}`.

## Theming

Light and dark palettes are first-class themes. Web applies them with `data-theme`, optional `data-palette`, CSS variables, and a generated document canvas (background, type, links, native text controls). Native applies them through React context and a full-screen canvas `View`. Products may pick a named palette (`ThemeProvider palette` or `import '@scalewing/react/palette/<id>.css'`), overlay brand colors through `createTheme` (`colors` may be flat or `{ light, dark }`), and let users choose light, dark, or system via `colorScheme`. They do not fork the class sheet. Card defaults to `glass` (opaque white on light).

## Icons

Scalewing does not ship glyphs. Components that need a consumer pictogram take a slot (`TabBar` `icon`). Generic UI icons in products use Lucide; control chrome stays private to the component. See [ADR 0008](adr/0008-icon-slots-and-lucide.md).

## Renderers

Native Accordion owns a controlled disclosure surface and optional separate
title action. It uses native Pressables and token styles; the DOM Accordion
keeps its existing implementation. No renderer code or DOM API is shared.

Do not share React Native component files with the DOM package. Do not introduce React Native Web to unify them.

## Examples

`apps/gallery` is the web catalog and pre-publish QA surface. `apps/native-example` proves native public exports. They are not a token source. A new or changed public web token, class, variant, or component is not done until the gallery demonstrates the meaningful states.
