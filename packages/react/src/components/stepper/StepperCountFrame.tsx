import type { MouseEvent, ReactNode } from 'react';

export type StepperCountFrameProps = {
  /** The count's input. */
  children: ReactNode;
  /** A short word after the count; no frame is drawn without one. */
  unit?: string;
};

/*
 * A press on the frame's own chrome (the unit or the padding) focuses the
 * count, as the text cursor over it promises. A press on the input itself
 * keeps the browser's own caret placement and selection.
 */
function focusCount(event: MouseEvent<HTMLSpanElement>) {
  const input = event.currentTarget.querySelector('input');
  if (!input || input.disabled || event.target === input) return;
  event.preventDefault();
  input.focus();
}

/**
 * The count with its unit inside one control frame ("90 min"), as Field's
 * suffix: the frame draws the control surface and focus ring, and the input
 * inside it drops its own. The unit is hidden from assistive technology,
 * which hears it in the count's `aria-valuetext` instead. Without a unit the
 * input is the frame, unchanged.
 */
export function StepperCountFrame({ children, unit }: StepperCountFrameProps) {
  if (unit === undefined) return <>{children}</>;
  return (
    // Not a control: a press only moves focus to the count inside, which
    // keyboard and assistive technology users reach directly.
    <span className="sw-stepper-count" onMouseDown={focusCount}>
      {children}
      <span aria-hidden="true" className="sw-stepper-unit">
        {unit.trim()}
      </span>
    </span>
  );
}
