# Roadmap

## Current focus

Native Accordion for FutMas: independent title navigation and disclosure,
controlled open state, theme-owned rounded grouping, accessible expanded
state, and metadata slot. Validate in the native example and linked FutMas.

FutMas native SegmentedControl contrast correction: selected accent/onAccent
fill and a 44-point minimum target, using existing tokens. Native tests pass;
linked iPhone visual review is next. See `docs/requests/futmas-segmented-control.md`.

Native `Field` shipped in the lockstep 0.5.0 release. The September 10 GitHub
release workflow completed successfully.

## Next action

Finish independent review and commit/push the native Accordion and segmented
selection changes. Native visual acceptance remains pending. A new explicitly
approved release is needed before FutMas can remove its development link for
these changes; 0.5.0 does not contain Accordion.

## Later

- GitLab Pages or a public URL for the gallery.
- Menu, AppShell, StatTile, other chart types when a filled request shows
  existing primitives cannot cover the use case.
- Native Select, Dialog, Split, or Toast if a product needs those on React Native.
- FutMas pins `@scalewing/react-native@0.5.0` and previews newer primitives through the Dragon Tails sibling checkout (`/Users/Neto/Projects/Dragon-Tails/scalewing`) using `pnpm scalewing:link`. Its current mobile palette is Ink; do not invent a second skin in the app.
- coach-platform token migration for generic primitives only.
- Point coach-platform agent files at `docs/CONSUMER_REQUESTS.md` when that app’s agent files exist. Do not keep a copy-paste request chat as the intake path.

## Inventory notes

- FutMas mobile: Expo 57, React 19.2, React Native 0.86. Admin web is planned Vite/React.
- coach-platform web: Astro 7 with React 19. Domain cards stay in that app.
- fantasy-football: web app at `/Users/Neto/Projects/Dragon-Tails/fantasy-football` using `@scalewing/react`.
