import { typographyVariants } from './typography.js';

const label = typographyVariants.label;

export function cssActionMenuClasses(): string {
  return `.sw-action-menu {
  display: inline-flex;
  position: relative;
}

.sw-action-menu-trigger {
  appearance: none;
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  color: var(--sw-color-text);
  cursor: pointer;
  font: inherit;
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
}

.sw-action-menu-trigger:focus-visible,
.sw-action-menu-item:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-action-menu-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.sw-action-menu-list {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-sm);
  box-shadow: var(--sw-elevation-sm), inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  box-sizing: border-box;
  color: var(--sw-color-text);
  margin: 0;
  max-height: var(--sw-select-max);
  max-width: calc(100vw - var(--sw-space-2));
  min-width: max-content;
  overflow: auto;
  padding: var(--sw-space-1);
  position: fixed;
  z-index: 10;
}

.sw-action-menu-list[hidden] {
  display: none;
}

.sw-action-menu-item {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--sw-radius-sm);
  color: inherit;
  cursor: pointer;
  display: flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  gap: var(--sw-space-2);
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
  text-align: start;
  width: 100%;
}

.sw-action-menu-item:hover,
.sw-action-menu-item:focus-visible {
  background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);
}

.sw-action-menu-item:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.sw-action-menu-item-danger {
  color: var(--sw-color-danger);
}`;
}

export function actionMenuClassCatalog(): string[] {
  return [
    'sw-action-menu',
    'sw-action-menu-trigger',
    'sw-action-menu-list',
    'sw-action-menu-item',
    'sw-action-menu-item-danger',
  ];
}
