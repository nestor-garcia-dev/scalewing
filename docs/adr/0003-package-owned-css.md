# ADR 0003: Package-owned generated CSS utilities

- Status: accepted
- Date: 2026-09-03

## Decision

Generate a bounded `sw-*` utility stylesheet from tokens (generation lives in `@scalewing/react`, ADR 0010) and publish it as `@scalewing/react/styles.css`. Consuming apps import that file once and do not copy it into their source tree.

Class names use spacing steps (`sw-padding-top-4`), not raw pixels. React Native uses the same steps as props.

## Rationale

Apps should reuse padding and layout without owning a design CSS file. A full Tailwind-style matrix would either bloat the published CSS or require a content scanner and an upgrade tax.

## Consequences

- v0.1 utilities are limited to padding, gap, flow, sizing, container, and screen-reader-only.
- Color utilities, arbitrary values, and responsive class syntax need a new ADR.
- Components remain the preferred way to place data.
