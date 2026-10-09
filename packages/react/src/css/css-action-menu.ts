import { typographyVariants } from '@scalewing/tokens';

import { zIndex } from './stacking.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const caption = typographyVariants.caption;
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
  /* The popover layer's inset: 0 would ignore the placed left in right-to-left. */
  inset: auto;
  margin: 0;
  max-height: var(--sw-select-max);
  /* On the top layer 100% is the viewport without a classic scrollbar. */
  max-width: calc(100% - var(--sw-space-2) - var(--sw-space-2));
  /* Never narrower than a touch target. */
  min-width: var(--sw-control-md-min-height);
  overflow: auto;
  padding: var(--sw-space-1);
  position: fixed;
  /* As wide as its longest command, until max-width wraps it. */
  width: max-content;
  ${zIndex('popup')}
}

/* Each child of the header is a line of its own: a name, then a role. */
.sw-action-menu-header {
  border-bottom: 1px solid var(--sw-color-border);
  color: var(--sw-color-muted);
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  margin-bottom: var(--sw-space-1);
  /* The commands' inline padding, so the header's words line up with theirs. */
  padding: var(--sw-space-1) var(--sw-control-xs-padding-inline) var(--sw-space-2);
}

/* With a header, the commands are the menu inside the popover. */
.sw-action-menu-items {
  display: block;
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
  line-height: ${label.lineHeight}px;
  min-height: var(--sw-control-xs-min-height);
  /* A long command wraps inside the capped menu, a word at a time if it must. */
  overflow-wrap: anywhere;
  padding-block: var(--sw-space-1);
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
}

/* A coarse pointer gets the full touch target: the trigger at least square, and every command as tall. */
@media ${coarsePointerQuery} {
  .sw-action-menu-trigger {
    min-height: ${touchTarget};
    min-width: ${touchTarget};
  }

  .sw-action-menu-item {
    min-height: ${touchTarget};
  }
}`;
}

export function actionMenuClassCatalog(): string[] {
  return [
    'sw-action-menu',
    'sw-action-menu-trigger',
    'sw-action-menu-list',
    'sw-action-menu-header',
    'sw-action-menu-items',
    'sw-action-menu-item',
    'sw-action-menu-item-danger',
  ];
}
