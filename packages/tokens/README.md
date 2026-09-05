# @scalewing/tokens

Framework-free themes, scales, and CSS generation for Scalewing.

```ts
import { buttonClassNames, createTheme, lightTheme } from '@scalewing/tokens';
```

The generated stylesheet is `@scalewing/tokens/styles.css`. Web apps should import `@scalewing/react/styles.css` instead so they pick up renderer-owned extras in later versions.

Visual language: quiet canvas (system sans, white light surfaces, hairline borders, no user-agent link chrome). Glass fill and blur live on `theme.glass`, not as a utility class matrix.

Named palettes overlay semantic colors. Default is indigo. Apply with `createTheme({ palette: 'cerulean' })` or generated CSS (`data-palette` in `styles.css`, or `@scalewing/tokens/palette/cerulean.css`). Brand overlays use `colors` as a flat map or `{ light, dark }` so `colorScheme` can switch.
