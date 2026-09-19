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

Teisoro F-002-S05: ActionMenu task 500 is reviewed and committed as `fad8f45`.
Switch task 510 is reviewed and committed as `6dac120`. DateField task 520 is
reviewed and committed as `1d69e34`. Checkbox task 530 is reviewed and committed
as `9e47362`. RadioGroup task 540 is reviewed and committed as `b0ce196`.
Spinner task 550 is reviewed and committed as `39a85a4`. Progress task 560 is
reviewed and committed as `de943eb`. Tooltip task 570 is reviewed and committed as `b718519`; Separator task 580 is in progress. Publish the
coordinated primitive set only in task 610 after each surface passes consumer
verification.

Version 0.6.0 is published for all three packages from tag `v0.6.0` (commit
`7a7800d`). Independent review, full local checks (113 tests), packed-artifact
inspection, and GitHub validation/publication passed. Release runs:
[validation](https://github.com/nestor-garcia-dev/scalewing/actions/runs/34649301270)
and [publication](https://github.com/nestor-garcia-dev/scalewing/actions/runs/34649467077).

Finish FutMas's registry-pin integration and native visual acceptance. No new
public surface is authorized by this release.

## Later

- GitLab Pages or a public URL for the gallery.
- Menu, AppShell, StatTile, other chart types when a filled request shows
  existing primitives cannot cover the use case.
- Native Select, Dialog, Split, or Toast if a product needs those on React Native.
- FutMas is upgrading to `@scalewing/react-native@0.6.0`; future unpublished primitives can be previewed through the Dragon Tails sibling checkout (`/Users/Neto/Projects/Dragon-Tails/scalewing`) using `pnpm scalewing:link`. Its current mobile palette is Ink; do not invent a second skin in the app.
- coach-platform token migration for generic primitives only.
- Point coach-platform agent files at `docs/CONSUMER_REQUESTS.md` when that app’s agent files exist. Do not keep a copy-paste request chat as the intake path.

## Inventory notes

- FutMas mobile: Expo 57, React 19.2, React Native 0.86. Admin web is planned Vite/React.
- coach-platform web: Astro 7 with React 19. Domain cards stay in that app.
- fantasy-football: web app at `/Users/Neto/Projects/Dragon-Tails/fantasy-football` using `@scalewing/react`.
