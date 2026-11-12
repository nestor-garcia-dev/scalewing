import { typographyVariants } from '@scalewing/tokens';

import { coarsePointerQuery, touchTarget } from './touch-target.js';

const body = typographyVariants.body;
const caption = typographyVariants.caption;
const label = typographyVariants.label;

/*
 * The docs navigation, in the side column and the disclosure alike: each
 * group a muted caption at weight 600 (sentence case, never uppercase) over
 * its list of links. Links are in the text colour with no hairline and no
 * underline; the current one takes SectionNav \`filled\`'s quiet muted fill
 * at the label weight, a hovered one a lighter fill. A 2 px transparent
 * border keeps room for forced colours, where links read as LinkText and
 * the current one's border turns Highlight. The link rules start at the
 * canvas (\`[data-theme]\`) to outrank its accent links.
 *
 * In the side column links are label size and the sm control (32; the
 * 44 px target on a coarse pointer). In the disclosure they are large
 * rows: body size, at least the 44 px target at every pointer.
 */
export function cssDocsLayoutNavRules(): string {
  return `.sw-docs-layout-nav {
  display: flex;
  flex-direction: column;
  font-family: var(--sw-font-sans);
  gap: var(--sw-space-5);
}

.sw-docs-layout-group {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
}

.sw-docs-layout-group-label {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  margin: 0;
  padding-inline: calc(var(--sw-space-2) + 2px);
}

.sw-docs-layout-list {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
  list-style: none;
  margin: 0;
  padding: 0;
}

[data-theme] .sw-docs-layout-link {
  align-items: center;
  border: 2px solid transparent;
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-color-text);
  display: flex;
  font-size: ${label.fontSize}px;
  font-weight: 400;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-height: var(--sw-control-sm-min-height);
  overflow-wrap: anywhere;
  padding: var(--sw-space-1) var(--sw-space-2);
  text-decoration: none;
}

[data-theme] .sw-docs-layout-link:hover {
  background: color-mix(in srgb, var(--sw-color-muted) 12%, transparent);
  color: var(--sw-color-text);
}

[data-theme] .sw-docs-layout-link[aria-current] {
  background: color-mix(in srgb, var(--sw-color-muted) 18%, transparent);
  font-weight: ${label.fontWeight};
}

[data-theme] .sw-docs-layout-link:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-docs-layout-nav-compact {
  padding-top: var(--sw-space-4);
}

[data-theme] .sw-docs-layout-nav-compact .sw-docs-layout-link {
  font-size: ${body.fontSize}px;
  letter-spacing: ${body.letterSpacing}px;
  line-height: ${body.lineHeight}px;
  min-height: ${touchTarget};
  padding-inline: var(--sw-space-3);
}

.sw-docs-layout-nav-compact .sw-docs-layout-group-label {
  padding-inline: calc(var(--sw-space-3) + 2px);
}

@media ${coarsePointerQuery} {
  [data-theme] .sw-docs-layout-link { min-height: ${touchTarget}; }
}

@media (forced-colors: active) {
  [data-theme] .sw-docs-layout-link { color: LinkText; }
  [data-theme] .sw-docs-layout-link[aria-current] { border-color: Highlight; }
}`;
}
