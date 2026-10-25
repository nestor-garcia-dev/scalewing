import {
  type ButtonSize,
  buttonSizes,
  buttonVariants,
  controlScale,
  typographyVariants,
} from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import {
  buttonGroupAttachedClassCatalog,
  cssButtonGroupAttachedClasses,
} from './css-button-group-attached.js';
import {
  buttonWidthClassCatalog,
  cssButtonWidthClasses,
} from './css-button-width.js';
import { quietFill } from './quiet-fill.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const label = typographyVariants.label;

/**
 * The web Button's variants: the shared tiers from `@scalewing/tokens`, plus
 * `neutral`, a quiet grey fill in the text color for an action beside the
 * primary that should not draw the eye (a Cancel on a sheet). Native has no
 * `neutral` yet.
 */
export const webButtonVariants = [...buttonVariants, 'neutral'] as const;

export type WebButtonVariant = (typeof webButtonVariants)[number];

export const buttonDisabledAppearances = ['faded', 'neutral'] as const;

/**
 * How a disabled button looks: `faded` (the default) fades the variant as
 * any disabled control; `neutral` draws a filled button on the quiet grey
 * fill with muted words, whatever its variant (a ghost button, which has
 * no fill, still fades).
 */
export type ButtonDisabledAppearance =
  (typeof buttonDisabledAppearances)[number];

export function buttonClassNames(options: {
  size: ButtonSize;
  variant: WebButtonVariant;
  disabledAppearance?: ButtonDisabledAppearance;
}): string[] {
  return [
    'sw-button',
    `sw-button-${options.variant}`,
    `sw-button-${options.size}`,
    ...(options.disabledAppearance === 'neutral'
      ? ['sw-button-disabled-neutral']
      : []),
  ];
}

function variantRules(): string {
  return [
    `.sw-button-primary { background: var(--sw-color-accent); border-color: transparent; color: var(--sw-color-onAccent); }`,
    `.sw-button-secondary { background: var(--sw-color-secondary); border-color: var(--sw-button-secondary-border); color: var(--sw-color-onSecondary); }`,
    `.sw-button-tertiary { background: var(--sw-color-tertiary); border-color: transparent; color: var(--sw-color-onTertiary); }`,
    `.sw-button-ghost { background: transparent; border-color: transparent; color: var(--sw-color-accent); }`,
    `.sw-button-danger { background: var(--sw-color-danger); border-color: transparent; color: var(--sw-color-onDanger); }`,
    `.sw-button-neutral { background: ${quietFill}; border-color: transparent; color: var(--sw-color-text); }`,
  ].join('\n');
}

/*
 * A neutral disabled button: the quiet fill with its words in the muted
 * color at 48 %, about #AEAEAE on the grey (a disabled control needs no
 * contrast, and the faded words say it cannot be pressed), at full
 * opacity so no accent shows through. The same for one that is only
 * \`aria-disabled\`. Forced colors draw it as any disabled button.
 */
function disabledNeutralRules(): string {
  return `.sw-button-disabled-neutral:is(:disabled, [aria-disabled='true']):not(.sw-button-ghost) {
  background: ${quietFill};
  border-color: transparent;
  color: color-mix(in srgb, var(--sw-color-muted) 48%, transparent);
  opacity: 1;
}`;
}

/*
 * A toggle button's pressed state is an accent ring drawn outside the fill,
 * past a 2 px gap in the page background: the ring meets the background on
 * both sides, so it keeps the accent's contrast on the canvas (4.5:1 or more
 * in every palette, above WCAG 1.4.11's 3:1) whatever the variant's fill.
 * A focused pressed button moves its focus outline out past the ring, so the
 * two stay apart. The unpressed button keeps its full label contrast: no
 * opacity.
 *
 * Forced colors drop box shadows, so there the same ring is a Highlight
 * border on an out-of-flow ::after, and the button's own border turns
 * Highlight. The button keeps the forced ButtonFace and ButtonText of every
 * other button: a Highlight fill cannot be used, because Chromium paints
 * the forced backplate behind a button's text in Canvas, which erased a
 * HighlightText label (1.00:1, Teisoro's pressed toggles in 1.12.0), and
 * forced-color-adjust: none would let every descendant keep author colors.
 */
export const pressedRingGap = 2;
export const pressedRingWidth = 4;

function pressedRules(): string {
  return `.sw-button[aria-pressed='true'] { box-shadow: 0 0 0 ${pressedRingGap}px var(--sw-color-background), 0 0 0 ${pressedRingWidth}px var(--sw-color-accent); }
.sw-button[aria-pressed='true']:focus-visible { outline-offset: calc(var(--sw-focus-ring-offset) + ${pressedRingWidth}px); }
@media (forced-colors: active) {
  .sw-button[aria-pressed='true'] { border-color: Highlight; position: relative; }
  .sw-button[aria-pressed='true']::after { border: ${pressedRingWidth - pressedRingGap}px solid Highlight; border-radius: inherit; content: ''; inset: calc(-1px - ${pressedRingWidth}px); pointer-events: none; position: absolute; }
}`;
}

/* The system greys a disabled button in forced colors, not one that is
   only aria-disabled: grey it the same, over the neutral look's words. */
function ariaDisabledForcedRules(): string {
  return `@media (forced-colors: active) {
  .sw-button[aria-disabled='true'],
  .sw-button-disabled-neutral[aria-disabled='true']:not(.sw-button-ghost) { border-color: GrayText; color: GrayText; }
}`;
}

/*
 * Each size's height and side padding for a fine pointer, then the
 * comfortable touch target (44 px both ways, the md control height) for
 * every size on a coarse pointer, so an xs or sm Button in a table row or a
 * checklist is still easy to tap. Its look stays the size's (padding and
 * type); only the minimum box grows. The coarse rule follows the sizes,
 * which it outranks only by order.
 */
function sizeRules(): string {
  const sizes = buttonSizes
    .map((size) => {
      const control = controlScale[size];
      return `.sw-button-${size} { min-height: ${control.minHeight}px; padding-inline: ${control.paddingInline}px; }`;
    })
    .join('\n');
  return `${sizes}
@media ${coarsePointerQuery} {
  .sw-button { min-height: ${touchTarget}; min-width: ${touchTarget}; }
}`;
}

/*
 * The button's own children are its flex items, so a glyph and its label
 * sit one token gap apart. An icon-only button has one item, and a consumer
 * that wraps its glyph and label in one element (an Inline span) has one
 * item too, so neither gets a second gap. A visually hidden name is
 * absolutely positioned, out of the flex flow, so it adds none either.
 */
export const buttonContentGap = 'var(--sw-space-2)';

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
  gap: ${buttonContentGap};
  justify-content: center;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  margin: 0;
}

.sw-button:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

/* A button that is off but still pressed and focused (\`aria-disabled\`,
   for a submit that, pressed while off, shows what to fix) looks as a
   disabled one; forced colors grey it too, after the pressed rules. */
.sw-button:disabled,
.sw-button[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}
${variantRules()}
${disabledNeutralRules()}
${pressedRules()}
${ariaDisabledForcedRules()}
${sizeRules()}
${cssButtonWidthClasses()}
${groupRules()}

${cssButtonGroupAttachedClasses()}`;
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
    ...webButtonVariants.map((variant) => `sw-button-${variant}`),
    'sw-button-disabled-neutral',
    ...buttonSizes.map((size) => `sw-button-${size}`),
    ...buttonWidthClassCatalog(),
    'sw-button-group',
    ...buttonGroupJustifies.map((name) => `sw-button-group-${name}`),
    ...buttonGroupAttachedClassCatalog(),
  ];
}
