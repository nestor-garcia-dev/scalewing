# Definition of done

A public API change is complete when:

- Behavior matches the accepted plan and this document.
- Token, class-catalog, and renderer tests that cover the change pass.
- `pnpm check` passes for cross-package work.
- Generated CSS still comes from the tokens through `@scalewing/react`'s generator with no parallel hand-written sheet.
- Web examples import `@scalewing/react/styles.css` and do not vendor that CSS.
- New or changed public web tokens, classes, variants, or components are demonstrated in `apps/gallery` with their meaningful states (a catalog section in the same change).
- Public component and prop names are reusable across products. The requesting app’s domain copy is not the API.
- Accessibility checks cover new interactive or text semantics.
- Types are exported and the gallery plus native example typecheck.
- A changeset records the API impact.
- `docs/ARCHITECTURE.md` and nested `AGENTS.md` files match any boundary change.
- No credentials, npm tokens, or generated secrets are committed.

A conversation ending or files existing is not completion. Incomplete work records what ran, what remains, and the next action.

A release additionally requires:

- Packed tarballs contain only build output, declarations, CSS, license, README, and package metadata.
- Renderer runtime libraries remain peer dependencies.
- One package is released per tag (`tokens-v…`, `react-v…`, `react-native-v…`); packed tarballs are checked for that package only.
- Publishing uses the explicit GitHub Actions release workflow, not a merge hook. The first version of a new package may be published once from a laptop so a trusted publisher can be attached.
