import { typographyVariants } from '@scalewing/tokens';

const body = typographyVariants.body;

const typedInputs = [
  "input[type='text']",
  "input[type='email']",
  "input[type='number']",
  "input[type='search']",
  "input[type='url']",
  "input[type='password']",
  'input:not([type])',
  'textarea',
].join(', ');

const controlSurface = `background-color: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  padding-inline: var(--sw-control-md-padding-inline);`;

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

[data-theme] [data-theme] {
  min-height: 0;
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

[data-theme] :is(${typedInputs}) {
  ${controlSurface}
  box-sizing: border-box;
  min-height: var(--sw-control-md-min-height);
}

[data-theme] select {
  ${controlSurface}
  appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--sw-color-muted) 50%),
    linear-gradient(135deg, var(--sw-color-muted) 50%, transparent 50%);
  background-position:
    calc(100% - var(--sw-space-4)) calc(50% - 1px),
    calc(100% - calc(var(--sw-space-4) - var(--sw-space-1))) calc(50% - 1px);
  background-repeat: no-repeat;
  background-size: var(--sw-space-1) var(--sw-space-1),
    var(--sw-space-1) var(--sw-space-1);
  box-sizing: content-box;
  height: calc(var(--sw-control-md-min-height) - 1px - 1px);
  min-height: 0;
  padding-inline-end: calc(
    var(--sw-control-md-padding-inline) + var(--sw-space-5)
  );
}

[data-theme] :is(${typedInputs}):focus,
[data-theme] select:focus {
  box-shadow: none;
  outline: none;
}

[data-theme] :is(${typedInputs}):focus-visible,
[data-theme] select:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}`;
}
