import { typographyVariants } from '@scalewing/tokens';

import { zIndex } from './stacking.js';

const label = typographyVariants.label;

/*
 * The stuck strip is a full-bleed band of the page canvas, not a glass card:
 * nine parts canvas color to one part see-through, with the glass blur
 * behind it, so a panel scrolling under it shows as a faint smear, never as
 * words beside the labels. At nine parts the muted labels keep at least
 * 4.1:1, and the accent label 3.6:1, in every palette even over a solid
 * block of the text, accent or danger color; over the canvas and ordinary
 * type, which the blur spreads, they keep their canvas contrast. The first
 * tab's own inline padding (the md control's, spacing step 4) lines its
 * label up with a space-4 page gutter, so the strip adds no padding of its
 * own. It rides the AppHeader's layer.
 */
export const stuckCanvasShare = 0.9;

function stickyRules(): string {
  return `.sw-tabs-sticky {
  background: color-mix(in srgb, var(--sw-color-background) ${stuckCanvasShare * 100}%, transparent);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  position: sticky;
  top: env(safe-area-inset-top, 0px);
  ${zIndex('topChrome')}
}

@media (prefers-reduced-transparency: reduce) {
  .sw-tabs-sticky {
    background: var(--sw-color-background);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}`;
}

/** The tab strip: a scrollable row of tabs with an accent underline under the current one. */
export function cssTabsClasses(): string {
  return `.sw-tabs {
  border-bottom: 1px solid var(--sw-color-border);
  display: flex;
  gap: var(--sw-space-1);
  margin: 0;
  overflow-x: auto;
  padding: 0;
  scrollbar-width: none;
}

.sw-tabs::-webkit-scrollbar {
  display: none;
}

.sw-tab {
  appearance: none;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  border-radius: var(--sw-radius-sm) var(--sw-radius-sm) 0 0;
  color: var(--sw-color-muted);
  cursor: pointer;
  flex: none;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  margin-bottom: -1px;
  min-height: var(--sw-control-md-min-height);
  padding-inline: var(--sw-control-md-padding-inline);
  white-space: nowrap;
}

.sw-tab:hover {
  color: var(--sw-color-text);
}

.sw-tab:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-tab-selected {
  border-bottom-color: var(--sw-color-accent);
  color: var(--sw-color-accent);
}

.sw-tab-panel:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

${stickyRules()}

@media (forced-colors: active) {
  .sw-tab-selected { border-bottom-color: Highlight; color: Highlight; }
  .sw-tabs-sticky { background: Canvas; backdrop-filter: none; -webkit-backdrop-filter: none; }
}`;
}

export function tabsClassCatalog(): string[] {
  return [
    'sw-tabs',
    'sw-tabs-sticky',
    'sw-tab',
    'sw-tab-selected',
    'sw-tab-panel',
  ];
}
