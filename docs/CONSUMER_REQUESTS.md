# Consumer requests

Scalewing is a shared design system. Product apps consume `@scalewing/react@0.3.0` or `@scalewing/react-native@0.3.0`. They do not fork the class sheet or invent a second visual system.

This document is the intake protocol. Copy the paste-ready blocks into a product `AGENTS.md` and `.cursor/rules/scalewing.mdc`. fantasy-football and FutMas already have them. Paste into coach-platform when that app’s agent files exist.

## Consume

Web:

```ts
import '@scalewing/react/styles.css';
import {
  Accordion,
  AppHeader,
  Badge,
  BarChart,
  Box,
  Button,
  Card,
  Dialog,
  Toast,
  Field,
  Nav,
  SegmentedControl,
  Select,
  Split,
  Stack,
  Table,
  Text,
  ThemeProvider,
} from '@scalewing/react';
```

React Native / Expo:

```ts
import {
  Button,
  Card,
  Stack,
  Text,
  ThemeProvider,
} from '@scalewing/react-native';
```

Import the stylesheet once at the web entry. Do not copy it into application `src`. `sw-padding-top-4` is spacing step `4`, not `4px`. Native uses the same step as `paddingTop={4}`.

Products may pick a named palette (`<ThemeProvider palette="cerulean">`, `data-palette` on the canvas node, or `import '@scalewing/react/palette/cerulean.css'` after the stylesheet) or overlay brand colors with `ThemeProvider` / `createTheme` (`colors` may be a flat map or `{ light, dark }` so end users can switch scheme). Domain cards, routing, and copy stay in the app. Do not restyle links, inputs, or page background in app CSS; the generated canvas on `ThemeProvider` owns that.

Visual language: quiet canvas (system sans, large radius, white light `Card`, no blue underlined user-agent links).

## Stop and ask

Do this in the product without a Scalewing change:

- Compose screens from `ThemeProvider`, `Box`, `Stack`, `Inline`, `Split`, `Card`, `Accordion`, `Dialog`, `Toast`, `Text`, `Button`, `Field` (web), `Select` (web), `Badge`, `SegmentedControl`, `Table`, `BarChart`, `AppHeader`, and `Nav` (web).
- Pick a named palette with `ThemeProvider palette`, `data-palette`, or a generated palette CSS file.
- Keep product-only chrome in the app. `Box as="a"` is a layout link. Use `Button` for press actions.
- Do not add app CSS that restyles `a`, inputs, or the page canvas.

Stop and write a request file before:

- A new public component (Badge, and so on).
- A new `sw-*` class family, spacing step, or color utility.
- Copying Scalewing CSS into app source.
- Adding Tailwind, NativeWind, MUI, React Native Paper, Tamagui, Gluestack, or another visual system.
- Inventing hex values, font sizes, or spacing in JSX to paper over a missing primitive.
- A second visual skin (custom link CSS, gradients, extra blur utilities).

One product is enough to request a primitive. Before adding a new surface, check whether an existing one already covers the use case. If it does, tell the product to use that. If it does not, ship the new primitive so later apps reuse it instead of inventing a parallel control.

A Scalewing agent treats a filled request **file** as discovery, then plans one lane (`tokens`, `react`, or `react-native`) per `docs/DELIVERY_WORKFLOW.md`. Do not scrape product UIs to guess a catalog. Do not wait for the filled template to be pasted into a Scalewing chat.

## Request files

Intake is a markdown file in this repository, not a chat paste.

Path: `docs/requests/<consumer>-<surface>.md`

- Kebab-case. One public surface per file.
- `<consumer>` is the product id (`fantasy-football`, `futmas`) or `gallery` when the catalog itself is the requester. System-wide token work with no single product may be `<surface>.md` (`named-palettes.md`).
- `<surface>` is the **reusable primitive name** (`accordion`, `dialog`, `badge`). Do not name the file after product copy (`why-this-grade.md`).
- Proposed API uses that same generic name and generic props (`title`, `open`, `onOpenChange`). Domain copy stays in the product.

Write the file in the Scalewing checkout (a linked workspace or a branch). If you cannot write this repo, give the human the file to drop in `docs/requests/`. A Scalewing chat may point at the path in one line. Do not paste the filled template into that chat.

## Linked development

A product may point its `@scalewing/react` (or `@scalewing/tokens`) dependency at this checkout with a local `link:` specifier while a requested primitive is being built, instead of waiting for a publish. fantasy-football does this with `pnpm scalewing:link` / `pnpm scalewing:unlink`; see its `docs/adr/0006-linked-scalewing-development.md` for the exact mechanics and the pnpm/webpack quirks it works around.

This does not change how Scalewing plans or ships work. The filled file in `docs/requests/` is still the intake, one lane per story still applies, and the gallery is still the pre-publish QA surface. Linking only removes the publish round trip between "component exists in this repo" and "a consumer can see it live."

## Request template

Put this, filled in, in `docs/requests/<consumer>-<surface>.md`:

```text
Scalewing request from <product>.

Renderer: react | react-native
Missing surface: one reusable component, utility family, or prop (generic name)
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Existing surface this might already be: <none | Button | …>
Workaround I almost used: <raw button, copied CSS, Tailwind, hex in JSX, …>
Proposed API (optional, reusable names only):
```

## Paste-ready product AGENTS.md section

```markdown
## Scalewing

This product uses Scalewing for layout primitives and generated CSS. Read
`https://gitlab.com/dna-consulting/scalewing/-/blob/main/docs/CONSUMER_REQUESTS.md`.

- Web: `pnpm add @scalewing/react@0.3.0` and `import '@scalewing/react/styles.css'` once.
- Native: `pnpm add @scalewing/react-native@0.3.0`. No CSS class API.
- Compose from ThemeProvider, Box, Stack, Inline, Split, Card, Accordion, Dialog, Toast, Text, Button, Field, Select, Badge, SegmentedControl, Table, BarChart, AppHeader, and Nav (web). Named palettes use `palette` on ThemeProvider.
- `Box as="a"` is a layout link. Use `Button` for press actions.
- Visual language is quiet and glass-minimal. Do not restyle links, inputs, or the page canvas in app CSS.
- Do not copy Scalewing CSS into `src`.
- Do not add Tailwind, NativeWind, MUI, or another visual system.
- Do not invent hex, font sizes, or spacing in JSX.

If an existing Scalewing primitive already covers the use case, use that.
If you need a new public component, class family, spacing step, or prop,
stop. Do not work around it. Write `docs/requests/<consumer>-<surface>.md`
in the Scalewing repository (template in `docs/CONSUMER_REQUESTS.md`) and
point the human at that path. Do not paste the filled template into a
Scalewing chat. One product is enough to request a primitive. Other apps
reuse the generic name.
```

## Paste-ready product `.cursor/rules/scalewing.mdc`

Use a four-backtick fence when copying if your editor nests poorly. The file contents are:

```
---
description: Consume Scalewing. Stop and request missing primitives.
alwaysApply: true
---

# Scalewing

- Depend on `@scalewing/react@0.3.0` (web) or `@scalewing/react-native@0.3.0` (native).
- Import `@scalewing/react/styles.css` once on web. Do not vendor that CSS.
- `sw-padding-top-4` is spacing step 4, not 4px. Native uses `paddingTop={4}`.
- Compose from ThemeProvider, Box, Stack, Inline, Split, Card, Accordion, Dialog, Toast, Text, Button, Field, Select, Badge, SegmentedControl, Table, BarChart, AppHeader, and Nav (web). Named palettes use `palette` on ThemeProvider.
- `Box as="a"` is a layout link. Use `Button` for press actions.
- Visual language is quiet and glass-minimal. Do not restyle links, inputs, or the page canvas in app CSS.
- Do not add Tailwind, NativeWind, MUI, or another visual system.
- Do not invent hex, font sizes, or spacing in JSX.

If a new public Scalewing surface is required, stop. Write
`docs/requests/<consumer>-<surface>.md` in the Scalewing repo using this
template. Do not paste the filled template into a Scalewing chat.

    Scalewing request from <product>.

    Renderer: react | react-native
    Missing surface: one reusable component, utility family, or prop (generic name)
    Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
    Existing surface this might already be: <none | Button | …>
    Workaround I almost used: <raw button, copied CSS, Tailwind, hex in JSX, …>
    Proposed API (optional, reusable names only):

If an existing primitive already covers the use case, use that. Do not work
around a missing primitive, and do not invent a second control for the same job.
```
