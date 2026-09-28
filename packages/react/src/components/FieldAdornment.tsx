import type { MouseEvent, ReactNode } from 'react';

export type FieldAdornmentProps = {
  children: ReactNode;
  prefix?: string;
  prefixId: string;
  suffix?: string;
  suffixId: string;
};

/*
 * A press on the frame's own chrome (the prefix, the suffix or the padding)
 * focuses the input, as the text cursor over the frame promises. A press on
 * the input itself keeps the browser's own caret placement and selection.
 */
function focusAdornedInput(event: MouseEvent<HTMLSpanElement>) {
  const input = event.currentTarget.querySelector('input');
  if (!input || input.disabled || event.target === input) return;
  event.preventDefault();
  input.focus();
}

/*
 * Draws the control frame around a native input with short text before or
 * after it. The text is hidden from the reading order so it is not read twice:
 * the input names or describes itself with this text by id (see
 * `adornedControlAria`), which still reads a hidden node it references directly.
 */
export function FieldAdornment({
  children,
  prefix,
  prefixId,
  suffix,
  suffixId,
}: FieldAdornmentProps) {
  return (
    // The frame is not a control: a press on it only moves focus to the input
    // inside, which keyboard and assistive technology users reach directly.
    <span className="sw-field-adorned" onMouseDown={focusAdornedInput}>
      {prefix ? (
        <span aria-hidden="true" className="sw-field-prefix" id={prefixId}>
          {prefix}
        </span>
      ) : null}
      {children}
      {suffix ? (
        <span aria-hidden="true" className="sw-field-suffix" id={suffixId}>
          {suffix}
        </span>
      ) : null}
    </span>
  );
}

export type AdornedControlNaming = {
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

export type AdornedControlAria = {
  /** The input's `aria-labelledby`; undefined keeps the input's own name. */
  labelledBy?: string;
  /** Adornment ids to add to the input's `aria-describedby`, if any. */
  describedBy?: string;
};

/*
 * An adorned input is named by its label plus the adornment ("Drop amount $").
 * When the input already names itself with `aria-label` or `aria-labelledby`,
 * that name stands and the adornment describes the input instead, so the unit
 * is still read.
 */
export function adornedControlAria(
  own: AdornedControlNaming,
  labelId: string,
  prefixId: string | undefined,
  suffixId: string | undefined,
): AdornedControlAria {
  const adornment = [prefixId, suffixId].filter(Boolean).join(' ');
  if (own['aria-label'] || own['aria-labelledby'])
    return { labelledBy: own['aria-labelledby'], describedBy: adornment };
  return { labelledBy: [labelId, adornment].join(' ') };
}
