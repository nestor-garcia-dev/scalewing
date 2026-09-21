# @scalewing/tokens

Framework-free themes, scales, and shared values for Scalewing.

```ts
import { createTheme, lightTheme } from '@scalewing/tokens';
```

This package has no CSS. Web apps import the generated stylesheet as `@scalewing/react/styles.css`.

Visual language: quiet canvas (system sans, white light surfaces, hairline borders, no user-agent link chrome). Glass fill and blur live on `theme.glass`, not as a utility class matrix.

Named palettes overlay semantic colors. Default is indigo. Apply with `createTheme({ palette: 'cerulean' })` or generated CSS (`data-palette` in `@scalewing/react/styles.css`, or `@scalewing/react/palette/cerulean.css`). Brand overlays use `colors` as a flat map or `{ light, dark }` so `colorScheme` can switch.
