import { breakpointQuery } from './breakpoints.js';
import {
  appShellDrawerClassCatalog,
  cssAppShellDrawerClasses,
} from './css-app-shell-drawer.js';
import {
  appShellNavClassCatalog,
  cssAppShellNavClasses,
  cssAppShellRailNavRules,
} from './css-app-shell-nav.js';
import {
  appShellPageBarClassCatalog,
  cssAppShellPageBarClasses,
} from './css-app-shell-page-bar.js';
import {
  appShellSkipLinkClassCatalog,
  cssAppShellSkipLinkRules,
} from './css-app-shell-skip-link.js';
import { iconButtonRules } from './css-icon-button.js';

/*
 * The width from which AppShell's sidebar is full rather than a rail: an
 * internal media query of the component, not a public breakpoint (the
 * `md` and `lg` tokens stay the only ones products use).
 */
const wideShellWidth = 75;

/** From this width up AppShell draws its full sidebar; script reads it too. */
export const appShellWideQuery = `(min-width: ${wideShellWidth}rem)`;

/* The full sidebar's width, a named geometry of this frame. */
const sidebarWidth = '15rem';

/* The rail: the 44 px target with a space-3 gutter each side, and its hairline. */
const railWidth =
  'calc(var(--sw-control-md-min-height) + 2 * var(--sw-space-3) + 1px)';

const fromLg = breakpointQuery('from', 'lg');

/*
 * Below `lg`: the page under a sticky top bar (an AppHeader `bar`: the menu
 * button, the title, the end controls), no sidebar. The frame never makes
 * `main` a scroll box: the page scrolls with the document.
 */
function barRules(): string {
  return `.sw-app-shell {
  min-height: 100vh;
  min-height: 100dvh;
}

.sw-app-shell-bar {
  align-items: center;
  display: flex;
  gap: var(--sw-space-2);
}

.sw-app-shell-bar-title {
  flex: 1 1 auto;
  min-width: 0;
}

.sw-app-shell-bar-end {
  align-items: center;
  display: flex;
  flex: none;
  gap: var(--sw-space-2);
}

${iconButtonRules('sw-app-shell-menu')}

.sw-app-shell-main {
  display: block;
  min-width: 0;
}

.sw-app-shell-sidebar,
.sw-app-shell-sidebar .sw-app-shell-rail-slot {
  display: none;
}`;
}

/*
 * From \`lg\`: no bar; the sidebar is a column of the frame's grid, sticky at
 * the top at the viewport's height on the solid surface with a hairline at
 * its inline end. Its header and footer keep their height and only the nav
 * between them scrolls, when it is taller than the window. A rail to 75rem,
 * full from there.
 */
function sidebarRules(): string {
  return `@media ${fromLg} {
  .sw-app-shell {
    align-items: start;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
  }

  .sw-app-shell-bar {
    display: none;
  }

  .sw-app-shell-sidebar {
    background: var(--sw-color-surface);
    border-inline-end: 1px solid var(--sw-color-border);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    position: sticky;
    top: 0;
    width: ${railWidth};
  }

  @media not all and ${appShellWideQuery} {
    .sw-app-shell-sidebar .sw-app-shell-slot {
      display: none;
    }

    .sw-app-shell-sidebar .sw-app-shell-rail-slot {
      display: block;
    }

${cssAppShellRailNavRules('    ')}
  }
}

@media ${appShellWideQuery} {
  .sw-app-shell-sidebar {
    width: ${sidebarWidth};
  }
}`;
}

/*
 * AppShell: a workspace frame with a pinned side navigation (see
 * components/AppShell.tsx). The links, groups and the rail's nav are
 * `css-app-shell-nav.ts`; the page bar and the menu's count are
 * `css-app-shell-page-bar.ts`; the menu drawer is `css-app-shell-drawer.ts`;
 * the skip link is `css-app-shell-skip-link.ts`.
 */
export function cssAppShellClasses(): string {
  return `${barRules()}

.sw-app-shell-header,
.sw-app-shell-footer {
  flex: none;
  padding: var(--sw-space-3);
}

.sw-app-shell-footer {
  border-top: 1px solid var(--sw-color-border);
}

${cssAppShellNavClasses()}

${cssAppShellPageBarClasses()}

${sidebarRules()}

${cssAppShellDrawerClasses()}

${cssAppShellSkipLinkRules()}`;
}

export function appShellClassCatalog(): string[] {
  return [
    'sw-app-shell',
    'sw-app-shell-bar',
    'sw-app-shell-menu',
    'sw-app-shell-bar-title',
    'sw-app-shell-bar-end',
    'sw-app-shell-main',
    'sw-app-shell-sidebar',
    'sw-app-shell-slot',
    'sw-app-shell-rail-slot',
    'sw-app-shell-header',
    'sw-app-shell-footer',
    ...appShellNavClassCatalog(),
    ...appShellPageBarClassCatalog(),
    ...appShellDrawerClassCatalog(),
    ...appShellSkipLinkClassCatalog(),
  ];
}
