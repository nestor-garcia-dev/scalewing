# Repository instructions

## Hard Rules

**Do not optimize for the smallest patch. If a change would cause a module to accumulate another responsibility, refactor the surrounding structure as part of the change.**

1. Tokens and theme math belong in `@scalewing/tokens`. That package must stay pure, deterministic, and free of React, React Native, DOM APIs, and CSS-in-JS runtimes.
2. Keep renderer components thin. Map props to tokens, generated classes, or native styles. Do not invent hex values, font sizes, or spacing in JSX.
3. Do not add substantial logic to files approaching 250–300 lines without first considering a split. Treat responsibility count as the primary signal. Tests, generated CSS, declarative configuration, and cohesive token tables are not mechanical split targets.
4. Prefer named functions for token composition, class generation, contrast checks, and style mapping.
5. Keep side effects at package boundaries: writing `styles.css`, example apps, and publish scripts.
6. Do not introduce generic `utils.ts` / `helpers.ts` / `common.ts` dumping grounds.
7. Do not preserve poor structure merely to minimize diff size.
8. Do not use functional abstractions where ordinary control flow is clearer.
9. Do not share React Native components with `@scalewing/react`. Do not introduce React Native Web to fake one component tree.
10. Do not add Tailwind, NativeWind, MUI, React Native Paper, Tamagui, Gluestack, or another full CSS/component framework as the visual system.
11. Generate CSS from tokens. Do not hand-maintain a parallel class sheet.
12. New public tokens, classes, or component props are a versioned API. Additive changes need tests and docs. Removals need a changeset and a migration note.
13. Never commit credentials, npm tokens, `.env` files, or personal data.
14. Production dependencies require a written rationale in the changeset or PR description.
15. Use pnpm only. Do not bypass frozen lockfiles in CI.
16. If a task appears to require violating a hard rule, stop and ask rather than working around it.
17. Do not mark work done because files exist. Apply `docs/DEFINITION_OF_DONE.md`.
18. A new public component, utility family, or renderer is its own planned change. Do not dump a catalog in one implementation. Do not add a new public surface without a filled file in `docs/requests/`. One consumer is enough. Prefer reusing an existing surface over adding a parallel one. Public names stay generic; product copy stays in the consumer. When the same agent can write this checkout and a consumer (for example both under Dragon Tails), write the request file, then implement here following this file and `docs/DELIVERY_WORKFLOW.md`. Do not wait for a second Scalewing chat or an npm publish. Consumers verify with a local `link:` (never committed) before the pin bumps.

## Product

This repository is **Scalewing**, a design system for multiple products. It publishes:

- `@scalewing/tokens` — themes, scales, shared values
- `@scalewing/react` — DOM components, CSS generation, and the consumer stylesheet
- `@scalewing/react-native` — Expo / React Native components

Consuming apps own product copy, routing, domain components, brand overlays, and pictograms (Lucide for generic UI glyphs; custom SVG for brand marks). Scalewing owns primitives, generated layout CSS, and private control chrome. See `docs/adr/0008-icon-slots-and-lucide.md`.

Read `docs/ARCHITECTURE.md`, `docs/DELIVERY_WORKFLOW.md`, `docs/CONSUMER_REQUESTS.md`, and `docs/DEFINITION_OF_DONE.md` before changing public API, CSS ownership, or package boundaries.

The display name is Scalewing. Do not hardcode a different product name in package metadata, docs, or examples.

## Visual language

Quiet and glass-minimal, in the same family as Apple.com: system sans, generous space, large radius, hairline borders, frosted surfaces. No user-agent chrome (no blue underlined links, no Win32 controls).

- Surfaces use `theme.glass` or `colors.surface`. Light glass fill is white. Do not invent hex, extra shadows, gradients, or a blur-utility matrix.
- The generated document canvas on `[data-theme]` sets page background, type, links, and native text controls.
- Card defaults to `glass`. `outlined` and `elevated` are the exceptions.
- Native approximates glass with translucent fills. Do not add BlurView to get a literal Apple material.
- Respect `prefers-reduced-transparency` on web (already in the generated CSS).
- Generic UI glyphs are Lucide in the consumer, sized and colored from tokens. Do not publish an icon catalog.

## Coding Agent Guidelines

### Core Engineering Principles

Write code for long-term maintainability, not merely for the smallest patch.

Prefer clear module boundaries, small focused functions, explicit data flow, and testable logic.

Do not optimize for:

- minimum diff size
- avoiding refactors at all costs
- putting all logic near the call site
- eliminating every `if`, `switch`, or loop

Optimize for:

- clear ownership of responsibilities
- predictable dependencies
- testability
- readability
- low coupling
- small modules
- explicit design-system concepts

### Repository Boundaries

```text
apps/gallery ───────────┐
apps/native-example ────┼──> packages/react or packages/react-native
                        │
packages/react ─────────┤
packages/react-native ──┘
        │
        v
packages/tokens
```

`@scalewing/tokens` must not import `@scalewing/react`, `@scalewing/react-native`, React, React Native, or example apps.

`@scalewing/react` must not import `react-native`, Expo, or `@scalewing/react-native`.

`@scalewing/react-native` must not import `react-dom`, CSS files, or `@scalewing/react`.

Example apps must consume public package exports the way a real consumer would, including `import '@scalewing/react/styles.css'` on web. They must not copy Scalewing CSS into their own `src`. The gallery may import public `@scalewing/tokens` exports to document values. It must not define tokens.

#### packages/tokens

Responsible for spacing, color, type, radius, elevation, motion, theme objects, contrast checks, and `createTheme`. It contains no CSS, class names, or breakpoints.

#### packages/react

Responsible for the CSS generators, class catalog, and breakpoint token (`src/css`), DOM `ThemeProvider` (including `palette`), Box, Stack, Inline, Split, Card, Accordion, Dialog, Toast, Text, Button, Field, Select, Badge, SegmentedControl, Table, BarChart, AppHeader, Nav, and re-exporting the generated stylesheet as `@scalewing/react/styles.css` plus optional `@scalewing/react/palette/<id>.css`. `Box as="a"` is a layout link. Use Button for press actions. Badge is not a press control. Split is a start pane with a drag separator. Accordion is a native details disclosure in page flow. Dialog is a modal on the native top layer. Toast is an auto-dismiss confirmation on the popover layer and does not trap focus. Select is a labeled listbox menu. BarChart is a labeled horizontal magnitude chart.

#### packages/react-native

Responsible for native `ThemeProvider` (including `palette`) and the matching
layout primitives plus Button (`Pressable`), Field (`TextInput`), DateField,
TimeField, MultiSelect, TabBar, Table, and Accordion. Spacing uses token steps as props, not CSS class names.
Accordion has controlled disclosure with optional independent title navigation.
Select, Dialog, Split, and Toast are web-only.

#### apps/gallery and apps/native-example

Responsible for demonstrating public exports. `apps/gallery` is the web catalog and pre-publish QA surface. They are not a design-system source of truth. Gallery sample copy is animals and habitats, not a consumer product.

### Functional Core, Imperative Shell

Token composition, class catalogs, contrast ratios, and style mapping should be pure functions. Filesystem writes, React rendering, and publish steps stay at the edges.

### Function Design

Functions should normally have one clear responsibility. Extract when a block is a distinct concept, is repeated, mixes orchestration with calculation, or deserves independent tests.

### File Size and Module Discipline

Aim for most source files to remain below ~200 lines. Review files approaching ~250 lines for responsibility creep. Prefer domain-oriented names such as `spacing-classes.ts` or `create-theme.ts`.

### Abstraction Rules

Create abstractions for real concepts: themes, scales, class catalogs, style mappers, and renderer adapters. Avoid one-line wrappers with no semantic value.

### Side Effects

Keep side effects near system boundaries: writing generated CSS, example app bootstraps, and npm publish.

### Error Handling

Fail closed on invalid theme overrides: unknown color keys, empty color values, or incomplete required palettes. Do not silently drop required semantic colors.

### Testing

Prefer testing token and mapping logic without rendering when the behavior is pure. Renderer tests cover semantics, class/prop mapping, accessibility, and theme switching.

### Refactoring Expectations

When adding a token or component, inspect surrounding structure first. Do not preserve a hand-written CSS sheet to minimize diff size.

### Before Finishing a Change

Check:

- Is token math in `@scalewing/tokens`?
- Did CSS classes come from the generator?
- Did this change grow a file that should have been split?
- Are public API changes tested and documented?
- Could the core logic be tested without React Native or a browser?

## Nested agent rules

| Path                              | Purpose                         |
| --------------------------------- | ------------------------------- |
| `packages/tokens/AGENTS.md`       | Pure shared token values        |
| `packages/react/AGENTS.md`        | DOM renderer                    |
| `packages/react-native/AGENTS.md` | Native renderer                 |
| `apps/gallery/AGENTS.md`          | Web gallery; animal sample copy |
| `apps/native-example/AGENTS.md`   | Native consumer demo            |

**Precedence:** nested files must not contradict the root. On conflict, the root wins.

**Staleness:** changes to package boundaries require updating the affected `AGENTS.md` in the same MR.

## Working agreements

- Use `pnpm` and workspace packages.
- Keep packages separately publishable.
- React and React Native are peer dependencies of the renderer packages.
- Packages release independently with semantic versioning from `1.0.0`, one changeset per affected package and one per-package release tag (`tokens-v…`, `react-v…`, `react-native-v…`). A tokens changeset states additive or breaking and needs both renderer agents' sign-off. See `docs/adr/0009-independent-package-releases.md`.
- Every agent works in its own git worktree on its own branch and reaches `main` only through a reviewed pull request. The shared checkout at `/Users/neto/projects/scalewing` stays on a clean `main`: do not edit it or switch its branch. See `docs/CONTRIBUTING.md`, "Working in parallel".
- Do not auto-publish every merge. Releases use Changesets and an explicit GitHub Actions dispatch. See `docs/CONTRIBUTING.md`.
- Reserve and use the `@scalewing` npm scope. If the scope is unavailable, stop and choose a new name rather than silently renaming packages.

## Quality gates

Run focused package checks while developing:

- `pnpm --filter @scalewing/tokens test`
- `pnpm --filter @scalewing/react test`
- `pnpm --filter @scalewing/react-native test`

Run `pnpm check` before declaring a cross-package change complete. `pnpm check:package <tokens|react|react-native>` is the scoped gate used at release time.

## Code review rules

Before committing code, use an independent read-only Bar Raiser reviewer.
The project agent definition, including the reviewer model and reasoning effort,
is `.codex/agents/bar-raiser.toml`. When spawning directly, read both settings
from that file and pass only the review assignment, not the full chat. Do not
copy the model or effort into another instruction. If the configured model is
unavailable, ask before substituting one.
Review the exact staged diff against the owning consumer requests and these
rules. Resolve blockers and required changes, then re-review the staged result
before committing. Never let the implementing agent approve its own work.

- Flag React Native imports in `@scalewing/react`.
- Flag React DOM or CSS class APIs in `@scalewing/react-native`.
- Flag hand-written CSS that should have been generated.
- Flag consumer examples that copy Scalewing CSS into app source.
- Flag new production dependencies without a rationale.
- Flag production modules grown past ~300 lines with multiple responsibilities and no structural reason.
- Flag logging of tokens or credentials.
- Flag arbitrary-value utility classes (`sw-padding-top-13px`).
- Flag adding Tailwind or another utility framework.
- Flag a glass-utility matrix or a second visual skin beside the generated canvas.
