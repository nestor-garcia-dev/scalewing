# Roadmap

## Current focus

Native `Field` is implemented and versioned for the lockstep 0.5.0 release.

## Next action

Create and validate the immutable `v0.5.0` release tag, then publish all three
public packages through the explicit GitHub workflow. FutMas can then pin
`@scalewing/react-native@0.5.0` and drop its local development link.

## Later

- GitLab Pages or a public URL for the gallery.
- Menu, AppShell, StatTile, other chart types when a filled request shows
  existing primitives cannot cover the use case.
- Native Select, Dialog, Accordion, Split, or Toast if a product needs those on React Native.
- FutMas consumes `@scalewing/react-native@0.5.0` after release from the Dragon Tails sibling checkout (`/Users/Neto/Projects/Dragon-Tails/scalewing`). New primitives are implemented here, then verified with FutMas `pnpm scalewing:link`. Named-palette choice for FutMas remains open; do not invent a second skin in the app.
- coach-platform token migration for generic primitives only.
- Point coach-platform agent files at `docs/CONSUMER_REQUESTS.md` when that app’s agent files exist. Do not keep a copy-paste request chat as the intake path.

## Inventory notes

- FutMas mobile: Expo 57, React 19.2, React Native 0.86. Admin web is planned Vite/React.
- coach-platform web: Astro 7 with React 19. Domain cards stay in that app.
- fantasy-football: web app at `/Users/Neto/Projects/Dragon-Tails/fantasy-football` using `@scalewing/react`.
