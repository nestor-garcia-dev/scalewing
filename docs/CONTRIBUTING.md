# Contributing

Read `AGENTS.md` first. Nested `AGENTS.md` files apply inside their packages.

Then read:

- `docs/ARCHITECTURE.md`
- `docs/DELIVERY_WORKFLOW.md`
- `docs/CONSUMER_REQUESTS.md`
- `docs/DEFINITION_OF_DONE.md`
- `docs/ROADMAP.md`

Use pnpm. Run focused tests while iterating and `pnpm check` before a cross-package change. The web catalog is `apps/gallery`. `pnpm dev:web` builds tokens and `@scalewing/react` first so `styles.css` is current, then starts the gallery.

Use Node 22.23.2 (`nvm use`) and pnpm 11.19.0. Install with `pnpm install --frozen-lockfile`. Public API changes need a changeset. Never store an npm write token in either CI system. GitHub Actions runs checks on pull requests, main, and version tags; publication is an explicit dispatch.

When a product needs a missing primitive, write `docs/requests/<consumer>-<surface>.md` (template in `docs/CONSUMER_REQUESTS.md`) and implement it in this repository, one lane at a time. Do not paste the filled template into a separate Scalewing chat. Consumers verify with a local `link:` (see `docs/CONSUMER_REQUESTS.md`) instead of waiting on npm. One consumer is enough. Do not add a new public component, class family, or renderer because a product UI looks like it might need one, and do not add a parallel control when an existing surface already covers the use case. Ship a reusable name so later apps can import the same primitive.

## npm trusted publisher setup

For each existing package (`@scalewing/tokens`, `@scalewing/react`, `@scalewing/react-native`), configure a GitHub Actions trusted publisher in npm package settings:

| Field                | Value               |
| -------------------- | ------------------- |
| Organization or user | `nestor-garcia-dev` |
| Repository           | `scalewing`         |
| Workflow filename    | `publish.yml`       |
| Environment          | `npm`               |

Allow direct `npm publish`. Create the GitHub environment `npm` and restrict deployment to the `main` branch: the workflow is dispatched from main and checks out the requested release tag. Only after this setup is verified, set repository Actions variable `NPM_PUBLISH_ENABLED` to `true`.

A new package's first publication may require a one-time local publish before attaching trusted publishing; do not republish existing versions.

## Versioning

Scalewing packages follow semantic versioning from `1.0.0` and release independently: `@scalewing/tokens`, `@scalewing/react`, and `@scalewing/react-native` each have their own version, changelog, and release tag. Add one changeset per affected package. A tokens changeset states whether the change is additive (minor) or breaking (major) and needs sign-off from both renderer agents; a breaking tokens release is coordinated with renderer releases. See [ADR 0009](adr/0009-independent-package-releases.md).

Run the scoped release gate locally with `pnpm check:package tokens`, `pnpm check:package react`, or `pnpm check:package react-native`.

## Explicit release

1. Apply the intended changesets with `pnpm changeset version` and commit the result on `main`.
2. Create an immutable per-package tag on that commit and push it to GitHub: `tokens-v<version>`, `react-v<version>`, or `react-native-v<version>`. A tag names one package, and that package's manifest version must equal it. Release `tokens` before a renderer that needs its new version.
3. Run **Release packages** from `main`, enter the tag, and leave **publish** unchecked for validation only.
4. For an intended npm release, dispatch again with **publish** checked after the trusted publisher is configured.

Validation checks the tag format and package, membership in main's history, that package's version, that a renderer's `@scalewing/tokens` version is already on npm, and `pnpm check:package` for that package. Publication uses the exact commit that passed validation, requires the enablement variable and the `npm` environment, and is dispatched from main only. A single concurrency group prevents overlapping GitHub releases.

Packages are packed using pnpm so `publishConfig.exports` maps source entries to distribution files. Only the tarball for the tagged public package is published, using npm OIDC and provenance. Gallery and native-example applications are never published. Inspect tarballs before release: build output, declarations, CSS, license, README, changelog, and metadata only; no source or credentials.

If publication partially succeeds, inspect npm versions before retrying. Do not overwrite a released version or force-move its tag.
