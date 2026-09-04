# Consumer requests

Scalewing is a shared design system. Product apps consume `@scalewing/react@0.2.0` or `@scalewing/react-native@0.2.0`. They do not fork the class sheet or invent a second visual system.

This document is the intake protocol. Copy the paste-ready blocks into a product `AGENTS.md` and `.cursor/rules/scalewing.mdc`. fantasy-football and FutMas already have them. Paste into coach-platform when that app’s agent files exist.

## Consume

Web:

```ts
import '@scalewing/react/styles.css';
import {
  Box,
  Button,
  Card,
  Field,
  Stack,
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

Products may overlay brand colors with `ThemeProvider` / `createTheme` on existing semantic keys. Domain cards, routing, and copy stay in the app. Do not restyle links, inputs, or page background in app CSS; the generated canvas on `ThemeProvider` owns that.

Visual language: quiet and glass-minimal (system sans, large radius, frosted `Card`, no blue underlined user-agent links).

## Stop and ask

Do this in the product without a Scalewing change:

- Compose screens from `ThemeProvider`, `Box`, `Stack`, `Inline`, `Card`, `Text`, `Button`, and `Field` (web).
- Keep product-only chrome in the app. `Box as="a"` is a layout link. Use `Button` for press actions.
- Do not add app CSS that restyles `a`, inputs, or the page canvas.

Stop and emit the request prompt before:

- A new public component (Badge, and so on).
- A new `sw-*` class family, spacing step, or color utility.
- Copying Scalewing CSS into app source.
- Adding Tailwind, NativeWind, MUI, React Native Paper, Tamagui, Gluestack, or another visual system.
- Inventing hex values, font sizes, or spacing in JSX to paper over a missing primitive.
- A second visual skin (custom link CSS, gradients, extra blur utilities).

One product is enough to request a primitive. Before adding a new surface, check whether an existing one already covers the use case. If it does, tell the product to use that. If it does not, ship the new primitive so later apps reuse it instead of inventing a parallel control.

A Scalewing agent treats a filled request as discovery, then plans one lane (`tokens`, `react`, or `react-native`) per `docs/DELIVERY_WORKFLOW.md`. Do not scrape product UIs to guess a catalog.

## Linked development

A product may point its `@scalewing/react` (or `@scalewing/tokens`) dependency at this checkout with a local `link:` specifier while a requested primitive is being built, instead of waiting for a publish. fantasy-football does this with `pnpm scalewing:link` / `pnpm scalewing:unlink`; see its `docs/adr/0006-linked-scalewing-development.md` for the exact mechanics and the pnpm/webpack quirks it works around.

This does not change how Scalewing plans or ships work. The filled request above is still the intake, one lane per story still applies, and the gallery is still the pre-publish QA surface. Linking only removes the publish round trip between "component exists in this repo" and "a consumer can see it live."

## Request prompt

Product agents stop and paste this, filled in, to the human or a Scalewing chat:

```text
Scalewing request from <product>.

Renderer: react | react-native
Missing surface: one component, one utility family, or one prop on an existing primitive
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Existing surface this might already be: <none | Button | …>
Workaround I almost used: <raw button, copied CSS, Tailwind, hex in JSX, …>
Proposed API (optional):
```

## Paste-ready product AGENTS.md section

```markdown
## Scalewing

This product uses Scalewing for layout primitives and generated CSS. Read
`https://gitlab.com/dna-consulting/scalewing/-/blob/main/docs/CONSUMER_REQUESTS.md`.

- Web: `pnpm add @scalewing/react@0.2.0` and `import '@scalewing/react/styles.css'` once.
- Native: `pnpm add @scalewing/react-native@0.2.0`. No CSS class API.
- Compose from ThemeProvider, Box, Stack, Inline, Card, Text, Button, and Field (web).
- `Box as="a"` is a layout link. Use `Button` for press actions.
- Visual language is quiet and glass-minimal. Do not restyle links, inputs, or the page canvas in app CSS.
- Do not copy Scalewing CSS into `src`.
- Do not add Tailwind, NativeWind, MUI, or another visual system.
- Do not invent hex, font sizes, or spacing in JSX.

If an existing Scalewing primitive already covers the use case, use that.
If you need a new public component, class family, spacing step, or prop,
stop. Do not work around it. Fill in the request prompt from
`docs/CONSUMER_REQUESTS.md` in the Scalewing repository and give it to the
human. One product is enough to request a primitive. Other apps reuse it.
```

## Paste-ready product `.cursor/rules/scalewing.mdc`

Use a four-backtick fence when copying if your editor nests poorly. The file contents are:

```
---
description: Consume Scalewing. Stop and request missing primitives.
alwaysApply: true
---

# Scalewing

- Depend on `@scalewing/react@0.2.0` (web) or `@scalewing/react-native@0.2.0` (native).
- Import `@scalewing/react/styles.css` once on web. Do not vendor that CSS.
- `sw-padding-top-4` is spacing step 4, not 4px. Native uses `paddingTop={4}`.
- Compose from ThemeProvider, Box, Stack, Inline, Card, Text, Button, and Field (web).
- `Box as="a"` is a layout link. Use `Button` for press actions.
- Visual language is quiet and glass-minimal. Do not restyle links, inputs, or the page canvas in app CSS.
- Do not add Tailwind, NativeWind, MUI, or another visual system.
- Do not invent hex, font sizes, or spacing in JSX.

If a new public Scalewing surface is required, stop and emit this prompt filled in:

    Scalewing request from <product>.

    Renderer: react | react-native
    Missing surface: one component, one utility family, or one prop on an existing primitive
    Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
    Existing surface this might already be: <none | Button | …>
    Workaround I almost used: <raw button, copied CSS, Tailwind, hex in JSX, …>
    Proposed API (optional):

If an existing primitive already covers the use case, use that. Do not work
around a missing primitive, and do not invent a second control for the same job.
```
