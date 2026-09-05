# ADR 0006: Dashboard vocabulary

- Status: accepted
- Date: 2026-09-04

## Decision

Scalewing remains a quiet glass-minimal system (ADR 0004) and **grows an opt-in dashboard vocabulary** so products like fantasy-football can compose dense data UIs without a second visual kit.

In scope, shipped as separate stories:

- Density tokens: control size `xs`, type variant `data`, `sw-tabular`
- Data components: `Badge`, `SegmentedControl`, `Table`, `BarChart` (web first)
- Chrome: `AppHeader`, `Nav`, compact `Field` (web first)

Out of scope until a filled request: Menu, toast, tabs, additional chart types.

Domain cards, ranking tables’ _content_, and routing stay in the product.

## Amendment (2026-09-05)

fantasy-football requested compact Badge chicklets, compact/selected Table
rows, and a horizontal factor `BarChart`. Those web surfaces are in this
checkout. Other chart types stay out of scope.

## Amendment (2026-09-05, Accordion)

fantasy-football requested an in-flow disclosure. The shipped primitive is
`Accordion` (native `details`/`summary`, `title`, `open`, `onOpenChange`,
optional `name`), not a product-named Why-this-grade panel. Web only. Gallery
section required in the same change.

## Rationale

Layout primitives plus marketing-page type and 44px controls cannot present a 200-row ranked board. Copying CSS or inventing hex in the app would fork the system. One consumer is enough to request the primitives.

## Consequences

- Default canvas (17px body, `md` 44px) does not become dense. Products opt in per surface.
- New components get gallery sections, tests, and a changeset.
- Native approximates fills from the same tokens; Field stays web-only.
