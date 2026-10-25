import { typographyVariants } from '@scalewing/tokens';

import {
  appHeaderBarClassCatalog,
  cssAppHeaderBarClasses,
} from './css-app-header-bar.js';
import { typedInputs } from './css-document.js';
import { cssNavWordsClasses, navWordsClassCatalog } from './css-nav-words.js';
import { zIndex } from './stacking.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

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

${cssAppHeaderBarClasses()}

.sw-app-header-sticky {
  position: sticky;
  top: 0;
  ${zIndex('topChrome')}
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

/*
 * A button in a navigation is a destination: on a coarse pointer it grows to
 * the 44 px touch target both ways, whatever its size, as a section link
 * and a calendar button do. A label beside its glyph keeps its line.
 */
@media ${coarsePointerQuery} {
  .sw-nav .sw-button {
    min-height: ${touchTarget};
    min-width: ${touchTarget};
  }
}

${cssNavWordsClasses()}

.sw-field-xs :is(select, input, textarea) {
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
}

/* The chevron's layers place themselves from this inset (selectChevronLayers). */
.sw-field-xs select {
  --sw-select-chevron-inset: var(--sw-space-3);
  height: calc(var(--sw-control-xs-min-height) - 1px - 1px);
  min-height: 0;
  padding-inline-end: calc(
    var(--sw-control-xs-padding-inline) + var(--sw-space-5)
  );
}

/*
 * The document canvas sizes every typed input under [data-theme] (0,2,1),
 * which outranks the xs rule above, so an xs field's own text control
 * matches it there. Adorned and search inputs sit one level deeper and keep
 * their frames' rules. On a coarse pointer it is the 44 px touch target.
 */
[data-theme] .sw-field-xs > :is(${typedInputs}) {
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
}

@media ${coarsePointerQuery} {
  [data-theme] .sw-field-xs > :is(${typedInputs}) {
    min-height: ${touchTarget};
  }
}`;
}

export function chromeClassCatalog(): string[] {
  return [
    'sw-app-header',
    'sw-app-header-sticky',
    ...appHeaderBarClassCatalog(),
    'sw-nav',
    ...navWordsClassCatalog(),
    'sw-field-xs',
  ];
}
