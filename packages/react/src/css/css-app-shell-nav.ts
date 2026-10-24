import { typographyVariants } from '@scalewing/tokens';

import { visuallyHiddenDeclarations } from './css-utilities.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const caption = typographyVariants.caption;
const label = typographyVariants.label;

/*
 * The shell's destinations, in the full sidebar and the drawer alike: label
 * size in the text colour at weight 500, the glyph before the label and the
 * count pill (the shared rule, `css-count-pill.ts`) at the row's end. The
 * current one takes the quiet muted fill in the text colour at the label
 * weight, as SectionNav \`filled\` marks it; hover a lighter fill. Each is
 * the sm control and the 44 px target on a coarse pointer. A 2 px
 * transparent border keeps room for forced colours, where the current
 * link's turns Highlight. A group's label is a muted caption at weight 600
 * (sentence case, never uppercase). The link rules start at the canvas
 * (\`[data-theme]\`) to outrank its accent links.
 */
export function cssAppShellNavClasses(): string {
  return `.sw-app-shell-nav {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--sw-space-4);
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--sw-space-2) var(--sw-space-3);
}

.sw-app-shell-group {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
}

.sw-app-shell-group-label {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  margin: 0;
  padding-inline: var(--sw-space-2);
}

.sw-app-shell-list {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
  list-style: none;
  margin: 0;
  padding: 0;
}

.sw-app-shell-item > .sw-tooltip-anchor {
  display: flex;
}

[data-theme] .sw-app-shell-link {
  align-items: center;
  border: 2px solid transparent;
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-color-text);
  display: flex;
  flex: 1 1 auto;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: 500;
  gap: var(--sw-space-3);
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-height: var(--sw-control-sm-min-height);
  padding: var(--sw-space-1) var(--sw-space-2);
  text-decoration: none;
}

[data-theme] .sw-app-shell-link:hover {
  background: color-mix(in srgb, var(--sw-color-muted) 12%, transparent);
}

[data-theme] .sw-app-shell-link:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

[data-theme] .sw-app-shell-link[aria-current] {
  background: color-mix(in srgb, var(--sw-color-muted) 18%, transparent);
  font-weight: ${label.fontWeight};
}

.sw-app-shell-icon {
  display: inline-flex;
  flex: none;
}

.sw-app-shell-label {
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;
}

.sw-app-shell-count {
  flex: none;
}

@media ${coarsePointerQuery} {
  [data-theme] .sw-app-shell-link { min-height: ${touchTarget}; }
}

@media (forced-colors: active) {
  [data-theme] .sw-app-shell-link { color: LinkText; }
  [data-theme] .sw-app-shell-link[aria-current] { border-color: Highlight; color: CanvasText; }
}`;
}

/*
 * The rail (from \`lg\` to 75rem, inside the sidebar's media queries): each
 * link the 44 px target holding its glyph alone, the label visually hidden
 * but still its name, the count pill at the link's top end corner. A
 * group's label is hidden too (it still names its list) and every group
 * after the first starts under a hairline.
 */
export function cssAppShellRailNavRules(indent: string): string {
  const rules = `.sw-app-shell-sidebar .sw-app-shell-label,
.sw-app-shell-sidebar .sw-app-shell-group-label { ${visuallyHiddenDeclarations} }

.sw-app-shell-sidebar .sw-app-shell-nav {
  gap: var(--sw-space-2);
}

.sw-app-shell-sidebar .sw-app-shell-group + .sw-app-shell-group {
  border-top: 1px solid var(--sw-color-border);
  padding-top: var(--sw-space-2);
}

[data-theme] .sw-app-shell-sidebar .sw-app-shell-link {
  justify-content: center;
  min-height: ${touchTarget};
  padding: 0;
  position: relative;
}

.sw-app-shell-sidebar .sw-app-shell-count {
  inset-block-start: 0;
  inset-inline-end: 0;
  position: absolute;
}`;
  return rules
    .split('\n')
    .map((line) => (line ? `${indent}${line}` : line))
    .join('\n');
}

export function appShellNavClassCatalog(): string[] {
  return [
    'sw-app-shell-nav',
    'sw-app-shell-group',
    'sw-app-shell-group-label',
    'sw-app-shell-list',
    'sw-app-shell-item',
    'sw-app-shell-link',
    'sw-app-shell-icon',
    'sw-app-shell-label',
    // sw-app-shell-count is the shared pill's (css-count-pill.ts).
  ];
}
