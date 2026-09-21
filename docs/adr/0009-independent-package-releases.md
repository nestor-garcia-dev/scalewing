# ADR 0009: Independent package releases

- Status: accepted by the product owner on 2026-09-21, with the FutMas (native consumer) review applied. All three packages start stable versioning at 1.0.0.
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
3. **Workflow.** Keep one workflow file named `publish.yml` so the npm trusted-publisher configuration for each package stays valid. The single `tag` input names the package, so no separate package input can disagree with it. The validate and publish jobs handle only that package.
4. **Gates.** Every merge to `main` and every pull request runs the full `pnpm check`. A release additionally runs a scoped check (`pnpm check:package <tokens|react|react-native>`): format, lint, the release tooling tests, then tests, builds, and typechecks for the package, everything it depends on, and everything that depends on it. For a renderer that includes its example app; for `tokens` it includes both renderers and both example apps. `check.yml` does not run on tags, because every release commit is already on `main` where the full check ran.
5. **Order.** A renderer release requires that the `@scalewing/tokens` version it depends on already exists on npm. The workflow verifies this before publishing.
6. **Tokens compatibility.** All three packages start at `1.0.0` and follow standard semantic versioning. Renderers keep a caret dependency on `tokens` (`workspace:^`, published as `^1.x.y`, verified from a packed manifest), so an **additive** token change is a minor release that renderers pick up without a release of their own. A **breaking** token change (rename, removal, or value change) is a major release plus coordinated renderer releases in the same window. Every tokens changeset states whether it is additive or breaking, and both renderer agents sign off on it in the pull request. This is policy enforced by review, not tooling.
7. **Consumer pins.** Products pin each `@scalewing/*` package separately. A native-only release changes no web pin. A product that depends on a renderer and on `tokens` directly must pin a `tokens` version that satisfies the renderer's caret range, so the install has one `tokens` copy (two copies break `ThemeProvider` and palettes; FutMas ADR 0013).

## Alternatives considered

- **Keep lockstep.** Simplest, and one version number describes the whole system. Rejected because it couples unrelated work and creates versions with no changes, which is the problem this ADR addresses.
- **Split into separate repositories.** Rejected. `tokens` is the piece both renderers share most tightly, and a repository boundary there adds a publish-then-consume round trip to every token change.
- **Independent versions with no dependency rule.** Rejected. Without an ordering and compatibility rule, a renderer can publish against a tokens version that does not exist or that it does not support.

- **Separate native and web token packages.** Rejected. Palettes, colors, spacing, typography, radius, and glass would exist twice and could drift, which is how products end up looking different by author. Shared values stay in one package.

## Follow-up: web CSS generation moves out of tokens

Done before the `1.0.0` release, so removing the CSS exports needed no tokens major. See [ADR 0010](0010-web-css-in-react.md).

## Consequences

- Version numbers stop matching across packages. Documentation that lists one Scalewing version (for example `docs/CONSUMER_REQUESTS.md`) names a version per package.
- Starting at `1.0.0` makes the public API a stable contract: removing or renaming an export, class, token, or prop is a major release. The `0.x` behavior, where a caret range does not span minor versions, no longer applies.
- The release process gains a package selector and a tokens-availability check, so `assert-release-tag.mjs` and its tests change.
- `check.yml` runs on `v*` tags only. Per-package tags will not trigger it; see decision 4.
- Consumers must add one `minimumReleaseAgeExclude` entry per package version they adopt (FutMas and Teisoro both list exact versions). `pnpm scalewing:link`-style linking is unaffected because it does not read versions or tags.
- Confirm an npm trusted-publisher entry exists for each of the three packages, since publishes become separate runs. The global `scalewing-npm-release` concurrency group already serializes runs and helps the tokens-then-renderer order.
- Trusted-publisher settings stay valid because the workflow filename and `npm` environment do not change.
- Contributors and agents add one changeset per affected package and describe the API impact for that package.

## Follow-up

The implementation is planned in `docs/requests/independent-package-releases.md`. The native agent should review both documents before the story starts, because the native example app, its checks, and its release cadence are affected.
