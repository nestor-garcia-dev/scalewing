import { typographyVariants } from '@scalewing/tokens';

import { visuallyHiddenDeclarations } from './css-utilities.js';
import {
  siteHeaderContentStart,
  siteHeaderGutter,
  siteHeaderGutterQuery,
} from './site-header-geometry.js';

const label = typographyVariants.label;

/*
 * The header's skip link, its first focusable element: visually hidden
 * until it has focus, then a pill on the surface in the text colour with
 * the accent ring, laid over the bar's start (centred in its height and
 * lined up with the brand), the control height tall only then. Positioned,
 * it paints over the bar's content, which is not, so it needs no layer of
 * its own.
 */
export function cssSiteHeaderSkipLinkRules(): string {
  return `.sw-site-header-skip-link {
  align-items: center;
  background: var(--sw-color-surface);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  inset-block-start: 50%;
  inset-inline-start: ${siteHeaderContentStart(siteHeaderGutter.compact)};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  padding-inline: var(--sw-space-4);
  position: absolute;
  transform: translateY(-50%);
  white-space: nowrap;
}

[data-theme] .sw-site-header-skip-link {
  color: var(--sw-color-text);
  text-decoration: none;
}

[data-theme] .sw-site-header-skip-link:focus {
  min-height: var(--sw-control-md-min-height);
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-site-header-skip-link:not(:focus) { ${visuallyHiddenDeclarations} }

@media ${siteHeaderGutterQuery} {
  .sw-site-header-skip-link { inset-inline-start: ${siteHeaderContentStart(siteHeaderGutter.wide)}; }
}`;
}
