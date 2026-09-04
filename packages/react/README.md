# @scalewing/react

DOM components plus the generated Scalewing stylesheet.

```ts
import '@scalewing/react/styles.css';
import {
  Box,
  Button,
  Card,
  Field,
  Stack,
  Text,
  ThemeProvider,
} from '@scalewing/react';
```

```html
<div class="sw-padding-top-4 sw-padding-x-4"></div>
```

Import the CSS once at the application entry. Do not copy it into your source tree.

`Box as="a"` is a layout link. Use `Button` for press actions. `Field` wraps a native `<input>` or `<select>` with a label and token gap; native text controls inherit the generated document canvas.

React is a peer dependency. Rationale: the host app already owns the React runtime.
