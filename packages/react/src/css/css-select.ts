import { typographyVariants } from '@scalewing/tokens';

import { chevronStroke } from './chevron.js';
import { zIndex } from './stacking.js';

const caption = typographyVariants.caption;
const label = typographyVariants.label;

export function cssSelectClasses(): string {
  return `.sw-select {
  max-width: 100%;
  width: max-content;
}

/*
 * width="full": the field and its trigger fill the container's inline size.
 * The value still takes the free space and ellipsizes, and the chevron stays
 * last, at the inline end. In an Inline row the field takes only the space
 * its siblings leave, so a Button beside it keeps its label on one line.
 */
.sw-select-full {
  width: 100%;
}

.sw-inline > .sw-select-full {
  flex: 1 1 0;
  min-width: 0;
}

.sw-select-full .sw-select-trigger {
  width: 100%;
}

.sw-select-control {
  position: relative;
}

.sw-select-trigger {
  align-items: center;
  appearance: none;
  -webkit-appearance: none;
  background-color: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-color-text);
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: inherit;
  gap: var(--sw-space-3);
  letter-spacing: inherit;
  line-height: inherit;
  margin: 0;
  max-width: 100%;
  min-height: var(--sw-control-md-min-height);
  padding-block: 0;
  padding-inline: var(--sw-control-md-padding-inline);
  text-align: start;
}

/* The chevron Accordion uses, pointing down, centred on the text. */
.sw-select-trigger::after {
  ${chevronStroke}
  content: '';
  flex: none;
  transform: translateY(-25%) rotate(45deg);
}

/*
 * The current label and a hidden copy of every option's label share one grid
 * cell, so the trigger is as wide as the longest option and keeps that width
 * when the value changes; past the available width the label ellipsizes.
 */
.sw-select-value {
  display: grid;
  flex: 1 1 auto;
  min-width: 0;
}

.sw-select-value > * {
  grid-area: 1 / 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sw-select-value-sizer {
  visibility: hidden;
}

.sw-select-placeholder {
  color: var(--sw-color-muted);
}

.sw-select-invalid .sw-select-trigger {
  border-color: var(--sw-color-danger);
}

.sw-select-value-sizer::before {
  content: attr(data-label);
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
  font-size: ${caption.fontSize}px;
  gap: var(--sw-space-2);
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
}

@media (forced-colors: active) {
  .sw-select-trigger::after { border-color: CanvasText; }
  .sw-select-invalid .sw-select-trigger { border-color: Mark; }
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
  ${zIndex('popup')}
}

/*
 * A full-width field's open list is exactly the trigger's width (min-width
 * already beats the dialog-max cap), so it never runs past a phone's edge;
 * a long option wraps inside it, even a single long word.
 */
.sw-select-full .sw-select-list {
  width: 100%;
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

.sw-select-full .sw-select-option {
  overflow-wrap: anywhere;
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
    'sw-select-full',
    'sw-select-control',
    'sw-select-trigger',
    'sw-select-value',
    'sw-select-value-text',
    'sw-select-value-sizer',
    'sw-select-placeholder',
    'sw-select-invalid',
    'sw-select-list',
    'sw-select-option',
    'sw-select-action',
  ];
}
