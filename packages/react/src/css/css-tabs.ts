import { typographyVariants } from '@scalewing/tokens';

const label = typographyVariants.label;

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

@media (forced-colors: active) {
  .sw-tab-selected { border-bottom-color: Highlight; color: Highlight; }
}`;
}

export function tabsClassCatalog(): string[] {
  return ['sw-tabs', 'sw-tab', 'sw-tab-selected', 'sw-tab-panel'];
}
