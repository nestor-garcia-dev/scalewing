import { buttonVariants, typographyVariants } from '@scalewing/tokens';

export const badgeTones = [
  'neutral',
  'accent',
  'success',
  'danger',
  'warning',
] as const;

export type BadgeTone = (typeof badgeTones)[number];

export const badgeSizes = ['sm', 'md'] as const;

export type BadgeSize = (typeof badgeSizes)[number];

const caption = typographyVariants.caption;

export function badgeClassNames(
  tone: BadgeTone,
  size: BadgeSize = 'md',
): string[] {
  return ['sw-badge', `sw-badge-${tone}`, `sw-badge-${size}`];
}

/*
 * A badge inside a filled button would otherwise draw its tone on the
 * button's fill (a warning badge on the accent is about 1.1:1), so it takes
 * the surface and sets its words in the text color, which is 4.5:1 on the
 * surface in every palette; its tone stays on its border (3:1 or more), as
 * some palettes' tones are under 4.5:1 as text on the surface. A ghost
 * button has no fill.
 */
function badgeOnFilledButtonRules(): string {
  const filled = buttonVariants
    .filter((variant) => variant !== 'ghost')
    .map((variant) => `.sw-button-${variant}`)
    .join(', ');
  return `:is(${filled}) .sw-badge { background: var(--sw-color-surface); color: var(--sw-color-text); }`;
}

export function cssDataClasses(): string {
  return `.sw-badge {
  align-items: center;
  border: 1px solid transparent;
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-badge-md {
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
}

.sw-badge-sm {
  padding-inline: var(--sw-space-2);
}

.sw-badge-neutral {
  background: var(--sw-glass-fill);
  border-color: var(--sw-color-border);
  color: var(--sw-color-text);
}

.sw-badge-accent {
  background: transparent;
  border-color: var(--sw-color-accent);
  color: var(--sw-color-accent);
}

.sw-badge-success {
  background: transparent;
  border-color: var(--sw-color-success);
  color: var(--sw-color-success);
}

.sw-badge-danger {
  background: transparent;
  border-color: var(--sw-color-danger);
  color: var(--sw-color-danger);
}

.sw-badge-warning {
  background: transparent;
  border-color: var(--sw-color-warning);
  color: var(--sw-color-warning);
}

${badgeOnFilledButtonRules()}`;
}

export function dataClassCatalog(): string[] {
  return [
    'sw-badge',
    ...badgeTones.map((tone) => `sw-badge-${tone}`),
    ...badgeSizes.map((size) => `sw-badge-${size}`),
  ];
}
