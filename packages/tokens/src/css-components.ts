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
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-md);
  color: var(--sw-color-text);
}

.sw-card-elevated {
  border-color: transparent;
  box-shadow: var(--sw-elevation-sm);
}

.sw-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

${textVariantRules()}`;
}
