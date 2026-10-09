'use client';

import { type ReactElement } from 'react';

import { TooltipAnchor } from './tooltip/TooltipAnchor.js';
import {
  type TooltipRelationship,
  type TooltipTriggerAria,
} from './tooltip-trigger-aria.js';

export type { TooltipRelationship };

export type TooltipProps = {
  content: string;
  /**
   * Turns the tooltip off, not its trigger: no tooltip, no description and no
   * Escape handling, while the trigger stays mounted, enabled and focusable
   * (and keeps its focus). Focus, hover and touch are still followed, so the
   * tooltip shows as soon as it is enabled again on a trigger that still has
   * focus, the pointer or an open touch toggle; Escape pressed while disabled
   * reaches the page and does not stop that. It must match between the server
   * render and the first client render.
   */
  disabled?: boolean;
  /**
   * `'description'` (default) adds supplementary help to a trigger that has
   * its own name, through `aria-describedby`. `'label'` makes `content` the
   * trigger's accessible name, through `aria-labelledby`, for an icon-only
   * control: the text is read once, as its name. The tooltip stays in the
   * DOM, hidden, so it names the trigger while it is not shown. While
   * `disabled` there is no tooltip to name it, so the trigger then needs its
   * own name: visible text, or an `aria-label` (which the tooltip overrides
   * while enabled). The trigger's own `aria-labelledby` and `aria-describedby`
   * are kept. It must match between the server render and the first client
   * render.
   */
  relationship?: TooltipRelationship;
  trigger: ReactElement<TooltipTriggerAria>;
};

/**
 * Supplementary help for a trigger that has its own name, or the name of an
 * icon-only trigger (`relationship="label"`). For a glyph whose only job is
 * to show its help, use `InfoTip`, which a press opens.
 */
export function Tooltip({
  content,
  disabled = false,
  relationship = 'description',
  trigger,
}: TooltipProps) {
  return (
    <TooltipAnchor
      content={content}
      disabled={disabled}
      relationship={relationship}
      trigger={trigger}
    />
  );
}
