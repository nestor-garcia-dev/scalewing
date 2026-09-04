# @scalewing/tokens

Framework-free themes, scales, and CSS generation for Scalewing.

```ts
import { buttonClassNames, createTheme, lightTheme } from '@scalewing/tokens';
```

The generated stylesheet is `@scalewing/tokens/styles.css`. Web apps should import `@scalewing/react/styles.css` instead so they pick up renderer-owned extras in later versions.

Visual language: quiet glass canvas (system sans, frosted surfaces, no user-agent link chrome). Glass fill and blur live on `theme.glass`, not as a utility class matrix.
