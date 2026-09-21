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

Existing package names and versions are preserved during repository migration. New versions are a separate release task. A new package's first publication may require a one-time local publish before attaching trusted publishing; do not republish existing versions.

## Explicit release

1. Apply the intended changesets and commit matching versions for all three public packages on `main`.
2. Create an immutable `v<version>` tag on that commit and push it to GitHub. Use a commit containing the GitHub workflow and `.nvmrc`; historical pre-migration tags do not include that setup.
3. Run **Release packages** from `main`, enter the tag, and leave **publish** unchecked for validation only.
4. For an intended npm release, dispatch again with **publish** checked after the trusted publisher is configured.

Validation checks tag format, membership in main's history, all three package versions, and `pnpm check`. Publication uses the exact commit that passed validation, requires the enablement variable and the `npm` environment, and is dispatched from main only. A single concurrency group prevents overlapping GitHub releases.

Packages are packed using pnpm so `publishConfig.exports` maps source entries to distribution files. Only the three public package tarballs are published using npm OIDC and provenance. Gallery and native-example applications are never published. Inspect tarballs before release: build output, declarations, CSS, license, README, changelog, and metadata only; no source or credentials.

If publication partially succeeds, inspect npm versions before retrying. Do not overwrite a released version or force-move its tag.
