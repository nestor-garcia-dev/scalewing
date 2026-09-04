# ADR 0001: Standalone repository and public npm packages

- Status: accepted
- Date: 2026-09-03

## Decision

Maintain Scalewing as its own GitLab repository and publish `@scalewing/tokens`, `@scalewing/react`, and `@scalewing/react-native` to the public npm registry.

## Rationale

FutMas, coach-platform, and planned fantasy-football apps need a shared visual language without coupling that language to the FutMas product scope. Public npm avoids GitLab registry authentication in every consumer and CI job. These packages contain no secrets.

## Consequences

- The npm organization `@scalewing` is reserved. If a publish fails because the scope is unavailable, stop and rename rather than publishing under `@futmas`.
- Consumers take a normal npm dependency. GitLab CI publishes from a protected token.
- FutMas must record a supply-chain rationale when it adds these packages.
