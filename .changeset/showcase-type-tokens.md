---
'@scalewing/tokens': minor
---

Additive. Typography variants `hero` (56/60 bold), `headline` (36/40 bold) and `lead` (20/29 regular), a public page's opening title, its section titles and the sentence under them, with compact sizes (36/40, 26/30, and the body's 17/25) in `compactTypographyVariants`. No existing variant moves. Renderers pick them up through their caret dependency (ADR 0009): web as `Text` variants with their compact step below `md`, native through `theme.typography`. Request: `docs/requests/teisoro-showcase-type.md`.

Renderer sign-off: Claude for both renderer agents, under the owner's Teisoro F-017 approval (2026-10-24); additive, so native needs no change and web maps the three to their default elements.
