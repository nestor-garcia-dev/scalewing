import { skipLinkRules } from './skip-link.js';
import { zIndex } from './stacking.js';

const link = '.sw-app-shell-skip-link';

/*
 * The shell's skip link, its first focusable element, in the shared skip
 * link look: while it has focus it is fixed at the window's top start,
 * over the sidebar, the compact bar and a page bar on its own layer, so it
 * shows however far the page has scrolled. Once used, `main` holds focus
 * (`tabindex="-1"`) without a ring: it is not a control, and the next Tab
 * reaches the page's first one.
 */
export function cssAppShellSkipLinkRules(): string {
  return `${skipLinkRules(link)}

${link} {
  inset-block-start: var(--sw-space-2);
  inset-inline-start: var(--sw-space-2);
  position: fixed;
  ${zIndex('skipLink')}
}

.sw-app-shell-main:focus { outline: none; }`;
}

export function appShellSkipLinkClassCatalog(): string[] {
  return ['sw-app-shell-skip-link'];
}
