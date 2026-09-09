# ADR 0008: Icon slots and Lucide

- Status: accepted
- Date: 2026-09-09

## Decision

Scalewing does not publish a general icon catalog and does not depend on a glyph vendor.

Consumers own product pictograms. Generic UI glyphs (search, close, plus, undo) use **Lucide** through existing component slots. Web apps import `lucide-react`. Expo / React Native apps import `lucide-react-native`. Size and color come from Scalewing tokens. Stroke is quieter than Lucide’s default: `strokeWidth={1.75}` at spacing step `4` or `5`. Named imports on web; per-icon paths on native (`lucide-react-native/icons/search`) so Metro does not pack the barrel.

Lucide is the library Scalewing supports. Official React and React Native packages, tree-shakeable components, and `size` / `color` / `strokeWidth` match this system’s two renderers (ADR 0002) and quiet canvas (ADR 0004). Do not mix a second family (Phosphor, Tabler, Heroicons, Font Awesome, Material). If Lucide’s catalog cannot cover a demonstrated operational need, switch the whole portfolio — do not run two sets.

Glyphs intrinsic to a control stay private to that component. Size, color, stroke or border weight, and placement come from tokens; the geometry is implementation (Select’s CSS chevron). The public contract is behavior and accessible name, not `CloseIcon`. If a consumer must replace a meaningful glyph, add a slot on that component.

Brand, domain, and league marks stay custom SVG in the product. `react-native-svg` is an application dependency, not a Scalewing dependency.

A public `Icon` wrapper that only maps size and color is out of scope until a product repeatedly invents sizing, alignment, or accessibility glue that slots cannot own. Many icons in an app is not enough.

## Rationale

TabBar already takes `icon` as a slot; product pictograms stay in the consumer. An icon catalog would be a dumped public API, a production vendor pin, and two renderer implementations. Teisoro’s Material icons are inventory of an app being replaced, not a reason to ship `@scalewing/icons`.

Lucide is the supported set so every consumer shares one stroke language. Phosphor’s thinner weights sit closer to hairline on a still, but native is a community port and weights become a second visual API. Tabler’s larger catalog invites overly specific picks. Heroicons read as Tailwind’s family. Font Awesome and Material are a second visual system.

## Consequences

- Products add Lucide themselves. Record the renderer package in that app’s `AGENTS.md` (`lucide-react` or `lucide-react-native`).
- Gallery and native-example may keep token-sized placeholder marks; they are not a glyph source.
- Do not add Lucide, `react-native-svg`, or an icon export to `@scalewing/tokens`, `@scalewing/react`, or `@scalewing/react-native`.
- Control chrome (chevrons, disclosure, dismiss) is not a public icon family.
- Changing the supported library is a new ADR.
