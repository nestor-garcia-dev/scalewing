# @scalewing/tokens

Framework-free themes, scales, and shared values for Scalewing.

```ts
import { createTheme, lightTheme } from '@scalewing/tokens';
```

This package has no CSS. Web apps import the generated stylesheet as `@scalewing/react/styles.css`.

Visual language: quiet canvas (system sans, white light surfaces, hairline borders, no user-agent link chrome). Glass fill and blur live on `theme.glass`, not as a utility class matrix.

Action colours: `accent`/`onAccent` fill the primary action, `secondary`/`onSecondary` the secondary (it follows `surface`, an outlined pill, unless a palette sets it), and `tertiary`/`onTertiary` a third solid action; `subtle` is a quiet neutral fill. The `signal` palette fills all three: cerulean, near-black, and violet.

`inverse`/`onInverse` are a dark band and the words on it, such as a site footer or one closing section: near black under the light page and a step above the black dark page, so the band stays dark in either scheme. No palette moves them; a brand sets its own band colour with an overlay (`colors: { inverse: '#0B2038' }`), and `onInverse` should keep 4.5:1 on it.

`accentSubtle` is a quiet fill tinted with the accent, for accent glyphs and labels on a tile. It is a solid mix of 10% accent into `surface`, stepped down one point at a time until accent on it keeps 4.5:1; `createTheme` recomputes it whenever a palette or overlay moves `accent` or `surface`, unless the overlay sets it. `accentSubtleFor(accent, surface)` returns the same colour. See [ADR 0011](../../docs/adr/0011-derived-accent-tint.md).

Categorical colours tell a small set of kinds apart (a product's services, a chart's series): `categoricalHues` (`green`, `blue`, `orange`, `purple`, `teal`, `rose`) plus `neutral`, in `categoricalColors.light` and `.dark` (the same fills), or `categoricalColorFor(color, scheme)`. Draw `onCategorical` (white) on them: every fill keeps a white glyph at 3:1 or more (`categoricalGlyphContrast`), enough for a glyph (WCAG 1.4.11) but not for text, so a categorical fill is not a text background. They carry no meaning, palettes do not overlay them, and which kind takes which hue is the consumer's choice.

Named palettes overlay semantic colors. Default is indigo. Apply with `createTheme({ palette: 'cerulean' })` or generated CSS (`data-palette` in `@scalewing/react/styles.css`, or `@scalewing/react/palette/cerulean.css`). Brand overlays use `colors` as a flat map or `{ light, dark }` so `colorScheme` can switch.
