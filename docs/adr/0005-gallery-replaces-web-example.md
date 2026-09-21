# ADR 0005: Gallery replaces web-example

- Status: accepted
- Date: 2026-09-04

## Decision

Replace `apps/web-example` with `apps/gallery`, a private Vite app that consumes public `@scalewing/react` and `@scalewing/tokens` exports. It is the local documentation catalog and the required pre-publish QA surface for web primitives.

The gallery is not a token source. It does not import package internals. It is not published to npm. Hosting (GitHub Pages or a custom domain) is a later decision.

## Rationale

A single Card cannot prove the glass canvas, Button matrix, Field semantics, or theme switching before a release tag. A custom site built from Scalewing, in the same family as Tailwind and Angular Material docs, lets unpublished workspace changes be reviewed without Storybook or a second visual system.

`@scalewing/react/styles.css` resolves to `packages/react/dist/styles.css`. Dev and gallery production builds must compile tokens, then React, then the gallery so stale CSS cannot be reviewed.

## Consequences

- `pnpm dev:web`, `pnpm build:gallery`, and `pnpm preview:gallery` are the local QA commands.
- A new or changed public web token, class, variant, or component is incomplete until the gallery demonstrates the meaningful states.
- `gallery.css` may own sticky/responsive documentation layout and code-block presentation. It must use Scalewing CSS variables and must not restyle showcased components.
