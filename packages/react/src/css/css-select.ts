import { typographyVariants } from '@scalewing/tokens';

const caption = typographyVariants.caption;
const label = typographyVariants.label;

const chevronImage = `background-image:
    linear-gradient(45deg, transparent 50%, var(--sw-color-muted) 50%),
    linear-gradient(135deg, var(--sw-color-muted) 50%, transparent 50%);
  background-repeat: no-repeat;
  background-size: var(--sw-space-1) var(--sw-space-1),
    var(--sw-space-1) var(--sw-space-1);`;

export function cssSelectClasses(): string {
  return `.sw-select {
  max-width: 100%;
  width: max-content;
}

.sw-select-control {
  position: relative;
}

.sw-select-trigger {
  appearance: none;
  -webkit-appearance: none;
  background-color: var(--sw-glass-fill);
  ${chevronImage}
  background-position:
    calc(100% - var(--sw-space-4)) calc(50% - 1px),
    calc(100% - calc(var(--sw-space-4) - var(--sw-space-1))) calc(50% - 1px);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-color-text);
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  margin: 0;
  min-height: var(--sw-control-md-min-height);
  padding-block: 0;
  padding-inline: var(--sw-control-md-padding-inline);
  padding-inline-end: calc(
    var(--sw-control-md-padding-inline) + var(--sw-space-5)
  );
  text-align: start;
  white-space: nowrap;
}

.sw-select-trigger:focus {
  box-shadow: none;
  outline: none;
}

.sw-select-trigger:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-select-xs .sw-select-trigger {
  background-position:
    calc(100% - var(--sw-space-3)) calc(50% - 1px),
    calc(100% - calc(var(--sw-space-3) - var(--sw-space-1))) calc(50% - 1px);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
  padding-inline-end: calc(
    var(--sw-control-xs-padding-inline) + var(--sw-space-5)
  );
}

.sw-select-list {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-sm);
  box-shadow: var(--sw-elevation-sm), inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  box-sizing: border-box;
  color: var(--sw-color-text);
  inset-inline-start: 0;
  margin: var(--sw-space-1) 0 0;
  max-height: var(--sw-select-max);
  max-width: var(--sw-dialog-max);
  min-width: 100%;
  overflow: auto;
  padding: var(--sw-space-1);
  position: absolute;
  width: max-content;
  z-index: 3;
}

.sw-select-option {
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
}

.sw-select-option[aria-selected='true'] {
  font-weight: ${label.fontWeight};
}

.sw-select-option[data-active='true'] {
  background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);
}

.sw-select-xs .sw-select-option {
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-select-action {
  border-top: 1px solid var(--sw-color-border);
  color: var(--sw-color-accent);
  margin-top: var(--sw-space-1);
}`;
}

export function selectClassCatalog(): string[] {
  return [
    'sw-select',
    'sw-select-xs',
    'sw-select-control',
    'sw-select-trigger',
    'sw-select-list',
    'sw-select-option',
    'sw-select-action',
  ];
}
