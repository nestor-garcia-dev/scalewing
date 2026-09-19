import { typographyVariants } from './typography.js';

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
  inset-block-start: calc(100% + var(--sw-space-1));
  inset-inline-start: 0;
  max-width: min(18rem, calc(100vw - 2 * var(--sw-space-3)));
  padding: var(--sw-space-2);
  position: absolute;
  width: max-content;
  z-index: 10;
}

.sw-tooltip[hidden] { display: none; }

@media (forced-colors: active) {
  .sw-tooltip { border-color: CanvasText; box-shadow: none; }
}`;
}

export function tooltipClassCatalog(): string[] {
  return ['sw-tooltip-anchor', 'sw-tooltip'];
}
