# Architecture

Scalewing is a design system published as three npm packages from one pnpm workspace.

## Packages

```text
@scalewing/react ──────────────┐
@scalewing/react-native ───────┼──> @scalewing/tokens
                               │
apps/web-example ──> react ────┘
apps/native-example ──> react-native
```

- **`@scalewing/tokens`**: theme objects, scales, contrast checks, CSS custom properties, and generated `sw-*` classes.
- **`@scalewing/react`**: DOM components plus `@scalewing/react/styles.css`.
- **`@scalewing/react-native`**: React Native components and a theme provider. No CSS class API.

## CSS ownership

The stylesheet is generated from tokens and published inside the packages. A web app imports it once:

```ts
import '@scalewing/react/styles.css';
```

Consumers do not copy that CSS into application source. Bundlers pull it from `node_modules`.

`sw-padding-top-4` is spacing step `4` (16px in the default scale), not 4 pixels.

React Native has no CSS classes. The same step is `paddingTop={4}`.

## Theming

Light and dark palettes are first-class themes. Web applies them with `data-theme` and CSS variables. Native applies them through React context. Products may overlay brand colors through `createTheme`; they do not fork the class sheet.

## Renderers

Do not share React Native component files with the DOM package. Do not introduce React Native Web to unify them.

## Examples

`apps/web-example` and `apps/native-example` exist to prove public exports. They are not a token source.
