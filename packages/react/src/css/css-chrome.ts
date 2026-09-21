import { typographyVariants } from '@scalewing/tokens';

const caption = typographyVariants.caption;
const label = typographyVariants.label;

export function cssChromeClasses(): string {
  return `.sw-app-header {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-lg);
  box-shadow: inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
}

.sw-app-header-sticky {
  position: sticky;
  top: 0;
  z-index: 2;
}

.sw-nav {
  align-items: center;
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--sw-space-3);
}

.sw-nav a {
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
}

.sw-nav a[aria-current='page'] {
  color: var(--sw-color-text);
}

.sw-field-xs :is(select, input, textarea) {
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
}

.sw-field-xs select {
  background-position:
    calc(100% - var(--sw-space-3)) calc(50% - 1px),
    calc(100% - calc(var(--sw-space-3) - var(--sw-space-1))) calc(50% - 1px);
  height: calc(var(--sw-control-xs-min-height) - 1px - 1px);
  min-height: 0;
  padding-inline-end: calc(
    var(--sw-control-xs-padding-inline) + var(--sw-space-5)
  );
}`;
}

export function chromeClassCatalog(): string[] {
  return ['sw-app-header', 'sw-app-header-sticky', 'sw-nav', 'sw-field-xs'];
}
