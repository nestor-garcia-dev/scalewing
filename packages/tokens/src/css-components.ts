import { cssButtonClasses } from './css-button.js';
import { typographyVariants } from './typography.js';

function textVariantRules(): string {
  return Object.entries(typographyVariants)
    .map(([name, variant]) => {
      return `.sw-text-${name} { font-family: var(--sw-font-sans); font-size: ${variant.fontSize}px; line-height: ${variant.lineHeight}px; font-weight: ${variant.fontWeight}; letter-spacing: ${variant.letterSpacing}px; }`;
    })
    .join('\n');
}

export function cssComponentClasses(): string {
  return `.sw-card {
  border-radius: var(--sw-radius-lg);
  color: var(--sw-color-text);
}

.sw-card-glass {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
}

.sw-card-outlined {
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
}

.sw-card-elevated {
  background: var(--sw-color-surface);
  border-color: transparent;
  box-shadow: var(--sw-elevation-sm);
}

@media (prefers-reduced-transparency: reduce) {
  .sw-card-glass,
  .sw-button-secondary {
    background: var(--sw-color-surface);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

.sw-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

${textVariantRules()}

${cssButtonClasses()}`;
}
