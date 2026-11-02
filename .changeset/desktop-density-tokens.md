---
'@scalewing/tokens': minor
---

Additive. `compactControlScale` (md 36/14, sm 28/10, xs 24/8), `compactFilterChipMinHeight` (32) and the typography variant `bodySm` (15/22/400), for `@scalewing/react`'s opt-in compact density. No existing token moves. Renderers pick `bodySm` up through their caret dependency (ADR 0009): web as a `Text` variant, native through `theme.typography`. Request: `docs/requests/futmas-density.md`.

Renderer sign-off: Claude for both renderer agents, under the owner's FutMas F-010-S28 request (2026-11-02); additive, so native needs no change and web maps `bodySm` to a paragraph.
