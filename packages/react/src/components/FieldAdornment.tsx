import type { ReactNode } from 'react';

export type FieldAdornmentProps = {
  children: ReactNode;
  prefix?: string;
  prefixId: string;
  suffix?: string;
  suffixId: string;
};

/*
 * Draws the control frame around a native input with short text before or
 * after it. The text is hidden from the reading order so it is not read twice:
 * the input names itself with the label and this text through
 * `aria-labelledby`, which still reads a hidden node it references directly.
 */
export function FieldAdornment({
  children,
  prefix,
  prefixId,
  suffix,
  suffixId,
}: FieldAdornmentProps) {
  return (
    <span className="sw-field-adorned">
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

export function adornedLabelledBy(
  labelId: string,
  prefixId: string | undefined,
  suffixId: string | undefined,
): string {
  return [labelId, prefixId, suffixId].filter(Boolean).join(' ');
}
