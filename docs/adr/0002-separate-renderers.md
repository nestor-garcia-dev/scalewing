# ADR 0002: Separate DOM and React Native renderers

- Status: accepted
- Date: 2026-09-03

## Decision

Share tokens across platforms. Implement components twice: `@scalewing/react` for the DOM and `@scalewing/react-native` for Expo / React Native. Do not use React Native Web.

## Rationale

React Native primitives are not HTML. FutMas administration is a document-oriented Vite app. A universal renderer would fight that architecture and create an upgrade surface similar to a heavy UI kit.

## Consequences

- Public component names and spacing steps stay aligned.
- Props and accessibility attributes may differ by renderer.
- CSS class names exist only on web.
