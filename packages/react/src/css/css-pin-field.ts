import { typographyVariants } from '@scalewing/tokens';

import {
  controlSurface,
  disabledControlForcedColors,
  disabledControlSurface,
} from './css-document.js';

const heading = typographyVariants.heading;

/** A pad key's least size both ways: two space-6, 64 px. */
const keySize = 'calc(2 * var(--sw-space-6))';

/*
 * The entry is the field's frame: it draws the canvas control surface, the
 * dots and, while its input has the focus, the accent ring. The input fills
 * it at opacity 0, so the mask characters it holds and its caret are never
 * painted (in forced colours either, where a transparent text colour would
 * be drawn), yet it takes every press and the focus. Its type stays the
 * canvas's body size, so iOS does not zoom when it is focused.
 * `input.sw-pin-field-input` matches the canvas's typed-input rule's
 * specificity and comes later in the sheet.
 */
function entryRules(): string {
  return `.sw-pin-field {
  min-width: 0;
  /* Holds its hidden label, count and empty error region, which leave the flow. */
  position: relative;
}

.sw-pin-field-entry {
  ${controlSurface}
  align-items: center;
  box-sizing: border-box;
  cursor: text;
  display: flex;
  min-height: var(--sw-control-md-min-height);
  position: relative;
}

[data-theme] input.sw-pin-field-input {
  border: 0;
  cursor: inherit;
  height: 100%;
  inset: 0;
  margin: 0;
  min-height: 0;
  opacity: 0;
  padding: 0;
  position: absolute;
  width: 100%;
}

/* The canvas sets a disabled text control's opacity back to 1: not this one's. */
[data-theme] input.sw-pin-field-input:disabled { opacity: 0; }

.sw-pin-field-entry:focus-within {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-field-invalid .sw-pin-field-entry { border-color: var(--sw-color-danger); }

/* The frame draws the surface, so it carries the disabled look for its input. */
.sw-pin-field-entry:has(> input:disabled) {
  ${disabledControlSurface}
}`;
}

/*
 * One dot per digit of the code: a ring in the muted colour (3:1 or more on
 * the surface and on the subtle fill in every palette), filled in the text
 * colour for a digit entered. A border draws the ring, so forced colours
 * keep it.
 */
function dotRules(): string {
  return `.sw-pin-field-dots {
  display: flex;
  gap: var(--sw-space-3);
  pointer-events: none;
}

.sw-pin-field-dot {
  border: 2px solid var(--sw-color-muted);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  flex: none;
  height: var(--sw-space-4);
  width: var(--sw-space-4);
}

.sw-pin-field-dot-filled {
  background: var(--sw-color-text);
  border-color: var(--sw-color-text);
}`;
}

/*
 * With its pad the field is one centred column, ten space-6 wide at most:
 * the dots stand without a frame (the ring still shows where the focus is),
 * and the keys are three equal columns. A key is at least 64 px both ways,
 * on the subtle fill inside an edge in the muted colour (3:1 or more
 * against the fill and the surface), its digit at the heading size. Delete
 * has the same edge on no fill. The hover fill is for a pointer that
 * hovers, so it never sticks after a touch.
 */
function padRules(): string {
  return `.sw-pin-field-with-pad {
  /* Centred in a column wider than it, whatever the column's alignment. */
  margin-inline: auto;
  max-inline-size: calc(10 * var(--sw-space-6));
  text-align: center;
  width: 100%;
}

.sw-pin-field-with-pad .sw-pin-field-entry,
.sw-pin-field-with-pad .sw-pin-field-entry:has(> input:disabled) {
  background-color: transparent;
  border-width: 0;
  justify-content: center;
}

.sw-pin-field-with-pad .sw-pin-field-entry:has(> input:disabled) .sw-pin-field-dots {
  opacity: var(--sw-disabled-opacity);
}

.sw-pin-field-pad {
  display: grid;
  gap: var(--sw-space-2);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-block-start: var(--sw-space-3);
}

/* The hint or the error under the keys stands a little apart from them. */
.sw-pin-field-pad ~ :is(.sw-field-description, .sw-field-error:not(:empty)) {
  margin-block-start: var(--sw-space-2);
}

.sw-pin-field-key {
  align-items: center;
  appearance: none;
  background: var(--sw-color-subtle);
  border: 1px solid var(--sw-color-muted);
  border-radius: var(--sw-radius-md);
  box-sizing: border-box;
  color: var(--sw-color-text);
  cursor: pointer;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${heading.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: 400;
  justify-content: center;
  line-height: ${heading.lineHeight}px;
  margin: 0;
  min-block-size: ${keySize};
  min-inline-size: ${keySize};
  padding: 0;
  touch-action: manipulation;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.sw-pin-field-key-delete { background: transparent; }

@media (hover: hover) {
  .sw-pin-field-key:hover:not(:disabled, [aria-disabled='true']) {
    background: var(--sw-color-border);
  }
}

.sw-pin-field-key:active:not(:disabled, [aria-disabled='true']) {
  background: var(--sw-color-border);
}

.sw-pin-field-key:focus { outline: none; }

.sw-pin-field-key:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-pin-field-key:is(:disabled, [aria-disabled='true']) {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

.sw-pin-field-glyph {
  fill: none;
  flex: none;
  height: var(--sw-space-5);
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  /* The stroke of the system's other private glyphs and of consumer icons (ADR 0008). */
  stroke-width: 1.75;
  width: var(--sw-space-5);
}

/* The mark points the way a deletion goes. */
[dir='rtl'] .sw-pin-field-glyph { transform: scaleX(-1); }`;
}

/* Forced colours: system edges and fills; a disabled part in GrayText, unfaded. */
function forcedColorRules(): string {
  return `@media (forced-colors: active) {
  .sw-field-invalid .sw-pin-field-entry { border-color: Mark; }
  .sw-pin-field-entry:has(> input:disabled) {
    ${disabledControlForcedColors}
  }
  .sw-pin-field-dot { border-color: CanvasText; }
  .sw-pin-field-dot-filled { background: CanvasText; }
  .sw-pin-field-entry:has(> input:disabled) .sw-pin-field-dot { border-color: GrayText; }
  .sw-pin-field-entry:has(> input:disabled) .sw-pin-field-dot-filled { background: GrayText; }
  .sw-pin-field-with-pad .sw-pin-field-entry:has(> input:disabled) .sw-pin-field-dots { opacity: 1; }
  .sw-pin-field-key { border-color: ButtonText; }
  .sw-pin-field-key:is(:disabled, [aria-disabled='true']) {
    border-color: GrayText;
    color: GrayText;
    opacity: 1;
  }
}`;
}

/**
 * The web PinField: a label over a frame of dots with an unseen input, and
 * with `sw-pin-field-with-pad` a centred column of dots over twelve keys.
 */
export function cssPinFieldClasses(): string {
  return `${entryRules()}

${dotRules()}

${padRules()}

${forcedColorRules()}`;
}

export function pinFieldClassCatalog(): string[] {
  return [
    'sw-pin-field',
    'sw-pin-field-with-pad',
    'sw-pin-field-entry',
    'sw-pin-field-input',
    'sw-pin-field-dots',
    'sw-pin-field-dot',
    'sw-pin-field-dot-filled',
    'sw-pin-field-pad',
    'sw-pin-field-key',
    'sw-pin-field-key-delete',
    'sw-pin-field-glyph',
  ];
}
