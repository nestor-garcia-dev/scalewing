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

- **`@scalewing/tokens`**: platform-neutral theme objects, named palettes, scales, and contrast checks. No CSS.
- **`@scalewing/react`**: DOM components, the CSS custom properties and generated `sw-*` classes (`packages/react/src/css`), plus `@scalewing/react/styles.css` and optional `@scalewing/react/palette/<id>.css`. Button is a real `<button>`; ButtonLink is a real `<a href>` drawn as one. `Box as="a"` is a layout link. Field wraps a native control with a label and token gap. FileField is one file chosen with the system picker or dropped on it, handed to the consumer as a `File` (no upload). Article is a page that reads like a post on a card at the reading width (`--sw-reading-max`): a cover photo, an eyebrow with the consumer's actions, the title, a meta line, a hairline and the body. MarkdownView draws a safe Markdown subset as React elements (never HTML from a string), with links limited to http, https and mailto and images to consumer-resolved `photo:` ids; `inspectMarkdown` lists its headings and what it left out. Stepper is a whole-number count between − and + buttons that can also be typed. Steps is a one-page vertical stepper of a form's steps. Select is a labeled listbox menu. Combobox is a text input with a list of suggestions the consumer filters (an ARIA 1.2 combobox: focus stays in the input, the active option is `aria-activedescendant`). MultiSelect is several choices: a trigger that discloses a group of checkboxes. DateField is a typed date-only entry with a Scalewing-drawn calendar dialog, not the browser's date input. CalendarButton is an icon-only Button that opens that calendar for a date shown elsewhere on the page. DateRangeButton shows a range of days and opens a calendar on the same private grid to pick a first and a last day. DocumentViewer draws a PDF from its bytes a page at a time with PDF.js (`pdfjs-dist`, an exact-pinned dependency loaded on first use, its legacy build for older browsers), with its worker entry published as `@scalewing/react/document-viewer-worker` so a consumer's worker is always the same version. Notice is a tinted note in the page's flow with a tone, a bold lead and one action. Skeleton is grey placeholder bars (text lines or list rows) in a status named by its words while content loads, still under reduced motion. FixtureRow is one pairing of two sides with a time or score between them, the centres lined up down a FixtureGroup (one grid, each row a subgrid). GlyphTile is a categorical-colour square holding a white glyph. ContextSwitcher is a button showing the context in use that opens a top-layer popup to switch it (a filter combobox, a grouped listbox, footer commands). CommandPalette is a modal search on the top layer (a combobox field over an always-open grouped listbox, ⌘K / Ctrl+K), opened by CommandPaletteTrigger. Badge, SegmentedControl, Table, ListGroup, BarChart, ColumnChart, LineChart, DataBar, ChartLegend, Pagination, AppHeader, AppShell, ContextSwitcher, CommandPalette, ActionBar, Nav (with NavCount), SectionNav, and Toast are web dashboard primitives; Band and SiteFooter are web page bands, and SiteHeader a public site's header. Split, Dialog, Select, Combobox, and Toast are web-only.
- **`@scalewing/react-native`**: React Native components and a theme provider. No CSS class API. Button is a `Pressable`. Field is a labeled native text input. TabBar is a bottom tab list. Table is a compact row/cell layout. Accordion is a controlled disclosure with optional independent title navigation.

## CSS ownership

The stylesheet is generated from tokens by `@scalewing/react` and published inside that package (ADR 0010). A web app imports it once:

```ts
import '@scalewing/react/styles.css';
```

Consumers do not copy that CSS into application source. Bundlers pull it from `node_modules`.

Every generated `z-index` is one layer of the stacking order in `packages/react/src/css/stacking.ts`, lowest first: a sticky table head group or row label, a sticky table footer, the sticky `ActionBar`, a glass surface holding an open popup, the sticky `AppHeader`, sticky `Tabs` strip or `AppShell` page bar, then popups. Dialog and Toast sit above all of them on the browser's top layer. A new layered surface takes a layer from that table rather than a number of its own. An attached `ButtonGroup` is its own stacking context with a local order (`joinedControlOrder`: a pressed button, then the focused one) that never meets the page's layers.

`sw-padding-top-4` is spacing step `4` (16px in the default scale), not 4 pixels.

React Native has no CSS classes. The same step is `paddingTop={4}`.

## Theming

Light and dark palettes are first-class themes. Web applies them with `data-theme`, optional `data-palette`, CSS variables, and a generated document canvas (background, type, links, native text controls, and the focus ring of a programmatic focus target). Native applies them through React context and a full-screen canvas `View`. A page may opt into the grouped canvas (`ThemeProvider canvas="grouped"`, `data-canvas`), a quiet grey under white cards. Products may pick a named palette (`ThemeProvider palette` or `import '@scalewing/react/palette/<id>.css'`), overlay brand colors through `createTheme` (`colors` may be flat or `{ light, dark }`), and let users choose light, dark, or system via `colorScheme`. They do not fork the class sheet. Card defaults to `glass` (opaque white on light).

## Icons

Scalewing does not ship glyphs. Components that need a consumer pictogram take a slot (`TabBar` `icon`). Generic UI icons in products use Lucide; control chrome stays private to the component. See [ADR 0008](adr/0008-icon-slots-and-lucide.md).

## Renderers

Native Accordion owns a controlled disclosure surface and optional separate
title action. It uses native Pressables and token styles; the DOM Accordion
stays a native `<details>` disclosure. Both take the same `subtitle` prop. No renderer code or DOM API is shared.

Do not share React Native component files with the DOM package. Do not introduce React Native Web to unify them.

## Examples

`apps/gallery` is the web catalog and pre-publish QA surface. `apps/native-example` proves native public exports. They are not a token source. A new or changed public web token, class, variant, or component is not done until the gallery demonstrates the meaningful states.
