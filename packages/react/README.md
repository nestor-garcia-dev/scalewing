# @scalewing/react

DOM components plus the generated Scalewing stylesheet.

```ts
import '@scalewing/react/styles.css';
import { Card, Stack, Text, ThemeProvider } from '@scalewing/react';
```

```html
<div class="sw-padding-top-4 sw-padding-x-4"></div>
```

Import the CSS once at the application entry. Do not copy it into your source tree.

React is a peer dependency. Rationale: the host app already owns the React runtime.
