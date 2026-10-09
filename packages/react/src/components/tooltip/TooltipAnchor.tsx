'use client';

import { cloneElement, useId, useRef, type ReactElement } from 'react';

import {
  tooltipTriggerAria,
  type TooltipRelationship,
  type TooltipTriggerAria,
} from '../tooltip-trigger-aria.js';
import { useTooltipOpen } from './use-tooltip-open.js';
import { useTooltipPlacement } from './use-tooltip-placement.js';

export type TooltipAnchorProps = {
  content: string;
  disabled?: boolean;
  /**
   * Internal, for `InfoTip`: a press of the trigger toggles the tooltip, and
   * the tooltip a press opens is also said once in a polite live region.
   */
  pressToggles?: boolean;
  relationship?: TooltipRelationship;
  trigger: ReactElement<TooltipTriggerAria>;
};

/**
 * The anchor `span` around a trigger and its tooltip: the bubble, its
 * reference from the trigger, and what opens and closes it. `Tooltip` and
 * `InfoTip` are this anchor; only `InfoTip` turns `pressToggles` on.
 */
export function TooltipAnchor({
  content,
  disabled = false,
  pressToggles = false,
  relationship = 'description',
  trigger,
}: TooltipAnchorProps) {
  if (!content.trim()) throw new RangeError('content must not be empty');

  const id = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const { handlers, pressed, shown } = useTooltipOpen({
    disabled,
    pressToggles,
    tooltipRef,
    wrapperRef,
  });
  useTooltipPlacement(shown, tooltipRef, wrapperRef);
  const triggerAria = tooltipTriggerAria(
    trigger.props,
    disabled ? undefined : id,
    relationship,
  );

  return (
    <span className="sw-tooltip-anchor" ref={wrapperRef} {...handlers}>
      {cloneElement(trigger, triggerAria)}
      {disabled ? null : (
        <span
          className="sw-tooltip"
          hidden={!shown}
          id={id}
          ref={tooltipRef}
          role="tooltip"
        >
          {content}
        </span>
      )}
      {pressToggles ? (
        // In the page from the start, so filling it is announced. The
        // description is read on focus; a press asks for the tip again, and
        // reaches a reader whose descriptions or hints are off.
        <span className="sw-sr-only" role="status">
          {pressed && shown ? content : null}
        </span>
      ) : null}
    </span>
  );
}
