import { typographyVariants } from '@scalewing/tokens';

import { visuallyHiddenDeclarations } from './css-utilities.js';

const label = typographyVariants.label;

/*
 * A skip link's look, shared by SiteHeader's and AppShell's: visually
 * hidden until it has focus, then a pill on the surface in the text colour
 * with the accent ring inside its edge, the control height tall. Each
 * component positions its own; forced colours draw it as a link on the
 * system canvas with the ring in the system colour.
 */
export function skipLinkRules(selector: string): string {
  return `${selector} {
  align-items: center;
  background: var(--sw-color-surface);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  padding-inline: var(--sw-space-4);
  white-space: nowrap;
}

[data-theme] ${selector} {
  color: var(--sw-color-text);
  text-decoration: none;
}

[data-theme] ${selector}:focus {
  min-height: var(--sw-control-md-min-height);
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

${selector}:not(:focus) { ${visuallyHiddenDeclarations} }`;
}
