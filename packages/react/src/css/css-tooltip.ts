import { typographyVariants } from '@scalewing/tokens';

import { zIndex } from './stacking.js';

const caption = typographyVariants.caption;

export function cssTooltipClasses(): string {
  return `.sw-tooltip-anchor {
  display: inline-flex;
  position: relative;
}

.sw-tooltip {
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  box-shadow: var(--sw-elevation-sm);
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
  /* The popover layer's inset: 0 would ignore the placed left in right-to-left. */
  inset: auto;
  margin: 0;
  /* On the top layer 100% is the viewport without a classic scrollbar. */
  max-width: min(18rem, calc(100% - 2 * var(--sw-space-2)));
  overflow: visible;
  padding: var(--sw-space-2);
  position: fixed;
  width: max-content;
  ${zIndex('popup')}
}

.sw-tooltip[hidden] { display: none; }

@media (forced-colors: active) {
  .sw-tooltip { border-color: CanvasText; box-shadow: none; }
}`;
}

export function tooltipClassCatalog(): string[] {
  return ['sw-tooltip-anchor', 'sw-tooltip'];
}
