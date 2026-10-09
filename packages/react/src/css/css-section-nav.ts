import { typographyVariants } from '@scalewing/tokens';

import {
  type Breakpoint,
  breakpointQuery,
  breakpoints,
} from './breakpoints.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const label = typographyVariants.label;

export function sectionNavVerticalClass(breakpoint: Breakpoint): string {
  return `sw-section-nav-vertical-from-${breakpoint}`;
}

/*
 * From the breakpoint up the row becomes a side list: one item per line,
 * the full width of its column, the current one marked by an accent bar at
 * its inline start instead of the underline.
 */
function verticalRules(): string {
  return breakpoints
    .map((breakpoint) => {
      const nav = `.${sectionNavVerticalClass(breakpoint)}`;
      return `@media ${breakpointQuery('from', breakpoint)} {
  ${nav} .sw-section-nav-list {
    border-bottom: 0;
    flex-direction: column;
    gap: var(--sw-space-1);
  }

  ${nav} .sw-section-nav-link {
    border-bottom: 0;
    border-inline-start: 2px solid transparent;
    border-radius: 0 var(--sw-radius-sm) var(--sw-radius-sm) 0;
    margin-bottom: 0;
    width: 100%;
  }

  ${nav} .sw-section-nav-link:dir(rtl) {
    border-radius: var(--sw-radius-sm) 0 0 var(--sw-radius-sm);
  }

  ${nav} .sw-section-nav-link[aria-current] {
    border-inline-start-color: var(--sw-color-accent);
  }
}`;
    })
    .join('\n\n');
}

/*
 * A section navigation is quieter than a workspace's: label-size words in
 * the muted color with no fill, the current item in the text color over an
 * accent underline on the row's hairline (as a tab strip marks its tab),
 * and a soft fill on hover. A link that is the current page or holds it is
 * marked the same way. A coarse pointer gets the 44 px target. The link
 * rules start at the canvas (`[data-theme]`) to outrank its accent links.
 */
export function cssSectionNavClasses(): string {
  return `.sw-section-nav-list {
  border-bottom: 1px solid var(--sw-color-border);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-1) var(--sw-space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

[data-theme] .sw-section-nav-link {
  align-items: center;
  border-bottom: 2px solid transparent;
  border-radius: var(--sw-radius-sm) var(--sw-radius-sm) 0 0;
  box-sizing: border-box;
  color: var(--sw-color-muted);
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  gap: var(--sw-space-2);
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  margin-bottom: -1px;
  min-height: var(--sw-control-sm-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
  text-decoration: none;
}

[data-theme] .sw-section-nav-link:hover {
  background: color-mix(in srgb, var(--sw-color-muted) 12%, transparent);
  color: var(--sw-color-text);
}

[data-theme] .sw-section-nav-link:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

[data-theme] .sw-section-nav-link[aria-current] {
  border-bottom-color: var(--sw-color-accent);
  color: var(--sw-color-text);
}

.sw-section-nav-icon {
  display: inline-flex;
  flex: none;
}

${verticalRules()}

@media ${coarsePointerQuery} {
  [data-theme] .sw-section-nav-link { min-height: ${touchTarget}; }
}

@media (forced-colors: active) {
  [data-theme] .sw-section-nav-link { color: LinkText; }
  [data-theme] .sw-section-nav-link[aria-current] { border-color: Highlight; color: CanvasText; }
}`;
}

export function sectionNavClassCatalog(): string[] {
  return [
    'sw-section-nav',
    'sw-section-nav-list',
    'sw-section-nav-link',
    'sw-section-nav-icon',
    ...breakpoints.map(sectionNavVerticalClass),
  ];
}
