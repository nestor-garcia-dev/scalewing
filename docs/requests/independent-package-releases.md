Scalewing request from release tooling (all consumers).

Status: accepted by the product owner on 2026-09-21; implementing. All three packages start at 1.0.0.
Renderer: none (repository release tooling)
Missing surface: independent per-package versioning, tagging, validation, and publication for `@scalewing/tokens`, `@scalewing/react`, and `@scalewing/react-native`. This adds no public component or class.
Why existing tooling cannot do this: The `fixed` Changesets group, the single-tag assert script, and the three-package publish job force one shared version and one whole-repo gate. Parallel web and native work cannot release separately.
Existing surface this might already be: Changesets independent mode (the default without `fixed`) covers versioning only; tags, validation, and publication need changes here.
Workaround I almost used: releasing everything together and coordinating timing by hand.
Proposed design: see [ADR 0009](../adr/0009-independent-package-releases.md).

## Plan

One lane: release tooling. One task per checklist item, landed in order.

1. **Config and tokens range.** Remove `fixed` from `.changeset/config.json`. Move `react` and `react-native` to `workspace:^` for `tokens` and confirm from a packed manifest that the published range is a caret. Show with a dry run of `changeset version` that a react-only changeset leaves `react-native` unchanged and that a tokens-only changeset bumps both dependents. At `1.0.0` the compatibility rule is standard semver (see ADR 0009): additive token changes are minor releases that caret ranges span.
2. **Tag assert script.** Change `scripts/assert-release-tag.mjs` to parse `tokens-v`, `react-v`, and `react-native-v` tags, verify that package's manifest version, and reject unknown prefixes and legacy `vX.Y.Z` tags. Extend `assert-release-tag.test.mjs` with wrong-prefix, mismatched-version, prerelease, and unknown-package cases.
3. **Scoped check.** Add a `check:package` script that runs format and lint, then tests, builds, and typechecks for one package, everything it depends on, and its example app (`gallery` for react, `native-example` for react-native). For `tokens` it also runs its dependents' tests, builds, and both example apps. Full `pnpm check` stays on every pull request and `main` push.
4. **Publish workflow.** Make the `tag` input of `publish.yml` name one package (`tokens-v…`, `react-v…`, `react-native-v…`). Validate the tag against that package, run its scoped check, pack and publish only its tarball with provenance, and verify before publishing a renderer that its `@scalewing/tokens` dependency version exists on npm. Keep the file name, the `npm` environment, and the `NPM_PUBLISH_ENABLED` gate. Confirm a trusted-publisher entry exists for each of the three packages.
5. **Tag triggers.** Remove the `v*` tag trigger from `check.yml`; per-package tags do not trigger it, and the full check already runs on the `main` commit.
6. **Documentation.** Update `docs/CONTRIBUTING.md`, `docs/CONSUMER_REQUESTS.md` (state versions per package and drop hard-coded current versions), the root and nested `AGENTS.md` release notes, and `docs/ROADMAP.md`. Document one changeset per package, the additive-as-patch tokens policy, and the rule that a tokens changeset states additive or breaking and needs both renderer agents' sign-off.
7. **Stable 1.0.0.** A changeset marks all three packages major so the first release under this scheme is `1.0.0` for each. Release `tokens` first, then `react`, then `react-native`.
8. **First independent release.** Publish one package alone (validation run first, then publication) and record both workflow runs in this file. Confirm consumers of the other packages need no new pin.

## Acceptance

- A changeset naming only `@scalewing/react-native` versions only that package, and validation and publication touch only that package.
- A red web-only change on a branch does not block a native release cut from a `main` commit where it is absent, and full `pnpm check` still guards `main`.
- A renderer release fails before publishing when its tokens dependency is not on npm.
- A `changeset version` dry run with a tokens-only changeset bumps both renderers, and one naming a single renderer bumps only that renderer.
- Legacy `vX.Y.Z` tags are rejected by the assert script.
- Docs name a version per package, and no document claims the packages share a version.

## Non-goals

No repository split, no new public API, no change to trusted-publisher settings, and no change to how consumers import packages. A breaking tokens policy beyond the rule in ADR 0009 is out of scope. Moving web CSS generation and `breakpointScale` out of `tokens` is the deferred follow-up recorded in ADR 0009 and needs its own request.

## Open questions

- Resolved by FutMas review: the tokens release gate includes native tests and both example apps; additive token changes ship as patches while `0.x`; `tokens` stays `0.x` for now.
- Who reviews a tokens change that both agents consume?
- Should the deferred CSS extraction start immediately after the first independent release, or wait until tokens bumps cause real friction?

Note: the previously held web release (`Box` `hideBelow`/`hideFrom`, commit `3a3240e`) ships inside the 1.0.0 releases. FutMas bumps its `react-native` and `tokens` pins when 1.0.0 is published.
