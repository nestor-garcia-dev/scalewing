import { typographyVariants } from './typography.js';

const body = typographyVariants.body;

const textControls = [
  "input[type='text']",
  "input[type='email']",
  "input[type='number']",
  "input[type='search']",
  "input[type='url']",
  "input[type='password']",
  'input:not([type])',
  'select',
  'textarea',
].join(', ');

export function cssDocumentCanvas(): string {
  return `html,
body {
  margin: 0;
}

[data-theme] {
  background-color: var(--sw-color-background);
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${body.fontSize}px;
  letter-spacing: ${body.letterSpacing}px;
  line-height: ${body.lineHeight}px;
  min-height: 100vh;
  min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

[data-theme='light'] {
  color-scheme: light;
}

[data-theme='dark'] {
  color-scheme: dark;
}

[data-theme] a {
  color: var(--sw-color-accent);
  text-decoration: none;
}

[data-theme] a:hover {
  color: var(--sw-color-text);
}

[data-theme] a:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

[data-theme] :is(${textControls}) {
  background-color: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  min-height: var(--sw-control-md-min-height);
  padding-inline: var(--sw-control-md-padding-inline);
}`;
}
