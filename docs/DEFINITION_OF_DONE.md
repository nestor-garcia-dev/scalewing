# Definition of done

A public API change is complete when:

- Behavior matches the accepted plan and this document.
- Token, class-catalog, and renderer tests that cover the change pass.
- `pnpm check` passes for cross-package work.
- Generated CSS still comes from `@scalewing/tokens` with no parallel hand-written sheet.
- Web examples import `@scalewing/react/styles.css` and do not vendor that CSS.
- Accessibility checks cover new interactive or text semantics.
- Types are exported and example apps typecheck.
- A changeset records the API impact.
- `docs/ARCHITECTURE.md` and nested `AGENTS.md` files match any boundary change.
- No credentials, npm tokens, or generated secrets are committed.

A conversation ending or files existing is not completion. Incomplete work records what ran, what remains, and the next action.

A release additionally requires:

- Packed tarballs contain only build output, declarations, CSS, license, README, and package metadata.
- Renderer runtime libraries remain peer dependencies.
- Publishing uses the explicit GitLab release job, not a merge hook.
