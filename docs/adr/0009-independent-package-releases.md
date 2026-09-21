# ADR 0009: Independent package releases

- Status: proposed (needs review by the web and native agents before acceptance)
- Date: 2026-09-21

## Context

`@scalewing/tokens`, `@scalewing/react`, and `@scalewing/react-native` are released in lockstep today. Nothing records that as a decision; it is the result of three mechanisms:

- `.changeset/config.json` lists all three packages in one `fixed` group, so any changeset bumps all three to the same version.
- `scripts/assert-release-tag.mjs` requires every public package version to equal one `vX.Y.Z` tag.
- `.github/workflows/publish.yml` validates that tag, runs the whole-repo `pnpm check`, then packs and publishes all three tarballs.

Web and native work now proceed in parallel, owned by different agents. Under lockstep:

- A failing web change on `main` blocks a native release, because the release gate is the whole-repo `pnpm check`.
- Every release bumps every package, including packages with no changes. A native-only fix produces a new `@scalewing/react` version that consumers must evaluate and pin.
- Both agents must agree on release timing, and merged but unfinished work in one renderer ships with the other.

`react` and `react-native` both depend on `@scalewing/tokens` through `workspace:*`, so a shared token change reaches both renderers regardless of how they are versioned.

## Decision

Release each public package independently from this repository. Do not split the repository.

1. **Versioning.** Remove the `fixed` group. Each package bumps only when a changeset names it or when a workspace dependency it consumes is released.
2. **Tags.** Use per-package tags: `tokens-vX.Y.Z`, `react-vX.Y.Z`, and `react-native-vX.Y.Z`. The tag names exactly one package, and that package's manifest version must equal the tag.
3. **Workflow.** Keep one workflow file named `publish.yml` so the npm trusted-publisher configuration for each package stays valid. Replace the whole-set input with a `package` input plus the tag. The validate and publish jobs handle only that package.
4. **Gates.** Every merge to `main` and every pull request still runs the full `pnpm check`. A release additionally runs a scoped check: the package, everything it depends on, and its example app.
5. **Order.** A renderer release requires that the `@scalewing/tokens` version it depends on already exists on npm. The workflow verifies this before publishing.
6. **Tokens compatibility.** Consumers of `tokens` are the renderers. A tokens change is additive unless the release explicitly coordinates a breaking change with every renderer. This is a policy for the agents, enforced by review, not by tooling.
7. **Consumer pins.** Products pin each `@scalewing/*` package separately. A native-only release changes no web pin.

## Alternatives considered

- **Keep lockstep.** Simplest, and one version number describes the whole system. Rejected because it couples unrelated work and creates versions with no changes, which is the problem this ADR addresses.
- **Split into separate repositories.** Rejected. `tokens` is the piece both renderers share most tightly, and a repository boundary there adds a publish-then-consume round trip to every token change.
- **Independent versions with no dependency rule.** Rejected. Without an ordering and compatibility rule, a renderer can publish against a tokens version that does not exist or that it does not support.

- **Separate native and web token packages.** Rejected. Palettes, colors, spacing, typography, radius, and glass would exist twice and could drift, which is how products end up looking different by author. Shared values stay in one package.

## Deferred follow-up: move web CSS generation out of tokens

`@scalewing/tokens` mixes platform-neutral values (colors, palettes, spacing, typography, radius, motion, glass, elevation, themes) with web-only CSS generation (the `css-*.ts` files, `stylesheet.ts`, and `scripts/write-css.js`). Native reads only the values. Every web CSS change therefore bumps `tokens`, and every renderer that depends on it.

Move the CSS generation, the class catalog, and `breakpointScale` into `@scalewing/react`, which already copies the generated `styles.css` into its own package. Tokens then changes only when a shared value changes, which is when both platforms need it. Do not create a fourth package unless a second web renderer needs the generator.

Consumers already import `@scalewing/react/styles.css`, so their import path does not change. The `@scalewing/tokens/styles.css` and `@scalewing/tokens/palette/*.css` exports, the gallery, the react build script, and the stylesheet tests move or update. Land this as its own coordinated story after independent releases work; independent versioning alone lets native ship without web, and the extraction only reduces how often tokens bumps.

## Consequences

- Version numbers stop matching across packages. Documentation that lists one Scalewing version (for example `docs/CONSUMER_REQUESTS.md`) names a version per package.
- While packages are `0.x`, a caret range on `tokens` does not span minor versions. A tokens minor release would force renderer releases even for additive changes. The story below must resolve this by choosing between shipping additive token changes as patches while `0.x`, using an explicit range, or moving `tokens` to `1.0.0`.
- The release process gains a package selector and a tokens-availability check, so `assert-release-tag.mjs` and its tests change.
- The legacy `.gitlab-ci.yml` release job keys off `v*` tags. New per-package tags do not trigger it, so the retired publisher cannot release by accident. Retire it in the same story if it has not been retired already.
- Trusted-publisher settings stay valid because the workflow filename and `npm` environment do not change.
- Contributors and agents add one changeset per affected package and describe the API impact for that package.

## Follow-up

The implementation is planned in `docs/requests/independent-package-releases.md`. The native agent should review both documents before the story starts, because the native example app, its checks, and its release cadence are affected.
