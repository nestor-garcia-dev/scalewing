# Roadmap

## Current focus

0.4.0 is versioned: native TabBar, Table, SegmentedControl, GitHub package
metadata, and lockstep public versions.

## Next action

Tag `v0.4.0` and run GitHub **Release packages** from `main`. Dry-run first,
then publish after the npm trusted publisher, `npm` environment, and
`NPM_PUBLISH_ENABLED` are set. Pin consumers to `@scalewing/react@0.4.0` /
`@scalewing/react-native@0.4.0` and drop local `link:` specifiers.

## Later

- GitLab Pages or a public URL for the gallery.
- Menu, AppShell, StatTile, other chart types when a filled request shows
  existing primitives cannot cover the use case.
- Native Field, Select, Dialog, Accordion, Split, or Toast if a product needs those on React Native.
- FutMas consumes `@scalewing/react-native@0.4.0` from the Dragon Tails sibling checkout (`/Users/Neto/Projects/Dragon-Tails/scalewing`). New primitives are implemented here, then verified with FutMas `pnpm scalewing:link`. Named-palette choice for FutMas remains open; do not invent a second skin in the app.
- coach-platform token migration for generic primitives only.
- Point coach-platform agent files at `docs/CONSUMER_REQUESTS.md` when that app’s agent files exist. Do not keep a copy-paste request chat as the intake path.

## Inventory notes

- FutMas mobile: Expo 57, React 19.2, React Native 0.86. Admin web is planned Vite/React.
- coach-platform web: Astro 7 with React 19. Domain cards stay in that app.
- fantasy-football: web app at `/Users/Neto/Projects/Dragon-Tails/fantasy-football` using `@scalewing/react`.
