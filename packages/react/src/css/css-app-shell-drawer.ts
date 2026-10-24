import { iconButtonRules } from './css-icon-button.js';

/* The drawer's width, a named geometry of this frame; a phone keeps a strip of backdrop. */
const drawerWidth = '20rem';

const drawer = '.sw-app-shell-drawer';

/*
 * AppShell's menu below `lg`: a modal `dialog` on the top layer, docked to
 * the inline start (the right in right-to-left) at the viewport's full
 * height on the solid surface, a hairline at its inline end, clearing the
 * safe areas, a space-8 strip of backdrop left in view on a phone. It
 * slides in from its edge unless reduced motion is asked for. Its column
 * is the top row (the close button where the menu button was, then the
 * header), the nav, which alone scrolls, and the footer. The backdrop is
 * Dialog's.
 */
export function cssAppShellDrawerClasses(): string {
  return `${drawer} {
  background: var(--sw-color-surface);
  border: 0;
  border-inline-end: 1px solid var(--sw-color-border);
  box-sizing: border-box;
  color: var(--sw-color-text);
  height: 100%;
  inset-block: 0;
  inset-inline: 0 auto;
  margin: 0;
  max-height: none;
  max-width: calc(100% - var(--sw-space-8));
  overflow: hidden;
  padding: env(safe-area-inset-top, 0px) 0 env(safe-area-inset-bottom, 0px);
  padding-inline-start: env(safe-area-inset-left, 0px);
  width: ${drawerWidth};
}

${drawer}:dir(rtl) {
  padding-inline-start: env(safe-area-inset-right, 0px);
}

${drawer}[open] {
  animation: sw-app-shell-drawer-in var(--sw-motion-default) var(--sw-motion-easing);
  display: flex;
  flex-direction: column;
}

${drawer}[open]:dir(rtl) {
  animation-name: sw-app-shell-drawer-in-rtl;
}

@keyframes sw-app-shell-drawer-in {
  from { translate: -100% 0; }
}

@keyframes sw-app-shell-drawer-in-rtl {
  from { translate: 100% 0; }
}

${drawer}::backdrop {
  background: color-mix(in srgb, var(--sw-color-text) 28%, transparent);
}

.sw-app-shell-drawer-top {
  align-items: center;
  display: flex;
  flex: none;
  gap: var(--sw-space-2);
  padding: var(--sw-space-3) var(--sw-space-3) 0;
}

.sw-app-shell-drawer-top .sw-app-shell-header {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0;
}

${iconButtonRules('sw-app-shell-close')}

@media (prefers-reduced-motion: reduce) {
  ${drawer}[open],
  ${drawer}[open]:dir(rtl) { animation: none; }
}

@media (forced-colors: active) {
  ${drawer} { border-inline-end-color: CanvasText; }
}`;
}

export function appShellDrawerClassCatalog(): string[] {
  return [
    'sw-app-shell-drawer',
    'sw-app-shell-drawer-top',
    'sw-app-shell-close',
  ];
}
