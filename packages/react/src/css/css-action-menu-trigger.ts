import { typographyVariants } from '@scalewing/tokens';

import { chevronStroke } from './chevron.js';
import { quietFill } from './quiet-fill.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const label = typographyVariants.label;

export const actionMenuTriggerAppearances = ['framed', 'text', 'icon'] as const;

/**
 * How an ActionMenu's trigger looks: `framed` (the default) is a small
 * outlined control; `text` is its words in the text color with a chevron
 * after them and no fill or outline until hovered or open, such as a
 * person's name that opens their account menu in a header; `icon` is the
 * consumer's glyph alone in a round quiet button, no chevron and no
 * outline until hovered or open, such as a row's ••• menu.
 */
export type ActionMenuTriggerAppearance =
  (typeof actionMenuTriggerAppearances)[number];

export const actionMenuTriggerTextClass = 'sw-action-menu-trigger-text';
export const actionMenuTriggerIconClass = 'sw-action-menu-trigger-icon';

const text = `.sw-action-menu-trigger.${actionMenuTriggerTextClass}`;
const icon = `.sw-action-menu-trigger.${actionMenuTriggerIconClass}`;

/*
 * A text trigger: no fill and a transparent border (kept, so forced colors
 * can draw one), its words in label type at medium weight in the text
 * color, the sm control height (the 44 px target on a coarse pointer), and
 * the shared muted chevron pointing down after them, a space-2 gap apart.
 * The quiet fill shows while the menu is open, so the open state is seen
 * as well as announced, and on hover where the pointer can hover (a tap
 * leaves no fill behind). Two classes, so it outranks the framed
 * trigger's rules; the coarse-pointer target is restated after. Forced
 * colors draw the kept border in the system's border color, the chevron
 * in CanvasText as every chevron, and the open trigger's border in
 * Highlight.
 */
export function cssActionMenuTriggerClasses(): string {
  return `${text} {
  align-items: center;
  background: transparent;
  border-color: transparent;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: 500;
  gap: var(--sw-space-2);
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-height: var(--sw-control-sm-min-height);
  padding-inline: var(--sw-space-3) var(--sw-space-2);
}

${text}::after {
  ${chevronStroke}
  content: '';
  flex: none;
  transform: translateY(-25%) rotate(45deg);
}

${text}[aria-expanded='true'] {
  background: ${quietFill};
}

@media (hover: hover) {
  ${text}:hover:not(:disabled) {
    background: ${quietFill};
  }
}

@media ${coarsePointerQuery} {
  ${text} { min-height: ${touchTarget}; }
}

@media (forced-colors: active) {
  ${text}::after { border-color: CanvasText; }
  ${text}[aria-expanded='true'] { border-color: Highlight; }
}`;
}

/*
 * An icon trigger: the consumer's glyph alone, centred in a round button
 * as wide as it is tall (the sm control height, the 44 px target on a
 * coarse pointer), in the muted colour, with no fill, no chevron and a
 * transparent border (kept for forced colors). Like the text trigger it
 * takes the quiet fill while open and under a hovering pointer. Its name
 * is the menu's label, so the glyph says nothing on its own.
 */
export function cssActionMenuTriggerIconClasses(): string {
  return `${icon} {
  align-items: center;
  background: transparent;
  border-color: transparent;
  border-radius: var(--sw-radius-pill);
  color: var(--sw-color-muted);
  display: inline-flex;
  justify-content: center;
  min-height: var(--sw-control-sm-min-height);
  min-width: var(--sw-control-sm-min-height);
  padding: 0;
}

${icon}[aria-expanded='true'] {
  background: ${quietFill};
  color: var(--sw-color-text);
}

@media (hover: hover) {
  ${icon}:hover:not(:disabled) {
    background: ${quietFill};
    color: var(--sw-color-text);
  }
}

@media ${coarsePointerQuery} {
  ${icon} {
    min-height: ${touchTarget};
    min-width: ${touchTarget};
  }
}

@media (forced-colors: active) {
  ${icon} { color: ButtonText; }
  ${icon}[aria-expanded='true'] { border-color: Highlight; }
}`;
}

export function actionMenuTriggerClassCatalog(): string[] {
  return [actionMenuTriggerTextClass, actionMenuTriggerIconClass];
}
