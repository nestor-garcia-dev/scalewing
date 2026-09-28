import { typographyVariants } from '@scalewing/tokens';

import { controlSurface } from './css-document.js';

const caption = typographyVariants.caption;

/*
 * A prefix or suffix sits inside the control frame: the wrapper draws the
 * canvas control surface and the focus ring, and the native input inside it
 * drops its own frame so the text and the value read as one control.
 */
function adornmentRules(): string {
  return `.sw-field-adorned {
  ${controlSurface}
  align-items: center;
  box-sizing: border-box;
  cursor: text;
  display: flex;
  gap: var(--sw-space-1);
  min-height: var(--sw-control-md-min-height);
}

[data-theme] .sw-field-adorned > input {
  align-self: stretch;
  background: transparent;
  border: 0;
  border-radius: 0;
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  padding-inline: 0;
}

[data-theme] .sw-field-adorned > input:focus-visible { outline: none; }

.sw-field-adorned:focus-within {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-field-prefix,
.sw-field-suffix {
  color: var(--sw-color-muted);
  flex: none;
  user-select: none;
  white-space: nowrap;
}

.sw-field-xs .sw-field-adorned {
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
}

.sw-field-invalid .sw-field-adorned { border-color: var(--sw-color-danger); }`;
}

export function cssFieldClasses(): string {
  return `.sw-field-required { color: var(--sw-color-danger); }

.sw-field-description,
.sw-field-error {
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

.sw-field-description { color: var(--sw-color-muted); }
.sw-field-error { color: var(--sw-color-danger); }

/* An error region is always rendered as a live region; empty, it leaves the layout (and its gap) but stays in the accessibility tree. */
.sw-field-error:empty { position: absolute; }

[data-theme] .sw-field-invalid :is(input, select, textarea) {
  border-color: var(--sw-color-danger);
}

${adornmentRules()}

@media (forced-colors: active) {
  [data-theme] .sw-field-invalid :is(input, select, textarea),
  .sw-field-invalid .sw-field-adorned { border-color: Mark; }
  .sw-field-prefix, .sw-field-suffix { color: CanvasText; }
  .sw-field-error, .sw-field-required { color: Mark; }
}`;
}

export function fieldClassCatalog(): string[] {
  return [
    'sw-field',
    'sw-field-required',
    'sw-field-description',
    'sw-field-error',
    'sw-field-invalid',
    'sw-field-adorned',
    'sw-field-prefix',
    'sw-field-suffix',
  ];
}
