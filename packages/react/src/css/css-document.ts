import { typographyVariants } from '@scalewing/tokens';

const body = typographyVariants.body;

/** The native controls that take typed text: the canvas's text controls. */
export const typedInputs = [
  "input[type='text']",
  "input[type='email']",
  "input[type='number']",
  "input[type='search']",
  "input[type='url']",
  "input[type='password']",
  'input:not([type])',
  'textarea',
].join(', ');

/** The frame every native text control draws: fill, hairline border, radius. */
export const controlSurface = `background-color: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  padding-inline: var(--sw-control-md-padding-inline);`;

/*
 * A disabled text control keeps its value in the text color, so a locked
 * value stays readable (4.5:1 or more on the subtle fill in every palette),
 * and says it is locked with the quiet subtle fill and a dashed hairline
 * instead of the opacity buttons use. WebKit fades a disabled entry's text
 * with its own fill color and opacity, so both are set back.
 */
export const disabledControlSurface = `background-color: var(--sw-color-subtle);
  border-style: dashed;
  cursor: not-allowed;
  opacity: 1;
  -webkit-text-fill-color: currentColor;`;

/* Forced colors keep the dashed border; the system's disabled color draws it. */
export const disabledControlForcedColors = `border-color: GrayText;
  color: GrayText;
  -webkit-text-fill-color: GrayText;`;

/**
 * A select's chevron: two muted triangles drawn as background layers, so a
 * rule that adds a layer (a changed field's tint) lists them with it. Their
 * distance from the end is `--sw-select-chevron-inset`, which the select
 * rule sets per size (space 4, and space 3 in an `xs` field), so every rule
 * that lists the layers places them for the size it is in.
 */
export const selectChevronLayers = {
  image: `linear-gradient(45deg, transparent 50%, var(--sw-color-muted) 50%),
    linear-gradient(135deg, var(--sw-color-muted) 50%, transparent 50%)`,
  position: `calc(100% - var(--sw-select-chevron-inset)) calc(50% - 1px),
    calc(100% - calc(var(--sw-select-chevron-inset) - var(--sw-space-1))) calc(50% - 1px)`,
  size: `var(--sw-space-1) var(--sw-space-1),
    var(--sw-space-1) var(--sw-space-1)`,
} as const;

/** A script-only focus target in the canvas, at zero specificity. */
export const focusTargetSelector =
  ":where([data-theme] [tabindex='-1']:focus-visible)";

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

/*
 * A programmatic focus target (tabindex="-1": a notice, a card or a heading
 * that a script focuses after a save) takes the accent ring past the ring
 * offset, as links and native controls do, instead of the browser's outline.
 * It shows when the browser would show its own (:focus-visible), so a target
 * focused after a mouse press stays quiet. :where() keeps the rule at zero
 * specificity: it still beats the user-agent outline, and every component's
 * own ring (a roving tabindex="-1" item's included) wins over it.
 */
${focusTargetSelector} {
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
  --sw-select-chevron-inset: var(--sw-space-4);
  appearance: none;
  background-image:
    ${selectChevronLayers.image};
  background-position:
    ${selectChevronLayers.position};
  background-repeat: no-repeat;
  background-size: ${selectChevronLayers.size};
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
}

/* The browser's placeholder gray is one fixed #757575 (2.3:1 on a dark
   field); muted is tuned per palette and scheme. */
[data-theme] :is(${typedInputs})::placeholder {
  color: var(--sw-color-muted);
  opacity: 1;
}

[data-theme] :is(${typedInputs}):disabled,
[data-theme] select:disabled {
  ${disabledControlSurface}
}

@media (forced-colors: active) {
  [data-theme] :is(${typedInputs}):disabled,
  [data-theme] select:disabled {
    ${disabledControlForcedColors}
  }
}`;
}
