import {
  type ButtonSize,
  type ButtonVariant,
  buttonSizes,
  buttonVariants,
  controlScale,
  typographyVariants,
} from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';

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
    `.sw-button-secondary { background: var(--sw-color-secondary); border-color: var(--sw-button-secondary-border); color: var(--sw-color-onSecondary); }`,
    `.sw-button-tertiary { background: var(--sw-color-tertiary); border-color: transparent; color: var(--sw-color-onTertiary); }`,
    `.sw-button-ghost { background: transparent; border-color: transparent; color: var(--sw-color-accent); }`,
    `.sw-button-danger { background: var(--sw-color-danger); border-color: transparent; color: var(--sw-color-onDanger); }`,
  ].join('\n');
}

/*
 * A toggle button's pressed state is an accent ring drawn outside the fill,
 * past a 2 px gap in the page background: the ring meets the background on
 * both sides, so it keeps the accent's contrast on the canvas (4.5:1 or more
 * in every palette, above WCAG 1.4.11's 3:1) whatever the variant's fill.
 * A focused pressed button moves its focus outline out past the ring, so the
 * two stay apart. The unpressed button keeps its full label contrast: no
 * opacity. Forced colors, which drop box shadows, fill the pressed button
 * with the system highlight, as a checked FilterChips chip or Checkbox is.
 */
export const pressedRingWidth = 4;

function pressedRules(): string {
  return `.sw-button[aria-pressed='true'] { box-shadow: 0 0 0 2px var(--sw-color-background), 0 0 0 ${pressedRingWidth}px var(--sw-color-accent); }
.sw-button[aria-pressed='true']:focus-visible { outline-offset: calc(var(--sw-focus-ring-offset) + ${pressedRingWidth}px); }
@media (forced-colors: active) {
  .sw-button[aria-pressed='true'] { background: Highlight; border-color: Highlight; color: HighlightText; }
}`;
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

${variantRules()}
${pressedRules()}
${sizeRules()}
${groupRules()}`;
}

export const buttonGroupJustifies = ['start', 'end', 'between'] as const;

/** The action row: one line from md up, full-width stacked buttons below it. */
function groupRules(): string {
  const justify = {
    start: 'flex-start',
    end: 'flex-end',
    between: 'space-between',
  } as const;
  return [
    `.sw-button-group { align-items: center; display: flex; flex-wrap: wrap; gap: var(--sw-space-2); min-width: 0; }`,
    ...buttonGroupJustifies.map(
      (name) =>
        `.sw-button-group-${name} { justify-content: ${justify[name]}; }`,
    ),
    `@media ${breakpointQuery('below', 'md')} {
  .sw-button-group { align-items: stretch; flex-direction: column; }
  .sw-button-group > * { width: 100%; }
}`,
  ].join('\n');
}

export function buttonClassCatalog(): string[] {
  return [
    'sw-button',
    ...buttonVariants.map((variant) => `sw-button-${variant}`),
    ...buttonSizes.map((size) => `sw-button-${size}`),
    'sw-button-group',
    ...buttonGroupJustifies.map((name) => `sw-button-group-${name}`),
  ];
}
