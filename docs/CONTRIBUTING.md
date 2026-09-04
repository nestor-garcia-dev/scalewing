# Contributing

Read `AGENTS.md` first. Nested `AGENTS.md` files apply inside their packages.

Then read:

- `docs/ARCHITECTURE.md`
- `docs/DELIVERY_WORKFLOW.md`
- `docs/DEFINITION_OF_DONE.md`
- `docs/ROADMAP.md`

Use pnpm. Run focused tests while iterating and `pnpm check` before a cross-package change.

Public API changes need a changeset. Do not publish from a laptop with a personal npm token unless the GitLab release job is unavailable and the user explicitly asked.

## Release

Workspace `exports` point at TypeScript source so example apps typecheck against the packages. `publishConfig.exports` remaps those entries to `dist` for npm. Packed tarballs must not include `src`.

1. Land the version you want on `main`. Package versions must match.
2. Add a GitLab CI/CD variable named `NPM_TOKEN`: an npm automation token that can publish to the `@scalewing` org. Mark it masked. Do not commit it.
3. Tag the commit as `v<version>`, for example `v0.1.0`, and push the tag.
4. Run the manual `publish` job on that tag pipeline.

The tag pipeline runs `check`, then waits for the manual `publish` job. `publish` refuses to run when `NPM_TOKEN` is empty or when the tag does not match the three package versions.
