# Roadmap

## Current focus

Local gallery in `apps/gallery` as the web catalog and pre-publish QA surface.

## Next action

Run `pnpm dev:web` and `pnpm build:gallery` to review unpublished web primitives. The next library code story is the next valid filled request. After a later tag, bump fantasy-football and FutMas if they still consume an older npm version.

## Later

- GitLab Pages or a public URL for the gallery.
- Badge when a filled request shows existing primitives cannot cover the use case.
- Native Field if a product needs a labeled control on React Native.
- FutMas ADR and mobile integration.
- coach-platform token migration for generic primitives only.
- Paste Scalewing consumer agent blocks into coach-platform when that app’s agent files exist.

## Inventory notes

- FutMas mobile: Expo 57, React 19.2, React Native 0.86. Admin web is planned Vite/React.
- coach-platform web: Astro 7 with React 19. Domain cards stay in that app.
- fantasy-football: web app at `/Users/Neto/Projects/Dragon Tails/fantasy-football` using `@scalewing/react`.
