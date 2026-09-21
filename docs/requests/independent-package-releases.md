Scalewing request from release tooling (all consumers).

Status: proposed; awaiting native and web agent review of ADR 0009.
Renderer: none (repository release tooling)
Missing surface: independent per-package versioning, tagging, validation, and publication for `@scalewing/tokens`, `@scalewing/react`, and `@scalewing/react-native`. This adds no public component or class.
Why existing tooling cannot do this: The `fixed` Changesets group, the single-tag assert script, and the three-package publish job force one shared version and one whole-repo gate. Parallel web and native work cannot release separately.
Existing surface this might already be: Changesets independent mode (the default without `fixed`) covers versioning only; tags, validation, and publication need changes here.
Workaround I almost used: releasing everything together and coordinating timing by hand.
Proposed design: see [ADR 0009](../adr/0009-independent-package-releases.md).

## Plan

One lane: release tooling. One task per checklist item, landed in order.

1. **Config and tokens range.** Remove `fixed` from `.changeset/config.json`. Decide and record how `react` and `react-native` depend on `tokens` (`workspace:^`, an explicit range, or a policy of additive token changes shipping as patches while `0.x`). Show with a dry run of `changeset version` that a react-only changeset leaves `react-native` unchanged and a tokens changeset bumps both dependents as intended.
2. **Tag assert script.** Change `scripts/assert-release-tag.mjs` to parse `tokens-v`, `react-v`, and `react-native-v` tags, verify that package's manifest version, and reject unknown prefixes and legacy `vX.Y.Z` tags. Extend `assert-release-tag.test.mjs` with wrong-prefix, mismatched-version, prerelease, and unknown-package cases.
3. **Scoped check.** Add a `check:package` script that runs format and lint, then tests, builds, and typechecks for one package, everything it depends on, and its example app (`gallery` for react, `native-example` for react-native). Full `pnpm check` stays on every pull request and `main` push.
4. **Publish workflow.** Add a `package` input to `publish.yml`. Validate the tag against that package, run its scoped check, pack and publish only its tarball with provenance, and verify before publishing a renderer that its `@scalewing/tokens` dependency version exists on npm. Keep the file name, the `npm` environment, and the `NPM_PUBLISH_ENABLED` gate.
5. **Documentation.** Update `docs/CONTRIBUTING.md`, `docs/CONSUMER_REQUESTS.md`, the root and nested `AGENTS.md` release notes, and `docs/ROADMAP.md`. Document one changeset per package and the additive-tokens policy.
6. **First independent release.** Publish one package alone (validation run first, then publication) and record both workflow runs in this file. Confirm consumers of the other packages need no new pin.

## Acceptance

- A changeset naming only `@scalewing/react-native` versions only that package, and validation and publication touch only that package.
- A red web-only change on a branch does not block a native release cut from a `main` commit where it is absent, and full `pnpm check` still guards `main`.
- A renderer release fails before publishing when its tokens dependency is not on npm.
- Legacy `vX.Y.Z` tags are rejected by the assert script and do not trigger the retired GitLab publisher.
- Docs name a version per package, and no document claims the packages share a version.

## Non-goals

No repository split, no new public API, no change to trusted-publisher settings, and no change to how consumers import packages. A breaking tokens policy beyond the rule in ADR 0009 is out of scope. Moving web CSS generation and `breakpointScale` out of `tokens` is the deferred follow-up recorded in ADR 0009 and needs its own request.

## Open questions for review

- Does the native example app or a native check need to run as part of the tokens release gate?
- Should `tokens` move to `1.0.0` to make caret ranges span additive changes, or should additive token changes ship as patches while `0.x`?
- Who reviews a tokens change that both agents consume?
- Should the deferred CSS extraction start immediately after the first independent release, or wait until tokens bumps cause real friction?
