import { typographyVariants } from '@scalewing/tokens';

import { chevronStroke } from './chevron.js';
import { quietFill } from './quiet-fill.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const label = typographyVariants.label;

export const contextSwitcherTriggerAppearances = [
  'framed',
  'text',
  'pill',
  'icon',
] as const;

/**
 * How a ContextSwitcher's trigger looks: `framed` (the default) is the
 * outlined control; `text` is its content and a chevron with no fill until
 * hovered or open; `pill` is a rounded outlined pill at label weight;
 * `icon` is a glyph alone in a round quiet button with no chevron.
 */
export type ContextSwitcherTriggerAppearance =
  (typeof contextSwitcherTriggerAppearances)[number];

export const contextSwitcherWidths = ['content', 'full'] as const;

/** `full` makes the trigger fill its column, such as a sidebar's top. */
export type ContextSwitcherWidth = (typeof contextSwitcherWidths)[number];

/** The modifier class of an appearance, such as `sw-context-switcher-trigger-pill`. */
export function contextSwitcherTriggerClass(
  appearance: ContextSwitcherTriggerAppearance,
): string {
  return `sw-context-switcher-trigger-${appearance}`;
}

const trigger = '.sw-context-switcher-trigger';
const framed = `${trigger}.${contextSwitcherTriggerClass('framed')}`;
const pill = `${trigger}.${contextSwitcherTriggerClass('pill')}`;
const icon = `${trigger}.${contextSwitcherTriggerClass('icon')}`;

/*
 * Every trigger: a real button in label type in the text colour, its
 * content (a mark and words, which may be two lines) taking the free space
 * at the inline start, then the shared muted chevron pointing down; the sm
 * control height, the 44 px target on a coarse pointer. A transparent
 * border is kept for forced colours. The quiet fill shows while open and
 * under a hovering pointer, so the open state is seen as well as read.
 */
function baseRules(): string {
  return `.sw-context-switcher {
  display: inline-flex;
  max-width: 100%;
}

.sw-context-switcher-full {
  display: flex;
  width: 100%;
}

${trigger} {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-color-text);
  cursor: pointer;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: 500;
  gap: var(--sw-space-2);
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  margin: 0;
  max-width: 100%;
  min-height: var(--sw-control-sm-min-height);
  padding-block: var(--sw-space-1);
  padding-inline: var(--sw-space-3) var(--sw-space-2);
  text-align: start;
}

.sw-context-switcher-full ${trigger} {
  width: 100%;
}

.sw-context-switcher-trigger-content {
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  gap: var(--sw-space-2);
  min-width: 0;
  overflow-wrap: anywhere;
}

${trigger}:not(.${contextSwitcherTriggerClass('icon')})::after {
  ${chevronStroke}
  content: '';
  flex: none;
  transform: translateY(-25%) rotate(45deg);
}

${trigger}[aria-expanded='true'] {
  background: ${quietFill};
}

@media (hover: hover) {
  ${trigger}:hover {
    background: ${quietFill};
  }
}

${trigger}:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

@media ${coarsePointerQuery} {
  ${trigger} { min-height: ${touchTarget}; }
}`;
}

/*
 * The appearances: \`framed\` the field's glass fill inside the border
 * hairline; \`pill\` the same hairline on the surface, fully rounded, at
 * label weight; \`icon\` a round button as wide as it is tall, the glyph
 * centred and muted, no chevron. Two classes, so each outranks the base.
 */
function appearanceRules(): string {
  return `${framed} {
  background: var(--sw-glass-fill);
  border-color: var(--sw-color-border);
}

${pill} {
  background: var(--sw-color-surface);
  border-color: var(--sw-color-border);
  border-radius: var(--sw-radius-pill);
  font-weight: ${label.fontWeight};
}

${framed}[aria-expanded='true'],
${pill}[aria-expanded='true'] {
  background: ${quietFill};
}

@media (hover: hover) {
  ${framed}:hover,
  ${pill}:hover {
    background: ${quietFill};
  }
}

${icon} {
  border-radius: var(--sw-radius-pill);
  color: var(--sw-color-muted);
  justify-content: center;
  min-width: var(--sw-control-sm-min-height);
  padding: 0;
}

${icon} .sw-context-switcher-trigger-content {
  flex: none;
  justify-content: center;
}

${icon}[aria-expanded='true'] {
  color: var(--sw-color-text);
}

@media ${coarsePointerQuery} {
  ${icon} { min-width: ${touchTarget}; }
}

@media (forced-colors: active) {
  ${trigger}::after { border-color: CanvasText; }
  ${trigger}[aria-expanded='true'] { border-color: Highlight; }
  ${icon} { color: ButtonText; }
}`;
}

/* ContextSwitcher's trigger (see components/ContextSwitcher.tsx). */
export function cssContextSwitcherTriggerClasses(): string {
  return `${baseRules()}

${appearanceRules()}`;
}

export function contextSwitcherTriggerClassCatalog(): string[] {
  return [
    'sw-context-switcher',
    'sw-context-switcher-full',
    'sw-context-switcher-trigger',
    'sw-context-switcher-trigger-content',
    ...contextSwitcherTriggerAppearances.map(contextSwitcherTriggerClass),
  ];
}
