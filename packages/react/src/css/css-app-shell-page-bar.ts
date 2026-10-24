import { breakpointQuery } from './breakpoints.js';
import { zIndex } from './stacking.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

/*
 * The compact bar's measured height, set on `.sw-app-shell` by the
 * component while it draws a page bar, so the page bar sticks right under
 * the bar whatever its end controls make it.
 */
export const appShellBarHeightVariable = '--sw-app-shell-bar-height';

/*
 * The bar's usual height before it is measured (and without script): the
 * sm menu button, or the touch target on a coarse pointer, inside the
 * bar's space-2 padding, and its hairline.
 */
function barHeightFallback(control: string): string {
  return `calc(${control} + 2 * var(--sw-space-2) + 1px)`;
}

const fromLg = breakpointQuery('from', 'lg');

/*
 * \`pageBar\`: a band at the top of \`main\` on every layout, the solid
 * surface with a hairline under it and the page's inline padding (space-4,
 * space-6 from \`lg\`), its children a wrapping row with space between them.
 * Sticky on the top chrome's layer: under the compact bar below \`lg\`, at
 * the window's top from \`lg\`, where the bar is gone. Reduce Transparency
 * needs nothing (it is already solid); forced colours keep the hairline.
 */
function pageBarRules(): string {
  return `.sw-app-shell-page-bar {
  align-items: center;
  background: var(--sw-color-surface);
  border-bottom: 1px solid var(--sw-color-border);
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2) var(--sw-space-3);
  justify-content: space-between;
  padding: var(--sw-space-2) var(--sw-space-4);
  position: sticky;
  top: var(${appShellBarHeightVariable}, ${barHeightFallback('var(--sw-control-sm-min-height)')});
  ${zIndex('topChrome')}
}

@media ${coarsePointerQuery} {
  .sw-app-shell-page-bar {
    top: var(${appShellBarHeightVariable}, ${barHeightFallback(touchTarget)});
  }
}

@media ${fromLg} {
  .sw-app-shell-page-bar {
    padding-inline: var(--sw-space-6);
    top: 0;
  }
}`;
}

/*
 * \`menuCount\`: the shared count pill (\`sw-app-shell-count\`, its tones
 * included) on the menu button's top end corner, over the glyph's edge as
 * on a rail glyph, mirrored in right-to-left.
 */
function menuCountRules(): string {
  return `.sw-app-shell-menu {
  position: relative;
}

.sw-app-shell-menu .sw-app-shell-count {
  inset-block-start: calc(-1 * var(--sw-space-1));
  inset-inline-end: calc(-1 * var(--sw-space-1));
  pointer-events: none;
  position: absolute;
}`;
}

/* AppShell's page bar and the menu button's count (see components/AppShell.tsx). */
export function cssAppShellPageBarClasses(): string {
  return `${pageBarRules()}

${menuCountRules()}`;
}

export function appShellPageBarClassCatalog(): string[] {
  return ['sw-app-shell-page-bar'];
}
