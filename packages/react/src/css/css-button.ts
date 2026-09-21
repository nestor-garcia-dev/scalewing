import {
  type ButtonSize,
  type ButtonVariant,
  buttonSizes,
  buttonVariants,
  controlScale,
  typographyVariants,
} from '@scalewing/tokens';

const label = typographyVariants.label;

export function buttonClassNames(options: {
  size: ButtonSize;
  variant: ButtonVariant;
}): string[] {
  return [
    'sw-button',
    `sw-button-${options.variant}`,
    `sw-button-${options.size}`,
  ];
}

function variantRules(): string {
  return [
    `.sw-button-primary { background: var(--sw-color-accent); border-color: transparent; color: var(--sw-color-onAccent); }`,
    `.sw-button-secondary { background: var(--sw-color-surface); border-color: var(--sw-color-border); color: var(--sw-color-text); }`,
    `.sw-button-ghost { background: transparent; border-color: transparent; color: var(--sw-color-accent); }`,
    `.sw-button-danger { background: var(--sw-color-danger); border-color: transparent; color: var(--sw-color-onDanger); }`,
  ].join('\n');
}

function sizeRules(): string {
  return buttonSizes
    .map((size) => {
      const control = controlScale[size];
      return `.sw-button-${size} { min-height: ${control.minHeight}px; padding-inline: ${control.paddingInline}px; }`;
    })
    .join('\n');
}

export function cssButtonClasses(): string {
  return `.sw-button {
  appearance: none;
  align-items: center;
  background: none;
  border: 1px solid transparent;
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  justify-content: center;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  margin: 0;
}

.sw-button:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-button:disabled {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

.sw-button[aria-pressed='false'] {
  opacity: var(--sw-quiet-opacity);
}

${variantRules()}
${sizeRules()}`;
}

export function buttonClassCatalog(): string[] {
  return [
    'sw-button',
    ...buttonVariants.map((variant) => `sw-button-${variant}`),
    ...buttonSizes.map((size) => `sw-button-${size}`),
  ];
}
