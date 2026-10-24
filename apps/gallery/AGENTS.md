# Gallery agent rules

Follow the root `AGENTS.md`. On conflict, the root wins.

## Hard rules

1. This app is the Scalewing documentation gallery and pre-publish QA surface. It is not a source of tokens.
2. Import `@scalewing/react/styles.css` once at the entry. Do not copy Scalewing CSS into `src`.
3. Consume public exports from `@scalewing/react` and `@scalewing/tokens` only. Do not import package `src` internals.
4. Compose from ThemeProvider, Box, Stack, Inline, Split, Card, Accordion, Dialog, Toast, Notice, Skeleton, GlyphTile, Text, Button, ButtonLink, CalendarButton, DateRangeButton, InfoTip, Field, FileField, Article, MarkdownView, Stepper, Steps, DateField, Select, Combobox, MultiSelect, Badge, SegmentedControl, Table, DescriptionList, ListGroup, BarChart, ColumnChart, LineChart, DataBar, ChartLegend, Pagination, DocumentViewer, AppHeader, AppShell, ContextSwitcher, CommandPalette, CommandPaletteTrigger, ActionBar, Nav, NavCount, SectionNav, and Band. Named palettes come from `@scalewing/tokens` and `ThemeProvider palette`. Do not add public primitives for site chrome.
5. `gallery.css` may own sticky/responsive documentation layout and code-block presentation. It must use Scalewing CSS variables. It must not restyle showcased components or redefine the canvas, links, inputs, colors, typography, radii, shadows, or glass.
6. Show only primitives that already exist. Do not invent hex, font sizes, or spacing in JSX.
7. Do not add product domain screens, Storybook, MDX, or another visual system.
8. Sample copy is animals and habitats: worldwide field-guide filler (species, biomes, sightings). Shared filler lives in `src/sample-copy.ts`. Do not use fantasy football, sports leagues, draft boards, ADP, or era-specific music catalogs. API usage snippets may stay generic.
9. When `@scalewing/react` gains a public component, prop, or meaningful state, add or update a catalog section in `src/catalog.ts` in the same change. Compose from the new export.

## Prefer

```ts
import '@scalewing/react/styles.css';
import { Button, Card, Stack, Text } from '@scalewing/react';
import { lightTheme } from '@scalewing/tokens';
```

## Avoid

Vendoring Scalewing CSS, importing renderer internals, and treating the gallery as a design-token source.

## Browser checks

`pnpm --filter @scalewing/gallery test:browser` runs `e2e/` on desktop-en, mobile-es and forced-colors in Chromium, and `e2e/tab-order.spec.ts` also in the `safari` project (WebKit, which keeps Safari's default Tab order: buttons, links, checkboxes and radios only with a `tabindex`). Install its browser once with `pnpm --filter @scalewing/gallery exec playwright install webkit`. CI does not run these; run them before a release.
