# Contributing

Read `AGENTS.md` first. Nested `AGENTS.md` files apply inside their packages.

Then read:

- `docs/ARCHITECTURE.md`
- `docs/DELIVERY_WORKFLOW.md`
- `docs/CONSUMER_REQUESTS.md`
- `docs/DEFINITION_OF_DONE.md`
- `docs/ROADMAP.md`

Use pnpm. Run focused tests while iterating and `pnpm check` before a cross-package change. The web catalog is `apps/gallery`. `pnpm dev:web` builds tokens and `@scalewing/react` first so `styles.css` is current, then starts the gallery.

Public API changes need a changeset. Do not store an npm write token in GitLab. Later releases publish with OIDC trusted publishing on GitLab.com shared runners.

Product agents request missing primitives by writing `docs/requests/<consumer>-<surface>.md` (template in `docs/CONSUMER_REQUESTS.md`). Do not paste the filled template into a Scalewing chat. One consumer is enough. Do not add a new public component, class family, or renderer because a product UI looks like it might need one, and do not add a parallel control when an existing surface already covers the use case. Ship a reusable name so later apps can import the same primitive.

## First publish

npm cannot attach a trusted publisher until the package exists. Publish `0.1.0` once from a laptop, then let CI own every later version.

```sh
pnpm check
npm login
pnpm publish -r --access public --no-git-checks
```

That publishes `@scalewing/tokens`, `@scalewing/react`, and `@scalewing/react-native`. The gallery and native example stay private. Confirm with `npm view @scalewing/react version`.

Then on each package at npmjs.com: **Settings → Trusted Publisher → GitLab CI/CD**:

| Field             | Value            |
| ----------------- | ---------------- |
| Namespace         | `dna-consulting` |
| Project name      | `scalewing`      |
| Top-level CI file | `.gitlab-ci.yml` |

Allow **npm publish**, not only staged publish. After a later OIDC release succeeds, set **Require 2FA and disallow tokens**.

## Later releases

Workspace `exports` point at TypeScript source so example apps typecheck against the packages. `publishConfig.exports` remaps those entries to `dist` for npm. Packed tarballs must not include `src`.

1. Land the version you want on `main`. Package versions must match.
2. Tag the commit as `v<version>`, for example `v0.1.1`, and push the tag.
3. Run the manual `publish` job on that tag pipeline. It must run on GitLab.com shared runners, not a self-hosted runner.

The tag pipeline runs `check`, then waits for the manual `publish` job. `publish` refuses to run when `NPM_ID_TOKEN` is empty or when the tag does not match the three package versions. Do not tag `v0.1.0` after the laptop publish; that version is already on npm.
