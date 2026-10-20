import { type ReactNode } from 'react';

import {
  actionMenuTriggerAppearances,
  type ActionMenuTriggerAppearance,
} from '../../css/css-action-menu-trigger.js';
import { type ActionMenuItem } from '../ActionMenu.js';
import { hasSlot } from '../slot.js';

/** Whether an icon trigger has a glyph to draw (blank words are none). */
function hasGlyph(trigger: ReactNode): boolean {
  return (
    hasSlot(trigger) && !(typeof trigger === 'string' && trigger.trim() === '')
  );
}

/**
 * Fails closed on a menu it cannot draw: an item's blank detail or
 * detailLang (or a detailLang with no detail), an unknown trigger
 * appearance, or an icon trigger with no glyph.
 */
export function assertActionMenu({
  items,
  trigger,
  triggerAppearance,
}: {
  items: readonly ActionMenuItem[];
  trigger: ReactNode;
  triggerAppearance: ActionMenuTriggerAppearance;
}): void {
  if (
    items.some(
      (item) =>
        (item.detail !== undefined && !item.detail.trim()) ||
        (item.detailLang !== undefined &&
          (!item.detailLang.trim() || item.detail === undefined)),
    )
  )
    throw new RangeError(
      'ActionMenu item detail and detailLang must not be blank; detailLang needs a detail',
    );
  if (
    !(actionMenuTriggerAppearances as readonly unknown[]).includes(
      triggerAppearance,
    )
  )
    throw new RangeError(
      `Unknown ActionMenu triggerAppearance: ${String(triggerAppearance)}`,
    );
  if (triggerAppearance === 'icon' && !hasGlyph(trigger))
    throw new RangeError('An icon ActionMenu trigger needs its glyph');
}
