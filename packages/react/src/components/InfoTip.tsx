'use client';

import { forwardRef, type ReactNode } from 'react';

import { Button, type ButtonSize } from './Button.js';
import { TooltipAnchor } from './tooltip/TooltipAnchor.js';

export type InfoTipProps = {
  /**
   * The button's accessible name, such as "About the expected balance".
   * Localized by the consumer.
   */
  label: string;
  /**
   * The tip: plain text, as `Tooltip`'s `content`. It is the button's
   * description, and a press also says it once in a polite live region.
   */
  content: string;
  /** The glyph, such as a Lucide `Info`; decorative, the label names it. */
  children: ReactNode;
  /** A Button size; md (default) is 44 px, and a coarse pointer always gets 44 px. */
  size?: ButtonSize;
};

/** The press is the anchor's: it toggles the tip on the button's click. */
function pressShowsTheTip() {}

/**
 * A toggletip: a ghost icon-only button whose only job is to show its tip.
 * Hover and a visible focus show it as `Tooltip` does; a press (a tap, a
 * click, Enter or Space) shows it and keeps it shown until the next press,
 * Escape, blur or a press outside. The button never submits a form. The ref
 * reaches the `<button>`.
 */
export const InfoTip = forwardRef<HTMLButtonElement, InfoTipProps>(
  function InfoTip({ children, content, label, size = 'md' }, ref) {
    if (typeof label !== 'string' || label.trim() === '')
      throw new RangeError('label must be non-empty text');
    return (
      <TooltipAnchor
        content={content}
        pressToggles
        trigger={
          <Button
            aria-label={label}
            className="sw-info-tip"
            onPress={pressShowsTheTip}
            ref={ref}
            size={size}
            type="button"
            variant="ghost"
          >
            {children}
          </Button>
        }
      />
    );
  },
);
