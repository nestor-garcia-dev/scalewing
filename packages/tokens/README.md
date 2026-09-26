# @scalewing/tokens

Framework-free themes, scales, and shared values for Scalewing.

```ts
import { createTheme, lightTheme } from '@scalewing/tokens';
```

This package has no CSS. Web apps import the generated stylesheet as `@scalewing/react/styles.css`.

Visual language: quiet canvas (system sans, white light surfaces, hairline borders, no user-agent link chrome). Glass fill and blur live on `theme.glass`, not as a utility class matrix.

Action colours: `accent`/`onAccent` fill the primary action, `secondary`/`onSecondary` the secondary (it follows `surface`, an outlined pill, unless a palette sets it), and `tertiary`/`onTertiary` a third solid action; `subtle` is a quiet neutral fill. The `signal` palette fills all three: cerulean, near-black, and violet.

Named palettes overlay semantic colors. Default is indigo. Apply with `createTheme({ palette: 'cerulean' })` or generated CSS (`data-palette` in `@scalewing/react/styles.css`, or `@scalewing/react/palette/cerulean.css`). Brand overlays use `colors` as a flat map or `{ light, dark }` so `colorScheme` can switch.
