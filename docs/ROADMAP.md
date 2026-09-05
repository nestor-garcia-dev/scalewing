# Roadmap

## Current focus

0.3.0 is versioned: Accordion, Dialog, Split, Select, Toast, dashboard
surfaces, and named palettes.

## Next action

Tag `v0.3.0` and run the GitLab publish job. Then pin consumers to
`@scalewing/react@0.3.0` and drop local `link:` specifiers.

## Later

- GitLab Pages or a public URL for the gallery.
- Menu, AppShell, StatTile, other chart types when a filled request shows
  existing primitives cannot cover the use case.
- Native Field, Select, Dialog, Accordion, Split, or Toast if a product needs those on React Native.
- FutMas ADR and mobile integration. Pin old teal via ThemeProvider until that restyle.
- coach-platform token migration for generic primitives only.
- Paste Scalewing consumer agent blocks into coach-platform when that app’s agent files exist.

## Inventory notes

- FutMas mobile: Expo 57, React 19.2, React Native 0.86. Admin web is planned Vite/React.
- coach-platform web: Astro 7 with React 19. Domain cards stay in that app.
- fantasy-football: web app at `/Users/Neto/Projects/Dragon Tails/fantasy-football` using `@scalewing/react`.
