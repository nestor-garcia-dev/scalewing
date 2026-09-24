# Consumer requests

Scalewing is a shared design system. Product apps consume `@scalewing/react` or `@scalewing/react-native`, each pinned to an exact published version (packages release independently, so versions differ; check npm for the latest). They do not fork the class sheet or invent a second visual system.

The Dragon Tails checkout is `/Users/Neto/Projects/Dragon-Tails/scalewing`. Product agents that can write that tree implement missing primitives here. They do not copy this file into a second chat and wait.

This document is the intake protocol. Product `AGENTS.md` and `.cursor/rules/scalewing.mdc` should point at this file. fantasy-football and FutMas already do. Point coach-platform at it when that app’s agent files exist.

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
  DateField,
  Field,
  MultiSelect,
  Progress,
  SingleSelect,
  Stack,
  Stepper,
  TabBar,
  Text,
  ThemeProvider,
  TimeField,
  WheelField,
} from '@scalewing/react-native';
```

Import the stylesheet once at the web entry. Do not copy it into application `src`. `sw-padding-top-4` is spacing step `4`, not `4px`. Native uses the same step as `paddingTop={4}`.

Products may pick a named palette (`<ThemeProvider palette="cerulean">`, `data-palette` on the canvas node, or `import '@scalewing/react/palette/cerulean.css'` after the stylesheet) or overlay brand colors with `ThemeProvider` / `createTheme` (`colors` may be a flat map or `{ light, dark }` so end users can switch scheme). Domain cards, routing, and copy stay in the app. Do not restyle links, inputs, or page background in app CSS; the generated canvas on `ThemeProvider` owns that.

Visual language: quiet canvas (system sans, large radius, white light `Card`, no blue underlined user-agent links).

## Product vs Scalewing

Do this in the product without a Scalewing change:

- Compose screens from `ThemeProvider`, `Box`, `Stack`, `Inline`, `Split`, `Card`, `Accordion`, `Dialog`, `Toast`, `Text`, `Button`, `Field` (web), `Select` (web), `Badge`, `SegmentedControl`, `Table`, `BarChart`, `AppHeader`, and `Nav` (web). Native also has `TabBar`, `DateField`, `TimeField`, `WheelField`, `Stepper`, `Progress`, `MultiSelect`, and `SingleSelect`.
- Pick a named palette with `ThemeProvider palette`, `data-palette`, or a generated palette CSS file.
- Keep product-only chrome in the app. `Box as="a"` is a layout link. Use `Button` for press actions.
- Do not add app CSS that restyles `a`, inputs, or the page canvas.
- Generic UI glyphs use Lucide in the product (`lucide-react` on web, `lucide-react-native` on Expo) through component slots. Size and color from tokens; `strokeWidth={1.75}` at spacing step `4` or `5`. Named imports on web; per-icon paths on native. Brand and domain marks stay custom SVG. See [ADR 0008](adr/0008-icon-slots-and-lucide.md). Do not add a second icon family, and do not request a Scalewing icon catalog.

Stop in the product and change Scalewing when you would otherwise:

- Add a new public component (Badge, and so on).
- Add a new `sw-*` class family, spacing step, or color utility.
- Copy Scalewing CSS into app source.
- Add Tailwind, NativeWind, MUI, React Native Paper, Tamagui, Gluestack, or another visual system.
- Invent hex values, font sizes, or spacing in JSX to paper over a missing primitive.
- Add a second visual skin (custom link CSS, gradients, extra blur utilities).

One product is enough to justify a primitive. Before adding a new surface, check whether an existing one already covers the use case. If it does, use that in the product. If it does not, implement the reusable primitive in this repository so later apps import it instead of inventing a parallel control.

## Same-workspace implementation

When the product and this checkout are both writable (Dragon Tails: FutMas, fantasy-football, and `scalewing` as siblings):

1. Confirm an existing primitive cannot do the job.
2. Write `docs/requests/<consumer>-<surface>.md` in this repository (durable intake; not a chat paste).
3. Plan one lane (`tokens`, `react`, or `react-native`) per `docs/DELIVERY_WORKFLOW.md`.
4. Implement here: tests, gallery or native-example coverage, changeset, agent-file updates.
5. In the product, run `pnpm scalewing:link` (or the product’s documented equivalent) and confirm the screen against the linked packages. Do not wait for npm.
6. After a published version exists, bump the product pin and `pnpm scalewing:unlink`. Never commit a `link:` or `file:` specifier.

Do not scrape product UIs to guess a catalog. Do not paste the filled template into a Scalewing-only chat. A separate Scalewing session is only needed when this checkout is not in the workspace.

## Request files

Intake is a markdown file in this repository, not a chat paste.

Path: `docs/requests/<consumer>-<surface>.md`

- Kebab-case. One public surface per file.
- `<consumer>` is the product id (`fantasy-football`, `futmas`) or `gallery` when the catalog itself is the requester. System-wide token work with no single product may be `<surface>.md` (`named-palettes.md`).
- `<surface>` is the **reusable primitive name** (`accordion`, `dialog`, `badge`). Do not name the file after product copy (`why-this-grade.md`).
- Proposed API uses that same generic name and generic props (`title`, `open`, `onOpenChange`). Domain copy stays in the product.

Write the file in this checkout. If you cannot write this repo, give the human the file to drop in `docs/requests/`. Do not paste the filled template into a chat.

## Linked development

A product may point `@scalewing/react`, `@scalewing/react-native`, and `@scalewing/tokens` at this checkout with local `link:` specifiers while a primitive is being built, instead of waiting for a publish. Default checkout path: `/Users/Neto/Projects/Dragon-Tails/scalewing` (override with `SCALEWING_PATH`).

- FutMas: `pnpm scalewing:link` / `pnpm scalewing:unlink`; `docs/adr/0013-linked-scalewing-development.md`.
- fantasy-football: `pnpm scalewing:link` / `pnpm scalewing:unlink`; `docs/adr/0006-linked-scalewing-development.md`.

Use pnpm `link:` (with the product’s install/symlink scripts). Do not use `npm link`; it fights pnpm’s hoisted `node_modules` and is not the supported path.

This does not change how Scalewing plans or ships work. The filled file in `docs/requests/` is still the intake, one lane per story still applies, and the gallery is still the pre-publish QA surface. Linking only removes the publish round trip between "component exists in this repo" and "a consumer can see it live." The committed product pin stays a registry version.

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
`https://github.com/nestor-garcia-dev/scalewing/blob/main/docs/CONSUMER_REQUESTS.md`.

- Web: `pnpm add @scalewing/react` and `import '@scalewing/react/styles.css'` once.
- Native: `pnpm add @scalewing/react-native`. No CSS class API.
- Compose from ThemeProvider, Box, Stack, Inline, Split, Card, Accordion, Dialog, Toast, Text, Button, Field, Select, Badge, SegmentedControl, Table, BarChart, AppHeader, and Nav (web). Named palettes use `palette` on ThemeProvider.
- `Box as="a"` is a layout link. Use `Button` for press actions.
- Visual language is quiet and glass-minimal. Do not restyle links, inputs, or the page canvas in app CSS.
- Generic UI glyphs: Lucide (`lucide-react` or `lucide-react-native`) in slots, token size/color, `strokeWidth={1.75}`. Custom SVG for brand marks. No second icon family. No Scalewing icon catalog (ADR 0008).
- Do not copy Scalewing CSS into `src`.
- Do not add Tailwind, NativeWind, MUI, or another visual system.
- Do not invent hex, font sizes, or spacing in JSX.

If an existing Scalewing primitive already covers the use case, use that.
If you need a new public component, class family, spacing step, or prop,
stop. Do not work around it. Write `docs/requests/<consumer>-<surface>.md`
in the Scalewing checkout (`/Users/Neto/Projects/Dragon-Tails/scalewing`)
and implement that surface there, one lane at a time. Verify in the product
with `pnpm scalewing:link`. Do not paste the filled template into a
Scalewing chat. Do not wait for npm. One product is enough. Other apps
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

- Depend on `@scalewing/react` (web) or `@scalewing/react-native` (native), pinned to an exact published version.
- Import `@scalewing/react/styles.css` once on web. Do not vendor that CSS.
- `sw-padding-top-4` is spacing step 4, not 4px. Native uses `paddingTop={4}`.
- Compose from ThemeProvider, Box, Stack, Inline, Split, Card, Accordion, Dialog, Toast, Text, Button, Field, Select, Badge, SegmentedControl, Table, BarChart, AppHeader, and Nav (web). Named palettes use `palette` on ThemeProvider.
- `Box as="a"` is a layout link. Use `Button` for press actions.
- Visual language is quiet and glass-minimal. Do not restyle links, inputs, or the page canvas in app CSS.
- Generic UI glyphs: Lucide in slots, token size/color, `strokeWidth={1.75}`. Custom SVG for brand marks. No second icon family (ADR 0008).
- Do not add Tailwind, NativeWind, MUI, or another visual system.
- Do not invent hex, font sizes, or spacing in JSX.

If a new public Scalewing surface is required, stop. Write
`docs/requests/<consumer>-<surface>.md` in `/Users/Neto/Projects/Dragon-Tails/scalewing`
and implement it there. Link the product locally; do not wait for npm.
Do not paste the filled template into a Scalewing chat.

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
