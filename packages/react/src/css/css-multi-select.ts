import { typographyVariants } from '@scalewing/tokens';

import { chevronStroke } from './chevron.js';
import { zIndex } from './stacking.js';

const label = typographyVariants.label;
const body = typographyVariants.body;

/*
 * The trigger: a glass control at the md height with the muted label, the
 * summary and Select's chevron. The panel: a glass popover beside it (as
 * ActionMenu's list), All and Clear over a hairline, then one checkbox row
 * per option at the md height, the whole row its label; a separated row
 * starts after a hairline. Checkboxes reuse Checkbox's generated control.
 */
export function cssMultiSelectClasses(): string {
  return `.sw-multi-select {
  display: inline-flex;
  max-width: 100%;
}

.sw-multi-select-trigger {
  align-items: center;
  appearance: none;
  background-color: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-color-text);
  column-gap: var(--sw-space-2);
  cursor: pointer;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  margin: 0;
  max-width: 100%;
  min-height: var(--sw-control-md-min-height);
  padding-inline: var(--sw-control-md-padding-inline);
}

.sw-multi-select-trigger::after {
  ${chevronStroke}
  content: '';
  flex: none;
  margin-inline-start: var(--sw-space-2);
  transform: translateY(-25%) rotate(45deg);
}

.sw-multi-select-trigger:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-multi-select-trigger:disabled {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

.sw-multi-select-label {
  color: var(--sw-color-muted);
  font-weight: 500;
}

.sw-multi-select-summary {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sw-multi-select-panel {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-sm);
  box-shadow: var(--sw-elevation-sm), inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  box-sizing: border-box;
  color: var(--sw-color-text);
  display: flex;
  flex-direction: column;
  inset: auto;
  margin: 0;
  /* The viewport, not --sw-select-max: the list is short and should show
     whole rather than scroll inside a 22rem cap. */
  max-height: calc(100% - var(--sw-space-2) - var(--sw-space-2));
  max-width: calc(100% - var(--sw-space-2) - var(--sw-space-2));
  min-width: var(--sw-select-max);
  overflow: auto;
  padding: var(--sw-space-1);
  position: fixed;
  width: max-content;
  ${zIndex('popup')}
}

.sw-multi-select-commands {
  border-bottom: 1px solid var(--sw-color-border);
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--sw-space-1);
  padding-bottom: var(--sw-space-1);
}

.sw-multi-select-row-separated {
  border-top: 1px solid var(--sw-color-border);
  margin-top: var(--sw-space-1);
  padding-top: var(--sw-space-1);
}

.sw-checkbox-label.sw-multi-select-option {
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${body.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  padding-inline: var(--sw-space-2);
  width: 100%;
}

.sw-multi-select-option:hover {
  background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);
}

.sw-multi-select-icon {
  display: inline-flex;
  flex: none;
}

.sw-multi-select-text {
  min-width: 0;
}

@media (forced-colors: active) {
  .sw-multi-select-trigger::after { border-color: CanvasText; }
  .sw-multi-select-panel { border-color: CanvasText; }
  .sw-multi-select-commands,
  .sw-multi-select-row-separated { border-color: CanvasText; }
}`;
}

export function multiSelectClassCatalog(): string[] {
  return [
    'sw-multi-select',
    'sw-multi-select-trigger',
    'sw-multi-select-label',
    'sw-multi-select-summary',
    'sw-multi-select-panel',
    'sw-multi-select-commands',
    'sw-multi-select-row',
    'sw-multi-select-row-separated',
    'sw-multi-select-option',
    'sw-multi-select-icon',
    'sw-multi-select-text',
  ];
}
